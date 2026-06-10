import {
  CheckCircle,
  Filter,
  IdCard,
  Link as LinkIcon,
  Loader2,
  Save,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useAddGroupLink,
  useBulkUpdateIdPassStatus,
  useGetAllGroupLinks,
  useGetAllTeamsWithIdPassStatus,
  useUpdateIdPassStatus,
} from "../hooks/useQueries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Textarea } from "./ui/textarea";

export default function IDPassManagement() {
  const { data: teams = [], isLoading: teamsLoading } =
    useGetAllTeamsWithIdPassStatus();
  const { data: groupLinks = [], isLoading: linksLoading } =
    useGetAllGroupLinks();
  const addGroupLink = useAddGroupLink();
  const updateIdPassStatus = useUpdateIdPassStatus();
  const bulkUpdateIdPassStatus = useBulkUpdateIdPassStatus();

  const [linkInputs, setLinkInputs] = useState<Record<number, string>>({});
  const [bulkLinks, setBulkLinks] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "assigned" | "not-assigned"
  >("all");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize link inputs from backend data
  useMemo(() => {
    if (groupLinks.length > 0) {
      const linksMap: Record<number, string> = {};
      for (const [groupNum, link] of groupLinks) {
        linksMap[Number(groupNum)] = link;
      }
      setLinkInputs(linksMap);
    }
  }, [groupLinks]);

  // Group teams by group number
  const teamsByGroup = useMemo(() => {
    const grouped: Record<number, typeof teams> = {};
    for (let i = 1; i <= 18; i++) {
      grouped[i] = [];
    }
    for (const team of teams) {
      const groupNum = Number(team.groupNumber);
      if (groupNum >= 1 && groupNum <= 18) {
        grouped[groupNum].push(team);
      }
    }
    return grouped;
  }, [teams]);

  // Filter teams by search term and ID Pass status
  const filteredTeams = useMemo(() => {
    let filtered = teams;

    // Apply status filter
    if (filterStatus === "assigned") {
      filtered = filtered.filter((team) => team.idPassAssigned);
    } else if (filterStatus === "not-assigned") {
      filtered = filtered.filter((team) => !team.idPassAssigned);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (team) =>
          team.teamName.toLowerCase().includes(term) ||
          team.teamId.toString().includes(term) ||
          team.groupNumber.toString().includes(term),
      );
    }

    return filtered;
  }, [teams, searchTerm, filterStatus]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalTeams = teams.length;
    const assignedTeams = teams.filter((t) => t.idPassAssigned).length;
    const notAssignedTeams = totalTeams - assignedTeams;
    return { totalTeams, assignedTeams, notAssignedTeams };
  }, [teams]);

  const handleLinkChange = (groupNumber: number, value: string) => {
    setLinkInputs((prev) => ({ ...prev, [groupNumber]: value }));
  };

  const handleSaveLink = async (groupNumber: number) => {
    const link = linkInputs[groupNumber]?.trim();
    if (!link) {
      toast.error("Please enter a valid link");
      return;
    }

    try {
      await addGroupLink.mutateAsync({
        groupNumber: BigInt(groupNumber),
        link,
      });
      toast.success(`Group ${groupNumber} link saved successfully`);
    } catch (error: any) {
      toast.error(`Failed to save link: ${error.message}`);
    }
  };

  const handleBulkSave = async () => {
    const lines = bulkLinks.split("\n").filter((line) => line.trim());
    if (lines.length !== 18) {
      toast.error("Please provide exactly 18 links (one per line)");
      return;
    }

    setIsSaving(true);
    try {
      for (let i = 0; i < 18; i++) {
        const link = lines[i].trim();
        if (link) {
          await addGroupLink.mutateAsync({ groupNumber: BigInt(i + 1), link });
        }
      }
      toast.success("All group links saved successfully");
      setBulkLinks("");
    } catch (error: any) {
      toast.error(`Failed to save links: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleIdPass = async (teamId: bigint, currentStatus: boolean) => {
    try {
      await updateIdPassStatus.mutateAsync({ teamId, status: !currentStatus });
      toast.success(
        `ID Pass ${!currentStatus ? "assigned" : "unassigned"} successfully`,
      );
    } catch (error: any) {
      toast.error(`Failed to update ID Pass status: ${error.message}`);
    }
  };

  const handleBulkAssign = async () => {
    try {
      await bulkUpdateIdPassStatus.mutateAsync(true);
      toast.success("ID Pass assigned to all teams");
    } catch (error: any) {
      toast.error(`Failed to assign ID Pass to all teams: ${error.message}`);
    }
  };

  const handleBulkUnassign = async () => {
    try {
      await bulkUpdateIdPassStatus.mutateAsync(false);
      toast.success("ID Pass unassigned from all teams");
    } catch (error: any) {
      toast.error(
        `Failed to unassign ID Pass from all teams: ${error.message}`,
      );
    }
  };

  if (teamsLoading || linksLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading ID Pass management...</p>
        </div>
      </div>
    );
  }

  const totalTeams = teams.length;
  const _teamsPerGroup = Math.ceil(totalTeams / 18);

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.totalTeams}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              ID Pass Assigned
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {stats.assignedTeams}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Assigned</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats.notAssignedTeams}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <IdCard className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">18</div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk ID Pass Assignment */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IdCard className="w-5 h-5" />
            Bulk ID Pass Assignment
          </CardTitle>
          <CardDescription>
            Assign or unassign ID Pass for all teams at once
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button
            onClick={handleBulkAssign}
            disabled={bulkUpdateIdPassStatus.isPending}
            className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
          >
            {bulkUpdateIdPassStatus.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Assign All
              </>
            )}
          </Button>
          <Button
            onClick={handleBulkUnassign}
            disabled={bulkUpdateIdPassStatus.isPending}
            variant="destructive"
            className="flex-1 gap-2"
          >
            {bulkUpdateIdPassStatus.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Unassign All
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* ID Pass Assignment Table */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>ID Pass Assignment Status</CardTitle>
          <CardDescription>
            Manage ID Pass assignment for individual teams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by team name, ID, or group..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={filterStatus}
                onValueChange={(value: any) => setFilterStatus(value)}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="assigned">Assigned Only</SelectItem>
                  <SelectItem value="not-assigned">
                    Not Assigned Only
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredTeams.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No teams found</p>
              </div>
            ) : (
              <div className="rounded-md border border-primary/20 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5 hover:bg-primary/10">
                      <TableHead>Team ID</TableHead>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>ID Pass Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeams.map((team) => (
                      <TableRow key={team.id} className="hover:bg-primary/5">
                        <TableCell className="font-mono font-bold text-primary">
                          #{team.teamId.toString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={team.logo.getDirectURL()}
                              alt={team.teamName}
                              className="w-8 h-8 rounded object-cover border border-primary/20"
                            />
                            <span className="font-medium">{team.teamName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                            Group {team.groupNumber.toString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          {team.idPassAssigned ? (
                            <Badge className="gap-1 bg-green-500/20 text-green-500 border-green-500/30">
                              <CheckCircle className="w-3 h-3" />
                              Assigned
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="gap-1 text-red-500 border-red-500/30"
                            >
                              <XCircle className="w-3 h-3" />
                              Not Assigned
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant={
                              team.idPassAssigned ? "destructive" : "default"
                            }
                            onClick={() =>
                              handleToggleIdPass(
                                team.teamId,
                                team.idPassAssigned,
                              )
                            }
                            disabled={updateIdPassStatus.isPending}
                            className="gap-2"
                          >
                            {team.idPassAssigned ? (
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Link Upload */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Bulk Upload Group Links
          </CardTitle>
          <CardDescription>
            Enter 18 unique group links (one per line) to assign to all groups
            at once
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bulk-links">Group Links (18 lines)</Label>
            <Textarea
              id="bulk-links"
              value={bulkLinks}
              onChange={(e) => setBulkLinks(e.target.value)}
              placeholder="https://group1.link&#10;https://group2.link&#10;https://group3.link&#10;..."
              rows={10}
              className="font-mono text-sm"
            />
          </div>
          <Button
            onClick={handleBulkSave}
            disabled={isSaving || addGroupLink.isPending}
            className="w-full gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving All Links...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save All Group Links
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Individual Group Links */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Individual Group Link Management</CardTitle>
          <CardDescription>
            Edit links for each group individually
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {Array.from({ length: 18 }, (_, i) => i + 1).map((groupNum) => {
              const groupTeams = teamsByGroup[groupNum];
              const assignedCount = groupTeams.filter(
                (t) => t.idPassAssigned,
              ).length;

              return (
                <AccordionItem key={groupNum} value={`group-${groupNum}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="font-semibold">Group {groupNum}</span>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{groupTeams.length} teams</span>
                        <span className="text-green-500">
                          {assignedCount} assigned
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <div className="flex gap-2">
                        <Input
                          value={linkInputs[groupNum] || ""}
                          onChange={(e) =>
                            handleLinkChange(groupNum, e.target.value)
                          }
                          placeholder={`Enter link for Group ${groupNum}`}
                          className="flex-1"
                        />
                        <Button
                          onClick={() => handleSaveLink(groupNum)}
                          disabled={addGroupLink.isPending}
                          className="gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </Button>
                      </div>
                      {groupTeams.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium mb-2">
                            Teams in this group:
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            {groupTeams.map((team) => (
                              <li
                                key={team.id}
                                className="flex items-center justify-between"
                              >
                                <span>
                                  {team.teamName} (ID: #{team.teamId.toString()}
                                  )
                                </span>
                                {team.idPassAssigned ? (
                                  <Badge className="gap-1 bg-green-500/20 text-green-500 border-green-500/30 text-xs">
                                    <CheckCircle className="w-3 h-3" />
                                    Assigned
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="gap-1 text-red-500 border-red-500/30 text-xs"
                                  >
                                    <XCircle className="w-3 h-3" />
                                    Not Assigned
                                  </Badge>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
