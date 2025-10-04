import { useState, useEffect } from "react";
import { StandardHeader } from "@/components/StandardHeader";
import EventDetailsView from "@/components/EventDetailsView";
import LogoManager from "@/components/LogoManager";
import { EventEditForm } from "@/components/EventEditForm";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
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
import { SIMPLE_USERS } from "@/lib/simpleAuth";
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
  Download,
  FileText,
  X,
  MapPin,
  Phone,
  Building
} from "lucide-react";

interface Event {
  id: string;
  name: string;
  slug?: string;
  start_date: string;
  location: string;
  status: string;
  event_type: string;
  is_cyclic: boolean;
  description?: string;
  end_date?: string;
  registration_deadline?: string;
  max_participants?: number;
  max_teams?: number;
  team_max_size?: number;
  team_required_girls?: number;
  team_required_boys?: number;
  organizer?: string;
  contact_email?: string;
  contact_phone?: string;
  logo_url?: string;
  regulations_pdf_url?: string;
  patron_honorowy?: string;
  organizatorzy?: string;
  contact_person_1_name?: string;
  contact_person_1_title?: string;
  contact_person_1_phone?: string;
  contact_person_2_name?: string;
  contact_person_2_title?: string;
  contact_person_2_phone?: string;
  event_rules?: string;
  patronat_pdf_url?: string;
  organizatorzy_pdf_url?: string;
  created_at?: string;
  updated_at?: string;
}

const AdminPanel = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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

  const loadCompetitions = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .eq('event_id', eventId);

      if (error) throw error;
      setCompetitions(data || []);
    } catch (error) {
      console.error('Error loading competitions:', error);
      setCompetitions([]);
    }
  };

  const handleEditEvent = async (event: Event) => {
    console.log('🔧 Opening edit modal for:', event.name);
    setEditingEvent(event);
    setShowEditModal(true);
    await loadCompetitions(event.id);
  };

  // Test function
  const testEdit = () => {
    console.log('🧪 Test edit function called');
    console.log('🧪 Available events:', events.length);
    const testEvent = events[0]; // Use first event for testing
    if (testEvent) {
      console.log('🧪 Using test event:', testEvent.name);
      setEditingEvent(testEvent);
      setShowEditModal(true);
    } else {
      console.log('🧪 No events available for testing');
    }
  };

  // Debug: wyświetl stan modala
  console.log('🔍 Modal state - showEditModal:', showEditModal, 'editingEvent:', editingEvent?.name);

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingEvent(null);
  };



  const handleSaveEvent = async (eventData: any, competitionsData: any[]) => {
    try {
      // Filter out fields that don't exist in the events table
      const allowedFields = [
        'name', 'slug', 'description', 'start_date', 'end_date', 'location', 'status', 
        'event_type', 'is_cyclic', 'organizer', 'contact_email', 'contact_phone',
        'registration_deadline', 'max_participants', 'max_teams', 'regulations_pdf_url',
        'team_max_size', 'team_required_girls', 'team_required_boys',
        'logo_url', 'patron_honorowy', 'organizatorzy', 'contact_person_1_name',
        'contact_person_1_title', 'contact_person_1_phone', 'contact_person_2_name',
        'contact_person_2_title', 'contact_person_2_phone', 'event_rules',
        'patronat_pdf_url', 'organizatorzy_pdf_url'
      ];
      
      const filteredEventData = Object.keys(eventData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = eventData[key];
          return obj;
        }, {} as any);

      // Update event
      const { error: eventError } = await supabase
        .from('events')
        .update(filteredEventData)
        .eq('id', eventData.id);

      if (eventError) {
        console.error('Supabase error:', eventError);
        throw eventError;
      }

      // Update competitions
      for (const comp of competitionsData) {
        if (comp.id.startsWith('comp-')) {
          // New competition
          const { error: insertError } = await supabase
            .from('competitions')
            .insert({
              ...comp,
              id: undefined,
              event_id: eventData.id
            });
          if (insertError) throw insertError;
        } else {
          // Update existing
          const { error: updateError } = await supabase
            .from('competitions')
            .update(comp)
            .eq('id', comp.id);
          if (updateError) throw updateError;
        }
      }

      await loadEvents();
      setEditingEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      throw error;
    }
  };

  const handleCreateUsers = () => {
    toast({
      title: "Informacja",
      description: "System używa lokalnej autoryzacji - konta są już gotowe do użycia",
    });
  };

  const handleNavigateToOffice = () => {
    navigate('/biuro');
  };

  const handleNavigateToJudge = () => {
    navigate('/sedzia');
  };

  const handleNavigateToResults = (eventId: string) => {
    navigate(`/wydarzenie/${eventId}`);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/logowanie');
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
        return { text: 'Projekt', variant: 'secondary', icon: Edit };
      case 'published':
        return { text: 'Opublikowane', variant: 'default', icon: Globe };
      case 'active':
        return { text: 'Aktywne', variant: 'default', icon: Trophy };
      case 'completed':
        return { text: 'Zakończone', variant: 'secondary', icon: Trophy };
      case 'archived':
        return { text: 'Zarchiwizowane', variant: 'secondary', icon: FileText };
      default:
        return { text: 'Nieznany', variant: 'secondary', icon: Edit };
    }
  };

  const updateEventStatus = async (eventId: string, status: 'draft' | 'published' | 'archived' | 'active' | 'completed') => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status })
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: 'Zaktualizowano status',
        description: `Nowy status: ${getEventStatusInfo(status).text}`,
      });

      await loadEvents();
    } catch (error) {
      console.error('Error updating event status:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się zaktualizować statusu wydarzenia',
        variant: 'destructive',
      });
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
    <div className="page-container">
      <StandardHeader 
        title="Panel Administratora"
        subtitle="Pomorskie Zrzeszenie LZS"
        showNavigation={true}
        showUserInfo={true}
        showNotifications={true}
        notifications={5}
      />
      
      <main className="page-content">
        <div className="page-section">
          {!selectedEventForDetails ? (
            <Tabs defaultValue="events" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="events">Zarządzanie wydarzeniami</TabsTrigger>
                    <TabsTrigger value="results">Wyniki i raporty</TabsTrigger>
                    <TabsTrigger value="panels">Panele systemu</TabsTrigger>
                    <TabsTrigger value="users">Użytkownicy</TabsTrigger>
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
                    <div className="flex gap-2">
                      <Button onClick={testEdit} variant="outline" className="bg-red-100">
                        🧪 Test Edit
                      </Button>
                      <Button variant="competition">
                        <Plus className="h-4 w-4 mr-2" />
                        Nowe wydarzenie
                      </Button>
                    </div>
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
                          <div key={event.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h4 className="font-semibold text-xl mb-2">{event.name}</h4>
                                {event.slug && (
                                  <div className="flex items-center gap-2 mb-2">
                                    <Globe className="h-4 w-4 text-primary" />
                                    <code className="text-sm text-primary bg-primary/10 px-2 py-1 rounded">
                                      /wydarzenie/{event.slug}
                                    </code>
                                  </div>
                                )}
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(event.start_date).toLocaleDateString('pl-PL')}
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {event.location}
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Trophy className="h-4 w-4" />
                                    {getEventTypeLabel(event.event_type)}
                                  </span>
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
                                
                                {event.description && (
                                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {event.description}
                                  </p>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div className="space-y-2">
                                    {event.organizer && (
                                      <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Organizator:</span>
                                        <span className="font-medium">{event.organizer}</span>
                                      </div>
                                    )}
                                    {event.contact_email && (
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Email:</span>
                                        <span className="font-medium">{event.contact_email}</span>
                                      </div>
                                    )}
                                    {event.contact_phone && (
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Telefon:</span>
                                        <span className="font-medium">{event.contact_phone}</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="space-y-2">
                                    {event.max_participants && (
                                      <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Max uczestników:</span>
                                        <span className="font-medium">{event.max_participants}</span>
                                      </div>
                                    )}
                                    {event.max_teams && (
                                      <div className="flex items-center gap-2">
                                        <Trophy className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Max drużyn:</span>
                                        <span className="font-medium">{event.max_teams}</span>
                                      </div>
                                    )}
                                    {event.registration_deadline && (
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Zgłoszenia do:</span>
                                        <span className="font-medium">{new Date(event.registration_deadline).toLocaleDateString('pl-PL')}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                            </div>

                              <div className="ml-4">
                                <Badge variant={statusInfo.variant as any} className="mb-2">
                                  {statusInfo.text}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-4 border-t pointer-events-auto relative z-10">
                              <Button 
                                variant="outline" 
                                size="sm"
                                type="button"
                                className="pointer-events-auto relative z-20"
                                onClickCapture={() => {
                                  console.log('🔎 onClickCapture reached for', event.name);
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log('🖱️ Edytuj clicked for', event.name, '(', event.id, ')');
                                  handleEditEvent(event);
                                }}
                              >
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
                                {event.status !== 'published' && event.status !== 'archived' && (
                                  <Button 
                                    variant="competition" 
                                    size="sm"
                                    onClick={() => updateEventStatus(event.id, 'published')}
                                  >
                                    <Globe className="h-4 w-4 mr-1" />
                                    Publikuj
                                  </Button>
                                )}
                                {event.status !== 'archived' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => updateEventStatus(event.id, 'archived')}
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    Archiwizuj
                                  </Button>
                                )}
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedEventForDetails(event)}
                                >
                                  <Users className="h-4 w-4 mr-1" />
                                Zarządzaj
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

            <TabsContent value="results" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Wyniki i raporty
                    </CardTitle>
                    <CardDescription>
                    Przeglądaj wyniki wydarzeń i generuj raporty
                    </CardDescription>
                  </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => (
                      <Card key={event.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{event.name}</h4>
                          <Badge variant="outline">{event.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {new Date(event.start_date).toLocaleDateString('pl-PL')} • {event.location}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleNavigateToResults(event.id)}
                            className="flex-1"
                          >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Zobacz wyniki
                          </Button>
                        </div>
                      </Card>
                    ))}
                      </div>
                      
                  {events.length === 0 && (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Brak wydarzeń do wyświetlenia</p>
                    </div>
                  )}
                  </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="panels" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Panele systemu
                    </CardTitle>
                    <CardDescription>
                    Dostęp do wszystkich paneli systemu
                    </CardDescription>
                  </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">Panel Biura</h3>
                          <p className="text-sm text-muted-foreground">
                            Zarządzanie zgłoszeniami, wprowadzanie wyników, generowanie dokumentów
                          </p>
                        </div>
                        <Button onClick={handleNavigateToOffice}>
                          Otwórz
                        </Button>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                          <Trophy className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">Panel Sędziego</h3>
                          <p className="text-sm text-muted-foreground">
                            Wprowadzanie wyników, karty sędziowskie, zarządzanie konkurencjami
                          </p>
                        </div>
                        <Button onClick={handleNavigateToJudge}>
                          Otwórz
                        </Button>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Globe className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">Strona główna</h3>
                          <p className="text-sm text-muted-foreground">
                            Publiczny widok wydarzeń i wyników
                          </p>
                        </div>
                        <Button onClick={() => navigate('/')}>
                          Otwórz
                        </Button>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">Raport PDF</h3>
                          <p className="text-sm text-muted-foreground">
                            Generowanie dokumentów i raportów
                          </p>
                        </div>
                        <Button variant="outline" onClick={() => navigate('/biuro')}>
                          Generuj
                        </Button>
                      </div>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Zarządzanie użytkownikami
                  </CardTitle>
                  <CardDescription>
                    Twórz i zarządzaj kontami użytkowników systemu
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Domyślne konta użytkowników</h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      {SIMPLE_USERS.map((user, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="font-medium">{user.name}:</span>
                          <span>{user.email} / {user.password}</span>
                        </div>
                      ))}
                      </div>
                    </div>
                    
                  <div className="flex gap-4">
                    <Button onClick={handleCreateUsers} className="bg-brand-primary hover:bg-brand-primary-dark">
                      <Users className="h-4 w-4 mr-2" />
                      Informacja o kontach
                    </Button>
                    <Button variant="outline" onClick={() => window.open('https://supabase.com', '_blank')}>
                      <Globe className="h-4 w-4 mr-2" />
                      Otwórz Supabase Dashboard
                      </Button>
                    </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">System gotowy</h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>✅ Konta są predefiniowane w kodzie</p>
                      <p>✅ Działa na VPS bez konfiguracji</p>
                      <p>✅ Brak problemów z rate limiting</p>
                      <p>✅ Natychmiastowe logowanie</p>
                    </div>
                  </div>
                  </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
          ) : (
            <EventDetailsView
              event={selectedEventForDetails as any}
              teams={[]}
              onClose={() => setSelectedEventForDetails(null)}
              onAddTeam={() => {/* TODO: Implement add team */}}
              onLoadTeams={() => {/* TODO: Implement load teams */}}
              onEditEvent={(ev) => handleEditEvent(ev as any)}
            />
          )}

        {/* Edit Modal */}
        {showEditModal && editingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edytuj wydarzenie: {editingEvent.name}</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseModal}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <EventEditForm
                event={editingEvent as any}
                competitions={competitions}
                onSave={async (eventData, competitionsData) => {
                  await handleSaveEvent(eventData, competitionsData);
                  setShowEditModal(false);
                  setEditingEvent(null);
                }}
                onCancel={handleCloseModal}
              />
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
