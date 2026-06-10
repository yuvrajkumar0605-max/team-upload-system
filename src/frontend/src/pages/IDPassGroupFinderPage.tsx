import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  ExternalLink,
  Link as LinkIcon,
  Loader2,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useSearchGroupLinkByTeam } from "../hooks/useQueries";

export default function IDPassGroupFinderPage() {
  const [teamName, setTeamName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const searchMutation = useSearchGroupLinkByTeam();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim() || !phoneNumber.trim()) {
      return;
    }

    await searchMutation.mutateAsync({
      teamName: teamName.trim(),
      phoneNumber: phoneNumber.trim(),
    });
  };

  const handleReset = () => {
    setTeamName("");
    setPhoneNumber("");
    searchMutation.reset();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary glow-primary flex items-center justify-center gap-3">
            <LinkIcon className="w-10 h-10" />
            ID Pass Group Finder
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your team name and phone number to find your assigned group
            link
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Find Your Group Link</CardTitle>
            <CardDescription>
              Enter your team name and captain's phone number to access your
              group assignment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter your team name..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Captain Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter captain's phone number..."
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={
                    searchMutation.isPending ||
                    !teamName.trim() ||
                    !phoneNumber.trim()
                  }
                  className="flex-1 gap-2"
                >
                  {searchMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Search
                    </>
                  )}
                </Button>
                {(searchMutation.data || searchMutation.isError) && (
                  <Button type="button" variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchMutation.isError && (
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <AlertTitle className="text-red-500">Team Not Found</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              You must register your team before accessing ID Pass group links.
              Please check your team name and phone number, or register your
              team first.
            </AlertDescription>
          </Alert>
        )}

        {searchMutation.data && (
          <Card className="border-primary/50 bg-card/50 backdrop-blur-sm glow-primary">
            <CardHeader>
              <CardTitle className="text-2xl">Your Group Assignment</CardTitle>
              <CardDescription>
                Group information for {teamName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Group Information */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-5 h-5" />
                    <Label className="text-base">Group Number</Label>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    Group {searchMutation.data.groupNumber.toString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <LinkIcon className="w-5 h-5" />
                    <Label className="text-base">Group ID</Label>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    #{searchMutation.data.groupId.toString()}
                  </div>
                </div>
              </div>

              {/* Group Link */}
              <div className="space-y-3 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ExternalLink className="w-5 h-5" />
                  <Label className="text-base">Your Group Link</Label>
                </div>
                <a
                  href={searchMutation.data.groupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  <ExternalLink className="w-5 h-5" />
                  Open Group Link
                </a>
                <p className="text-sm text-muted-foreground break-all">
                  {searchMutation.data.groupLink}
                </p>
              </div>

              {/* Success Message */}
              <Alert className="border-green-500/50 bg-green-500/10">
                <AlertDescription className="text-muted-foreground">
                  Your group assignment has been found! Click the link above to
                  access your group.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {!searchMutation.data &&
          !searchMutation.isError &&
          !searchMutation.isPending && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>
                Enter your team name and phone number to find your group link
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
