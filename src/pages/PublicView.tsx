import { PublicResults } from "@/components/PublicResults";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, FileText, Trophy } from "lucide-react";

const PublicView = () => {
  // Sample results data
  const sampleResults = [
    {
      position: 1,
      name: "Anna Kowalska",
      team: "SP nr 15 Gdynia",
      score: "95 pkt",
      category: "Dziewczęta U-16"
    },
    {
      position: 2,
      name: "Piotr Nowak", 
      team: "LO Sopot",
      score: "92 pkt",
      category: "Chłopcy U-18"
    },
    {
      position: 3,
      name: "Maria Wiśniewska",
      team: "SP nr 8 Gdańsk", 
      score: "89 pkt",
      category: "Dziewczęta U-16"
    },
    {
      position: 4,
      name: "Tomasz Lewandowski",
      team: "Technikum Gdynia",
      score: "87 pkt", 
      category: "Chłopcy U-18"
    },
    {
      position: 5,
      name: "Katarzyna Dąbrowska",
      team: "SP nr 22 Gdańsk",
      score: "85 pkt",
      category: "Dziewczęta U-16"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Public Header */}
      <header className="bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">LZS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Pomorskiego Zrzeszenia LZS
                </h1>
                <p className="text-sm text-muted-foreground">
                  System Zawodów Sportowych
                </p>
              </div>
            </div>
            
            <Badge className="bg-success text-success-foreground">
              <Trophy className="h-3 w-3 mr-1" />
              Wyniki na żywo
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Event Info */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">
              Mistrzostwa Pomorskiego LZS w Strzelectwie 2024
            </CardTitle>
            <CardDescription className="text-lg">
              Kłanino, Gdańsk - 15 października 2024
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <Calendar className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">15 października</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <MapPin className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Miejsce</p>
                  <p className="font-medium">Kłanino, Gdańsk</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <Users className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Uczestników</p>
                  <p className="font-medium">45 zawodników</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <Trophy className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Konkurencje</p>
                  <p className="font-medium">4 dyscypliny</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competition Tabs/Results */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="flex space-x-2 bg-muted p-1 rounded-lg">
              <Badge className="bg-primary text-primary-foreground px-4 py-2">
                Strzelectwo - Broń krótka
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                Broń długa
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                Rzut granatem
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                Bieg przełajowy
              </Badge>
            </div>
          </div>

          <PublicResults
            eventTitle="Klasyfikacja końcowa"
            competition="Strzelectwo - Broń krótka"
            lastUpdated="15:30, 15 października 2024"
            results={sampleResults}
          />
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Regulamin zawodów
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Zawody odbywają się zgodnie z regulaminem Pomorskiego Zrzeszenia LZS.
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Strzelectwo - broń krótka i długa</li>
                <li>• Rzut granatem na celność</li>
                <li>• Bieg przełajowy 3km</li>
                <li>• Klasyfikacja indywidualna i drużynowa</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                System punktacji
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Punktacja zgodnie z zasadami LZS:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>I miejsce:</span>
                  <span className="font-medium">15 pkt</span>
                </div>
                <div className="flex justify-between">
                  <span>II miejsce:</span>
                  <span className="font-medium">13 pkt</span>
                </div>
                <div className="flex justify-between">
                  <span>III miejsce:</span>
                  <span className="font-medium">11 pkt</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>IV-XIII:</span>
                  <span>10-1 pkt</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm border-t pt-6">
          <p>© 2024 Pomorskie Zrzeszenie LZS. System Zawodów Sportowych.</p>
          <p>Wyniki aktualizowane na bieżąco podczas trwania zawodów.</p>
        </div>
      </main>
    </div>
  );
};

export default PublicView;