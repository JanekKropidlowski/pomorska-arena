import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Target, Clock } from "lucide-react";

interface ResultEntry {
  position: number;
  name: string;
  team: string;
  score: string;
  category: string;
}

interface PublicResultsProps {
  eventTitle: string;
  competition: string;
  lastUpdated: string;
  results: ResultEntry[];
}

export function PublicResults({ 
  eventTitle, 
  competition, 
  lastUpdated, 
  results 
}: PublicResultsProps) {
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Medal className="h-4 w-4 text-amber-600" />;
      default:
        return <Target className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPositionBadge = (position: number) => {
    if (position <= 3) {
      return (
        <Badge className="bg-primary text-primary-foreground">
          #{position}
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        #{position}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">
          {eventTitle}
        </CardTitle>
        <CardDescription className="text-lg">
          {competition}
        </CardDescription>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Ostatnia aktualizacja: {lastUpdated}</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {results.map((result, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors hover:bg-accent/50 ${
                result.position <= 3 ? 'bg-primary-light border-primary/20' : 'bg-card'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getPositionIcon(result.position)}
                  {getPositionBadge(result.position)}
                </div>
                
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    {result.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{result.team}</span>
                    <span>•</span>
                    <span>{result.category}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-primary">
                  {result.score}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <Button variant="outline">
            Pobierz wyniki PDF
          </Button>
          <Button variant="competition">
            Udostępnij wyniki
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}