import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Search, Download, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAllTeamLogos, useDeleteTeamLogo } from '../hooks/useQueries';
import type { LogoUpload } from '../backend';

export default function TeamLogosManagement() {
  const { data: logos = [], isLoading } = useGetAllTeamLogos();
  const deleteTeamLogo = useDeleteTeamLogo();

  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<LogoUpload | null>(null);

  // Filter logos by search term
  const filteredLogos = useMemo(() => {
    if (!searchTerm.trim()) return logos;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return logos.filter((logo) =>
      logo.teamName.toLowerCase().includes(lowercaseSearch)
    );
  }, [logos, searchTerm]);

  const handleDownloadLogo = async (logo: LogoUpload) => {
    try {
      const bytes = await logo.logo.getBytes();
      const blob = new Blob([bytes], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${logo.teamName.replace(/\s+/g, '_')}_logo.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Logo for "${logo.teamName}" downloaded successfully`);
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error('Failed to download logo');
    }
  };

  const handleDeleteLogo = async () => {
    if (!confirmDelete) return;

    try {
      await deleteTeamLogo.mutateAsync(confirmDelete.teamName);
      toast.success(`Logo for "${confirmDelete.teamName}" deleted successfully`);
      setConfirmDelete(null);
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete logo');
    }
  };

  const formatFileSize = (bytes: bigint): string => {
    const kb = Number(bytes) / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatDate = (timestamp: bigint): string => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading team logos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Team Logos Management
          </CardTitle>
          <CardDescription>
            View, search, and manage all uploaded team logos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by team name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <ImageIcon className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-primary">
                {filteredLogos.length}
              </p>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'Matching logos' : 'Total logos uploaded'}
              </p>
            </div>
          </div>

          {/* Logos Table */}
          {filteredLogos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">
                {searchTerm ? 'No logos found' : 'No team logos uploaded yet'}
              </p>
              <p className="text-sm">
                {searchTerm
                  ? 'Try adjusting your search term'
                  : 'Team logos will appear here once uploaded'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-primary/20 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/5 hover:bg-primary/10">
                    <TableHead>Logo</TableHead>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>File Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogos.map((logo) => (
                    <TableRow key={logo.teamName} className="hover:bg-primary/5">
                      <TableCell>
                        <img
                          src={logo.logo.getDirectURL()}
                          alt={logo.teamName}
                          className="w-16 h-16 rounded-md object-cover border border-primary/20"
                          loading="lazy"
                        />
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{logo.teamName}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(logo.uploadTime)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatFileSize(logo.fileSize)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadLogo(logo)}
                            className="gap-1"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setConfirmDelete(logo)}
                            disabled={deleteTeamLogo.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
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
              Delete Team Logo
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the logo for{' '}
              <span className="font-semibold text-foreground">"{confirmDelete?.teamName}"</span>?
              <br /><br />
              <span className="text-destructive font-medium">⚠️ This action cannot be undone.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLogo}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteTeamLogo.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Logo
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
