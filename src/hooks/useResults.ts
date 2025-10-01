import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Result {
  id: string;
  registration_id: string;
  competition_id: string;
  attempt_number: number;
  raw_value: number | null;
  processed_value: number | null;
  time_value: string | null;
  status: string;
  notes: string | null;
  recorded_by: string | null;
  recorded_at: string;
  registrations: {
    start_number: number | null;
    participants: {
      first_name: string;
      last_name: string;
    };
    teams: {
      name: string;
    };
    age_categories: {
      name: string;
    };
  };
}

export function useResults(competitionId?: string) {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadResults = async () => {
    try {
      let query = supabase
        .from('results')
        .select(`
          *,
          registrations (
            start_number,
            participants (first_name, last_name),
            teams (name),
            age_categories (name)
          )
        `)
        .order('recorded_at', { ascending: false });

      if (competitionId) {
        query = query.eq('competition_id', competitionId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setResults(data as any || []);
    } catch (error) {
      console.error('Error loading results:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się załadować wyników",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveResult = async (
    registrationId: string,
    competitionId: string,
    attemptNumber: number,
    value: number,
    status: string = 'valid'
  ) => {
    try {
      const { error } = await supabase
        .from('results')
        .upsert({
          registration_id: registrationId,
          competition_id: competitionId,
          attempt_number: attemptNumber,
          raw_value: value,
          processed_value: value,
          status: status as any,
          recorded_at: new Date().toISOString()
        } as any, {
          onConflict: 'registration_id,competition_id,attempt_number'
        });

      if (error) throw error;

      toast({
        title: "Zapisano",
        description: "Wynik został zapisany",
      });

      await loadResults();
    } catch (error) {
      console.error('Error saving result:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać wyniku",
        variant: "destructive"
      });
    }
  };

  const markDNS = async (registrationId: string, competitionId: string) => {
    try {
      const { error } = await supabase
        .from('results')
        .upsert({
          registration_id: registrationId,
          competition_id: competitionId,
          attempt_number: 1,
          status: 'dns' as any,
          recorded_at: new Date().toISOString()
        } as any, {
          onConflict: 'registration_id,competition_id,attempt_number'
        });

      if (error) throw error;

      toast({
        title: "DNS",
        description: "Oznaczono jako nieobecny",
      });

      await loadResults();
    } catch (error) {
      console.error('Error marking DNS:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się oznaczyć DNS",
        variant: "destructive"
      });
    }
  };

  const markDQ = async (registrationId: string, competitionId: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('results')
        .upsert({
          registration_id: registrationId,
          competition_id: competitionId,
          attempt_number: 1,
          status: 'dq' as any,
          notes,
          recorded_at: new Date().toISOString()
        } as any, {
          onConflict: 'registration_id,competition_id,attempt_number'
        });

      if (error) throw error;

      toast({
        title: "DQ",
        description: "Oznaczono jako zdyskwalifikowany",
      });

      await loadResults();
    } catch (error) {
      console.error('Error marking DQ:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się oznaczyć DQ",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadResults();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('results-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'results'
      }, () => {
        loadResults();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [competitionId]);

  return { 
    results, 
    loading, 
    refetch: loadResults,
    saveResult,
    markDNS,
    markDQ
  };
}