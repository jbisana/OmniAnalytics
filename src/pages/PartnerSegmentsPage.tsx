import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generatePartnerSegments } from '@/services/ai';
import { PieChart, Loader2, Users, Target, Lightbulb, AlertTriangle, SlidersHorizontal } from 'lucide-react';
import { useAI } from '@/contexts/AIContext';

export function PartnerSegmentsPage() {
  const [segments, setSegments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAIEnabled } = useAI();
  
  const [rfmParams, setRfmParams] = useState({
    recency: "Active in last 30 days",
    frequency: "> 5 orders/month",
    monetary: "> $10,000 ARR"
  });

  const fetchSegments = async () => {
    if (!isAIEnabled) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/crm/activity');
      const crmActivity = await res.json();
      const result = await generatePartnerSegments(crmActivity, rfmParams);
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
            Predictive Partner Segmentation
          </h1>
          <p className="text-sm text-gray-500 mt-1">AI-driven analysis of partner behavior to predict Lifetime Value (CLV).</p>
        </div>
        <Button onClick={fetchSegments} disabled={isLoading || !isAIEnabled}>
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Users className="w-4 h-4 mr-2" />}
          Regenerate Segments
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-gray-100 flex flex-row items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-400" />
          <div>
            <CardTitle className="text-lg">Segmentation Parameters (RFM)</CardTitle>
            <CardDescription>Manually input criteria to influence AI segment grouping.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-4 bg-gray-50/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recency Target</label>
              <input 
                type="text" 
                className="w-full pl-3 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={rfmParams.recency} 
                onChange={e => setRfmParams({...rfmParams, recency: e.target.value})}
                placeholder="e.g. Last 30 days" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency Target</label>
              <input 
                type="text" 
                className="w-full pl-3 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={rfmParams.frequency} 
                onChange={e => setRfmParams({...rfmParams, frequency: e.target.value})}
                placeholder="e.g. Weekly active" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monetary Value Target</label>
              <input 
                type="text" 
                className="w-full pl-3 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={rfmParams.monetary} 
                onChange={e => setRfmParams({...rfmParams, monetary: e.target.value})}
                placeholder="e.g. > $5,000 / month" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {!isAIEnabled ? (
        <Card>
          <CardContent className="h-64 flex flex-col items-center justify-center text-gray-500">
            <AlertTriangle className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">AI is Disabled</p>
            <p className="text-sm">Please enable AI in the global toggle to generate partner segments.</p>
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
            <CardHeader>
              <CardContent className="h-64 flex flex-col items-center justify-center text-gray-500">
                <p className="text-sm">Failed to generate partner segments. Verification of Gemini configuration may be required.</p>
              </CardContent>
            </CardHeader>
          )}
        </div>
      )}
    </div>
  );
}
