import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateCustomerSegments } from '@/services/ai';
import { PieChart, Loader2, Users, Target, Lightbulb, AlertTriangle } from 'lucide-react';
import { useAI } from '@/contexts/AIContext';

export function CustomerSegmentsPage() {
  const [segments, setSegments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAIEnabled } = useAI();

  const fetchSegments = async () => {
    if (!isAIEnabled) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/crm/activity');
      const crmActivity = await res.json();
      const result = await generateCustomerSegments(crmActivity);
      setSegments(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, [isAIEnabled]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-blue-600" />
            Predictive Customer Segmentation
          </h1>
          <p className="text-sm text-gray-500 mt-1">AI-driven analysis of customer behavior to predict Lifetime Value (CLV).</p>
        </div>
        <Button onClick={fetchSegments} disabled={isLoading || !isAIEnabled}>
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Users className="w-4 h-4 mr-2" />}
          Regenerate Segments
        </Button>
      </div>

      {!isAIEnabled ? (
        <Card>
          <CardContent className="h-64 flex flex-col items-center justify-center text-gray-500">
            <AlertTriangle className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">AI is Disabled</p>
            <p className="text-sm">Please enable AI in the global toggle to generate customer segments.</p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card className="h-64 flex items-center justify-center bg-gray-50/50">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {segments.map((segment, idx) => (
            <Card key={idx} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 p-6 bg-blue-50/30 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-lg text-gray-900">{segment.segmentName}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{segment.description}</p>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Predicted Avg CLV</p>
                    <p className="text-2xl font-bold text-blue-600">{segment.averageCLV}</p>
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    <h4 className="font-semibold text-gray-900">Suggested Marketing Strategies</h4>
                  </div>
                  <div className="space-y-3">
                    {segment.suggestedStrategies.map((strategy: string, sIdx: number) => (
                      <div key={sIdx} className="flex gap-3 items-start bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                        <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-medium shrink-0">
                          {sIdx + 1}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{strategy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {segments.length === 0 && (
            <Card>
              <CardContent className="h-64 flex flex-col items-center justify-center text-gray-500">
                <p className="text-sm">Failed to generate customer segments. Verification of Gemini configuration may be required.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
