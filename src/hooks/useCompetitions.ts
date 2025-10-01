import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Competition {
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
}

export function useCompetitions(eventId?: string) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadCompetitions = async () => {
    try {
      let query = supabase
        .from('competitions')
        .select('*')
        .order('sort_order', { ascending: true });

      if (eventId) {
        query = query.eq('event_id', eventId);
      }

      const { data, error } = await query;

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
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompetitions();
  }, [eventId]);

  return { competitions, loading, refetch: loadCompetitions };
}