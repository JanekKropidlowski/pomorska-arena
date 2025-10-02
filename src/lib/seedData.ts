import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AggregationType = Database['public']['Enums']['aggregation_type'];
type MetricType = Database['public']['Enums']['metric_type'];
type Gender = Database['public']['Enums']['gender'];

// Seed II Mistrzostwa Województwa Pomorskiego "W Dychę"
export async function seedCyclicEvents() {
  try {
    console.log('Starting to seed II Mistrzostwa W Dychę event...');

    // Event: II Mistrzostwa Województwa Pomorskiego "W Dychę"
    const { data: wDycheEvent, error: wDycheError } = await supabase
      .from('events')
      .insert({
        name: 'II Mistrzostwa Województwa Pomorskiego Szkół Ponadpodstawowych w Strzelectwie „W Dychę" o Puchar Prezesa Pomorskiego Zrzeszenia LZS',
        description: `Zawody składają się z trzech obowiązkowych konkurencji: strzelectwa, biegu przełajowego oraz rzutu granatem.

Konkurencja strzelecka: Każdy zawodnik oddaje 5 strzałów z broni krótkiej i 5 strzałów z broni długiej w pozycji stojącej z odległości 5 metrów. Przed zawodami wykonuje 5 strzałów próbnych.

Bieg przełajowy: Dystans około 1000 metrów.

Rzut granatem: Dziewczęta rzucają z odległości 15 metrów, chłopcy z 20 metrów. Każdy zawodnik oddaje 3 próby.

Każda szkoła wystawia drużynę składającą się z 6 zawodników: 3 dziewcząt i 3 chłopców. W klasyfikacji drużynowej liczą się wyniki wszystkich 6 zawodników.

Punktacja drużynowa: 1→15pkt, 2→13pkt, 3→11pkt, 4→10pkt, 5→9pkt, 6→8pkt, 7→7pkt, 8→6pkt, 9→5pkt, 10→4pkt, 11→3pkt, 12→2pkt, 13+→1pkt

Organizatorzy: Pomorskie Zrzeszenie LZS, Muzeum Sportu Wiejskiego w Łebczu, Powiatowy Zespół Szkół w Kłaninie, Powiatowe Centrum Kształcenia Zawodowego i Ustawicznego w Pucku, Starostwo Powiatowe w Pucku.

Uroczyste otwarcie: 10:00, Biuro zawodów czynne od 9:00.

Warunki udziału: Przesłanie listy zgłoszeniowej do 3 października 2025 roku. Każdy uczestnik musi posiadać legitymację szkolną. Zdyskwalifikowanie całej drużyny w przypadku udziału osoby niebędącej uczniem zgłaszanej szkoły.

Nagrody: Medale uczestnictwa dla wszystkich, dyplomy i puchary dla najlepszych trzech zawodników w każdej konkurencji, dyplomy i nagrody rzeczowe (sprzęt sportowy) dla drużyn, ciepły posiłek oraz bezpłatne zwiedzanie Muzeum Sportu Wiejskiego w Łebczu.`,
        location: 'Powiatowy Zespół Szkół w Kłaninie (Powiat Pucki), ul. Szkolna 4',
        start_date: '2025-10-10',
        end_date: '2025-10-10',
        registration_deadline: '2025-10-03',
        event_type: 'shooting' as const,
        is_cyclic: true,
        cyclic_month: 10,
        status: 'active',
        regulations_pdf_url: null,
        logo_url: '/lzs-logo.png',
        max_participants: 200,
        max_teams: 40,
        organizer: 'Pomorskie Zrzeszenie LZS, Muzeum Sportu Wiejskiego w Łebczu, PZS w Kłaninie, PCKZiU w Pucku, Starostwo Powiatowe w Pucku',
        contact_email: 'kontakt@lzs-pomorski.pl',
        contact_phone: '+48 58 123 456 789'
      })
      .select()
      .single();

    if (wDycheError) throw wDycheError;
    console.log('Created W Dychę event:', wDycheEvent.id);

    // Age Categories - Szkoły Ponadpodstawowe (students aged 15-19)
    const { data: ageCategory, error: ageCategoryError } = await supabase
      .from('age_categories')
      .insert({
        event_id: wDycheEvent.id,
        name: 'Szkoły Ponadpodstawowe',
        min_age: 15,
        max_age: 19,
        gender: 'mixed' as Gender
      })
      .select()
      .single();

    if (ageCategoryError) throw ageCategoryError;
    console.log('Created age category:', ageCategory.id);

    // Competitions
    const competitions = [
      {
        event_id: wDycheEvent.id,
        name: 'Strzelectwo - Broń Krótka',
        description: '5 strzałów z broni krótkiej w pozycji stojącej z odległości 5 metrów. Przed zawodami 5 strzałów próbnych.',
        rules: 'Każdy zawodnik oddaje 5 strzałów. Punktacja: suma punktów ze wszystkich strzałów.',
        metric_type: 'points' as MetricType,
        aggregation_type: 'sum' as AggregationType,
        attempts_count: 5,
        is_team_competition: false,
        team_size: 1,
        scoring_formula: 'SUM(raw_value)',
        penalty_rules: null,
        sort_order: 1
      },
      {
        event_id: wDycheEvent.id,
        name: 'Strzelectwo - Broń Długa',
        description: '5 strzałów z broni długiej w pozycji stojącej z odległości 5 metrów.',
        rules: 'Każdy zawodnik oddaje 5 strzałów. Punktacja: suma punktów ze wszystkich strzałów.',
        metric_type: 'points' as MetricType,
        aggregation_type: 'sum' as AggregationType,
        attempts_count: 5,
        is_team_competition: false,
        team_size: 1,
        scoring_formula: 'SUM(raw_value)',
        penalty_rules: null,
        sort_order: 2
      },
      {
        event_id: wDycheEvent.id,
        name: 'Rzut Granatem - Dziewczęta',
        description: 'Rzut granatem z odległości 15 metrów. 3 próby.',
        rules: 'Dziewczęta rzucają z 15m. Punktacja według trafienia w koła: 3, 2, 1 pkt. Przy remisie liczy się mniejsza odległość od środka.',
        metric_type: 'points' as MetricType,
        aggregation_type: 'best_attempt' as AggregationType,
        attempts_count: 3,
        is_team_competition: false,
        team_size: 1,
        scoring_formula: 'MAX(raw_value)',
        penalty_rules: 'Przy remisie mierzy się odległość od środka',
        sort_order: 3
      },
      {
        event_id: wDycheEvent.id,
        name: 'Rzut Granatem - Chłopcy',
        description: 'Rzut granatem z odległości 20 metrów. 3 próby.',
        rules: 'Chłopcy rzucają z 20m. Punktacja według trafienia w koła: 3, 2, 1 pkt. Przy remisie liczy się mniejsza odległość od środka.',
        metric_type: 'points' as MetricType,
        aggregation_type: 'best_attempt' as AggregationType,
        attempts_count: 3,
        is_team_competition: false,
        team_size: 1,
        scoring_formula: 'MAX(raw_value)',
        penalty_rules: 'Przy remisie mierzy się odległość od środka',
        sort_order: 4
      },
      {
        event_id: wDycheEvent.id,
        name: 'Bieg Przełajowy',
        description: 'Bieg przełajowy na dystansie około 1000 metrów.',
        rules: 'Wynik według kolejności na mecie. Punktacja dla drużyny: 1→15pkt, 2→13pkt, 3→11pkt, 4→10pkt, 5→9pkt, 6→8pkt, 7→7pkt, 8→6pkt, 9→5pkt, 10→4pkt, 11→3pkt, 12→2pkt, 13+→1pkt',
        metric_type: 'time' as MetricType,
        aggregation_type: 'best_attempt' as AggregationType,
        attempts_count: 1,
        is_team_competition: false,
        team_size: 1,
        scoring_formula: 'RANK based on time',
        penalty_rules: null,
        sort_order: 5
      }
    ];

    const { data: insertedCompetitions, error: competitionsError } = await supabase
      .from('competitions')
      .insert(competitions)
      .select();

    if (competitionsError) throw competitionsError;
    console.log('Created competitions:', insertedCompetitions.length);

    // Link all competitions to the age category
    const competitionCategories = insertedCompetitions.map(comp => ({
      competition_id: comp.id,
      age_category_id: ageCategory.id
    }));

    const { error: ccError } = await supabase
      .from('competition_categories')
      .insert(competitionCategories);

    if (ccError) throw ccError;

    console.log('Successfully seeded W Dychę event with all configurations');
    return { success: true };
  } catch (error) {
    console.error('Error seeding events:', error);
    return { success: false, error };
  }
}
