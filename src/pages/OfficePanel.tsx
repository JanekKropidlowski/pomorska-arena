import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileCheck, 
  Users, 
  Download, 
  Upload,
  CheckCircle,
  X,
  Clock,
  AlertCircle,
  Trophy,
  FileText,
  Printer,
  Share2,
  Search
} from "lucide-react";

interface TeamApplication {
  id: string;
  teamName: string;
  supervisor: string;
  email: string;
  competitorsCount: number;
  status: 'pending' | 'approved' | 'rejected';
  documentsComplete: boolean;
  submittedAt: string;
  competitions: string[];
}

interface CompetitionResult {
  position: number;
  startNumber: number;
  name: string;
  team: string;
  category: string;
  result: string;
  competition: string;
}

const OfficePanel = () => {
  const [applications, setApplications] = useState<TeamApplication[]>([
    {
      id: '1',
      teamName: 'SP nr 15 Gdynia',
      supervisor: 'Maria Wiśniewska',
      email: 'maria.wisniewska@sp15.gdynia.pl',
      competitorsCount: 3,
      status: 'approved',
      documentsComplete: true,
      submittedAt: '10 października 2024',
      competitions: ['Strzelectwo', 'Rzut granatem']
    },
    {
      id: '2',
      teamName: 'LO Sopot',
      supervisor: 'Jan Kowalski',
      email: 'jan.kowalski@lo.sopot.pl',
      competitorsCount: 4,
      status: 'pending',
      documentsComplete: false,
      submittedAt: '11 października 2024',
      competitions: ['Strzelectwo', 'Bieg przełajowy']
    },
    {
      id: '3',
      teamName: 'Technikum Gdynia',
      supervisor: 'Anna Nowak',
      email: 'anna.nowak@tech.gdynia.pl',
      competitorsCount: 2,
      status: 'rejected',
      documentsComplete: false,
      submittedAt: '12 października 2024',
      competitions: ['Rzut granatem']
    }
  ]);

  const [results] = useState<CompetitionResult[]>([
    {
      position: 1,
      startNumber: 101,
      name: 'Anna Kowalska',
      team: 'SP nr 15 Gdynia',
      category: 'Dziewczęta U-16',
      result: '95 pkt',
      competition: 'Strzelectwo - broń krótka'
    },
    {
      position: 2,
      startNumber: 102,
      name: 'Piotr Nowak',
      team: 'LO Sopot',
      category: 'Chłopcy U-18',
      result: '92 pkt',
      competition: 'Strzelectwo - broń krótka'
    },
    {
      position: 1,
      startNumber: 201,
      name: 'Maria Wiśniewska',
      team: 'SP nr 8 Gdańsk',
      category: 'Dziewczęta U-16',
      result: '5 pkt',
      competition: 'Rzut granatem'
    }
  ]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Oczekuje', color: 'bg-warning text-warning-foreground', icon: Clock };
      case 'approved':
        return { label: 'Zatwierdzone', color: 'bg-success text-success-foreground', icon: CheckCircle };
      case 'rejected':
        return { label: 'Odrzucone', color: 'bg-destructive text-destructive-foreground', icon: X };
      default:
        return { label: 'Nieznany', color: 'bg-muted text-muted-foreground', icon: Clock };
    }
  };

  const updateApplicationStatus = (id: string, status: TeamApplication['status']) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status } : app
    ));
  };

  const stats = {
    totalApplications: applications.length,
    approvedApplications: applications.filter(a => a.status === 'approved').length,
    pendingApplications: applications.filter(a => a.status === 'pending').length,
    totalCompetitors: applications.reduce((sum, app) => sum + app.competitorsCount, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header 
        userRole="Biuro zawodów" 
        userName="Katarzyna Biurowa"
        notifications={3}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Biuro Zawodów</h1>
              <p className="text-muted-foreground">
                Zarządzanie zgłoszeniami, wynikami i dokumentacją
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-primary text-primary-foreground">
                <FileCheck className="h-3 w-3 mr-1" />
                {stats.pendingApplications} do sprawdzenia
              </Badge>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{stats.totalApplications}</p>
                  <p className="text-sm text-muted-foreground">Zgłoszenia</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{stats.approvedApplications}</p>
                  <p className="text-sm text-muted-foreground">Zatwierdzone</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">{stats.pendingApplications}</p>
                  <p className="text-sm text-muted-foreground">Oczekujące</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{stats.totalCompetitors}</p>
                  <p className="text-sm text-muted-foreground">Zawodników</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="applications" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="applications">Zgłoszenia</TabsTrigger>
              <TabsTrigger value="startlists">Listy startowe</TabsTrigger>
              <TabsTrigger value="results">Wyniki</TabsTrigger>
              <TabsTrigger value="documents">Dokumenty</TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Weryfikacja zgłoszeń</CardTitle>
                      <CardDescription>
                        Sprawdź i zatwierdź zgłoszenia drużyn
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Szukaj drużyny..." className="pl-8 w-64" />
                      </div>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Eksportuj
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.map((application) => {
                      const statusInfo = getStatusInfo(application.status);
                      
                      return (
                        <div key={application.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-medium text-lg">{application.teamName}</h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span>Opiekun: {application.supervisor}</span>
                                <span>•</span>
                                <span>{application.competitorsCount} zawodników</span>
                                <span>•</span>
                                <span>{application.submittedAt}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={statusInfo.color}>
                                <statusInfo.icon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                              {application.documentsComplete ? (
                                <Badge className="bg-success text-success-foreground">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Dokumenty OK
                                </Badge>
                              ) : (
                                <Badge className="bg-warning text-warning-foreground">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Brakuje dokumentów
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <p className="text-sm font-medium">Konkurencje:</p>
                            <div className="flex gap-2">
                              {application.competitions.map((comp, idx) => (
                                <Badge key={idx} variant="secondary">
                                  {comp}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Email: {application.email}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                Szczegóły
                              </Button>
                              {application.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Odrzuć
                                  </Button>
                                  <Button 
                                    variant="success" 
                                    size="sm"
                                    onClick={() => updateApplicationStatus(application.id, 'approved')}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Zatwierdź
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="startlists" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Listy startowe</CardTitle>
                      <CardDescription>
                        Generuj i zarządzaj listami startowymi
                      </CardDescription>
                    </div>
                    <Button variant="competition">
                      <Users className="h-4 w-4 mr-2" />
                      Generuj wszystkie listy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Strzelectwo - broń krótka', 'Strzelectwo - broń długa', 'Rzut granatem', 'Bieg przełajowy'].map((competition, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{competition}</h4>
                          <Badge variant="secondary">
                            {Math.floor(Math.random() * 15) + 5} zawodników
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Lista gotowa do wydruku i dystrybucji
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <FileText className="h-4 w-4 mr-1" />
                            Podgląd
                          </Button>
                          <Button variant="competition" size="sm" className="flex-1">
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Publikacja wyników</CardTitle>
                      <CardDescription>
                        Zarządzaj wynikami i publikuj na żywo
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Import wyników
                      </Button>
                      <Button variant="competition">
                        <Share2 className="h-4 w-4 mr-2" />
                        Publikuj na żywo
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className="bg-success text-success-foreground">
                        <Trophy className="h-3 w-3 mr-1" />
                        Strzelectwo - opublikowane
                      </Badge>
                      <Badge className="bg-warning text-warning-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        Rzut granatem - w trakcie
                      </Badge>
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Bieg - oczekuje
                      </Badge>
                    </div>

                    {results.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded bg-primary-light flex items-center justify-center text-sm font-bold text-primary">
                            {result.position}
                          </div>
                          <div>
                            <p className="font-medium">{result.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {result.team} • {result.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{result.result}</p>
                          <p className="text-xs text-muted-foreground">{result.competition}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generowanie dokumentów</CardTitle>
                  <CardDescription>
                    Protokoły, dyplomy i raporty zawodów
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <h4 className="font-medium mb-2">Protokół końcowy</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Oficjalny protokół z wynikami
                      </p>
                      <Button variant="outline" className="w-full">
                        <Printer className="h-4 w-4 mr-2" />
                        Generuj PDF
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4 text-center">
                      <Trophy className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <h4 className="font-medium mb-2">Dyplomy</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Dyplomy dla zwycięzców
                      </p>
                      <Button variant="outline" className="w-full">
                        <Printer className="h-4 w-4 mr-2" />
                        Generuj wszystkie
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4 text-center">
                      <FileCheck className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <h4 className="font-medium mb-2">Raport końcowy</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Kompleksowy raport z wydarzenia
                      </p>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Pobierz raport
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Szybkie akcje</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="competition" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Wyślij wyniki mailem
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-1" />
                        Eksportuj do Excel
                      </Button>
                      <Button variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-1" />
                        Drukuj listy wyników
                      </Button>
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