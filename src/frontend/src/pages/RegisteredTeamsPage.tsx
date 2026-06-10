import { Button } from "@/components/ui/button";
import { Loader2, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import {
  useGetPublicRegistrations,
  useGetRegistrationSummary,
} from "../hooks/useQueries";

const ITEMS_PER_PAGE = 12;

export default function RegisteredTeamsPage() {
  const { data: registrations, isLoading, error } = useGetPublicRegistrations();
  const { data: summary, isLoading: summaryLoading } =
    useGetRegistrationSummary();
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const paginatedData = useMemo(() => {
    if (!registrations) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return registrations.slice(startIndex, endIndex);
  }, [registrations, currentPage]);

  const totalPages = useMemo(() => {
    if (!registrations) return 0;
    return Math.ceil(registrations.length / ITEMS_PER_PAGE);
  }, [registrations]);

  if (isLoading || summaryLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading registered teams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-card border border-border rounded-lg p-8">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Unable to Load Teams</h2>
            <p className="text-muted-foreground">
              We're having trouble loading the registered teams. Please try
              again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!registrations || registrations.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-card border border-border rounded-lg p-8">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Teams Registered Yet</h2>
            <p className="text-muted-foreground">
              Be the first to register your team for the tournament!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalTeams = summary
    ? Number(summary.totalTeams)
    : registrations.length;
  const maxTeams =
    summary?.maxTeams !== undefined ? Number(summary.maxTeams) : null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary glow-primary">
            Registered Teams
          </h1>
          <p className="text-muted-foreground text-lg">
            {maxTeams !== null ? (
              <span className="text-primary font-semibold">
                {totalTeams} / {maxTeams} teams registered
              </span>
            ) : (
              <span className="text-primary font-semibold">
                {totalTeams} teams registered
              </span>
            )}
          </p>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedData.map((team, index) => (
            <div
              key={`${team.teamName}-${index}`}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              {/* Team Logo with lazy loading */}
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-border">
                  <img
                    src={team.logo.getDirectURL()}
                    alt={`${team.teamName} logo`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "/assets/generated/default-team-logo-transparent.dim_200x200.png";
                    }}
                  />
                </div>
              </div>

              {/* Team Name */}
              <h3 className="text-xl font-bold text-center text-foreground">
                {team.teamName}
              </h3>
            </div>
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
