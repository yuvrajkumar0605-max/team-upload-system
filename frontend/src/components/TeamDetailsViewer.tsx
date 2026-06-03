import { useState, useMemo } from 'react';
import { useGetTeamDetailsViewer, useUpdateIdPassStatus } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Users, Eye, Download, Phone, User, Hash, CheckCircle, XCircle } from 'lucide-react';
import type { TeamRegistration } from '../backend';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 12;

export default function TeamDetailsViewer() {
  const { data: teams = [], isLoading } = useGetTeamDetailsViewer();
  const updateIdPassStatus = useUpdateIdPassStatus();
  const [selectedTeam, setSelectedTeam] = useState<TeamRegistration | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return teams.slice(startIndex, endIndex);
  }, [teams, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(teams.length / ITEMS_PER_PAGE);
  }, [teams]);

  const handleDownloadLogo = async (team: TeamRegistration) => {
    try {
      const logoBytes = await team.logo.getBytes();
      const blob = new Blob([logoBytes], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${team.teamName.replace(/\s+/g, '_')}_logo.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Logo downloaded for ${team.teamName}`);
    } catch (error: any) {
      toast.error(`Failed to download logo: ${error.message}`);
    }
  };

  const handleToggleIdPass = async (teamId: bigint, currentStatus: boolean) => {
    try {
      await updateIdPassStatus.mutateAsync({ teamId, status: !currentStatus });
      toast.success(`ID Pass ${!currentStatus ? 'assigned' : 'unassigned'} successfully`);
      // Update selected team if it's currently open
      if (selectedTeam && selectedTeam.teamId === teamId) {
        setSelectedTeam({ ...selectedTeam, idPassAssigned: !currentStatus });
      }
    } catch (error: any) {
      toast.error(`Failed to update ID Pass status: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading team details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Team Details Viewer
          </CardTitle>
          <CardDescription>View detailed information for all registered teams</CardDescription>
        </CardHeader>
        <CardContent>
          {teams.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No teams registered yet</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {paginatedData.map((team) => (
                  <Card key={team.id} className="border-primary/20 bg-card/30 hover:bg-card/50 transition-colors">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <img
                            src={team.logo.getDirectURL()}
                            alt={team.teamName}
                            className="w-16 h-16 rounded-lg object-cover border-2 border-primary/30 flex-shrink-0"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">{team.teamName}</h3>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span className="truncate">{team.captain.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{team.members.length} member{team.members.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div>
                          {team.idPassAssigned ? (
                            <Badge className="gap-1 bg-green-500/20 text-green-500 border-green-500/30">
                              <CheckCircle className="w-3 h-3" />
                              ID Pass Assigned
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1 text-red-500 border-red-500/30">
                              <XCircle className="w-3 h-3" />
                              ID Pass Not Assigned
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTeam(team)}
                          className="flex-1 gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadLogo(team)}
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Logo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Team Details Modal */}
      <Dialog open={!!selectedTeam} onOpenChange={(open) => !open && setSelectedTeam(null)}>
        <DialogContent className="max-w-2xl border-primary/20 bg-card/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary flex items-center gap-3">
              <img
                src={selectedTeam?.logo.getDirectURL()}
                alt={selectedTeam?.teamName}
                className="w-12 h-12 rounded-lg object-cover border-2 border-primary/30"
                loading="lazy"
              />
              {selectedTeam?.teamName}
            </DialogTitle>
            <DialogDescription>Complete team registration information</DialogDescription>
          </DialogHeader>

          {selectedTeam && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* ID Pass Status */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">ID Pass Status</h3>
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3">
                      {selectedTeam.idPassAssigned ? (
                        <Badge className="gap-1 bg-green-500/20 text-green-500 border-green-500/30">
                          <CheckCircle className="w-4 h-4" />
                          ID Pass Assigned
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-red-500 border-red-500/30">
                          <XCircle className="w-4 h-4" />
                          ID Pass Not Assigned
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={selectedTeam.idPassAssigned ? "destructive" : "default"}
                      onClick={() => handleToggleIdPass(selectedTeam.teamId, selectedTeam.idPassAssigned)}
                      disabled={updateIdPassStatus.isPending}
                      className="gap-2"
                    >
                      {selectedTeam.idPassAssigned ? (
                        <>
                          <XCircle className="w-4 h-4" />
                          Unassign
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Assign
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Captain Information */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Captain Information</h3>
                  <div className="space-y-2 bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-medium">Name:</span>
                      <span>{selectedTeam.captain.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="font-medium">Phone:</span>
                      <span>{selectedTeam.captain.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Team Members ({selectedTeam.members.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedTeam.members.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <span className="font-medium">{member.name}</span>
                        </div>
                        {member.playerId && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Hash className="w-4 h-4" />
                            <span>{member.playerId}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Logo */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Team Logo</h3>
                  <div className="flex flex-col items-center gap-4 p-6 bg-primary/5 rounded-lg border border-primary/20">
                    <img
                      src={selectedTeam.logo.getDirectURL()}
                      alt={selectedTeam.teamName}
                      className="w-48 h-48 rounded-lg object-cover border-2 border-primary/30"
                      loading="lazy"
                    />
                    <Button
                      onClick={() => handleDownloadLogo(selectedTeam)}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Logo
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
