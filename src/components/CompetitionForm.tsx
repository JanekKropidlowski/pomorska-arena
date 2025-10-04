import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, X } from "lucide-react";

interface CompetitionFormProps {
  eventId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CompetitionForm: React.FC<CompetitionFormProps> = ({ eventId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'individual', // individual, team, relay
    scoring_type: 'points', // points, time, distance
    max_participants: '',
    rules: '',
    equipment: '',
    duration_minutes: '',
    gender_restriction: 'both', // male, female, both
    age_category: 'all', // all, youth, adult, senior
    is_qualifying: false,
    qualifying_criteria: ''
  });

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('competitions')
        .insert({
          event_id: eventId,
          name: formData.name,
          description: formData.description,
          type: formData.type,
          scoring_type: formData.scoring_type,
          max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
          rules: formData.rules,
          equipment: formData.equipment,
          duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
          gender_restriction: formData.gender_restriction,
          age_category: formData.age_category,
          is_qualifying: formData.is_qualifying,
          qualifying_criteria: formData.qualifying_criteria
        });

      if (error) throw error;

      toast({
        title: "Sukces!",
        description: "Konkurencja została dodana do wydarzenia",
      });

      onSuccess();
    } catch (error) {
      console.error('Error adding competition:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się dodać konkurencji",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Dodaj nową konkurencję</CardTitle>
        <CardDescription>
          Wypełnij szczegóły konkurencji dla tego wydarzenia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nazwa konkurencji *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="np. Strzelectwo - broń krótka"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Typ konkurencji *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Indywidualna</SelectItem>
                  <SelectItem value="team">Drużynowa</SelectItem>
                  <SelectItem value="relay">Sztafeta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scoring_type">Typ punktowania *</Label>
              <Select value={formData.scoring_type} onValueChange={(value) => setFormData({...formData, scoring_type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz typ punktowania" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="points">Punkty</SelectItem>
                  <SelectItem value="time">Czas</SelectItem>
                  <SelectItem value="distance">Odległość</SelectItem>
                  <SelectItem value="accuracy">Celność</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_participants">Maksymalna liczba uczestników</Label>
              <Input
                id="max_participants"
                type="number"
                value={formData.max_participants}
                onChange={(e) => setFormData({...formData, max_participants: e.target.value})}
                placeholder="np. 50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender_restriction">Ograniczenia płci</Label>
              <Select value={formData.gender_restriction} onValueChange={(value) => setFormData({...formData, gender_restriction: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz ograniczenia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Bez ograniczeń</SelectItem>
                  <SelectItem value="male">Tylko mężczyźni</SelectItem>
                  <SelectItem value="female">Tylko kobiety</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age_category">Kategoria wiekowa</Label>
              <Select value={formData.age_category} onValueChange={(value) => setFormData({...formData, age_category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz kategorię" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie kategorie</SelectItem>
                  <SelectItem value="youth">Młodzież (do 18 lat)</SelectItem>
                  <SelectItem value="adult">Dorośli (18-35 lat)</SelectItem>
                  <SelectItem value="senior">Seniorzy (35+ lat)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Czas trwania (minuty)</Label>
              <Input
                id="duration_minutes"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})}
                placeholder="np. 60"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment">Wymagany sprzęt</Label>
              <Input
                id="equipment"
                value={formData.equipment}
                onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                placeholder="np. Broń krótka, amunicja"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Opis konkurencji</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Szczegółowy opis konkurencji, zasad i wymagań"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rules">Regulamin konkurencji</Label>
            <Textarea
              id="rules"
              value={formData.rules}
              onChange={(e) => setFormData({...formData, rules: e.target.value})}
              placeholder="Szczegółowe zasady i regulamin konkurencji"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualifying_criteria">Kryteria kwalifikacyjne</Label>
            <Textarea
              id="qualifying_criteria"
              value={formData.qualifying_criteria}
              onChange={(e) => setFormData({...formData, qualifying_criteria: e.target.value})}
              placeholder="Warunki kwalifikacji do tej konkurencji"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Anuluj
            </Button>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Dodaj konkurencję
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompetitionForm;
