import { useState, useEffect } from "react";
import { StandardHeader } from "@/components/StandardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Download, 
  CheckCircle,
  X,
  Clock,
  AlertCircle,
  Trophy,
  FileText,
  Search,
  BarChart3,
  Plus,
  Edit,
  Eye
} from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useRegistrations } from "@/hooks/useRegistrations";
import { useCompetitions } from "@/hooks/useCompetitions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const OfficePanel = () => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleApproveRegistration = async (registrationId: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: 'office'
        })
        .eq('id', registrationId);

      if (error) throw error;

      toast({
        title: "Zatwierdzono",
        description: "Rejestracja została zatwierdzona",
      });

      refetchRegistrations();
    } catch (error) {
      console.error('Error approving registration:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zatwierdzić rejestracji",
        variant: "destructive"
      });
    }
  };

  const handleRejectRegistration = async (registrationId: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ 
          status: 'rejected',
          approved_at: new Date().toISOString(),
          approved_by: 'office'
        })
        .eq('id', registrationId);

      if (error) throw error;

      toast({
        title: "Odrzucono",
        description: "Rejestracja została odrzucona",
      });

      refetchRegistrations();
    } catch (error) {
      console.error('Error rejecting registration:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się odrzucić rejestracji",
        variant: "destructive"
      });
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'Oczekuje', variant: 'secondary', icon: Clock };
      case 'approved':
        return { text: 'Zatwierdzona', variant: 'default', icon: CheckCircle };
      case 'rejected':
        return { text: 'Odrzucona', variant: 'destructive', icon: X };
      case 'cancelled':
        return { text: 'Anulowana', variant: 'secondary', icon: AlertCircle };
      default:
        return { text: 'Nieznany', variant: 'secondary', icon: Clock };
    }
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.teams?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.participants?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.participants?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="page-container">
      <StandardHeader 
        title="Panel Biura"
        subtitle="Zarządzanie rejestracjami i wynikami"
        showNavigation={true}
        showUserInfo={true}
        showNotifications={true}
        notifications={registrations.filter(r => r.status === 'pending').length}
      />
      
      <main className="page-content">
        <div className="page-section">
          {/* Selektor wydarzeń */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Wybór wydarzenia</CardTitle>
              <CardDescription>
                Wybierz wydarzenie, dla którego chcesz zarządzać rejestracjami
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

          <Tabs defaultValue="registrations" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="registrations">Rejestracje</TabsTrigger>
              <TabsTrigger value="teams">Drużyny</TabsTrigger>
              <TabsTrigger value="results">Wyniki</TabsTrigger>
              <TabsTrigger value="reports">Raporty</TabsTrigger>
            </TabsList>

            {/* REJESTRACJE */}
            <TabsContent value="registrations" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Zarządzanie rejestracjami</CardTitle>
                      <CardDescription>
                        Zatwierdzaj i zarządzaj rejestracjami drużyn
                        {selectedEvent && (
                          <span className="block text-sm font-medium text-primary mt-1">
                            Wydarzenie: {selectedEvent.name}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Szukaj drużyn, uczestników..."
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
                    <p className="text-center text-muted-foreground py-8">Ładowanie rejestracji...</p>
                  ) : filteredRegistrations.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">Brak rejestracji</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedEvent ? `Dla wydarzenia: ${selectedEvent.name}` : 'Wybierz wydarzenie'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredRegistrations.map((registration) => {
                        const statusInfo = getStatusInfo(registration.status);
                        return (
                          <div key={registration.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg mb-2">
                                  {registration.participants?.first_name} {registration.participants?.last_name}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div className="space-y-1">
                                    <p><strong>Drużyna:</strong> {registration.teams?.name}</p>
                                    <p><strong>Kategoria:</strong> {registration.age_categories?.name}</p>
                                    <p><strong>Data rejestracji:</strong> {new Date(registration.registration_date).toLocaleDateString('pl-PL')}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p><strong>Email:</strong> {registration.teams?.contact_email}</p>
                                    <p><strong>Opiekun:</strong> {registration.teams?.contact_person}</p>
                                    <p><strong>Numer startowy:</strong> {registration.start_number || 'Nie przypisano'}</p>
                                  </div>
                                </div>
                                {registration.notes && (
                                  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                                    <strong>Uwagi:</strong> {registration.notes}
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
                              {registration.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm"
                                    onClick={() => handleApproveRegistration(registration.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Zatwierdź
                                  </Button>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRejectRegistration(registration.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Odrzuć
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                Szczegóły
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4 mr-1" />
                                Edytuj
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

            {/* DRUŻYNY */}
            <TabsContent value="teams" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Lista drużyn</CardTitle>
                      <CardDescription>
                        Przeglądaj wszystkie zarejestrowane drużyny
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Szukaj drużyn..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {registrationsLoading ? (
                    <p className="text-center text-muted-foreground py-8">Ładowanie drużyn...</p>
                  ) : (() => {
                    // Grupuj rejestracje według drużyn
                    const teamsMap = new Map();
                    filteredRegistrations.forEach(reg => {
                      const teamId = reg.team_id;
                      if (!teamsMap.has(teamId)) {
                        teamsMap.set(teamId, {
                          id: teamId,
                          name: reg.teams?.name || 'Nieznana drużyna',
                          type: reg.teams?.type || 'Nieznany typ',
                          contact_person: reg.teams?.contact_person,
                          contact_email: reg.teams?.contact_email,
                          participants: [],
                          totalParticipants: 0,
                          approvedParticipants: 0,
                          pendingParticipants: 0
                        });
                      }
                      
                      const team = teamsMap.get(teamId);
                      team.participants.push({
                        id: reg.participant_id,
                        name: `${reg.participants?.first_name} ${reg.participants?.last_name}`,
                        category: reg.age_categories?.name,
                        status: reg.status,
                        registration_date: reg.registration_date
                      });
                      team.totalParticipants++;
                      
                      if (reg.status === 'approved') team.approvedParticipants++;
                      if (reg.status === 'pending') team.pendingParticipants++;
                    });
                    
                    const teams = Array.from(teamsMap.values());
                    
                    return teams.length === 0 ? (
                      <div className="text-center py-12">
                        <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">Brak drużyn</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedEvent ? `Dla wydarzenia: ${selectedEvent.name}` : 'Wybierz wydarzenie'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {teams.map((team) => (
                          <div key={team.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg mb-2">{team.name}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div className="space-y-1">
                                    <p><strong>Typ:</strong> {team.type}</p>
                                    <p><strong>Opiekun:</strong> {team.contact_person || 'Brak danych'}</p>
                                    <p><strong>Email:</strong> {team.contact_email || 'Brak danych'}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p><strong>Uczestnicy:</strong> {team.totalParticipants}</p>
                                    <p><strong>Zatwierdzeni:</strong> {team.approvedParticipants}</p>
                                    <p><strong>Oczekujący:</strong> {team.pendingParticipants}</p>
                                  </div>
                                </div>
                                
                                <div className="mt-3">
                                  <h5 className="font-medium mb-2">Uczestnicy:</h5>
                                  <div className="space-y-1">
                                    {team.participants.map((participant, index) => (
                                      <div key={participant.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                                        <span>{participant.name} ({participant.category})</span>
                                        <Badge variant={participant.status === 'approved' ? 'default' : participant.status === 'pending' ? 'secondary' : 'destructive'}>
                                          {participant.status === 'approved' ? 'Zatwierdzony' : 
                                           participant.status === 'pending' ? 'Oczekuje' : 'Odrzucony'}
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 pt-3 border-t">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                Szczegóły
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4 mr-1" />
                                Edytuj
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-1" />
                                Eksportuj
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </TabsContent>

            {/* WYNIKI */}
            <TabsContent value="results" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Wprowadzanie wyników</CardTitle>
                  <CardDescription>
                    Wprowadzaj i zarządzaj wynikami konkurencji
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
                    <div className="space-y-6">
                      {competitions.map((competition) => (
                        <div key={competition.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-lg">{competition.name}</h4>
                              <p className="text-sm text-muted-foreground">{competition.description}</p>
                            </div>
                            <Badge variant="outline">
                              {competition.metric_type === 'points' ? 'Punkty' :
                               competition.metric_type === 'time' ? 'Czas' :
                               competition.metric_type === 'distance' ? 'Odległość' :
                               competition.metric_type === 'count' ? 'Liczba' : 'Dokładność'}
                            </Badge>
                          </div>
                          
                          <div className="space-y-3">
                            <h5 className="font-medium">Zarejestrowani uczestnicy:</h5>
                            <div className="space-y-2">
                              {filteredRegistrations
                                .filter(reg => reg.status === 'approved')
                                .map((registration) => (
                                <div key={registration.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                  <div className="flex items-center gap-4">
                                    <span className="font-medium">
                                      #{registration.start_number || '?'}
                                    </span>
                                    <span>
                                      {registration.participants?.first_name} {registration.participants?.last_name}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      ({registration.teams?.name})
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      placeholder="Wynik"
                                      className="w-24"
                                      type={competition.metric_type === 'time' ? 'time' : 'number'}
                                    />
                                    <Button size="sm" variant="outline">
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* RAPORTY */}
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Raporty i eksporty</CardTitle>
                  <CardDescription>
                    Generuj raporty i eksportuj dane
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-center gap-3 mb-3">
                        <Users className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-semibold">Lista uczestników</h4>
                          <p className="text-sm text-muted-foreground">Eksport do CSV</p>
                        </div>
                      </div>
                      <Button className="w-full" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Pobierz CSV
                      </Button>
                    </Card>

                    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-center gap-3 mb-3">
                        <Trophy className="h-8 w-8 text-green-600" />
                        <div>
                          <h4 className="font-semibold">Lista drużyn</h4>
                          <p className="text-sm text-muted-foreground">Eksport do CSV</p>
                        </div>
                      </div>
                      <Button className="w-full" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Pobierz CSV
                      </Button>
                    </Card>

                    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="h-8 w-8 text-purple-600" />
                        <div>
                          <h4 className="font-semibold">Protokół</h4>
                          <p className="text-sm text-muted-foreground">Generuj PDF</p>
                        </div>
                      </div>
                      <Button className="w-full" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Generuj PDF
                      </Button>
                    </Card>

                    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-center gap-3 mb-3">
                        <BarChart3 className="h-8 w-8 text-orange-600" />
                        <div>
                          <h4 className="font-semibold">Wyniki</h4>
                          <p className="text-sm text-muted-foreground">Eksport wyników</p>
                        </div>
                      </div>
                      <Button className="w-full" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Pobierz CSV
                      </Button>
                    </Card>

                    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="h-8 w-8 text-red-600" />
                        <div>
                          <h4 className="font-semibold">Karty sędziowskie</h4>
                          <p className="text-sm text-muted-foreground">Generuj PDF</p>
                        </div>
                      </div>
                      <Button className="w-full" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Generuj PDF
                      </Button>
                    </Card>

                    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-center gap-3 mb-3">
                        <Trophy className="h-8 w-8 text-yellow-600" />
                        <div>
                          <h4 className="font-semibold">Klasyfikacja</h4>
                          <p className="text-sm text-muted-foreground">Generuj PDF</p>
                        </div>
                      </div>
                      <Button className="w-full" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Generuj PDF
                      </Button>
                    </Card>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Statystyki wydarzenia</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600 font-medium">Drużyny:</span>
                        <span className="ml-2">{(() => {
                          const teamsSet = new Set(filteredRegistrations.map(r => r.team_id));
                          return teamsSet.size;
                        })()}</span>
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">Uczestnicy:</span>
                        <span className="ml-2">{filteredRegistrations.length}</span>
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">Zatwierdzeni:</span>
                        <span className="ml-2">{filteredRegistrations.filter(r => r.status === 'approved').length}</span>
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">Oczekujący:</span>
                        <span className="ml-2">{filteredRegistrations.filter(r => r.status === 'pending').length}</span>
                      </div>
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

export default OfficePanel;