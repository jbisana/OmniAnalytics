import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { detectAnomalies } from '@/services/ai';
import { kpiData } from '@/data/mockData';
import { AlertTriangle, Loader2, Activity, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAI } from '@/contexts/AIContext';

export function AnomalyDetectionPage() {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAIEnabled } = useAI();

  const fetchAnomalies = async () => {
    if (!isAIEnabled) return;
    setIsLoading(true);
    try {
      const result = await detectAnomalies(kpiData);
      setAnomalies(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, [isAIEnabled]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            Anomaly Detection
          </h1>
          <p className="text-sm text-gray-500 mt-1">Real-time monitoring of statistical deviations in core KPIs.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Bell className="w-4 h-4 mr-2" /> Alert Settings</Button>
          <Button onClick={fetchAnomalies} disabled={isLoading || !isAIEnabled}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Activity className="w-4 h-4 mr-2" />}
            Scan Metrics
          </Button>
        </div>
      </div>

      {!isAIEnabled ? (
        <Card>
          <CardContent className="h-64 flex flex-col items-center justify-center text-gray-500">
            <AlertTriangle className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">AI is Disabled</p>
            <p className="text-sm">Please enable AI in the global toggle to detect anomalies.</p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card className="h-64 flex items-center justify-center bg-gray-50/50">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </Card>
      ) : anomalies.length === 0 ? (
        <Card>
          <CardContent className="h-64 flex flex-col items-center justify-center text-gray-500">
            <Activity className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">All Systems Normal</p>
            <p className="text-sm">No statistical deviations detected in the current metrics.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {anomalies.map((anomaly, idx) => (
            <Card key={idx} className="border-red-100 overflow-hidden">
              <div className="h-1 w-full bg-red-500" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <CardTitle className="text-lg">{anomaly.metric}</CardTitle>
                  </div>
                  <Badge variant="destructive">{anomaly.deviation}</Badge>
                </div>
                <CardDescription className="text-gray-900 mt-2 font-medium">
                  {anomaly.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50/50 rounded-lg p-4 border border-red-50">
                  <h4 className="text-sm font-semibold text-red-900 mb-2">Potential Root Causes:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {anomaly.potentialCauses.map((cause: string, cIdx: number) => (
                      <li key={cIdx} className="text-sm text-red-800">{cause}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
