import { useState, useMemo } from 'react';
import { useGetAllAnnouncements } from '../hooks/useQueries';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink, Megaphone } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export default function AnnouncementsSection() {
  const { data: announcements = [], isLoading } = useGetAllAnnouncements();
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return announcements.slice(startIndex, endIndex);
  }, [announcements, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(announcements.length / ITEMS_PER_PAGE);
  }, [announcements]);

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4 glow-text">Announcements</h2>
          <p className="text-muted-foreground">Stay updated with the latest tournament news</p>
        </div>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading announcements...</p>
          </div>
        </div>
      </section>
    );
  }

  if (announcements.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4 glow-text">Announcements</h2>
          <p className="text-muted-foreground">Stay updated with the latest tournament news</p>
        </div>
        <div className="text-center py-12">
          <Megaphone className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground text-lg">No announcements yet</p>
          <p className="text-muted-foreground text-sm mt-2">Check back later for updates</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-primary mb-4 glow-text">Announcements</h2>
        <p className="text-muted-foreground">Stay updated with the latest tournament news</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedData.map((announcement) => (
          <Card
            key={announcement.id}
            className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 overflow-hidden group"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={announcement.image.getDirectURL()}
                alt={announcement.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2 glow-text-sm">{announcement.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{announcement.description}</p>
              {announcement.link && (
                <a
                  href={announcement.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-sm group/link"
                >
                  <span>Learn More</span>
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
    </section>
  );
}
