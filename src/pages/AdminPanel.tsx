import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { seedCyclicEvents } from "@/lib/seedData";
import { 
  Settings, 
  Calendar, 
  Trophy, 
  Users, 
  BarChart3, 
  Plus,
  Edit,
  Copy,
  Trash2,
  Mail,
  Bell,
  Shield,
  Database,
  Globe,
  Clock,
  Download
} from "lucide-react";

interface Event {
  id: string;
  name: string;
  start_date: string;
  location: string;
  status: string;
  event_type: string;
  is_cyclic: boolean;
}

const AdminPanel = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const { toast } = useToast();

  // Load events from Supabase
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;

      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się załadować wydarzeń",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      const result = await seedCyclicEvents();
      
      if (result.success) {
        toast({
          title: "Sukces!",
          description: "Pomyślnie załadowano 3 cykliczne wydarzenia z pełną konfiguracją",
        });
        await loadEvents();
      } else {
        throw new Error('Seed failed');
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się załadować danych testowych",
        variant: "destructive"
      });
    } finally {
      setSeeding(false);
    }
  };

  const cloneEvent = async (eventId: string) => {
    try {
      // Get the event to clone
      const { data: eventToClone, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (fetchError) throw fetchError;

      // Create new event
      const { data: newEvent, error: insertError } = await supabase
        .from('events')
        .insert({
          ...eventToClone,
          id: undefined,
          name: eventToClone.name + ' (kopia)',
          status: 'draft',
          created_at: undefined,
          updated_at: undefined
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: "Sklonowano wydarzenie",
        description: `Utworzono kopię: ${newEvent.name}`,
      });

      await loadEvents();
    } catch (error) {
      console.error('Error cloning event:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się sklonować wydarzenia",
        variant: "destructive"
      });
    }
  };

  const getEventStatusInfo = (status: string) => {
    switch (status) {
      case 'draft':
        return { label: 'Projekt', color: 'bg-muted text-muted-foreground', icon: Edit };
      case 'published':
        return { label: 'Opublikowane', color: 'bg-primary text-primary-foreground', icon: Globe };
      case 'active':
        return { label: 'Aktywne', color: 'bg-success text-success-foreground', icon: Trophy };
      case 'completed':
        return { label: 'Zakończone', color: 'bg-secondary text-secondary-foreground', icon: Trophy };
      default:
        return { label: 'Nieznany', color: 'bg-muted text-muted-foreground', icon: Edit };
    }
  };

  const getEventTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'shooting': 'Strzelectwo',
      'seniors': 'Senioriada',
      'active_village': 'Aktywna Wieś',
      'other': 'Inne'
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header 
        userRole="Administrator" 
        userName="Anna Administrator"
        notifications={5}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Panel Administratora</h1>
              <p className="text-muted-foreground">
                Zarządzanie systemem, wydarzeniami i konfiguracją
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-primary text-primary-foreground">
                <Shield className="h-3 w-3 mr-1" />
                Superadmin
              </Badge>
              {events.length === 0 && !loading && (
                <Button 
                  variant="competition"
                  onClick={handleSeedData}
                  disabled={seeding}
                >
                  <Database className="h-4 w-4 mr-2" />
                  {seeding ? "Ładowanie..." : "Załaduj dane testowe"}
                </Button>
              )}
            </div>
          </div>

          {/* System Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary">{events.length}</p>
                    <p className="text-sm text-muted-foreground">Wydarzenia</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-success">
                      {events.filter(e => e.is_cyclic).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Cykliczne</p>
                  </div>
                  <Trophy className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-warning">
                      {events.filter(e => e.status === 'published').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Opublikowane</p>
                  </div>
                  <Globe className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {events.filter(e => e.status === 'active').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Aktywne</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="events" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="events">Wydarzenia</TabsTrigger>
              <TabsTrigger value="competitions">Konkurencje</TabsTrigger>
              <TabsTrigger value="users">Użytkownicy</TabsTrigger>
              <TabsTrigger value="settings">Ustawienia</TabsTrigger>
              <TabsTrigger value="reports">Raporty</TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Zarządzanie wydarzeniami</CardTitle>
                      <CardDescription>
                        Twórz, edytuj i zarządzaj wydarzeniami sportowymi
                      </CardDescription>
                    </div>
                    <Button variant="competition">
                      <Plus className="h-4 w-4 mr-2" />
                      Nowe wydarzenie
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-center text-muted-foreground py-8">Ładowanie...</p>
                  ) : events.length === 0 ? (
                    <div className="text-center py-12">
                      <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">Brak wydarzeń w systemie</p>
                      <Button variant="competition" onClick={handleSeedData} disabled={seeding}>
                        <Database className="h-4 w-4 mr-2" />
                        {seeding ? "Ładowanie..." : "Załaduj przykładowe wydarzenia"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {events.map((event) => {
                        const statusInfo = getEventStatusInfo(event.status);
                        
                        return (
                          <div key={event.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-lg">{event.name}</h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                  <span>{new Date(event.start_date).toLocaleDateString('pl-PL')}</span>
                                  <span>•</span>
                                  <span>{event.location}</span>
                                  <span>•</span>
                                  <span>{getEventTypeLabel(event.event_type)}</span>
                                  {event.is_cyclic && (
                                    <>
                                      <span>•</span>
                                      <Badge variant="secondary" className="text-xs">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Cykliczne
                                      </Badge>
                                    </>
                                  )}
                                </div>
                              </div>
                              <Badge className={statusInfo.color}>
                                <statusInfo.icon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Utworzono: {new Date(event.start_date).toLocaleDateString('pl-PL')}
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edytuj
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => cloneEvent(event.id)}
                                >
                                  <Copy className="h-4 w-4 mr-1" />
                                  Klonuj
                                </Button>
                                <Button variant="outline" size="sm">
                                  <BarChart3 className="h-4 w-4 mr-1" />
                                  Statystyki
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="competitions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Konfiguracja konkurencji</CardTitle>
                  <CardDescription>
                    Konkurencje są przypisane do wydarzeń. Wybierz wydarzenie powyżej.
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Zarządzanie użytkownikami</CardTitle>
                  <CardDescription>
                    Role, uprawnienia i dostępy do systemu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Funkcja w przygotowaniu - będzie dostępna po wdrożeniu uwierzytelniania
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ustawienia systemu</CardTitle>
                  <CardDescription>
                    Ogólne ustawienia działania systemu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Panel ustawień w przygotowaniu
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Raporty i statystyki</CardTitle>
                  <CardDescription>
                    Generuj raporty z wydarzeń i konkurencji
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <Download className="h-5 w-5 mb-2" />
                      Raport frekwencji
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Trophy className="h-5 w-5 mb-2" />
                      Ranking medalowy
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <BarChart3 className="h-5 w-5 mb-2" />
                      Statystyki wydarzeń
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Calendar className="h-5 w-5 mb-2" />
                      Plan na przyszły rok
                    </Button>
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

export default AdminPanel;