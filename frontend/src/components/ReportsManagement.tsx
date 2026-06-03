import { useState } from 'react';
import { useGetAllReports, useDeleteReport, useDownloadReport } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { FileText, Download, Trash2, Calendar, HardDrive } from 'lucide-react';
import { toast } from 'sonner';
import type { ReportMetadata } from '../backend';

export default function ReportsManagement() {
  const { data: reports = [], isLoading } = useGetAllReports();
  const deleteReport = useDeleteReport();
  const downloadReport = useDownloadReport();
  const [confirmDelete, setConfirmDelete] = useState<ReportMetadata | null>(null);
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);

  const handleDelete = async (report: ReportMetadata) => {
    setConfirmDelete(report);
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;

    try {
      await deleteReport.mutateAsync(confirmDelete.filename);
      toast.success(`Report "${confirmDelete.filename}" deleted successfully`);
    } catch (error: any) {
      toast.error(`Failed to delete report: ${error.message}`);
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleDownload = async (report: ReportMetadata) => {
    setDownloadingReport(report.filename);
    try {
      await downloadReport.mutateAsync(report);
      toast.success(`Report "${report.filename}" downloaded successfully`);
    } catch (error: any) {
      toast.error(`Failed to download report: ${error.message}`);
    } finally {
      setDownloadingReport(null);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: bigint) => {
    const size = Number(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Excel Reports
          </CardTitle>
          <CardDescription>
            View and download previously generated Excel reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No reports generated yet</p>
              <p className="text-sm">
                Excel reports will appear here after you export registration data from the Registrations tab
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-primary/20 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/5 hover:bg-primary/10">
                    <TableHead>Filename</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.filename} className="hover:bg-primary/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-green-500" />
                          <span className="font-medium">{report.filename}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {formatDate(report.created)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <HardDrive className="w-4 h-4" />
                          {formatFileSize(report.size)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleDownload(report)}
                            disabled={downloadingReport === report.filename}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            {downloadingReport === report.filename ? (
                              <>
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(report)}
                            disabled={deleteReport.isPending}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <AlertDialogContent className="border-destructive/20 bg-card/95 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Report
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the report <span className="font-semibold text-foreground">"{confirmDelete?.filename}"</span>?
              <br /><br />
              <span className="text-destructive font-medium">⚠️ This will permanently delete the report file.</span> This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAction}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteReport.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Report
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
