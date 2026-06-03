import type { TeamRegistration } from '../backend';

/**
 * Production-optimized CSV export utility
 * Memory-efficient processing for large tournament datasets
 */

export interface ExcelExportData {
  'Team Name': string;
  'Captain Name': string;
  'Captain Phone': string;
  'Team Members': string;
  'Member Count': number;
}

const ROWS_PER_SHEET = 500;
const CHUNK_SIZE = 100; // Process in smaller chunks for memory efficiency

/**
 * Convert team registrations to CSV format with memory optimization
 */
export function prepareExcelData(registrations: TeamRegistration[]): ExcelExportData[] {
  return registrations.map((reg) => {
    // Optimize member text generation
    const membersText = reg.members
      .map((m, idx) => {
        const playerId = m.playerId ? ` (ID: ${m.playerId})` : '';
        return `${idx + 1}. ${m.name}${playerId}`;
      })
      .join('; ');

    return {
      'Team Name': reg.teamName,
      'Captain Name': reg.captain.name,
      'Captain Phone': reg.captain.phone,
      'Team Members': membersText,
      'Member Count': reg.members.length,
    };
  });
}

/**
 * Escape CSV field value
 */
function escapeCSVField(field: string | number): string {
  const stringField = String(field);
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
}

/**
 * Convert data to CSV with memory optimization
 */
function convertToCSV(data: ExcelExportData[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const headerRow = headers.map(escapeCSVField).join(',');
  
  // Process rows in chunks to avoid memory spikes
  const chunks: string[] = [headerRow];
  
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);
    const chunkRows = chunk.map(row => {
      return headers.map(header => {
        const value = row[header as keyof ExcelExportData];
        return escapeCSVField(value);
      }).join(',');
    });
    chunks.push(...chunkRows);
  }
  
  return chunks.join('\n');
}

/**
 * Split data into chunks
 */
function chunkData<T>(data: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Generate sheet name
 */
function generateSheetName(startIndex: number, endIndex: number, totalCount: number): string {
  if (totalCount <= ROWS_PER_SHEET) {
    return 'Teams';
  }
  return `Teams_${startIndex + 1}-${Math.min(endIndex, totalCount)}`;
}

/**
 * Download Excel report with pagination
 */
export async function downloadExcelReport(
  registrations: TeamRegistration[], 
  filename: string = 'registrations.csv'
): Promise<boolean> {
  try {
    const excelData = prepareExcelData(registrations);
    const totalCount = excelData.length;
    
    if (totalCount <= ROWS_PER_SHEET) {
      return await downloadSingleSheet(excelData, filename);
    }
    
    const chunks = chunkData(excelData, ROWS_PER_SHEET);
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const startIndex = i * ROWS_PER_SHEET;
      const endIndex = startIndex + chunk.length;
      
      const sheetName = generateSheetName(startIndex, endIndex, totalCount);
      const baseFilename = filename.replace(/\.(csv|xlsx)$/i, '');
      const paginatedFilename = `${baseFilename}_${sheetName}.csv`;
      
      await downloadSingleSheet(chunk, paginatedFilename);
      
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return true;
  } catch (error) {
    console.error('CSV export error:', error);
    throw new Error('Failed to generate CSV files');
  }
}

/**
 * Download single CSV sheet with memory optimization
 */
async function downloadSingleSheet(
  data: ExcelExportData[], 
  filename: string
): Promise<boolean> {
  try {
    const csvContent = convertToCSV(data);
    
    // UTF-8 BOM for Excel compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.csv') ? filename : filename.replace(/\.[^.]+$/, '.csv');
    
    document.body.appendChild(link);
    link.click();
    
    // Immediate cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('CSV download error:', error);
    throw new Error('Failed to download CSV file');
  }
}

/**
 * Generate CSV blob for backend upload
 */
export async function generateExcelBlob(registrations: TeamRegistration[]): Promise<Blob> {
  try {
    const excelData = prepareExcelData(registrations);
    const csvContent = convertToCSV(excelData);
    
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    return blob;
  } catch (error) {
    console.error('CSV blob generation error:', error);
    throw new Error('Failed to generate CSV blob');
  }
}

/**
 * Generate paginated CSV blobs
 */
export async function generatePaginatedExcelBlobs(
  registrations: TeamRegistration[]
): Promise<Array<{ blob: Blob; sheetName: string }>> {
  try {
    const excelData = prepareExcelData(registrations);
    const totalCount = excelData.length;
    
    if (totalCount <= ROWS_PER_SHEET) {
      const blob = await generateExcelBlob(registrations);
      return [{ blob, sheetName: 'Teams' }];
    }
    
    const chunks = chunkData(excelData, ROWS_PER_SHEET);
    const results: Array<{ blob: Blob; sheetName: string }> = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const startIndex = i * ROWS_PER_SHEET;
      const endIndex = startIndex + chunk.length;
      
      const sheetName = generateSheetName(startIndex, endIndex, totalCount);
      const csvContent = convertToCSV(chunk);
      
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      
      results.push({ blob, sheetName });
    }
    
    return results;
  } catch (error) {
    console.error('Paginated CSV generation error:', error);
    throw new Error('Failed to generate paginated CSV blobs');
  }
}
