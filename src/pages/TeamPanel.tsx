import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  FileText, 
  Download, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  School
} from "lucide-react";

interface Competitor {
  id: string;
  firstName: string;
  lastName: string;
  birthYear: number;
  category: string;
  gender: 'M' | 'K';
  competitions: string[];
}

const TeamPanel = () => {
  const [competitors, setCompetitors] = useState<Competitor[]>([
    {
      id: '1',
      firstName: 'Anna',
      lastName: 'Kowalska',
      birthYear: 2008,
      category: 'U-16',
      gender: 'K',
      competitions: ['Strzelectwo - broń krótka', 'Rzut granatem']
    },
    {
      id: '2',
      firstName: 'Piotr',
      lastName: 'Nowak',
      birthYear: 2006,
      category: 'U-18',
      gender: 'M',
      competitions: ['Strzelectwo - broń długa', 'Bieg przełajowy']
    }
  ]);

  const [teamInfo, setTeamInfo] = useState({
    name: 'SP nr 15 Gdynia',
    type: 'Szkoła podstawowa',
    supervisor: 'Maria Wiśniewska',
    email: 'maria.wisniewska@sp15.gdynia.pl',
    phone: '+48 123 456 789'
  });

  const applicationStatus = {
    status: 'accepted',
    submittedAt: '10 października 2024, 14:30',
    documentsComplete: true,
    competitorsCount: competitors.length,
    maxCompetitors: 6
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'draft':
        return { label: 'Robocze', color: 'bg-muted text-muted-foreground', icon: Clock };
      case 'submitted':
        return { label: 'Wysłane', color: 'bg-warning text-warning-foreground', icon: Clock };
      case 'accepted':
        return { label: 'Przyjęte', color: 'bg-success text-success-foreground', icon: CheckCircle };
      case 'rejected':
        return { label: 'Odrzucone', color: 'bg-destructive text-destructive-foreground', icon: AlertCircle };
      default:
        return { label: 'Nieznany', color: 'bg-muted text-muted-foreground', icon: Clock };
    }
  };

  const statusInfo = getStatusInfo(applicationStatus.status);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header 
        userRole="Opiekun drużyny" 
        userName="Maria Wiśniewska"
        notifications={2}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Panel Drużyny</h1>
              <p className="text-muted-foreground">
                Zarządzaj zgłoszeniami i zawodnikami swojej drużyny
              </p>
            </div>
            <Badge className={statusInfo.color}>
              <statusInfo.icon className="h-3 w-3 mr-1" />
              {statusInfo.label}
            </Badge>
          </div>

          {/* Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                Status zgłoszenia - {teamInfo.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Data zgłoszenia</p>
                  <p className="font-medium">{applicationStatus.submittedAt}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Zawodnicy</p>
                  <p className="font-medium">
                    {applicationStatus.competitorsCount}/{applicationStatus.maxCompetitors}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Dokumenty</p>
                  <p className="font-medium flex items-center justify-center gap-1">
                    {applicationStatus.documentsComplete ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-success" />
                        Kompletne
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-warning" />
                        Brakuje
                      </>
                    )}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Termin zgłoszeń</p>
                  <p className="font-medium text-destructive">12 października</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="competitors" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="competitors">Zawodnicy</TabsTrigger>
              <TabsTrigger value="team">Dane drużyny</TabsTrigger>
              <TabsTrigger value="documents">Dokumenty</TabsTrigger>
              <TabsTrigger value="schedule">Harmonogram</TabsTrigger>
            </TabsList>

            <TabsContent value="competitors" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Lista zawodników</CardTitle>
                      <CardDescription>
                        Dodaj zawodników do swojej drużyny (max. 6 osób)
                      </CardDescription>
                    </div>
                    <Button variant="competition">
                      <Plus className="h-4 w-4 mr-2" />
                      Dodaj zawodnika
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitors.map((competitor) => (
                      <div key={competitor.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {competitor.firstName} {competitor.lastName}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Rok ur. {competitor.birthYear}</span>
                              <span>•</span>
                              <span>{competitor.category}</span>
                              <span>•</span>
                              <span>{competitor.gender === 'M' ? 'Chłopiec' : 'Dziewczyna'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Konkurencje:</p>
                            <div className="flex gap-1">
                              {competitor.competitions.map((comp, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {comp}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Edytuj
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dane drużyny</CardTitle>
                  <CardDescription>
                    Informacje o drużynie i opiekunie
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="teamName">Nazwa drużyny</Label>
                      <Input 
                        id="teamName" 
                        value={teamInfo.name}
                        onChange={(e) => setTeamInfo({...teamInfo, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teamType">Typ organizacji</Label>
                      <Input 
                        id="teamType" 
                        value={teamInfo.type}
                        onChange={(e) => setTeamInfo({...teamInfo, type: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supervisor">Opiekun drużyny</Label>
                      <Input 
                        id="supervisor" 
                        value={teamInfo.supervisor}
                        onChange={(e) => setTeamInfo({...teamInfo, supervisor: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email kontaktowy</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={teamInfo.email}
                        onChange={(e) => setTeamInfo({...teamInfo, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input 
                        id="phone" 
                        value={teamInfo.phone}
                        onChange={(e) => setTeamInfo({...teamInfo, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button variant="competition" className="w-full">
                    Zapisz zmiany
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dokumenty zgłoszeniowe</CardTitle>
                  <CardDescription>
                    Pobierz wymagane dokumenty i przesyłaj wypełnione formularze
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Lista zgłoszeniowa</h4>
                        <Badge className="bg-success text-success-foreground">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Gotowe
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Oficjalna lista zawodników do wydruku
                      </p>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Pobierz PDF
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Zgody RODO</h4>
                        <Badge className="bg-warning text-warning-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          Oczekuje
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Zgody na przetwarzanie danych osobowych
                      </p>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Pobierz formularz
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Oświadczenia zdrowotne</h4>
                        <Badge className="bg-success text-success-foreground">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Przesłane
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Zaświadczenia o zdolności do uprawiania sportu
                      </p>
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Zobacz przesłane
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Regulamin zawodów</h4>
                        <Badge variant="secondary">Informacja</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Oficjalny regulamin mistrzostw LZS
                      </p>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Pobierz PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Harmonogram zawodów
                  </CardTitle>
                  <CardDescription>
                    Plan zawodów dla Twojej drużyny
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Rejestracja uczestników</h4>
                          <p className="text-sm text-muted-foreground">
                            Potwierdzenie obecności i odbiór numerów startowych
                          </p>
                        </div>
                        <Badge variant="secondary">08:00 - 08:30</Badge>
                      </div>
                    </div>

                    <div className="border-l-4 border-warning pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Strzelectwo - broń krótka</h4>
                          <p className="text-sm text-muted-foreground">
                            Zawodnicy: Anna Kowalska
                          </p>
                        </div>
                        <Badge className="bg-warning text-warning-foreground">09:00 - 10:30</Badge>
                      </div>
                    </div>

                    <div className="border-l-4 border-success pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Strzelectwo - broń długa</h4>
                          <p className="text-sm text-muted-foreground">
                            Zawodnicy: Piotr Nowak
                          </p>
                        </div>
                        <Badge className="bg-success text-success-foreground">11:00 - 12:30</Badge>
                      </div>
                    </div>

                    <div className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Rzut granatem</h4>
                          <p className="text-sm text-muted-foreground">
                            Zawodnicy: Anna Kowalska
                          </p>
                        </div>
                        <Badge className="bg-primary text-primary-foreground">13:30 - 14:30</Badge>
                      </div>
                    </div>

                    <div className="border-l-4 border-accent pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Bieg przełajowy</h4>
                          <p className="text-sm text-muted-foreground">
                            Zawodnicy: Piotr Nowak
                          </p>
                        </div>
                        <Badge className="bg-accent text-accent-foreground">15:00 - 16:00</Badge>
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

export default TeamPanel;