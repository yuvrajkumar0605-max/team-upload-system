import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  DoorClosed,
  DoorOpen,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  IdCard,
  Image as ImageIcon,
  Infinity as InfinityIcon,
  Megaphone,
  Save,
  Search,
  Share2,
  Trash2,
  Trophy,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import {
  useCloseRegistration,
  useDeleteRegistration,
  useGetAllRegistrations,
  useGetAllTeamLogos,
  useGetAnnouncementsCount,
  useGetRegistrationStatus,
  useGetRegistrationSummary,
  useGetResultsCount,
  useSearchTeamsByName,
  useSetMaxTeamRegistrations,
  useStoreReport,
} from "../hooks/useQueries";
import { generateExcelBlob } from "../lib/excelExport";
import type { TeamRegistration } from "../types";
import AnnouncementsManagement from "./AnnouncementsManagement";
import BannerManagement from "./BannerManagement";
import DuplicateRegistrationsManagement from "./DuplicateRegistrationsManagement";
import GroupManagement from "./GroupManagement";
import IDPassManagement from "./IDPassManagement";
import ReportsManagement from "./ReportsManagement";
import ResultsManagement from "./ResultsManagement";
import SocialLinksManagement from "./SocialLinksManagement";
import TeamDetailsViewer from "./TeamDetailsViewer";
import TeamLogosManagement from "./TeamLogosManagement";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
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
import { Switch } from "./ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function AdminDashboard() {
  const { data: registrations = [], isLoading } = useGetAllRegistrations();
  const { data: announcementsCount = BigInt(0) } = useGetAnnouncementsCount();
  const { data: resultsCount = BigInt(0) } = useGetResultsCount();
  const { data: teamLogos = [] } = useGetAllTeamLogos();
  const { data: isRegistrationOpen = true, isLoading: statusLoading } =
    useGetRegistrationStatus();
  const { data: summary, isLoading: summaryLoading } =
    useGetRegistrationSummary();
  const deleteRegistration = useDeleteRegistration();
  const closeRegistration = useCloseRegistration();
  const setMaxTeamRegistrations = useSetMaxTeamRegistrations();
  const storeReport = useStoreReport();
  const searchTeamsByName = useSearchTeamsByName();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<TeamRegistration[] | null>(
    null,
  );
  const [isSearching, setIsSearching] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete";
    registration: TeamRegistration;
  } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Registration limit state
  const [limitInput, setLimitInput] = useState("");
  const [isUnlimited, setIsUnlimited] = useState(
    summary?.maxTeams === undefined,
  );

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setSearchResults(null);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      searchTeamsByName.mutate(searchTerm, {
        onSuccess: (results) => {
          setSearchResults(results);
          setIsSearching(false);
        },
        onError: () => {
          setSearchResults([]);
          setIsSearching(false);
        },
      });
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, searchTeamsByName.mutate]);

  // Clear search handler
  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setSearchResults(null);
    setIsSearching(false);
  }, []);

  // Display registrations (either search results or all registrations)
  const displayedRegistrations = useMemo(() => {
    const teamsToDisplay =
      searchResults !== null ? searchResults : registrations;

    // Sort by team name
    return [...teamsToDisplay].sort((a, b) =>
      a.teamName.localeCompare(b.teamName),
    );
  }, [searchResults, registrations]);

  // Statistics
  const stats = useMemo(() => {
    const total = summary ? Number(summary.totalTeams) : registrations.length;
    const announcements = Number(announcementsCount);
    const results = Number(resultsCount);
    const logos = teamLogos.length;
    const limit =
      summary?.maxTeams !== undefined ? Number(summary.maxTeams) : null;
    return { total, announcements, results, logos, limit };
  }, [summary, registrations, announcementsCount, resultsCount, teamLogos]);

  const handleDelete = async (registration: TeamRegistration) => {
    setConfirmAction({ type: "delete", registration });
  };

  const confirmDelete = async () => {
    if (!confirmAction || confirmAction.type !== "delete") return;

    try {
      await deleteRegistration.mutateAsync(confirmAction.registration.id);
      toast.success(
        `Team "${confirmAction.registration.teamName}" deleted successfully`,
      );
    } catch (error: any) {
      toast.error(`Failed to delete team: ${error.message}`);
    } finally {
      setConfirmAction(null);
    }
  };

  const handleToggleRegistration = async (checked: boolean) => {
    try {
      await closeRegistration.mutateAsync(checked);
      toast.success(
        `Registration ${checked ? "opened" : "closed"} successfully`,
      );
    } catch (error: any) {
      toast.error(
        `Failed to ${checked ? "open" : "close"} registration: ${error.message}`,
      );
    }
  };

  const handleSaveLimit = async () => {
    try {
      if (isUnlimited) {
        await setMaxTeamRegistrations.mutateAsync(null);
        toast.success("Registration limit removed (unlimited)");
      } else {
        const limit = Number.parseInt(limitInput);
        if (Number.isNaN(limit) || limit < 1) {
          toast.error("Please enter a valid number greater than 0");
          return;
        }
        await setMaxTeamRegistrations.mutateAsync(BigInt(limit));
        toast.success(`Registration limit set to ${limit} teams`);
      }
    } catch (error: any) {
      toast.error(`Failed to update limit: ${error.message}`);
    }
  };

  const handleUnlimitedToggle = (checked: boolean) => {
    setIsUnlimited(checked);
    if (checked) {
      setLimitInput("");
    }
  };

  const handleDownloadExcel = async () => {
    if (registrations.length === 0) {
      toast.error("No registrations to export");
      return;
    }

    setIsExporting(true);
    try {
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `BOOYAH_Registrations_${timestamp}.csv`;

      // Generate CSV blob
      const csvBlob = await generateExcelBlob(registrations);
      const size = BigInt(csvBlob.size);

      // Upload to cloud storage
      const externalBlob = ExternalBlob.fromBytes(
        new Uint8Array(await csvBlob.arrayBuffer()),
      );
      await storeReport.mutateAsync({ filename, blob: externalBlob, size });

      // Also download locally
      const url = URL.createObjectURL(csvBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Excel report generated and saved to cloud storage");
    } catch (error: any) {
      console.error("Excel export error:", error);
      toast.error("Failed to generate Excel report");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading || statusLoading || summaryLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2 glow-text">
            Battle of Supremacy - Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage tournament registrations, announcements, and results
          </p>
        </div>
        <Button
          onClick={handleDownloadExcel}
          disabled={isExporting || registrations.length === 0}
          className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Download Excel Report
            </>
          )}
        </Button>
      </div>

      {/* Registration Control */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isRegistrationOpen ? (
              <DoorOpen className="w-5 h-5 text-green-500" />
            ) : (
              <DoorClosed className="w-5 h-5 text-red-500" />
            )}
            Registration Control
          </CardTitle>
          <CardDescription>
            Enable or disable team registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-primary/20 rounded-lg bg-primary/5">
            <div className="flex items-center gap-3">
              <Label
                htmlFor="registration-toggle"
                className="text-base font-medium cursor-pointer"
              >
                Registration Status
              </Label>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isRegistrationOpen
                    ? "bg-green-500/20 text-green-500 border border-green-500/30"
                    : "bg-red-500/20 text-red-500 border border-red-500/30"
                }`}
              >
                {isRegistrationOpen ? "Open" : "Closed"}
              </div>
            </div>
            <Switch
              id="registration-toggle"
              checked={isRegistrationOpen}
              onCheckedChange={handleToggleRegistration}
              disabled={closeRegistration.isPending}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {isRegistrationOpen
              ? "Teams can currently submit new registrations. Toggle off to close registration."
              : "Registration is closed. New team submissions are blocked. Toggle on to allow registrations."}
          </p>
        </CardContent>
      </Card>

      {/* Registration Limit Control */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Registration Limit
          </CardTitle>
          <CardDescription>
            Set maximum number of team registrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-primary/20 rounded-lg bg-primary/5">
            <div>
              <p className="text-sm font-medium">Current Status</p>
              <p className="text-2xl font-bold text-primary flex items-center gap-2">
                {stats.limit !== null ? (
                  <span>
                    {stats.total} / {stats.limit} teams registered
                  </span>
                ) : (
                  <span>{stats.total} teams registered</span>
                )}
              </p>
              {stats.limit !== null && (
                <p className="text-sm text-muted-foreground mt-1">
                  Limit: {stats.limit} teams
                </p>
              )}
              {stats.limit === null && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <InfinityIcon className="w-4 h-4" /> Unlimited
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Switch
                id="unlimited-toggle"
                checked={isUnlimited}
                onCheckedChange={handleUnlimitedToggle}
              />
              <Label htmlFor="unlimited-toggle" className="cursor-pointer">
                Unlimited registrations
              </Label>
            </div>

            {!isUnlimited && (
              <div className="space-y-2">
                <Label htmlFor="limit-input">Maximum Teams</Label>
                <div className="flex gap-2">
                  <Input
                    id="limit-input"
                    type="number"
                    min="1"
                    placeholder="Enter maximum number of teams"
                    value={limitInput}
                    onChange={(e) => setLimitInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSaveLimit}
                    disabled={setMaxTeamRegistrations.isPending}
                    className="gap-2"
                  >
                    {setMaxTeamRegistrations.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {isUnlimited && (
              <Button
                onClick={handleSaveLimit}
                disabled={setMaxTeamRegistrations.isPending}
                variant="outline"
                className="w-full gap-2"
              >
                {setMaxTeamRegistrations.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Unlimited Setting
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Registered Teams
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.limit !== null ? (
                <span>
                  {stats.total} / {stats.limit}
                </span>
              ) : (
                <span>{stats.total}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.limit !== null
                ? `${stats.limit - stats.total} spots remaining`
                : "Unlimited spots"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Announcements</CardTitle>
            <Megaphone className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {stats.announcements}
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Results</CardTitle>
            <Trophy className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {stats.results}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Logos</CardTitle>
            <ImageIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {stats.logos}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Teams, Team Details, Duplicates, ID Pass, Group Management, Schedule, Announcements, Results, Social Links, Team Logos, and Reports */}
      <Tabs defaultValue="teams" className="space-y-6">
        <TabsList className="grid w-full max-w-6xl grid-cols-5 lg:grid-cols-12">
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="details">
            <Eye className="w-4 h-4 mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger value="duplicates">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Duplicates
          </TabsTrigger>
          <TabsTrigger value="idpass">
            <IdCard className="w-4 h-4 mr-2" />
            ID Pass
          </TabsTrigger>
          <TabsTrigger value="groups">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Groups
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="banner">Banner</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="social">
            <Share2 className="w-4 h-4 mr-2" />
            Social
          </TabsTrigger>
          <TabsTrigger value="logos">
            <ImageIcon className="w-4 h-4 mr-2" />
            Logos
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="space-y-6">
          {/* Filters and Search */}
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Team Registrations</CardTitle>
              <CardDescription>
                Review and manage team registrations (all teams are
                auto-approved)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
                      onClick={handleClearSearch}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Search status indicator */}
              {searchTerm && (
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  {isSearching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : searchResults !== null ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>
                        Found {displayedRegistrations.length} team
                        {displayedRegistrations.length !== 1 ? "s" : ""}{" "}
                        matching "{searchTerm}"
                      </span>
                    </>
                  ) : null}
                </div>
              )}

              {/* Registrations Table */}
              {displayedRegistrations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {searchTerm
                      ? "No teams found matching your search"
                      : "No registrations found"}
                  </p>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      onClick={handleClearSearch}
                      className="mt-4"
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              ) : (
                <div className="rounded-md border border-primary/20 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary/5 hover:bg-primary/10">
                        <TableHead>Team ID</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Group</TableHead>
                        <TableHead>ID Pass</TableHead>
                        <TableHead>Captain</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedRegistrations.map((registration) => (
                        <TableRow
                          key={registration.id}
                          className="hover:bg-primary/5"
                        >
                          <TableCell className="font-mono font-bold text-primary">
                            #{registration.teamId.toString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={registration.logo.getDirectURL()}
                                alt={registration.teamName}
                                className="w-10 h-10 rounded-md object-cover border border-primary/20"
                              />
                              <span className="font-medium">
                                {registration.teamName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-sm">
                              Group {registration.groupNumber.toString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            {registration.idPassAssigned ? (
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
                          <TableCell>{registration.captain.name}</TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {registration.captain.phone}
                            </div>
                          </TableCell>
                          <TableCell>{registration.members.length}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(registration)}
                              disabled={deleteRegistration.isPending}
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
        </TabsContent>

        <TabsContent value="details">
          <TeamDetailsViewer />
        </TabsContent>

        <TabsContent value="duplicates">
          <DuplicateRegistrationsManagement />
        </TabsContent>

        <TabsContent value="idpass">
          <IDPassManagement />
        </TabsContent>

        <TabsContent value="groups">
          <GroupManagement />
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule Management
              </CardTitle>
              <CardDescription>
                Upload and manage the IDP group schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">
                  Schedule Management Coming Soon
                </p>
                <p className="text-sm">
                  Schedule upload and management features will be available in
                  the next update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements">
          <AnnouncementsManagement />
        </TabsContent>

        <TabsContent value="banner">
          <BannerManagement />
        </TabsContent>

        <TabsContent value="results">
          <ResultsManagement />
        </TabsContent>

        <TabsContent value="social">
          <SocialLinksManagement />
        </TabsContent>

        <TabsContent value="logos">
          <TeamLogosManagement />
        </TabsContent>

        <TabsContent value="reports">
          <ReportsManagement />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={confirmAction?.type === "delete"}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <AlertDialogContent className="border-destructive/20 bg-card/95 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Delete Team Registration
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the team{" "}
              <span className="font-semibold text-foreground">
                "{confirmAction?.registration.teamName}"
              </span>
              ?
              <br />
              <br />
              <span className="text-destructive font-medium">
                ⚠️ This action cannot be undone.
              </span>{" "}
              All team data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteRegistration.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Team
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
