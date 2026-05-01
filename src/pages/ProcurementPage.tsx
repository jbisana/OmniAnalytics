import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateProcurementInsights } from '@/services/ai';
import { Truck, Loader2, AlertTriangle, PackageSearch, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { useAI } from '@/contexts/AIContext';
import { cn } from '@/lib/utils';

// Mock supply chain data
const supplierData = [
  { id: 'sup-1', name: 'Global Metals Inc.', rawMaterial: 'Aluminum Sheets', leadTimeDays: 14, reliabilityScore: 92, status: 'On Track' },
  { id: 'sup-2', name: 'Plastak Corp', rawMaterial: 'Polymers', leadTimeDays: 21, reliabilityScore: 85, status: 'Delayed' },
  { id: 'sup-3', name: 'TechChips Ltd', rawMaterial: 'Microcontrollers', leadTimeDays: 45, reliabilityScore: 78, status: 'Critical' },
  { id: 'sup-4', name: 'EcoPack Solutions', rawMaterial: 'Cardboard Boxes', leadTimeDays: 7, reliabilityScore: 98, status: 'On Track' },
];

export function ProcurementPage() {
  const [insights, setInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAIEnabled } = useAI();

  const fetchInsights = async () => {
    if (!isAIEnabled) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/crm/activity'); // reusing as some context for partner bulk orders
      const partnerActivity = await res.json();
      
      const payload = {
        suppliers: supplierData,
        partnerActivity
      };

      const result = await generateProcurementInsights(payload);
      setInsights(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAIEnabled) {
      fetchInsights();
    }
  }, [isAIEnabled]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            Supply Chain & Predictive Procurement
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track supplier performance and AI-driven restocking alerts.</p>
        </div>
        <Button onClick={fetchInsights} disabled={isLoading || !isAIEnabled}>
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
          Generate AI Insights
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supplier List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Lead Times & Supplier Performance</CardTitle>
            <CardDescription>Current status of incoming raw materials.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-y border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-medium">Supplier</th>
                    <th className="px-4 py-3 font-medium">Material</th>
                    <th className="px-4 py-3 font-medium">Avg Lead Time</th>
                    <th className="px-4 py-3 font-medium">Reliability</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {supplierData.map(sup => (
                    <tr key={sup.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-gray-900">{sup.name}</td>
                      <td className="px-4 py-3 text-gray-600">{sup.rawMaterial}</td>
                      <td className="px-4 py-3 text-gray-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" /> {sup.leadTimeDays} days
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full", 
                                sup.reliabilityScore >= 90 ? "bg-green-500" : sup.reliabilityScore >= 80 ? "bg-yellow-500" : "bg-red-500"
                              )} 
                              style={{ width: `${sup.reliabilityScore}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{sup.reliabilityScore}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={sup.status === 'On Track' ? 'success' : sup.status === 'Delayed' ? 'warning' : 'destructive'}>
                          {sup.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestions Stack */}
        <div className="space-y-4">
          <Card className="border-indigo-100 shadow-sm bg-gradient-to-br from-indigo-50/50 flex flex-col h-full">
            <CardHeader className="pb-3 border-b border-indigo-50">
              <CardTitle className="text-base flex items-center gap-2 text-indigo-900">
                <Sparkles className="w-5 h-5 text-indigo-500" /> 
                Predictive AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1">
              {!isAIEnabled ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                  <AlertTriangle className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">AI is Disabled</p>
                  <p className="text-xs mt-1">Enable AI in the global toggle to predict partner bulk orders and raw material needs.</p>
                </div>
              ) : isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  <p className="text-sm border-t border-b border-transparent inline-block">Analyzing supplier lead times...</p>
                </div>
              ) : insights.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                  <p className="text-sm">No predictive insights found. Try generating again.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {insights.map((insight, idx) => (
                    <div key={idx} className="bg-white border text-sm border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 pr-2">{insight.title}</h4>
                        <Badge variant={insight.urgency === 'High' ? 'destructive' : insight.urgency === 'Medium' ? 'warning' : 'secondary'} className="text-[10px] shrink-0">
                          {insight.urgency}
                        </Badge>
                      </div>
                      {insight.partner && (
                        <div className="text-xs font-medium text-indigo-600 mb-2 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Impact: {insight.partner}
                        </div>
                      )}
                      <p className="text-gray-600 text-xs leading-relaxed bg-gray-50 p-2 rounded border border-gray-100">
                        {insight.recommendedAction}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
