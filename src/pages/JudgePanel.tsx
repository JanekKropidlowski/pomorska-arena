import { useState, useEffect } from "react";
import { StandardHeader } from "@/components/StandardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  Save, 
  CheckCircle,
  X,
  Clock,
  AlertTriangle,
  Trophy,
  User,
  Search,
  BarChart3,
  Eye,
  Edit
} from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useRegistrations } from "@/hooks/useRegistrations";
import { useCompetitions } from "@/hooks/useCompetitions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CompetitorResult {
  id: string;
  startNumber: number;
  firstName: string;
  lastName: string;
  team: string;
  category: string;
  result?: string;
  status: 'waiting' | 'competing' | 'finished' | 'dns' | 'dq';
  scores: number[];
  notes?: string;
}

const JudgePanel = () => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [competitors, setCompetitors] = useState<CompetitorResult[]>([]);
  const { toast } = useToast();
  
  // Pobierz dane z bazy
  const { events, loading: eventsLoading } = useEvents();
  const { registrations, loading: registrationsLoading, refetch: refetchRegistrations } = useRegistrations(selectedEventId);
  const { competitions, loading: competitionsLoading } = useCompetitions(selectedEventId);

  // Wybierz pierwsze wydarzenie jeśli nie ma wybranego
  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  // Wybierz pierwszą konkurencję jeśli nie ma wybranej
  useEffect(() => {
    if (competitions.length > 0 && !selectedCompetitionId) {
      setSelectedCompetitionId(competitions[0].id);
    }
  }, [competitions, selectedCompetitionId]);

  // Konwertuj rejestracje na format dla sędziów
  useEffect(() => {
    if (registrations.length > 0) {
      const competitorsData = registrations
        .filter(reg => reg.status === 'approved')
        .map((reg, index) => ({
          id: reg.id,
          startNumber: reg.start_number || (index + 1),
          firstName: reg.participants?.first_name || 'Nieznane',
          lastName: reg.participants?.last_name || 'Nieznane',
          team: reg.teams?.name || 'Nieznana drużyna',
          category: reg.age_categories?.name || 'Nieznana kategoria',
          status: 'waiting' as const,
          scores: [0, 0, 0, 0, 0],
          notes: reg.notes || ''
        }));
      setCompetitors(competitorsData);
    }
  }, [registrations]);

  const handleScoreChange = (competitorId: string, scoreIndex: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCompetitors(prev => prev.map(comp => 
      comp.id === competitorId 
        ? { 
            ...comp, 
            scores: comp.scores.map((score, idx) => idx === scoreIndex ? numValue : score),
            status: 'competing' as const
          }
        : comp
    ));
  };

  const handleSaveResult = async (competitorId: string) => {
    try {
      const competitor = competitors.find(c => c.id === competitorId);
      if (!competitor || !selectedCompetitionId) return;

      const totalScore = competitor.scores.reduce((sum, score) => sum + score, 0);
      
      // Zapisz wynik do bazy danych
      const { error } = await supabase
        .from('results')
        .insert({
          competition_id: selectedCompetitionId,
          registration_id: competitorId,
          raw_value: totalScore,
          processed_value: totalScore,
          status: 'valid',
          recorded_at: new Date().toISOString(),
          recorded_by: 'judge',
          notes: competitor.notes
        });

      if (error) throw error;

      // Zaktualizuj status zawodnika
      setCompetitors(prev => prev.map(comp => 
        comp.id === competitorId 
          ? { ...comp, status: 'finished' as const, result: totalScore.toString() }
          : comp
      ));

      toast({
        title: "Wynik zapisany",
        description: `Wynik ${totalScore} punktów został zapisany`,
      });

    } catch (error) {
      console.error('Error saving result:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać wyniku",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = (competitorId: string, status: 'waiting' | 'competing' | 'finished' | 'dns' | 'dq') => {
    setCompetitors(prev => prev.map(comp => 
      comp.id === competitorId 
        ? { ...comp, status }
        : comp
    ));
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'waiting':
        return { text: 'Oczekuje', variant: 'secondary', icon: Clock };
      case 'competing':
        return { text: 'Startuje', variant: 'default', icon: Target };
      case 'finished':
        return { text: 'Zakończył', variant: 'default', icon: CheckCircle };
      case 'dns':
        return { text: 'DNS', variant: 'destructive', icon: X };
      case 'dq':
        return { text: 'DQ', variant: 'destructive', icon: AlertTriangle };
      default:
        return { text: 'Nieznany', variant: 'secondary', icon: Clock };
    }
  };

  const filteredCompetitors = competitors.filter(comp => 
    comp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.startNumber.toString().includes(searchTerm)
  );

  const selectedEvent = events.find(e => e.id === selectedEventId);
  const selectedCompetition = competitions.find(c => c.id === selectedCompetitionId);

  return (
    <div className="page-container">
      <StandardHeader 
        title="Panel Sędziego"
        subtitle="Wprowadzanie wyników konkurencji"
        showNavigation={true}
        showUserInfo={true}
        showNotifications={true}
        notifications={competitors.filter(c => c.status === 'competing').length}
      />
      
      <main className="page-content">
        <div className="page-section">
          {/* Selektor wydarzeń */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Wybór wydarzenia</CardTitle>
              <CardDescription>
                Wybierz wydarzenie, dla którego chcesz sędziować
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <select
                  value={selectedEventId || ''}
                  onChange={(e) => setSelectedEventId(e.target.value || null)}
                  className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Wybierz wydarzenie...</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} ({new Date(event.start_date).toLocaleDateString('pl-PL')})
                    </option>
                  ))}
                </select>
                {selectedEvent && (
                  <div className="text-sm text-muted-foreground">
                    Wybrane: <span className="font-medium text-foreground">{selectedEvent.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="competition" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="competition">Konkurencja</TabsTrigger>
              <TabsTrigger value="competitors">Zawodnicy</TabsTrigger>
              <TabsTrigger value="results">Wyniki</TabsTrigger>
            </TabsList>

            {/* KONKURENCJA */}
            <TabsContent value="competition" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Wybór konkurencji</CardTitle>
                  <CardDescription>
                    Wybierz konkurencję do sędziowania
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {competitionsLoading ? (
                    <p className="text-center text-muted-foreground py-8">Ładowanie konkurencji...</p>
                  ) : competitions.length === 0 ? (
                    <div className="text-center py-12">
                      <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">Brak konkurencji</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedEvent ? `Dla wydarzenia: ${selectedEvent.name}` : 'Wybierz wydarzenie'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {competitions.map((competition) => (
                        <Card 
                          key={competition.id} 
                          className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                            selectedCompetitionId === competition.id 
                              ? 'ring-2 ring-blue-500 bg-blue-50' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedCompetitionId(competition.id)}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <Trophy className="h-8 w-8 text-blue-600" />
                            <div>
                              <h4 className="font-semibold">{competition.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {competition.metric_type === 'points' ? 'Punkty' :
                                 competition.metric_type === 'time' ? 'Czas' :
                                 competition.metric_type === 'distance' ? 'Odległość' :
                                 competition.metric_type === 'count' ? 'Liczba' : 'Dokładność'}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {competition.description}
                          </p>
                          <Badge variant={selectedCompetitionId === competition.id ? 'default' : 'outline'}>
                            {selectedCompetitionId === competition.id ? 'Wybrana' : 'Wybierz'}
                          </Badge>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ZAWODNICY */}
            <TabsContent value="competitors" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Lista zawodników</CardTitle>
                      <CardDescription>
                        {selectedCompetition ? `Konkurencja: ${selectedCompetition.name}` : 'Wybierz konkurencję'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Szukaj zawodników..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Button onClick={refetchRegistrations}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Odśwież
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {registrationsLoading ? (
                    <p className="text-center text-muted-foreground py-8">Ładowanie zawodników...</p>
                  ) : filteredCompetitors.length === 0 ? (
                    <div className="text-center py-12">
                      <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">Brak zawodników</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedEvent ? `Dla wydarzenia: ${selectedEvent.name}` : 'Wybierz wydarzenie'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredCompetitors.map((competitor) => {
                        const statusInfo = getStatusInfo(competitor.status);
                        const totalScore = competitor.scores.reduce((sum, score) => sum + score, 0);
                        
                        return (
                          <div key={competitor.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg mb-2">
                                  #{competitor.startNumber} {competitor.firstName} {competitor.lastName}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div className="space-y-1">
                                    <p><strong>Drużyna:</strong> {competitor.team}</p>
                                    <p><strong>Kategoria:</strong> {competitor.category}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p><strong>Wynik:</strong> {totalScore} punktów</p>
                                    <p><strong>Status:</strong> {statusInfo.text}</p>
                                  </div>
                                </div>
                                
                                {/* Pola do wprowadzania wyników */}
                                <div className="mt-4">
                                  <Label className="text-sm font-medium">Wyniki:</Label>
                                  <div className="flex gap-2 mt-2">
                                    {competitor.scores.map((score, index) => (
                                      <Input
                                        key={index}
                                        type="number"
                                        value={score || ''}
                                        onChange={(e) => handleScoreChange(competitor.id, index, e.target.value)}
                                        placeholder={`${index + 1}`}
                                        className="w-16 text-center"
                                        disabled={competitor.status === 'dns' || competitor.status === 'dq'}
                                      />
                                    ))}
                                  </div>
                                </div>
                                
                                {competitor.notes && (
                                  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                                    <strong>Uwagi:</strong> {competitor.notes}
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <Badge variant={statusInfo.variant as any} className="mb-2">
                                  {statusInfo.text}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 pt-3 border-t">
                              <Button 
                                size="sm"
                                onClick={() => handleSaveResult(competitor.id)}
                                disabled={competitor.status === 'dns' || competitor.status === 'dq'}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Save className="h-4 w-4 mr-1" />
                                Zapisz wynik
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(competitor.id, 'competing')}
                                disabled={competitor.status === 'dns' || competitor.status === 'dq'}
                              >
                                <Target className="h-4 w-4 mr-1" />
                                Startuje
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(competitor.id, 'dns')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                DNS
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(competitor.id, 'dq')}
                              >
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                DQ
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* WYNIKI */}
            <TabsContent value="results" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Podsumowanie wyników</CardTitle>
                  <CardDescription>
                    Przeglądaj wprowadzone wyniki
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800">Zakończyli</h4>
                        <p className="text-2xl font-bold text-blue-600">
                          {competitors.filter(c => c.status === 'finished').length}
                        </p>
                      </div>
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-semibold text-yellow-800">Startują</h4>
                        <p className="text-2xl font-bold text-yellow-600">
                          {competitors.filter(c => c.status === 'competing').length}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold text-gray-800">Oczekują</h4>
                        <p className="text-2xl font-bold text-gray-600">
                          {competitors.filter(c => c.status === 'waiting').length}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Wyniki (posortowane według wyniku):</h4>
                      {competitors
                        .filter(c => c.status === 'finished')
                        .sort((a, b) => {
                          const scoreA = a.scores.reduce((sum, score) => sum + score, 0);
                          const scoreB = b.scores.reduce((sum, score) => sum + score, 0);
                          return scoreB - scoreA;
                        })
                        .map((competitor, index) => (
                          <div key={competitor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div className="flex items-center gap-4">
                              <span className="font-bold text-lg">#{index + 1}</span>
                              <span className="font-medium">
                                #{competitor.startNumber} {competitor.firstName} {competitor.lastName}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                ({competitor.team})
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-bold text-lg">
                                {competitor.scores.reduce((sum, score) => sum + score, 0)} pkt
                              </span>
                              <Badge variant="default">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Zakończył
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default JudgePanel;