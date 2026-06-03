import { useState, useMemo } from 'react';
import { useGetDuplicateRegistrations, useDeleteDuplicateEntry, useGetAllRegistrations } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { XCircle, Trash2, Search, AlertTriangle, Eye, Users, Phone, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { DuplicateEntry, TeamRegistration } from '../backend';
import { DuplicateReason } from '../backend';

export default function DuplicateRegistrationsManagement() {
  const { data: duplicates = [], isLoading: duplicatesLoading } = useGetDuplicateRegistrations();
  const { data: allRegistrations = [] } = useGetAllRegistrations();
  const deleteDuplicateEntry = useDeleteDuplicateEntry();

  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<DuplicateEntry | null>(null);
  const [viewDetails, setViewDetails] = useState<{ original: TeamRegistration; duplicate: TeamRegistration; reason: DuplicateReason } | null>(null);

  // Create a map for quick registration lookup
  const registrationsMap = useMemo(() => {
    const map = new Map<string, TeamRegistration>();
    allRegistrations.forEach(reg => map.set(reg.id, reg));
    return map;
  }, [allRegistrations]);

  // Filter duplicates based on search
  const filteredDuplicates = useMemo(() => {
    return duplicates.filter((dup) => {
      const original = registrationsMap.get(dup.originalId);
      const duplicate = registrationsMap.get(dup.duplicateId);
      
      if (!original || !duplicate) return false;

      const matchesSearch = 
        original.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        duplicate.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        original.captain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        duplicate.captain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        original.captain.phone.includes(searchTerm) ||
        duplicate.captain.phone.includes(searchTerm);

      return matchesSearch;
    });
  }, [duplicates, registrationsMap, searchTerm]);

  const handleDelete = async (duplicate: DuplicateEntry) => {
    setConfirmDelete(duplicate);
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;

    // Generate the duplicate ID based on the backend logic
    const reason = confirmDelete.reason === DuplicateReason.teamName ? 'team-name' : 'phone';
    const duplicateId = `${confirmDelete.duplicateId}_${reason}_${confirmDelete.duplicatedAt}`;

    try {
      await deleteDuplicateEntry.mutateAsync(duplicateId);
      toast.success('Duplicate record deleted successfully');
    } catch (error: any) {
      toast.error(`Failed to delete duplicate: ${error.message}`);
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleViewDetails = (duplicate: DuplicateEntry) => {
    const original = registrationsMap.get(duplicate.originalId);
    const duplicateReg = registrationsMap.get(duplicate.duplicateId);

    if (original && duplicateReg) {
      setViewDetails({ original, duplicate: duplicateReg, reason: duplicate.reason });
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleString();
  };

  const getReason = (reason: DuplicateReason) => {
    if (reason === DuplicateReason.teamName) {
      return { text: 'Team Name', icon: Users, color: 'text-blue-500' };
    } else {
      return { text: 'Captain Phone', icon: Phone, color: 'text-purple-500' };
    }
  };

  if (duplicatesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading duplicate registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-amber-500/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Duplicate Registrations
          </CardTitle>
          <CardDescription>
            Review and manage duplicate team registrations detected by the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by team name, captain name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Duplicates Table */}
          {filteredDuplicates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No duplicates found</p>
              <p className="text-sm mt-2">All team registrations are unique</p>
            </div>
          ) : (
            <div className="rounded-md border border-amber-500/20 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-amber-500/5 hover:bg-amber-500/10">
                    <TableHead>Original Team</TableHead>
                    <TableHead>Duplicate Team</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Detected At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDuplicates.map((duplicate, index) => {
                    const original = registrationsMap.get(duplicate.originalId);
                    const duplicateReg = registrationsMap.get(duplicate.duplicateId);
                    const reasonInfo = getReason(duplicate.reason);
                    const ReasonIcon = reasonInfo.icon;

                    if (!original || !duplicateReg) return null;

                    return (
                      <TableRow key={`${duplicate.originalId}-${duplicate.duplicateId}-${index}`} className="hover:bg-amber-500/5">
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={original.logo.getDirectURL()}
                                alt={original.teamName}
                                className="w-10 h-10 rounded-md object-cover border border-primary/20"
                                loading="lazy"
                              />
                              <div>
                                <div className="font-medium">{original.teamName}</div>
                                <div className="text-sm text-muted-foreground">{original.captain.name}</div>
                              </div>
                            </div>
                            {original.idPassAssigned && (
                              <Badge className="gap-1 bg-green-500/20 text-green-500 border-green-500/30 text-xs">
                                <CheckCircle className="w-3 h-3" />
                                ID Pass Assigned
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={duplicateReg.logo.getDirectURL()}
                                alt={duplicateReg.teamName}
                                className="w-10 h-10 rounded-md object-cover border border-primary/20"
                                loading="lazy"
                              />
                              <div>
                                <div className="font-medium">{duplicateReg.teamName}</div>
                                <div className="text-sm text-muted-foreground">{duplicateReg.captain.name}</div>
                              </div>
                            </div>
                            {duplicateReg.idPassAssigned && (
                              <Badge className="gap-1 bg-green-500/20 text-green-500 border-green-500/30 text-xs">
                                <CheckCircle className="w-3 h-3" />
                                ID Pass Assigned
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`gap-1 ${reasonInfo.color}`}>
                            <ReasonIcon className="w-3 h-3" />
                            {reasonInfo.text}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(duplicate.duplicatedAt)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(duplicate)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Details
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(duplicate)}
                              disabled={deleteDuplicateEntry.isPending}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
              <XCircle className="w-5 h-5" />
              Delete Duplicate Record
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this duplicate record?
              <br /><br />
              <span className="text-destructive font-medium">⚠️ This will permanently delete the duplicate team registration.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAction}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteDuplicateEntry.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Record
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Details Dialog */}
      <Dialog open={!!viewDetails} onOpenChange={(open) => !open && setViewDetails(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto border-primary/20 bg-card/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Duplicate Registration Details
            </DialogTitle>
            <DialogDescription>
              Compare the original and duplicate team registrations
            </DialogDescription>
          </DialogHeader>

          {viewDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Original Team */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-primary/20">
                  <h3 className="text-lg font-semibold text-green-500">Original Team</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={viewDetails.original.logo.getDirectURL()}
                      alt={viewDetails.original.teamName}
                      className="w-16 h-16 rounded-md object-cover border border-primary/20"
                    />
                    <div>
                      <p className="font-medium text-lg">{viewDetails.original.teamName}</p>
                      <p className="text-sm text-muted-foreground">Team ID: {viewDetails.original.id}</p>
                    </div>
                  </div>
                  {viewDetails.original.idPassAssigned && (
                    <Badge className="gap-1 bg-green-500/20 text-green-500 border-green-500/30">
                      <CheckCircle className="w-3 h-3" />
                      ID Pass Assigned
                    </Badge>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Captain</p>
                    <p className="font-medium">{viewDetails.original.captain.name}</p>
                    <p className="text-sm text-muted-foreground">{viewDetails.original.captain.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Team Members ({viewDetails.original.members.length})</p>
                    <div className="space-y-1">
                      {viewDetails.original.members.map((member, idx) => (
                        <div key={idx} className="text-sm p-2 bg-primary/5 rounded border border-primary/10">
                          <p className="font-medium">{member.name}</p>
                          {member.playerId && (
                            <p className="text-muted-foreground">ID: {member.playerId}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Duplicate Team */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-amber-500/20">
                  <h3 className="text-lg font-semibold text-amber-500">Duplicate Team</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={viewDetails.duplicate.logo.getDirectURL()}
                      alt={viewDetails.duplicate.teamName}
                      className="w-16 h-16 rounded-md object-cover border border-primary/20"
                    />
                    <div>
                      <p className="font-medium text-lg">{viewDetails.duplicate.teamName}</p>
                      <p className="text-sm text-muted-foreground">Team ID: {viewDetails.duplicate.id}</p>
                    </div>
                  </div>
                  {viewDetails.duplicate.idPassAssigned && (
                    <Badge className="gap-1 bg-green-500/20 text-green-500 border-green-500/30">
                      <CheckCircle className="w-3 h-3" />
                      ID Pass Assigned
                    </Badge>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Captain</p>
                    <p className="font-medium">{viewDetails.duplicate.captain.name}</p>
                    <p className="text-sm text-muted-foreground">{viewDetails.duplicate.captain.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Team Members ({viewDetails.duplicate.members.length})</p>
                    <div className="space-y-1">
                      {viewDetails.duplicate.members.map((member, idx) => (
                        <div key={idx} className="text-sm p-2 bg-primary/5 rounded border border-primary/10">
                          <p className="font-medium">{member.name}</p>
                          {member.playerId && (
                            <p className="text-muted-foreground">ID: {member.playerId}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewDetails && (
            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Duplicate Reason: {getReason(viewDetails.reason).text}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
