import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
  Clock
} from "lucide-react";

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  status: 'draft' | 'active' | 'completed';
  participants: number;
  competitions: number;
}

interface Competition {
  id: string;
  name: string;
  type: 'points' | 'time' | 'distance';
  maxScore?: number;
  unit?: string;
  active: boolean;
}

const AdminPanel = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      name: 'Mistrzostwa Pomorskiego LZS w Strzelectwie',
      date: '15 października 2024',
      location: 'Kłanino, Gdańsk',
      status: 'active',
      participants: 45,
      competitions: 4
    },
    {
      id: '2',
      name: 'Biegi Przełajowe LZS',
      date: '22 października 2024',
      location: 'Starzyna',
      status: 'draft',
      participants: 0,
      competitions: 2
    },
    {
      id: '3',
      name: 'Letnie Mistrzostwa LZS 2024',
      date: '5 września 2024',
      location: 'Gdynia',
      status: 'completed',
      participants: 120,
      competitions: 8
    }
  ]);

  const [competitions, setCompetitions] = useState<Competition[]>([
    {
      id: '1',
      name: 'Strzelectwo - broń krótka',
      type: 'points',
      maxScore: 100,
      active: true
    },
    {
      id: '2',
      name: 'Strzelectwo - broń długa',
      type: 'points',
      maxScore: 100,
      active: true
    },
    {
      id: '3',
      name: 'Rzut granatem',
      type: 'points',
      maxScore: 6,
      active: true
    },
    {
      id: '4',
      name: 'Bieg przełajowy',
      type: 'time',
      unit: 'mm:ss',
      active: true
    }
  ]);

  const [systemSettings, setSystemSettings] = useState({
    registrationOpen: true,
    publicResults: true,
    emailNotifications: true,
    autoCloseRegistration: true,
    maxTeamsPerEvent: 50,
    maxCompetitorsPerTeam: 6
  });

  const getEventStatusInfo = (status: string) => {
    switch (status) {
      case 'draft':
        return { label: 'Projekt', color: 'bg-muted text-muted-foreground', icon: Edit };
      case 'active':
        return { label: 'Aktywne', color: 'bg-success text-success-foreground', icon: Trophy };
      case 'completed':
        return { label: 'Zakończone', color: 'bg-secondary text-secondary-foreground', icon: Trophy };
      default:
        return { label: 'Nieznany', color: 'bg-muted text-muted-foreground', icon: Edit };
    }
  };

  const cloneEvent = (eventId: string) => {
    const eventToClone = events.find(e => e.id === eventId);
    if (eventToClone) {
      const newEvent = {
        ...eventToClone,
        id: Date.now().toString(),
        name: eventToClone.name + ' (kopia)',
        status: 'draft' as const,
        participants: 0
      };
      setEvents(prev => [...prev, newEvent]);
    }
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
                    <p className="text-2xl font-bold text-success">{competitions.filter(c => c.active).length}</p>
                    <p className="text-sm text-muted-foreground">Konkurencje</p>
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
                      {events.reduce((sum, event) => sum + event.participants, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Zawodnicy</p>
                  </div>
                  <Users className="h-8 w-8 text-warning" />
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
                  <div className="space-y-4">
                    {events.map((event) => {
                      const statusInfo = getEventStatusInfo(event.status);
                      
                      return (
                        <div key={event.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-lg">{event.name}</h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span>{event.date}</span>
                                <span>•</span>
                                <span>{event.location}</span>
                                <span>•</span>
                                <span>{event.participants} uczestników</span>
                                <span>•</span>
                                <span>{event.competitions} konkurencji</span>
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
                                Utworzono: 1 października
                              </Badge>
                              <Badge variant="secondary">
                                <Users className="h-3 w-3 mr-1" />
                                Limit: 60 zawodników
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="competitions" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Konfiguracja konkurencji</CardTitle>
                      <CardDescription>
                        Definiuj rodzaje konkurencji i zasady punktacji
                      </CardDescription>
                    </div>
                    <Button variant="competition">
                      <Plus className="h-4 w-4 mr-2" />
                      Nowa konkurencja
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitions.map((competition) => (
                      <div key={competition.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Switch 
                              checked={competition.active}
                              onCheckedChange={(checked) => 
                                setCompetitions(prev => prev.map(c => 
                                  c.id === competition.id ? { ...c, active: checked } : c
                                ))
                              }
                            />
                            <div>
                              <h4 className="font-medium">{competition.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="secondary">
                                  {competition.type === 'points' ? 'Punkty' : 
                                   competition.type === 'time' ? 'Czas' : 'Odległość'}
                                </Badge>
                                {competition.maxScore && (
                                  <span>Max: {competition.maxScore} pkt</span>
                                )}
                                {competition.unit && (
                                  <span>Jednostka: {competition.unit}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edytuj
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4 mr-1" />
                              Punktacja
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                      <Shield className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <h4 className="font-medium mb-2">Administratorzy</h4>
                      <p className="text-2xl font-bold text-primary mb-2">3</p>
                      <Button variant="outline" size="sm" className="w-full">
                        Zarządzaj
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4 text-center">
                      <Trophy className="h-8 w-8 mx-auto mb-3 text-success" />
                      <h4 className="font-medium mb-2">Sędziowie</h4>
                      <p className="text-2xl font-bold text-success mb-2">12</p>
                      <Button variant="outline" size="sm" className="w-full">
                        Zarządzaj
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4 text-center">
                      <Users className="h-8 w-8 mx-auto mb-3 text-warning" />
                      <h4 className="font-medium mb-2">Opiekunowie</h4>
                      <p className="text-2xl font-bold text-warning mb-2">28</p>
                      <Button variant="outline" size="sm" className="w-full">
                        Zarządzaj
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4 text-center">
                      <Globe className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                      <h4 className="font-medium mb-2">Publiczny</h4>
                      <p className="text-2xl font-bold text-muted-foreground mb-2">∞</p>
                      <Button variant="outline" size="sm" className="w-full">
                        Ustawienia
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ustawienia systemu</CardTitle>
                    <CardDescription>
                      Ogólne ustawienia działania systemu
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Otwarte zgłoszenia</Label>
                        <p className="text-sm text-muted-foreground">
                          Umożliw nowe zgłoszenia do wydarzeń
                        </p>
                      </div>
                      <Switch 
                        checked={systemSettings.registrationOpen}
                        onCheckedChange={(checked) => 
                          setSystemSettings(prev => ({ ...prev, registrationOpen: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Publiczne wyniki</Label>
                        <p className="text-sm text-muted-foreground">
                          Publikuj wyniki na stronie publicznej
                        </p>
                      </div>
                      <Switch 
                        checked={systemSettings.publicResults}
                        onCheckedChange={(checked) => 
                          setSystemSettings(prev => ({ ...prev, publicResults: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Powiadomienia email</Label>
                        <p className="text-sm text-muted-foreground">
                          Wysyłaj automatyczne powiadomienia
                        </p>
                      </div>
                      <Switch 
                        checked={systemSettings.emailNotifications}
                        onCheckedChange={(checked) => 
                          setSystemSettings(prev => ({ ...prev, emailNotifications: checked }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Maksymalna liczba drużyn na wydarzenie</Label>
                      <Input 
                        type="number" 
                        value={systemSettings.maxTeamsPerEvent}
                        onChange={(e) => 
                          setSystemSettings(prev => ({ 
                            ...prev, 
                            maxTeamsPerEvent: parseInt(e.target.value) || 50 
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Maksymalna liczba zawodników na drużynę</Label>
                      <Input 
                        type="number" 
                        value={systemSettings.maxCompetitorsPerTeam}
                        onChange={(e) => 
                          setSystemSettings(prev => ({ 
                            ...prev, 
                            maxCompetitorsPerTeam: parseInt(e.target.value) || 6 
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Szablony i komunikacja</CardTitle>
                    <CardDescription>
                      Konfiguruj szablony dokumentów i wiadomości
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Szablon powiadomienia o zatwierdzeniu</Label>
                      <Textarea 
                        placeholder="Szablon email o zatwierdzeniu zgłoszenia..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Szablon powiadomienia o odrzuceniu</Label>
                      <Textarea 
                        placeholder="Szablon email o odrzuceniu zgłoszenia..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Mail className="h-4 w-4 mr-2" />
                        Test email
                      </Button>
                      <Button variant="competition" className="flex-1">
                        <Bell className="h-4 w-4 mr-2" />
                        Zapisz szablony
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Raporty systemu</CardTitle>
                  <CardDescription>
                    Analizy, statystyki i raporty z działania systemu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <h4 className="font-medium mb-2">Raport frekwencji</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Analiza uczestnictwa w wydarzeniach
                      </p>
                      <Button variant="outline" className="w-full">
                        Generuj raport
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4 text-center">
                      <Trophy className="h-8 w-8 mx-auto mb-3 text-success" />
                      <h4 className="font-medium mb-2">Ranking medalowy</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Klasyfikacja szkół i województw
                      </p>
                      <Button variant="outline" className="w-full">
                        Generuj raport
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4 text-center">
                      <Database className="h-8 w-8 mx-auto mb-3 text-warning" />
                      <h4 className="font-medium mb-2">Eksport danych</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Pełny eksport danych systemu
                      </p>
                      <Button variant="outline" className="w-full">
                        Eksportuj
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Ostatnie aktywności systemu
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Nowe zgłoszenie - SP nr 15 Gdynia</span>
                        <span className="text-muted-foreground">2 minuty temu</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Opublikowano wyniki - Strzelectwo</span>
                        <span className="text-muted-foreground">15 minut temu</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zatwierdzono zgłoszenie - LO Sopot</span>
                        <span className="text-muted-foreground">1 godzinę temu</span>
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

export default AdminPanel;