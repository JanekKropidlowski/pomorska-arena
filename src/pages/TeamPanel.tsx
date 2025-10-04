import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StandardHeader } from "@/components/StandardHeader";
import { generateTeamRegistrationPDF } from "@/components/PDFGenerator";
import { supabase } from "@/integrations/supabase/client";
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
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  
  const [teamInfo, setTeamInfo] = useState<any>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState<any>(null);

  useEffect(() => {
    if (teamId) {
      loadTeamData();
    }
  }, [teamId]);

  const loadTeamData = async () => {
    if (!teamId) return;

    try {
      // Load team info
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (teamError) throw teamError;

      setTeamInfo(team);

      // Load event info
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', team.event_id)
        .single();

      if (eventError) throw eventError;
      setEventInfo(event);

      // Load competitors
      const { data: participants, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .eq('team_id', teamId);

      if (participantsError) throw participantsError;

      const formattedCompetitors = participants.map(p => ({
        id: p.id,
        firstName: p.first_name,
        lastName: p.last_name,
        birthYear: p.birth_year,
        category: p.birth_year >= 2008 ? 'U-16' : 'U-18',
        gender: p.gender,
        competitions: p.competitions || []
      }));

      setCompetitors(formattedCompetitors);
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Ładowanie danych drużyny...</p>
        </div>
      </div>
    );
  }

  if (!teamInfo) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Drużyna nie została znaleziona</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Wróć do strony głównej
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const applicationStatus = {
    status: teamInfo.status || 'draft',
    submittedAt: teamInfo.submitted_at ? new Date(teamInfo.submitted_at).toLocaleString('pl-PL') : 'Nie wysłano',
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
    <div className="page-container">
      <StandardHeader 
        title="Panel Drużyny"
        subtitle="Zarządzanie drużyną i uczestnikami"
        showNavigation={true}
        showUserInfo={true}
        showNotifications={true}
        notifications={0}
      />
      
      <main className="page-content">
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
                        value={teamInfo.name || ''}
                        onChange={(e) => setTeamInfo({...teamInfo, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teamType">Typ organizacji</Label>
                      <Input 
                        id="teamType" 
                        value={teamInfo.type || ''}
                        onChange={(e) => setTeamInfo({...teamInfo, type: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supervisor">Opiekun drużyny</Label>
                      <Input 
                        id="supervisor" 
                        value={teamInfo.supervisor_name || ''}
                        onChange={(e) => setTeamInfo({...teamInfo, supervisor_name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email kontaktowy</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={teamInfo.supervisor_email || ''}
                        onChange={(e) => setTeamInfo({...teamInfo, supervisor_email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input 
                        id="phone" 
                        value={teamInfo.supervisor_phone || ''}
                        onChange={(e) => setTeamInfo({...teamInfo, supervisor_phone: e.target.value})}
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
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          if (teamInfo && eventInfo) {
                            const pdfContent = generateTeamRegistrationPDF(
                              { ...teamInfo, event_name: eventInfo.name },
                              competitors
                            );
                            
                            // Create a temporary element to render the PDF content
                            const tempDiv = document.createElement('div');
                            tempDiv.style.position = 'absolute';
                            tempDiv.style.left = '-9999px';
                            tempDiv.style.top = '0';
                            tempDiv.style.width = '800px';
                            tempDiv.style.backgroundColor = 'white';
                            tempDiv.style.padding = '20px';
                            tempDiv.style.fontFamily = 'Arial, sans-serif';
                            
                            // Render the content
                            const { createRoot } = require('react-dom/client');
                            const root = createRoot(tempDiv);
                            root.render(pdfContent);
                            
                            document.body.appendChild(tempDiv);
                            
                            // Generate PDF using jsPDF
                            setTimeout(async () => {
                              const { jsPDF } = await import('jspdf');
                              const html2canvas = (await import('html2canvas')).default;
                              
                              const canvas = await html2canvas(tempDiv, {
                                scale: 2,
                                useCORS: true,
                                allowTaint: true,
                                backgroundColor: '#ffffff'
                              });
                              
                              const imgData = canvas.toDataURL('image/png');
                              const pdf = new jsPDF('p', 'mm', 'a4');
                              const imgWidth = 210;
                              const pageHeight = 295;
                              const imgHeight = (canvas.height * imgWidth) / canvas.width;
                              let heightLeft = imgHeight;
                              
                              let position = 0;
                              
                              pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                              heightLeft -= pageHeight;
                              
                              while (heightLeft >= 0) {
                                position = heightLeft - imgHeight;
                                pdf.addPage();
                                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                                heightLeft -= pageHeight;
                              }
                              
                              pdf.save(`zgłoszenie-${teamInfo.name}.pdf`);
                              
                              // Cleanup
                              document.body.removeChild(tempDiv);
                              root.unmount();
                            }, 1000);
                          }
                        }}
                      >
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