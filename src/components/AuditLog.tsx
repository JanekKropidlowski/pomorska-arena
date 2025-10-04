import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, Activity, Trash2 } from 'lucide-react';
import { getAuditLog, clearAuditLog } from '@/lib/audit';

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: Record<string, any>;
  version: number;
}

export const AuditLog = () => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = () => {
    setLoading(true);
    const log = getAuditLog();
    setEntries(log);
    setLoading(false);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'result_entry':
        return 'Wprowadzenie wyniku';
      case 'recalc_classifications':
        return 'Przeliczenie klasyfikacji';
      case 'publish_results':
        return 'Publikacja wyników';
      default:
        return action;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'result_entry':
        return 'bg-blue-100 text-blue-800';
      case 'recalc_classifications':
        return 'bg-yellow-100 text-yellow-800';
      case 'publish_results':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleClearLog = () => {
    if (confirm('Czy na pewno chcesz wyczyścić cały log audytu?')) {
      clearAuditLog();
      loadEntries();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Log audytu</CardTitle>
          <CardDescription>Ładowanie...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Log audytu
            </CardTitle>
            <CardDescription>
              Historia wszystkich akcji w systemie ({entries.length} wpisów)
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearLog}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Wyczyść log
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Brak wpisów w logu audytu</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex-shrink-0 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getActionColor(entry.action)}>
                      {getActionLabel(entry.action)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      v{entry.version}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <User className="h-3 w-3" />
                    <span>{entry.user}</span>
                    <span>•</span>
                    <span>{formatTimestamp(entry.timestamp)}</span>
                  </div>
                  
                  {Object.keys(entry.details).length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {Object.entries(entry.details).map(([key, value]) => (
                        <span key={key} className="mr-3">
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
