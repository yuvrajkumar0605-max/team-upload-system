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
  IdCard,
  Link as LinkIcon,
  Loader2,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useSearchTeamsByNameOrPhone } from "../hooks/useQueries";
import type { TeamRegistration } from "../types";

export default function IDPassPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<TeamRegistration | null>(
    null,
  );
  const searchMutation = useSearchTeamsByNameOrPhone();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      return;
    }

    try {
      const results = await searchMutation.mutateAsync(searchTerm.trim());
      if (results && results.length > 0) {
        setSearchResult(results[0]);
      } else {
        setSearchResult(null);
      }
    } catch (_error: unknown) {
      setSearchResult(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary glow-primary flex items-center justify-center gap-3">
            <IdCard className="w-10 h-10" />
            ID Pass
          </h1>
          <p className="text-muted-foreground text-lg">
            Search for your team to view your Team ID and assigned IDP group
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Find Your Team</CardTitle>
            <CardDescription>
              Enter your team name or captain's phone number to search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Team Name or Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter team name or phone number..."
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={searchMutation.isPending || !searchTerm.trim()}
                    className="gap-2"
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
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchMutation.isError && (
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTitle className="text-yellow-500">No Team Found</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              No teams match your search. Please check your team name or phone
              number and try again.
            </AlertDescription>
          </Alert>
        )}

        {searchResult && (
          <>
            {/* ID Pass Not Assigned */}
            {!searchResult.idPassAssigned && (
              <Alert className="border-amber-500/50 bg-amber-500/10 mb-6">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <AlertTitle className="text-amber-500">
                  ID Pass Not Yet Assigned
                </AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  Your ID Pass is not yet assigned. Please check back later or
                  contact the tournament organizers for more information.
                </AlertDescription>
              </Alert>
            )}

            {/* Team Information Card */}
            <Card className="border-primary/50 bg-card/50 backdrop-blur-sm glow-primary">
              <CardHeader>
                <CardTitle className="text-2xl">Team Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Team Logo and Name */}
                <div className="flex items-center gap-6 pb-6 border-b border-border">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex items-center justify-center border-2 border-primary/30">
                    <img
                      src={searchResult.logo.getDirectURL()}
                      alt={`${searchResult.teamName} logo`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary">
                      {searchResult.teamName}
                    </h3>
                    <p className="text-muted-foreground">
                      Captain: {searchResult.captain.name}
                    </p>
                  </div>
                </div>

                {/* Conditional Display Based on ID Pass Status */}
                {searchResult.idPassAssigned ? (
                  <>
                    {/* Team ID and Group Info - Only shown if ID Pass is assigned */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <IdCard className="w-5 h-5" />
                          <Label className="text-base">Team ID</Label>
                        </div>
                        <div className="text-3xl font-bold text-primary">
                          #{searchResult.teamId.toString()}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-5 h-5" />
                          <Label className="text-base">IDP Group</Label>
                        </div>
                        <div className="text-3xl font-bold text-primary">
                          Group {searchResult.groupNumber.toString()}
                        </div>
                      </div>
                    </div>

                    {/* Group Link - Only shown if ID Pass is assigned */}
                    {searchResult.groupLink && (
                      <div className="space-y-2 pt-6 border-t border-border">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <LinkIcon className="w-5 h-5" />
                          <Label className="text-base">Group Link</Label>
                        </div>
                        <a
                          href={searchResult.groupLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:underline break-all"
                        >
                          {searchResult.groupLink}
                        </a>
                      </div>
                    )}

                    {!searchResult.groupLink && (
                      <Alert className="border-blue-500/50 bg-blue-500/10">
                        <AlertDescription className="text-muted-foreground">
                          Group link will be available soon. Please check back
                          later.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                ) : (
                  /* Message when ID Pass is not assigned */
                  <div className="text-center py-8">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-amber-500 opacity-50" />
                    <p className="text-lg font-medium text-muted-foreground">
                      Your team has been registered successfully, but your ID
                      Pass details are not yet available.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Please check back later or contact the organizers for more
                      information.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {!searchResult &&
          !searchMutation.isError &&
          !searchMutation.isPending && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Enter your team name or phone number to search</p>
            </div>
          )}
      </div>
    </div>
  );
}
