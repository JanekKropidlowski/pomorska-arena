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
        description: `Zawody składają się z trzech obowiązkowych konkurencji: strzelectwa, biegu przełajowego oraz rzutu granatem do celu.

KONKURENCJE I PUNKTACJA:

1. Strzelectwo
Każdy zawodnik oddaje 5 strzałów z broni krótkiej i 5 strzałów z broni długiej (pozycja stojąca, 5 metrów). Do klasyfikacji liczy się suma punktów z obu serii. Przed strzelaniem zawodnik ma 5 strzałów próbnych (nie liczą się do punktacji).

2. Bieg przełajowy
Dystans: ok. 1000 m. Prowadzona jest tylko klasyfikacja miejsc (nie ma dodatkowych punktów do sumy). Troje najlepszych dziewcząt i chłopców dostaje nagrody.

3. Rzut granatem do celu
Dziewczęta: rzut z 15 m, chłopcy: rzut z 20 m. Cel: trzy koła o średnicy 1 m, 2 m, 3 m. Punktacja: trafienie do środka = 3 pkt, do drugiego koła = 2 pkt, do trzeciego = 1 pkt. Każdy uczestnik wykonuje 3 rzuty.

KLASYFIKACJA:
- Indywidualna: Strzelectwo (suma punktów), Bieg (kolejność na mecie), Rzut granatem (suma punktów)
- Drużynowa: Szkołę reprezentuje 6 uczniów (3 dziewczęta + 3 chłopców). Punktacja: 1→15pkt, 2→13pkt, 3→11pkt, 4→10pkt, 5→9pkt, 6→8pkt, 7→7pkt, 8→6pkt, 9→5pkt, 10→4pkt, 11→3pkt, 12→2pkt, 13+→1pkt

ZGŁOSZENIA:
Termin: do 3 października 2025 r.
Email: esio13@poczta.onet.pl
Wymagania: legitymacja szkolna, udział ucznia spoza szkoły = dyskwalifikacja całej drużyny

KOSZTY:
Brak wpisowego, transport pokrywa szkoła/samorząd

NAGRODY:
Medale uczestnictwa, dyplomy i puchary dla najlepszych, nagrody rzeczowe dla drużyn, ciepły posiłek, bezpłatne zwiedzanie Muzeum Sportu Wiejskiego w Łebczu`,
        location: 'Powiatowy Zespół Szkół w Kłaninie, ul. Szkolna 4, 84-107 Kłanino',
        start_date: '2025-10-10',
        end_date: '2025-10-10',
        registration_deadline: '2025-10-03',
        event_type: 'championship' as const,
        is_cyclic: true,
        cyclic_month: 10,
        status: 'published',
        regulations_pdf_url: null,
        logo_url: `${import.meta.env.BASE_URL}lzs-logo.png`,
        max_participants: 200,
        max_teams: 40,
        organizer: 'Pomorskie Zrzeszenie LZS',
        contact_email: 'esio13@poczta.onet.pl',
        contact_phone: '+48 608 341 880',
        patron_honorowy: 'Pomorski Kurator Oświaty',
        organizatorzy: 'Pomorskie Zrzeszenie LZS, Muzeum Sportu Wiejskiego w Łebczu, Powiatowy Zespół Szkół w Kłaninie, Powiatowe Centrum Kształcenia Zawodowego i Ustawicznego w Pucku, Starostwo Powiatowe w Pucku',
        contact_person_1_name: 'Wiesław Oberzig',
        contact_person_1_title: 'Wiceprezes PZ LZS, nauczyciel PZS w Kłaninie',
        contact_person_1_phone: '608-341-880',
        contact_person_2_name: 'Jan Trofimowicz',
        contact_person_2_title: 'Wiceprezes PZ LZS, nauczyciel w PZKZiU w Pucku',
        contact_person_2_phone: '508-738-161',
        event_rules: `WARUNKI UDZIAŁU:
- Każdy uczestnik musi mieć legitymację szkolną
- Udział ucznia spoza szkoły = dyskwalifikacja całej drużyny
- Obowiązek udziału we wszystkich konkurencjach
- Strój sportowy obowiązkowy
- Oświadczenia zdrowotne wymagane w dniu zawodów

REMISY:
- Strzelectwo: porównanie wyników z jednej broni lub dogrywka
- Rzut granatem: pomiar od środka koła - bliższy rzut wygrywa
- Bieg przełajowy: foto-finisz lub decyzja sędziego
- Drużynowa: dodatkowe kryteria (np. liczba pierwszych miejsc)`
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

    // Competitions - zgodnie z regulaminem
    const competitions = [
      {
        event_id: wDycheEvent.id,
        name: 'Strzelectwo',
        description: 'Każdy zawodnik oddaje 5 strzałów z broni krótkiej i 5 strzałów z broni długiej (pozycja stojąca, 5 metrów). Do klasyfikacji liczy się suma punktów z obu serii. Przed strzelaniem zawodnik ma 5 strzałów próbnych (nie liczą się do punktacji).',
        rules: 'Przy remisie można porównać wyniki z jednej broni albo wprowadzić dogrywkę (decyzja organizatora).',
        metric_type: 'points' as MetricType,
        aggregation_type: 'sum' as AggregationType,
        attempts_count: 10,
        is_team_competition: false,
        team_size: 1,
        scoring_formula: 'SUM(bron_krotka) + SUM(bron_dluga)',
        penalty_rules: 'Przy remisie: porównanie wyników z jednej broni lub dogrywka',
        sort_order: 1
      },
      {
        event_id: wDycheEvent.id,
        name: 'Bieg przełajowy',
        description: 'Dystans: ok. 1000 m. Prowadzona jest tylko klasyfikacja miejsc (nie ma dodatkowych punktów do sumy). Troje najlepszych dziewcząt i chłopców dostaje nagrody.',
        rules: 'Klasyfikacja wg miejsca na mecie, przy identycznym czasie decyduje foto-finisz lub decyzja sędziego.',
        metric_type: 'time' as MetricType,
        aggregation_type: 'best_attempt' as AggregationType,
        attempts_count: 1,
        is_team_competition: false,
        team_size: 1,
        scoring_formula: 'RANK based on time',
        penalty_rules: 'Przy identycznym czasie: foto-finisz lub decyzja sędziego',
        sort_order: 2
      },
      {
        event_id: wDycheEvent.id,
        name: 'Rzut granatem do celu',
        description: 'Dziewczęta: rzut z 15 m, chłopcy: rzut z 20 m. Cel: trzy koła o średnicy 1 m, 2 m, 3 m. Punktacja: trafienie do środka = 3 pkt, do drugiego koła = 2 pkt, do trzeciego = 1 pkt. Każdy uczestnik wykonuje 3 rzuty.',
        rules: 'Przy remisie: decyduje pomiar od środka koła – bliższe trafienie wygrywa.',
        metric_type: 'points' as MetricType,
        aggregation_type: 'sum' as AggregationType,
        attempts_count: 3,
        is_team_competition: false,
        team_size: 1,
        scoring_formula: 'SUM(rzut1 + rzut2 + rzut3)',
        penalty_rules: 'Przy remisie: pomiar od środka koła - bliższy rzut wygrywa',
        sort_order: 3
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
