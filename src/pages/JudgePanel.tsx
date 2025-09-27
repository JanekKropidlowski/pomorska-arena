import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  QrCode, 
  Save, 
  CheckCircle,
  X,
  Clock,
  AlertTriangle,
  Trophy,
  User,
  Camera
} from "lucide-react";

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
  const [selectedCompetition, setSelectedCompetition] = useState('pistol');
  const [competitors, setCompetitors] = useState<CompetitorResult[]>([
    {
      id: '1',
      startNumber: 101,
      firstName: 'Anna',
      lastName: 'Kowalska',
      team: 'SP nr 15 Gdynia',
      category: 'Dziewczęta U-16',
      result: '95',
      status: 'finished',
      scores: [18, 19, 20, 19, 19],
      notes: 'Bardzo dobry wynik'
    },
    {
      id: '2',
      startNumber: 102,
      firstName: 'Piotr',
      lastName: 'Nowak',
      team: 'LO Sopot',
      category: 'Chłopcy U-18',
      status: 'competing',
      scores: [17, 18, 0, 0, 0]
    },
    {
      id: '3',
      startNumber: 103,
      firstName: 'Maria',
      lastName: 'Wiśniewska',
      team: 'SP nr 8 Gdańsk',
      category: 'Dziewczęta U-16',
      status: 'waiting',
      scores: [0, 0, 0, 0, 0]
    },
    {
      id: '4',
      startNumber: 104,
      firstName: 'Jakub',
      lastName: 'Kowalczyk',
      team: 'Technikum Gdynia',
      category: 'Chłopcy U-18',
      status: 'dns',
      scores: [0, 0, 0, 0, 0],
      notes: 'Nieobecność usprawiedliwiona'
    }
  ]);

  const competitions = [
    { id: 'pistol', name: 'Strzelectwo - broń krótka', maxScore: 100 },
    { id: 'rifle', name: 'Strzelectwo - broń długa', maxScore: 100 },
    { id: 'grenade', name: 'Rzut granatem', maxScore: 6 },
    { id: 'run', name: 'Bieg przełajowy', unit: 'czas' }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'waiting':
        return { label: 'Oczekuje', color: 'bg-muted text-muted-foreground', icon: Clock };
      case 'competing':
        return { label: 'Startuje', color: 'bg-warning text-warning-foreground', icon: Target };
      case 'finished':
        return { label: 'Zakończył', color: 'bg-success text-success-foreground', icon: CheckCircle };
      case 'dns':
        return { label: 'DNS', color: 'bg-destructive text-destructive-foreground', icon: X };
      case 'dq':
        return { label: 'DQ', color: 'bg-destructive text-destructive-foreground', icon: AlertTriangle };
      default:
        return { label: 'Nieznany', color: 'bg-muted text-muted-foreground', icon: Clock };
    }
  };

  const updateCompetitorScore = (competitorId: string, scoreIndex: number, value: number) => {
    setCompetitors(prev => prev.map(comp => {
      if (comp.id === competitorId) {
        const newScores = [...comp.scores];
        newScores[scoreIndex] = value;
        const result = newScores.reduce((sum, score) => sum + score, 0).toString();
        return { ...comp, scores: newScores, result, status: 'finished' as const };
      }
      return comp;
    }));
  };

  const updateCompetitorStatus = (competitorId: string, status: CompetitorResult['status']) => {
    setCompetitors(prev => prev.map(comp => 
      comp.id === competitorId ? { ...comp, status } : comp
    ));
  };

  const currentCompetition = competitions.find(c => c.id === selectedCompetition);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header 
        userRole="Sędzia" 
        userName="Jan Sędziowski"
        notifications={1}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Panel Sędziego</h1>
              <p className="text-muted-foreground">
                Wprowadzanie wyników i zarządzanie konkurencją
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-primary text-primary-foreground">
                <Target className="h-3 w-3 mr-1" />
                Aktywna konkurencja
              </Badge>
              <Button variant="outline" size="sm">
                <QrCode className="h-4 w-4 mr-2" />
                Skanuj QR
              </Button>
            </div>
          </div>

          {/* Competition Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Wybierz konkurencję</CardTitle>
              <CardDescription>
                Przełączaj między przypisanymi konkurencjami
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {competitions.map((comp) => (
                  <Button
                    key={comp.id}
                    variant={selectedCompetition === comp.id ? "competition" : "outline"}
                    onClick={() => setSelectedCompetition(comp.id)}
                    className="justify-start"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    {comp.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="results" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="results">Wprowadzanie wyników</TabsTrigger>
              <TabsTrigger value="startlist">Lista startowa</TabsTrigger>
              <TabsTrigger value="summary">Podsumowanie</TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{currentCompetition?.name}</CardTitle>
                  <CardDescription>
                    Wprowadź wyniki dla poszczególnych zawodników
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitors.map((competitor) => {
                      const statusInfo = getStatusInfo(competitor.status);
                      
                      return (
                        <div key={competitor.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary">
                                {competitor.startNumber}
                              </div>
                              <div>
                                <h4 className="font-medium">
                                  {competitor.firstName} {competitor.lastName}
                                </h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>{competitor.team}</span>
                                  <span>•</span>
                                  <span>{competitor.category}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={statusInfo.color}>
                                <statusInfo.icon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                              {competitor.result && (
                                <Badge className="bg-success text-success-foreground text-lg px-3">
                                  {competitor.result} pkt
                                </Badge>
                              )}
                            </div>
                          </div>

                          {selectedCompetition === 'pistol' && (
                            <div className="space-y-3">
                              <Label>Wyniki strzelania (5 strzałów)</Label>
                              <div className="grid grid-cols-5 gap-2">
                                {competitor.scores.map((score, index) => (
                                  <div key={index} className="space-y-1">
                                    <Label className="text-xs">Strzał {index + 1}</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      max="20"
                                      value={score || ''}
                                      onChange={(e) => updateCompetitorScore(
                                        competitor.id, 
                                        index, 
                                        parseInt(e.target.value) || 0
                                      )}
                                      placeholder="0-20"
                                      disabled={competitor.status === 'dns' || competitor.status === 'dq'}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updateCompetitorStatus(competitor.id, 'dns')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                DNS
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => updateCompetitorStatus(competitor.id, 'dq')}
                              >
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                DQ
                              </Button>
                            </div>
                            <Button variant="success" size="sm">
                              <Save className="h-4 w-4 mr-1" />
                              Zapisz wynik
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="startlist" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lista startowa - {currentCompetition?.name}</CardTitle>
                  <CardDescription>
                    Przegląd wszystkich zawodników w konkurencji
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {competitors.map((competitor) => {
                      const statusInfo = getStatusInfo(competitor.status);
                      return (
                        <div key={competitor.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-primary-light flex items-center justify-center text-sm font-bold text-primary">
                              {competitor.startNumber}
                            </div>
                            <div>
                              <p className="font-medium">
                                {competitor.firstName} {competitor.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {competitor.team} • {competitor.category}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {competitor.result && (
                              <span className="font-bold text-primary">{competitor.result} pkt</span>
                            )}
                            <Badge className={statusInfo.color}>
                              <statusInfo.icon className="h-3 w-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {competitors.filter(c => c.status === 'finished').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Zakończonych</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-warning">
                        {competitors.filter(c => c.status === 'waiting' || c.status === 'competing').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Oczekujących</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-destructive">
                        {competitors.filter(c => c.status === 'dns' || c.status === 'dq').length}
                      </p>
                      <p className="text-sm text-muted-foreground">DNS/DQ</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Karta sędziowska</CardTitle>
                  <CardDescription>
                    Podsumowanie konkurencji do wydruku
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>Konkurencja:</Label>
                      <p className="font-medium">{currentCompetition?.name}</p>
                    </div>
                    <div>
                      <Label>Data:</Label>
                      <p className="font-medium">15 października 2024</p>
                    </div>
                    <div>
                      <Label>Sędzia:</Label>
                      <p className="font-medium">Jan Sędziowski</p>
                    </div>
                    <div>
                      <Label>Liczba zawodników:</Label>
                      <p className="font-medium">{competitors.length}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Camera className="h-4 w-4 mr-2" />
                      Generuj QR kod
                    </Button>
                    <Button variant="competition" className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Eksportuj kartę
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

export default JudgePanel;