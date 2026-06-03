import { useState } from 'react';
import { useGetAllGroupLinksWithInfo, useCreateGroupLink, useDeleteGroupLink } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Upload, Trash2, Loader2, FileSpreadsheet, AlertCircle, Download, Users } from 'lucide-react';
import { toast } from 'sonner';

interface ExcelRow {
  teamName: string;
  phoneNumber: string;
  groupLink: string;
}

export default function GroupManagement() {
  const { data: groupLinks = [], isLoading } = useGetAllGroupLinksWithInfo();
  const createGroupLink = useCreateGroupLink();
  const deleteGroupLink = useDeleteGroupLink();

  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ExcelRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<bigint | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      processCSVFile(selectedFile);
    }
  };

  const processCSVFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error('CSV file must have at least a header row and one data row');
        setPreviewData([]);
        setIsProcessing(false);
        return;
      }

      // Parse CSV (simple implementation)
      const parsedData: ExcelRow[] = [];
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      
      // Find column indices
      const teamNameIdx = headers.findIndex(h => 
        h.includes('team') && h.includes('name') || h === 'teamname' || h === 'team_name'
      );
      const phoneIdx = headers.findIndex(h => 
        h.includes('phone') || h === 'phonenumber' || h === 'phone_number'
      );
      const linkIdx = headers.findIndex(h => 
        h.includes('link') || h === 'grouplink' || h === 'group_link'
      );

      if (teamNameIdx === -1 || phoneIdx === -1 || linkIdx === -1) {
        toast.error('CSV must have columns: Team Name, Phone Number, Group Link');
        setPreviewData([]);
        setIsProcessing(false);
        return;
      }

      // Parse data rows
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        if (values.length > Math.max(teamNameIdx, phoneIdx, linkIdx)) {
          parsedData.push({
            teamName: values[teamNameIdx] || '',
            phoneNumber: values[phoneIdx] || '',
            groupLink: values[linkIdx] || '',
          });
        }
      }

      // Validate required fields
      const invalidRows = parsedData.filter(
        (row) => !row.teamName || !row.phoneNumber || !row.groupLink
      );

      if (invalidRows.length > 0) {
        toast.error(`CSV file has ${invalidRows.length} rows with missing required fields`);
        setPreviewData([]);
        setIsProcessing(false);
        return;
      }

      setPreviewData(parsedData);
      toast.success(`Loaded ${parsedData.length} teams from CSV file`);
    } catch (error: any) {
      console.error('CSV processing error:', error);
      toast.error('Failed to process CSV file. Please check the format.');
      setPreviewData([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = async () => {
    if (previewData.length === 0) {
      toast.error('No data to upload');
      return;
    }

    setIsProcessing(true);
    try {
      // Group data by unique group links
      const groupMap = new Map<string, ExcelRow[]>();
      previewData.forEach((row) => {
        const existing = groupMap.get(row.groupLink) || [];
        existing.push(row);
        groupMap.set(row.groupLink, existing);
      });

      // Create group links
      let groupId = 1;
      for (const [groupLink, teams] of groupMap.entries()) {
        if (teams.length > 12) {
          toast.warning(`Group ${groupId} has ${teams.length} teams (max 12 recommended)`);
        }

        await createGroupLink.mutateAsync({
          groupId: BigInt(groupId),
          groupNumber: BigInt(groupId),
          groupLink,
        });

        groupId++;
      }

      toast.success(`Successfully uploaded ${groupMap.size} group assignments`);
      setFile(null);
      setPreviewData([]);
      
      // Reset file input
      const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload group assignments: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (groupId: bigint) => {
    try {
      await deleteGroupLink.mutateAsync(groupId);
      toast.success('Group assignment deleted successfully');
      setConfirmDelete(null);
    } catch (error: any) {
      toast.error(`Failed to delete group: ${error.message}`);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = 'Team Name,Phone Number,Group Link\nExample Team 1,1234567890,https://example.com/group1\nExample Team 2,0987654321,https://example.com/group1';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'group_assignment_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading group management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Group Assignments
          </CardTitle>
          <CardDescription>
            Upload a CSV file with team names, phone numbers, and group links. Each group can have up to 12 teams.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download CSV Template
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="csv-upload">CSV File</Label>
            <Input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
            <p className="text-sm text-muted-foreground">
              Required columns: Team Name, Phone Number, Group Link
            </p>
          </div>

          {previewData.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-primary/20 rounded-lg bg-primary/5">
                <div>
                  <p className="text-sm font-medium">Preview</p>
                  <p className="text-2xl font-bold text-primary">{previewData.length} teams loaded</p>
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={isProcessing || createGroupLink.isPending}
                  className="gap-2"
                >
                  {isProcessing || createGroupLink.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Assignments
                    </>
                  )}
                </Button>
              </div>

              <div className="max-h-64 overflow-y-auto rounded-md border border-primary/20">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead>Team Name</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Group Link</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.slice(0, 10).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.teamName}</TableCell>
                        <TableCell>{row.phoneNumber}</TableCell>
                        <TableCell className="text-sm text-muted-foreground truncate max-w-xs">
                          {row.groupLink}
                        </TableCell>
                      </TableRow>
                    ))}
                    {previewData.length > 10 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          ... and {previewData.length - 10} more teams
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Group Assignments */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Current Group Assignments
          </CardTitle>
          <CardDescription>
            View and manage uploaded group assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {groupLinks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No group assignments uploaded yet</p>
              <p className="text-sm mt-2">Upload a CSV file to create group assignments</p>
            </div>
          ) : (
            <div className="rounded-md border border-primary/20 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/5 hover:bg-primary/10">
                    <TableHead>Group ID</TableHead>
                    <TableHead>Group Number</TableHead>
                    <TableHead>Group Link</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupLinks.map((link) => (
                    <TableRow key={link.id} className="hover:bg-primary/5">
                      <TableCell className="font-mono font-bold text-primary">
                        #{link.groupId.toString()}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-sm">
                          Group {link.groupNumber.toString()}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        <a
                          href={link.groupLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {link.groupLink}
                        </a>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(Number(link.createdAt) / 1000000).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setConfirmDelete(link.groupId)}
                          disabled={deleteGroupLink.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
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
      <AlertDialog open={confirmDelete !== null} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <AlertDialogContent className="border-destructive/20 bg-card/95 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Delete Group Assignment
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this group assignment?
              <br /><br />
              <span className="text-destructive font-medium">⚠️ This action cannot be undone.</span> All team mappings for this group will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete && handleDelete(confirmDelete)}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteGroupLink.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Group
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
