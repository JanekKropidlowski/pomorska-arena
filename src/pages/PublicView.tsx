import { useState, useEffect } from "react";
import { StandardHeader } from "@/components/StandardHeader";
import { PublicResults } from "@/components/PublicResults";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, FileText, Trophy, Loader2 } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useCompetitions } from "@/hooks/useCompetitions";
import { useResults } from "@/hooks/useResults";

const PublicView = () => {
  const { events, loading: eventsLoading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(null);
  
  const { competitions } = useCompetitions(selectedEvent || undefined);
  const { results, loading: resultsLoading } = useResults(selectedCompetition || undefined);

  useEffect(() => {
    if (events.length > 0 && !selectedEvent) {
      // Select first published or active event
      const activeEvent = events.find(e => e.status === 'published' || e.status === 'active');
      if (activeEvent) {
        setSelectedEvent(activeEvent.id);
      }
    }
  }, [events, selectedEvent]);

  useEffect(() => {
    if (competitions.length > 0 && !selectedCompetition) {
      setSelectedCompetition(competitions[0].id);
    }
  }, [competitions, selectedCompetition]);

  const currentEvent = events.find(e => e.id === selectedEvent);
  const currentCompetition = competitions.find(c => c.id === selectedCompetition);

  // Prefer published snapshot from localStorage (MVP), fallback to hook results
  let publishedDisplay: Array<{ position: number; name: string; team: string; score: string; category: string }> | null = null;
  let publishedAt: string | null = null;
  try {
    const snapRaw = localStorage.getItem('publishedResults');
    if (snapRaw) {
      const snap = JSON.parse(snapRaw);
      if (Array.isArray(snap.individual)) {
        publishedDisplay = snap.individual.map((r: any, idx: number) => ({
          position: idx + 1,
          name: r.name ?? '-',
          team: r.team ?? '-',
          score: r.result ?? '-',
          category: r.category ?? '-',
        }));
      }
      if (Array.isArray(snap.team)) {
        // store for team classification rendering below
      }
      if (typeof snap.publishedAt === 'string') {
        publishedAt = snap.publishedAt;
      }
    }
  } catch {}

  const displayResults = publishedDisplay ?? results
    .filter(r => r && r.status === 'valid' && r.registrations && r.registrations.participants && r.registrations.teams && r.registrations.age_categories)
    .map((r, index) => ({
      position: index + 1,
      name: `${r.registrations.participants?.first_name ?? ''} ${r.registrations.participants?.last_name ?? ''}`.trim(),
      team: r.registrations.teams?.name ?? '-',
      score: r.processed_value ? `${r.processed_value} pkt` : '-',
      category: r.registrations.age_categories?.name ?? '-'
    }))
    .slice(0, 10);

  // Read published team classification
  let publishedTeams: Array<{ team: string; points: number }> = [];
  try {
    const snapRaw = localStorage.getItem('publishedResults');
    if (snapRaw) {
      const snap = JSON.parse(snapRaw);
      if (Array.isArray(snap.team)) {
        publishedTeams = snap.team as Array<{ team: string; points: number }>;
      }
    }
  } catch {}

  // Sample results data for empty state
  const sampleResults = [
    {
      position: 1,
      name: "Anna Kowalska",
      team: "SP nr 15 Gdynia",
      score: "95 pkt",
      category: "Dziewczęta U-16"
    },
    {
      position: 2,
      name: "Piotr Nowak", 
      team: "LO Sopot",
      score: "92 pkt",
      category: "Chłopcy U-18"
    },
    {
      position: 3,
      name: "Maria Wiśniewska",
      team: "SP nr 8 Gdańsk", 
      score: "89 pkt",
      category: "Dziewczęta U-16"
    },
    {
      position: 4,
      name: "Tomasz Lewandowski",
      team: "Technikum Gdynia",
      score: "87 pkt", 
      category: "Chłopcy U-18"
    },
    {
      position: 5,
      name: "Katarzyna Dąbrowska",
      team: "SP nr 22 Gdańsk",
      score: "85 pkt",
      category: "Dziewczęta U-16"
    },
  ];

  if (eventsLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Brak dostępnych wydarzeń</CardTitle>
            <CardDescription>
              Obecnie nie ma opublikowanych wydarzeń sportowych
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container">
      <StandardHeader 
        title="Publiczne wyniki"
        subtitle="Pomorskie Zrzeszenie LZS"
        showNavigation={true}
        showUserInfo={false}
        showNotifications={false}
      />

      <main className="page-content page-section">
        {/* Event Info */}
        {currentEvent && (
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="mobile-heading text-foreground">
                {currentEvent?.name || 'Wydarzenie'}
              </CardTitle>
              <CardDescription className="text-lg">
                {currentEvent.location} - {new Date(currentEvent.start_date).toLocaleDateString('pl-PL', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="mobile-grid text-center">
                <div className="flex flex-col items-center space-y-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">
                      {new Date(currentEvent.start_date).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-2">
                  <MapPin className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Miejsce</p>
                    <p className="font-medium">{currentEvent.location}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-2">
                  <Trophy className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Konkurencje</p>
                    <p className="font-medium">{competitions.length} dyscyplin</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Event Selection */}
        {events.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Wybierz wydarzenie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {events
                  .filter(e => e.status === 'published' || e.status === 'active')
                  .map(event => (
                    <Button
                      key={event.id}
                      variant={selectedEvent === event.id ? "default" : "outline"}
                      onClick={() => setSelectedEvent(event.id)}
                    >
                      {event.name}
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Competition Tabs/Results */}
        <div className="space-y-6">
          <div className="flex justify-center flex-wrap gap-2">
            <div className="flex space-x-2 bg-muted p-1 rounded-lg flex-wrap">
              {competitions.map(comp => (
                <Badge
                  key={comp.id}
                  className={selectedCompetition === comp.id ? "bg-primary text-primary-foreground px-4 py-2 cursor-pointer" : "px-4 py-2 cursor-pointer"}
                  variant={selectedCompetition === comp.id ? "default" : "secondary"}
                  onClick={() => setSelectedCompetition(comp.id)}
                >
                  {comp.name}
                </Badge>
              ))}
            </div>
          </div>

          {resultsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : displayResults.length > 0 ? (
            <PublicResults
              eventTitle="Klasyfikacja końcowa"
              competition={currentCompetition?.name || 'Konkurencja'}
              lastUpdated={publishedAt ? new Date(publishedAt).toLocaleString('pl-PL') : new Date().toLocaleString('pl-PL')}
              results={displayResults}
            />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Brak wyników dla tej konkurencji
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Additional Info */}
        <div className="mobile-grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Regulamin zawodów
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Zawody odbywają się zgodnie z regulaminem Pomorskiego Zrzeszenia LZS.
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Strzelectwo - broń krótka i długa</li>
                <li>• Rzut granatem na celność</li>
                <li>• Bieg przełajowy 3km</li>
                <li>• Klasyfikacja indywidualna i drużynowa</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Klasyfikacja drużynowa
              </CardTitle>
            </CardHeader>
            <CardContent>
              {publishedTeams.length > 0 ? (
                <div className="space-y-2 text-sm">
                  {publishedTeams.map((t, i) => (
                    <div key={t.team} className="flex justify-between">
                      <span>{i+1}. {t.team}</span>
                      <span className="font-medium">{t.points} pkt</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Brak opublikowanej klasyfikacji drużynowej</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm border-t pt-6">
          <p>© 2024 Pomorskie Zrzeszenie LZS. System Zawodów Sportowych.</p>
          <p>Wyniki aktualizowane na bieżąco podczas trwania zawodów.</p>
        </div>
      </main>
    </div>
  );
};

export default PublicView;