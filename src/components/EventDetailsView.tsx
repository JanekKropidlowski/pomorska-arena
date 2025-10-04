import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  Users,
  Trophy,
  BarChart3,
  Plus,
  Edit,
  Download,
  Eye,
  LogIn,
  X,
  CheckCircle,
  Clock,
  Mail,
  User,
  FileText,
  Trash2,
  Globe
} from "lucide-react";
import CompetitionForm from "./CompetitionForm";
import TeamUserManagement from "./TeamUserManagement";
import { PDFGenerator } from "./PDFGenerator";

interface Event {
  id: string;
  name: string;
  description: string | null;
  location: string;
  start_date: string;
  end_date: string | null;
  registration_deadline: string | null;
  status: string;
  event_type: string;
  is_cyclic: boolean;
  max_participants: number | null;
  max_teams: number | null;
  organizer: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  regulations_pdf_url: string | null;
  logo_url: string | null;
  created_at?: string;
  updated_at?: string;
}

interface Team {
  id: string;
  name: string;
  type: string;
  supervisor_name: string;
  supervisor_email: string;
  supervisor_phone: string | null;
  organization: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  status: string;
  created_at: string;
  event_id: string;
}

interface Competition {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  rules: string | null;
  metric_type: string;
  aggregation_type: string;
  attempts_count: number | null;
  is_team_competition: boolean | null;
  team_size: number | null;
  scoring_formula: string | null;
  penalty_rules: string | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

interface EventDetailsViewProps {
  event: Event;
  teams: Team[];
  onClose: () => void;
  onAddTeam: () => void;
  onLoadTeams: () => void;
  onEditEvent?: (event: Event) => void;
}

const EventDetailsView: React.FC<EventDetailsViewProps> = ({
  event,
  teams,
  onClose,
  onAddTeam,
  onLoadTeams,
  onEditEvent
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [showCompetitionForm, setShowCompetitionForm] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);
  const [showCompetitionEditModal, setShowCompetitionEditModal] = useState(false);
  const [selectedTeamForUsers, setSelectedTeamForUsers] = useState<Team | null>(null);
  const [loadingCompetitions, setLoadingCompetitions] = useState(false);

  useEffect(() => {
    if (event) {
      loadCompetitions();
    }
  }, [event]);

  const getEventStatusInfo = (status: string) => {
    switch (status) {
      case 'draft':
        return { label: 'Projekt', color: 'bg-muted text-muted-foreground', icon: Edit };
      case 'published':
        return { label: 'Opublikowane', color: 'bg-primary text-primary-foreground', icon: Globe };
      case 'active':
        return { label: 'Aktywne', color: 'bg-success text-success-foreground', icon: CheckCircle };
      case 'completed':
        return { label: 'Zakończone', color: 'bg-gray-500 text-white', icon: Trophy };
      case 'cancelled':
        return { label: 'Anulowane', color: 'bg-destructive text-destructive-foreground', icon: X };
      default:
        return { label: 'Nieznany', color: 'bg-muted text-muted-foreground', icon: Clock };
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'shooting': return 'Strzelectwo';
      case 'athletics': return 'Lekkoatletyka';
      case 'football': return 'Piłka nożna';
      case 'basketball': return 'Koszykówka';
      case 'volleyball': return 'Siatkówka';
      case 'other': return 'Inne';
      default: return 'Nieznany';
    }
  };

  const openEditCompetition = (competition: Competition) => {
    console.log('🖱️ Otwieram edycję konkurencji', competition?.id, competition?.name);
    setEditingCompetition(competition);
    setShowCompetitionEditModal(true);
    setTimeout(() => {
      console.log('🔍 Stan modala', { show: true, editingCompetitionName: competition?.name });
    }, 0);
  };

  const saveCompetition = async () => {
    if (!editingCompetition) return;
    try {
      const { id, ...rest } = editingCompetition as any;
      const { error } = await supabase.from('competitions').update(rest).eq('id', id);
      if (error) throw error;
      toast({ title: 'Zapisano konkurencję', description: editingCompetition.name });
      setShowCompetitionEditModal(false);
      await loadCompetitions();
    } catch (err: any) {
      toast({ title: 'Błąd zapisu', description: err.message, variant: 'destructive' });
    }
  };

  const loadCompetitions = async () => {
    setLoadingCompetitions(true);
    try {
      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .eq('event_id', event.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCompetitions(data || []);
    } catch (error) {
      console.error('Error loading competitions:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się załadować konkurencji",
        variant: "destructive"
      });
    } finally {
      setLoadingCompetitions(false);
    }
  };

  const handleCompetitionSuccess = () => {
    setShowCompetitionForm(false);
    loadCompetitions();
  };

  const handleTeamUserManagement = (team: Team) => {
    setSelectedTeamForUsers(team);
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
        return { label: 'Odrzucone', color: 'bg-destructive text-destructive-foreground', icon: X };
      default:
        return { label: 'Nieznany', color: 'bg-muted text-muted-foreground', icon: Clock };
    }
  };

  const statusInfo = getEventStatusInfo(event.status);
  const StatusIcon = statusInfo.icon;

  const eventTeams = teams.filter(t => t.event_id === event.id);
  const pendingTeams = eventTeams.filter(t => t.status === 'submitted').length;
  const acceptedTeams = eventTeams.filter(t => t.status === 'accepted').length;

  return (
    <div className="space-y-4">
      {/* Event Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onClose}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Wróć do listy
              </Button>
              <div>
                <CardTitle className="text-2xl">{event.name}</CardTitle>
                <CardDescription>
                  {event.location} • {new Date(event.start_date).toLocaleDateString('pl-PL')}
                </CardDescription>
              </div>
            </div>
            <Badge className={statusInfo.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusInfo.label}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Event Sub-tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Przegląd</TabsTrigger>
          <TabsTrigger value="teams">Drużyny</TabsTrigger>
          <TabsTrigger value="competitions">Konkurencje</TabsTrigger>
          <TabsTrigger value="reports">Raporty</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Drużyny
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {eventTeams.length}
                </div>
                <p className="text-sm text-muted-foreground">Zarejestrowane drużyny</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-600" />
                  Uczestnicy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {eventTeams.length * 6} {/* Assuming 6 participants per team for now */}
                </div>
                <p className="text-sm text-muted-foreground">Łączna liczba uczestników</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {acceptedTeams}
                </div>
                <p className="text-sm text-muted-foreground">Zaakceptowane drużyny</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Drużyny - {event.name}</CardTitle>
                  <CardDescription>
                    Zarządzaj drużynami zarejestrowanymi do tego wydarzenia
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Eksport drużyn
                  </Button>
                  <Button 
                    variant="competition"
                    onClick={onAddTeam}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj drużynę
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {eventTeams.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Brak zarejestrowanych drużyn</p>
                  <p className="text-sm text-muted-foreground">
                    Dodaj drużynę lub poczekaj na zgłoszenia
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Statistics Bar */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{eventTeams.length}</div>
                      <div className="text-sm text-blue-800">Wszystkie drużyny</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {pendingTeams}
                      </div>
                      <div className="text-sm text-orange-800">Oczekujące</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {acceptedTeams}
                      </div>
                      <div className="text-sm text-green-800">Zaakceptowane</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {eventTeams.filter(t => t.status === 'rejected').length}
                      </div>
                      <div className="text-sm text-red-800">Odrzucone</div>
                    </div>
                  </div>

                  {/* Teams List */}
                  {eventTeams.map((team) => {
                    const teamStatusInfo = getStatusInfo(team.status);

                    return (
                      <Card key={team.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-2">{team.name}</CardTitle>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {team.type}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {team.supervisor_name}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Mail className="h-4 w-4" />
                                  {team.supervisor_email}
                                </span>
                              </div>
                            </div>
                            <Badge className={teamStatusInfo.color}>
                              <teamStatusInfo.icon className="h-3 w-3 mr-1" />
                              {teamStatusInfo.label}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <h5 className="font-medium text-sm">Dane kontaktowe</h5>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div>📧 {team.supervisor_email}</div>
                                <div>📞 {team.supervisor_phone || 'Brak numeru'}</div>
                                <div>🏢 {team.organization || 'Brak organizacji'}</div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium text-sm">Informacje o drużynie</h5>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div>👥 Typ: {team.type}</div>
                                <div>📅 Zgłoszono: {new Date(team.created_at).toLocaleDateString('pl-PL')}</div>
                                <div>🏆 Status: {teamStatusInfo.label}</div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2 pt-4 border-t">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/druzyna/${team.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Zobacz szczegóły
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/druzyna/${team.id}`)}
                            >
                              <LogIn className="h-4 w-4 mr-1" />
                              Zaloguj jako drużyna
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edytuj dane
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Pobierz PDF
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Wyślij email
                            </Button>
                            
                            {/* Status Change Buttons */}
                            {team.status !== 'accepted' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => { /* supabase update status */ }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Zaakceptuj
                              </Button>
                            )}
                            
                            {team.status !== 'rejected' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => { /* supabase update status */ }}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Odrzuć
                              </Button>
                            )}
                            
                            {team.status === 'accepted' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-orange-600 hover:text-orange-700"
                                onClick={() => { /* supabase update status */ }}
                              >
                                <Clock className="h-4 w-4 mr-1" />
                                Cofnij akceptację
                              </Button>
                            )}
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Usuń
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {showCompetitionEditModal && editingCompetition && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Edytuj konkurencję: {editingCompetition.name}</h3>
                  <Button variant="outline" size="sm" onClick={() => setShowCompetitionEditModal(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nazwa</Label>
                    <Input
                      value={editingCompetition.name || ''}
                      onChange={(e) => setEditingCompetition({ ...editingCompetition, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Typ metryki</Label>
                    <Input
                      value={editingCompetition.metric_type || ''}
                      onChange={(e) => setEditingCompetition({ ...editingCompetition, metric_type: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Agregacja</Label>
                    <Input
                      value={editingCompetition.aggregation_type || ''}
                      onChange={(e) => setEditingCompetition({ ...editingCompetition, aggregation_type: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Liczba prób</Label>
                    <Input
                      type="number"
                      value={editingCompetition.attempts_count ?? ''}
                      onChange={(e) => setEditingCompetition({ ...editingCompetition, attempts_count: e.target.value === '' ? null : Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Rozmiar drużyny</Label>
                    <Input
                      type="number"
                      value={editingCompetition.team_size ?? ''}
                      onChange={(e) => setEditingCompetition({ ...editingCompetition, team_size: e.target.value === '' ? null : Number(e.target.value) })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Regulamin</Label>
                    <Textarea
                      value={editingCompetition.rules || ''}
                      onChange={(e) => setEditingCompetition({ ...editingCompetition, rules: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Formuła punktacji</Label>
                    <Input
                      value={editingCompetition.scoring_formula || ''}
                      onChange={(e) => setEditingCompetition({ ...editingCompetition, scoring_formula: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Zasady kar</Label>
                    <Input
                      value={editingCompetition.penalty_rules || ''}
                      onChange={(e) => setEditingCompetition({ ...editingCompetition, penalty_rules: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setShowCompetitionEditModal(false)}>Anuluj</Button>
                  <Button onClick={saveCompetition}>Zapisz</Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="competitions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Konkurencje - {event.name}</CardTitle>
                  <CardDescription>
                    Zarządzaj konkurencjami dla tego wydarzenia
                  </CardDescription>
                </div>
                <Button onClick={() => setShowCompetitionForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Dodaj konkurencję
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showCompetitionForm ? (
                <CompetitionForm
                  eventId={event.id}
                  onSuccess={handleCompetitionSuccess}
                  onCancel={() => setShowCompetitionForm(false)}
                />
              ) : loadingCompetitions ? (
                <div className="text-center py-8">Ładowanie konkurencji...</div>
              ) : competitions.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Brak zdefiniowanych konkurencji</p>
                  <Button onClick={() => setShowCompetitionForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj pierwszą konkurencję
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {competitions.map((competition) => (
                    <Card key={competition.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{competition.name}</CardTitle>
                            <CardDescription>
                              {competition.description || 'Brak opisu'}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {competition.is_team_competition ? 'Drużynowa' : 'Indywidualna'}
                            </Badge>
                            <Badge variant="outline">
                              {competition.metric_type === 'points' ? 'Punkty' :
                               competition.metric_type === 'time' ? 'Czas' :
                               competition.metric_type === 'distance' ? 'Odległość' :
                               competition.metric_type === 'count' ? 'Liczba' : 'Dokładność'}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <h5 className="font-medium text-sm">Szczegóły konkurencji</h5>
                            <div className="text-sm text-muted-foreground space-y-1">
                              {competition.attempts_count && (
                                <div>🎯 Liczba prób: {competition.attempts_count}</div>
                              )}
                              {competition.team_size && (
                                <div>👥 Rozmiar drużyny: {competition.team_size}</div>
                              )}
                              <div>📊 Typ: {competition.metric_type === 'points' ? 'Punkty' :
                                               competition.metric_type === 'time' ? 'Czas' :
                                               competition.metric_type === 'distance' ? 'Odległość' :
                                               competition.metric_type === 'count' ? 'Liczba' : 'Dokładność'}</div>
                              <div>🔢 Agregacja: {competition.aggregation_type === 'sum' ? 'Suma' :
                                                    competition.aggregation_type === 'best_attempt' ? 'Najlepszy wynik' :
                                                    competition.aggregation_type === 'average' ? 'Średnia' :
                                                    competition.aggregation_type === 'top_n' ? 'Top N' : 'Odrzuć najgorszy'}</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h5 className="font-medium text-sm">Wymagania</h5>
                            <div className="text-sm text-muted-foreground space-y-1">
                              {competition.scoring_formula && (
                                <div>📐 Formuła: {competition.scoring_formula}</div>
                              )}
                              {competition.penalty_rules && (
                                <div>⚠️ Kary: {competition.penalty_rules}</div>
                              )}
                              {competition.sort_order && (
                                <div>🔢 Kolejność: {competition.sort_order}</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {competition.rules && (
                          <div className="space-y-2 mb-4">
                            <h5 className="font-medium text-sm">Regulamin</h5>
                            <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                              {competition.rules}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-4 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); openEditCompetition(competition); }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edytuj
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Usuń
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Raporty - {event.name}</CardTitle>
              <CardDescription>
                Generuj raporty i eksportuj dane dla tego wydarzenia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Lista drużyn
                    </CardTitle>
                    <CardDescription>Pełna lista zarejestrowanych drużyn</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PDFGenerator
                      title="Lista drużyn"
                      content={<div>Lista drużyn</div>}
                      filename={`druzyny_${event.id}.pdf`}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      Lista uczestników
                    </CardTitle>
                    <CardDescription>Wszyscy zawodnicy z drużyn</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PDFGenerator
                      title="Lista drużyn"
                      content={<div>Lista drużyn</div>}
                      filename={`druzyny_${event.id}.pdf`}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      Statystyki
                    </CardTitle>
                    <CardDescription>Analiza danych wydarzenia</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Pobierz Excel
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      Numery startowe
                    </CardTitle>
                    <CardDescription>Numery dla zawodników</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PDFGenerator
                      title="Numery startowe"
                      content={<div>Numery startowe</div>}
                      filename={`numery_${event.id}.pdf`}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-red-600" />
                      Karty sędziowskie
                    </CardTitle>
                    <CardDescription>Dokumenty dla sędziów</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PDFGenerator
                      title="Karty sędziowskie"
                      content={<div>Karty sędziowskie</div>}
                      filename={`karty_sedziowskie_${event.id}.pdf`}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-indigo-600" />
                      Raport końcowy
                    </CardTitle>
                    <CardDescription>Podsumowanie wydarzenia</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PDFGenerator
                      title="Raport końcowy"
                      content={<div>Raport końcowy</div>}
                      filename={`raport_${event.id}.pdf`}
                    />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventDetailsView;
