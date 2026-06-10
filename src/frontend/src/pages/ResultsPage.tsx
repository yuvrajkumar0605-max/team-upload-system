import { ExternalLink, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useGetAllResults } from "../hooks/useQueries";

const ITEMS_PER_PAGE = 9;

export default function ResultsPage() {
  const { data: results = [], isLoading } = useGetAllResults();
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return results.slice(startIndex, endIndex);
  }, [results, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(results.length / ITEMS_PER_PAGE);
  }, [results]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4 glow-text">
              Tournament Results
            </h1>
            <p className="text-muted-foreground">
              Check out the latest tournament outcomes
            </p>
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading results...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4 glow-text">
            Tournament Results
          </h1>
          <p className="text-muted-foreground">
            Check out the latest tournament outcomes
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-20 h-20 mx-auto mb-6 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No results posted yet
            </h2>
            <p className="text-muted-foreground">
              Check back later for tournament results
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-8">
              {paginatedData.map((result) => (
                <Card
                  key={result.id}
                  className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 overflow-hidden group"
                >
                  <div
                    className="relative w-full overflow-hidden"
                    style={{ aspectRatio: "4857 / 4428" }}
                  >
                    <img
                      src={result.image.getDirectURL()}
                      alt={result.title}
                      className="w-full h-full object-contain bg-background/50 transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-2 glow-text-sm">
                      {result.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {result.description}
                    </p>
                    {result.link && (
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-sm group/link"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
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
          </>
        )}
      </div>
    </div>
  );
}
