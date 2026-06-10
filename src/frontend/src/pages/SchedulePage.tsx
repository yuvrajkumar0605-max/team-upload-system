import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

export default function SchedulePage() {
  // TODO: Add backend integration for schedule data when implemented
  const hasSchedule = false;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary glow-primary flex items-center justify-center gap-3">
            <Calendar className="w-10 h-10" />
            Tournament Schedule
          </h1>
          <p className="text-muted-foreground text-lg">
            View the IDP group schedule and tournament timeline
          </p>
        </div>

        {/* Schedule Content */}
        {!hasSchedule && (
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-12 pb-12">
              <Alert className="border-blue-500/50 bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-500" />
                <AlertTitle className="text-blue-500 text-xl font-bold">
                  Schedule Coming Soon
                </AlertTitle>
                <AlertDescription className="text-muted-foreground mt-2">
                  The tournament schedule will be published here soon. Please
                  check back later for updates on match timings and group
                  schedules.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* TODO: Add schedule display when data is available */}
        {hasSchedule && (
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>IDP Group Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Schedule content will be displayed here */}
              <p className="text-muted-foreground">
                Schedule details will appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
