import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  FileText,
  Clock,
  Mail,
  Phone,
  Building,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  Download,
  File
} from 'lucide-react';

interface Event {
  id: string;
  name: string;
  slug?: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  status: string;
  event_type: string;
  is_cyclic: boolean;
  organizer?: string;
  contact_email?: string;
  contact_phone?: string;
  registration_deadline?: string;
  max_participants?: number;
  max_teams?: number;
  team_max_size?: number;
  team_required_girls?: number;
  team_required_boys?: number;
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
}

interface Competition {
  id: string;
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
  event_id: string;
}

interface EventEditFormProps {
  event: Event;
  competitions: Competition[];
  onSave: (eventData: Event, competitionsData: Competition[]) => Promise<void>;
  onCancel: () => void;
}

export const EventEditForm = ({ event, competitions, onSave, onCancel }: EventEditFormProps) => {
  console.log('🎯 EventEditForm rendered with event:', event?.name, 'competitions:', competitions?.length);
  const [formData, setFormData] = useState<Event>(event);
  const [competitionsData, setCompetitionsData] = useState<Competition[]>(competitions);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Funkcja do generowania slug z nazwy
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[ąćęłńóśźż]/g, (char) => {
        const map = {
          'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
          'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z'
        };
        return map[char] || char;
      })
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (field: keyof Event, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCompetitionChange = (index: number, field: keyof Competition, value: any) => {
    setCompetitionsData(prev => 
      prev.map((comp, i) => 
        i === index ? { ...comp, [field]: value } : comp
      )
    );
  };

  const addCompetition = () => {
    const newCompetition: Competition = {
      id: `comp-${Date.now()}`,
      name: '',
      description: '',
      rules: '',
      metric_type: 'points',
      aggregation_type: 'sum',
      attempts_count: null,
      is_team_competition: false,
      team_size: null,
      scoring_formula: '',
      penalty_rules: '',
      sort_order: competitionsData.length + 1,
      event_id: event.id
    };
    setCompetitionsData(prev => [...prev, newCompetition]);
  };

  const removeCompetition = (index: number) => {
    setCompetitionsData(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (file: File, field: 'regulations_pdf_url' | 'patronat_pdf_url' | 'organizatorzy_pdf_url') => {
    try {
      // W rzeczywistej aplikacji tutaj byłoby wgrywanie do Supabase Storage
      // Na razie symulujemy URL
      const mockUrl = `/uploads/${field}/${file.name}`;
      handleInputChange(field, mockUrl);
      
      toast({
        title: "Plik wgrany",
        description: `Plik ${file.name} został wgrany pomyślnie`,
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się wgrać pliku",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(formData, competitionsData);
      toast({
        title: "Sukces!",
        description: "Wydarzenie zostało zaktualizowane",
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać zmian",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const formatDateForInput = (dateString: string) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      {/* Event Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Podstawowe informacje
          </CardTitle>
          <CardDescription>
            Edytuj podstawowe dane wydarzenia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="mobile-grid gap-4">
            <div>
              <Label htmlFor="name">Nazwa wydarzenia *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  handleInputChange('name', e.target.value);
                  // Automatycznie generuj slug gdy zmienia się nazwa
                  if (!formData.slug || formData.slug === generateSlug(formData.name)) {
                    handleInputChange('slug', generateSlug(e.target.value));
                  }
                }}
                placeholder="np. II Mistrzostwa Województwa Pomorskiego"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="event_type">Typ wydarzenia</Label>
              <Select 
                value={formData.event_type} 
                onValueChange={(value) => handleInputChange('event_type', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="competition">Zawody</SelectItem>
                  <SelectItem value="tournament">Turniej</SelectItem>
                  <SelectItem value="championship">Mistrzostwa</SelectItem>
                  <SelectItem value="other">Inne</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="slug">Przyjazny adres URL (slug) *</Label>
            <Input
              id="slug"
              value={formData.slug || ''}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="np. ii-mistrzostwa-wojewodztwa-pomorskiego"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Używany w adresach URL. Tylko małe litery, cyfry i myślniki. 
              Przykład: /wydarzenie/{formData.slug || 'twoj-slug'}
            </p>
          </div>

          <div>
            <Label htmlFor="description">Opis wydarzenia</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Szczegółowy opis wydarzenia, regulamin, informacje dla uczestników..."
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div className="mobile-grid gap-4">
            <div>
              <Label htmlFor="location">Miejsce *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="np. Pomorska Arena, Gdańsk"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="organizer">Organizator</Label>
              <Input
                id="organizer"
                value={formData.organizer || ''}
                onChange={(e) => handleInputChange('organizer', e.target.value)}
                placeholder="np. Pomorskie Zrzeszenie LZS"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dates and Times */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daty i terminy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="mobile-grid gap-4">
            <div>
              <Label htmlFor="start_date">Data rozpoczęcia *</Label>
              <Input
                id="start_date"
                type="date"
                value={formatDateForInput(formData.start_date)}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="end_date">Data zakończenia</Label>
              <Input
                id="end_date"
                type="date"
                value={formatDateForInput(formData.end_date)}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="mobile-grid gap-4">
            <div>
              <Label htmlFor="registration_deadline">Termin zgłoszeń</Label>
              <Input
                id="registration_deadline"
                type="date"
                value={formData.registration_deadline ? formatDateForInput(formData.registration_deadline) : ''}
                onChange={(e) => handleInputChange('registration_deadline', e.target.value || null)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Projekt</SelectItem>
                  <SelectItem value="published">Opublikowane</SelectItem>
                  <SelectItem value="active">Aktywne</SelectItem>
                  <SelectItem value="completed">Zakończone</SelectItem>
                  <SelectItem value="archived">Zarchiwizowane</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Informacje kontaktowe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mobile-grid gap-4">
            <div>
              <Label htmlFor="contact_email">Email kontaktowy</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email || ''}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                placeholder="kontakt@lzs.pomorskie.pl"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="contact_phone">Telefon kontaktowy</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone || ''}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                placeholder="+48 123 456 789"
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="patron_honorowy">Patronat Honorowy</Label>
              <Input
                id="patron_honorowy"
                value={formData.patron_honorowy || ''}
                onChange={(e) => handleInputChange('patron_honorowy', e.target.value)}
                placeholder="np. Pomorski Kurator Oświaty"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="organizatorzy">Organizator i Współorganizatorzy</Label>
              <Textarea
                id="organizatorzy"
                value={formData.organizatorzy || ''}
                onChange={(e) => handleInputChange('organizatorzy', e.target.value)}
                placeholder="np. Pomorskie Zrzeszenie LZS&#10;Współorganizator: Powiatowy Zespół Szkół w Kłaninie"
                className="mt-1 min-h-[60px]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Osoby kontaktowe</h4>
            
            <div className="mobile-grid gap-4">
              <div>
                <Label htmlFor="contact_person_1_name">Osoba 1 - Imię i nazwisko</Label>
                <Input
                  id="contact_person_1_name"
                  value={formData.contact_person_1_name || ''}
                  onChange={(e) => handleInputChange('contact_person_1_name', e.target.value)}
                  placeholder="np. Wiesław Oberzig"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="contact_person_1_title">Osoba 1 - Stanowisko</Label>
                <Input
                  id="contact_person_1_title"
                  value={formData.contact_person_1_title || ''}
                  onChange={(e) => handleInputChange('contact_person_1_title', e.target.value)}
                  placeholder="np. Wiceprezes PZ LZS, nauczyciel PZS w Kłaninie"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="contact_person_1_phone">Osoba 1 - Telefon</Label>
                <Input
                  id="contact_person_1_phone"
                  value={formData.contact_person_1_phone || ''}
                  onChange={(e) => handleInputChange('contact_person_1_phone', e.target.value)}
                  placeholder="np. 608-341-880"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mobile-grid gap-4">
              <div>
                <Label htmlFor="contact_person_2_name">Osoba 2 - Imię i nazwisko</Label>
                <Input
                  id="contact_person_2_name"
                  value={formData.contact_person_2_name || ''}
                  onChange={(e) => handleInputChange('contact_person_2_name', e.target.value)}
                  placeholder="np. Jan Trofimowicz"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="contact_person_2_title">Osoba 2 - Stanowisko</Label>
                <Input
                  id="contact_person_2_title"
                  value={formData.contact_person_2_title || ''}
                  onChange={(e) => handleInputChange('contact_person_2_title', e.target.value)}
                  placeholder="np. Wiceprezes PZ LZS, nauczyciel w PZKZiU w Pucku"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="contact_person_2_phone">Osoba 2 - Telefon</Label>
                <Input
                  id="contact_person_2_phone"
                  value={formData.contact_person_2_phone || ''}
                  onChange={(e) => handleInputChange('contact_person_2_phone', e.target.value)}
                  placeholder="np. 508-738-161"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Dokumenty
          </CardTitle>
          <CardDescription>
            Wgraj regulamin, patronat i inne dokumenty
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="regulations_pdf">Regulamin wydarzenia (PDF)</Label>
              <div className="mt-2 flex items-center gap-4">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'regulations_pdf_url');
                  }}
                  className="flex-1"
                />
                {formData.regulations_pdf_url && (
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Wgrany</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(formData.regulations_pdf_url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="patronat_pdf">Patronat honorowy (PDF)</Label>
              <div className="mt-2 flex items-center gap-4">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'patronat_pdf_url');
                  }}
                  className="flex-1"
                />
                {formData.patronat_pdf_url && (
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Wgrany</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(formData.patronat_pdf_url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="organizatorzy_pdf">Organizatorzy (PDF)</Label>
              <div className="mt-2 flex items-center gap-4">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'organizatorzy_pdf_url');
                  }}
                  className="flex-1"
                />
                {formData.organizatorzy_pdf_url && (
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Wgrany</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(formData.organizatorzy_pdf_url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Limits and Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Limity i zasady
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="mobile-grid gap-4">
            <div>
              <Label htmlFor="max_participants">Maksymalna liczba uczestników</Label>
              <Input
                id="max_participants"
                type="number"
                value={formData.max_participants || ''}
                onChange={(e) => handleInputChange('max_participants', parseInt(e.target.value) || null)}
                placeholder="np. 120"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="max_teams">Maksymalna liczba drużyn</Label>
              <Input
                id="max_teams"
                type="number"
                value={formData.max_teams || ''}
                onChange={(e) => handleInputChange('max_teams', parseInt(e.target.value) || null)}
                placeholder="np. 20"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="team_max_size">Maksymalna liczba osób w drużynie</Label>
              <Input
                id="team_max_size"
                type="number"
                value={formData.team_max_size || ''}
                onChange={(e) => handleInputChange('team_max_size', parseInt(e.target.value) || null)}
                placeholder="np. 6"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="team_required_girls">Wymagana liczba dziewcząt</Label>
              <Input
                id="team_required_girls"
                type="number"
                value={formData.team_required_girls || ''}
                onChange={(e) => handleInputChange('team_required_girls', parseInt(e.target.value) || 0)}
                placeholder="np. 3"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="team_required_boys">Wymagana liczba chłopców</Label>
              <Input
                id="team_required_boys"
                type="number"
                value={formData.team_required_boys || ''}
                onChange={(e) => handleInputChange('team_required_boys', parseInt(e.target.value) || 0)}
                placeholder="np. 3"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="event_rules">Regulamin wydarzenia</Label>
            <Textarea
              id="event_rules"
              value={formData.event_rules || ''}
              onChange={(e) => handleInputChange('event_rules', e.target.value)}
              placeholder="Szczegółowy regulamin, zasady uczestnictwa, wymagania..."
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_cyclic"
              checked={formData.is_cyclic}
              onCheckedChange={(checked) => handleInputChange('is_cyclic', checked)}
            />
            <Label htmlFor="is_cyclic">Wydarzenie cykliczne</Label>
          </div>
        </CardContent>
      </Card>

      {/* Competitions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Konkurencje ({competitionsData.length})
              </CardTitle>
              <CardDescription>
                Zarządzaj konkurencjami w ramach wydarzenia
              </CardDescription>
            </div>
            <Button onClick={addCompetition} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Dodaj konkurencję
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {competitionsData.map((competition, index) => (
            <div key={competition.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Konkurencja #{index + 1}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeCompetition(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mobile-grid gap-4">
                <div>
                  <Label>Nazwa konkurencji *</Label>
                  <Input
                    value={competition.name}
                    onChange={(e) => handleCompetitionChange(index, 'name', e.target.value)}
                    placeholder="np. Strzelectwo"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Typ metryki *</Label>
                  <Select 
                    value={competition.metric_type} 
                    onValueChange={(value) => handleCompetitionChange(index, 'metric_type', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="points">Punkty</SelectItem>
                      <SelectItem value="time">Czas</SelectItem>
                      <SelectItem value="distance">Odległość</SelectItem>
                      <SelectItem value="count">Liczba</SelectItem>
                      <SelectItem value="accuracy">Dokładność</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Typ agregacji *</Label>
                  <Select 
                    value={competition.aggregation_type} 
                    onValueChange={(value) => handleCompetitionChange(index, 'aggregation_type', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sum">Suma</SelectItem>
                      <SelectItem value="best_attempt">Najlepszy wynik</SelectItem>
                      <SelectItem value="average">Średnia</SelectItem>
                      <SelectItem value="top_n">Top N</SelectItem>
                      <SelectItem value="drop_worst">Odrzuć najgorszy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Liczba prób</Label>
                  <Input
                    type="number"
                    value={competition.attempts_count || ''}
                    onChange={(e) => handleCompetitionChange(index, 'attempts_count', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="np. 5"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Kolejność</Label>
                  <Input
                    type="number"
                    value={competition.sort_order || ''}
                    onChange={(e) => handleCompetitionChange(index, 'sort_order', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="np. 1"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="mobile-grid gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={competition.is_team_competition || false}
                    onCheckedChange={(checked) => handleCompetitionChange(index, 'is_team_competition', checked)}
                  />
                  <Label>Konkurencja drużynowa</Label>
                </div>

                {competition.is_team_competition && (
                  <div>
                    <Label>Rozmiar drużyny</Label>
                    <Input
                      type="number"
                      value={competition.team_size || ''}
                      onChange={(e) => handleCompetitionChange(index, 'team_size', e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="np. 6"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              <div className="mobile-grid gap-4">
                <div>
                  <Label>Formuła punktacji</Label>
                  <Input
                    value={competition.scoring_formula || ''}
                    onChange={(e) => handleCompetitionChange(index, 'scoring_formula', e.target.value)}
                    placeholder="np. sum(points)"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Zasady kar</Label>
                  <Input
                    value={competition.penalty_rules || ''}
                    onChange={(e) => handleCompetitionChange(index, 'penalty_rules', e.target.value)}
                    placeholder="np. Brak punktów za strzały poza celem"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label>Opis konkurencji</Label>
                <Textarea
                  value={competition.description}
                  onChange={(e) => handleCompetitionChange(index, 'description', e.target.value)}
                  placeholder="Szczegółowy opis konkurencji, zasady, wymagania..."
                  className="mt-1 min-h-[80px]"
                />
              </div>
              
              <div>
                <Label>Zasady i regulamin</Label>
                <Textarea
                  value={competition.rules}
                  onChange={(e) => handleCompetitionChange(index, 'rules', e.target.value)}
                  placeholder="Szczegółowe zasady, kryteria oceny, rozwiązywanie remisów..."
                  className="mt-1 min-h-[80px]"
                />
              </div>
            </div>
          ))}
          
          {competitionsData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Brak konkurencji</p>
              <p className="text-sm">Dodaj konkurencje dla tego wydarzenia</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-end pt-6 border-t">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Anuluj
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Zapisywanie..." : "Zapisz zmiany"}
        </Button>
      </div>
    </div>
  );
};
