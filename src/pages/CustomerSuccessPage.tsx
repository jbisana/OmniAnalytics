import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAI } from '@/contexts/AIContext';
import { Heart, TrendingUp, AlertTriangle, Presentation, Star, Users, Sparkles, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const mockHealthScores = [
  { partner: 'Acme Corp', nps: 72, csat: 4.8, engagement: 'High', churnRisk: 'Low', aiScore: 94 },
  { partner: 'TechStart Inc', nps: 45, csat: 3.5, engagement: 'Medium', churnRisk: 'Medium', aiScore: 71 },
  { partner: 'Nexus Systems', nps: 15, csat: 2.1, engagement: 'Low', churnRisk: 'High', aiScore: 42 },
  { partner: 'Global IT Solutions', nps: 85, csat: 4.9, engagement: 'Very High', churnRisk: 'Low', aiScore: 98 },
];

const mockNpsTrend = [
  { month: 'Jan', nps: 45 }, { month: 'Feb', nps: 48 }, { month: 'Mar', nps: 52 },
  { month: 'Apr', nps: 55 }, { month: 'May', nps: 61 }, { month: 'Jun', nps: 64 },
];

export function CustomerSuccessPage() {
  const { isAIEnabled } = useAI();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500" />
            Customer Success & Health
          </h1>
          <p className="text-sm text-gray-500 mt-1">Monitor partner health, predict churn, and build Quarterly Business Reviews (QBRs).</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><Presentation className="w-4 h-4 mr-2" /> QBR Builder</Button>
          <Button className="bg-rose-600 hover:bg-rose-700">Send NPS Survey</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <Heart className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Average Health Score</p>
            <h3 className="text-2xl font-bold text-gray-900">88 / 100</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total NPS</p>
            <h3 className="text-2xl font-bold text-gray-900">+64</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Star className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Avg CSAT (Out of 5)</p>
            <h3 className="text-2xl font-bold text-gray-900">4.6</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              {isAIEnabled && <Sparkles className="w-4 h-4 text-red-500" />}
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">High Churn Risk Partners</p>
            <h3 className="text-2xl font-bold text-gray-900">2</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Partner Health & Churn Risk</CardTitle>
                  <CardDescription>AI-driven scoring based on engagement, support tickets, and sales velocity.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-500">Partner</th>
                      <th className="px-4 py-3 font-medium text-gray-500">NPS</th>
                      <th className="px-4 py-3 font-medium text-gray-500">CSAT</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Engagement</th>
                      <th className="px-4 py-3 font-medium text-gray-500">
                        {isAIEnabled && <Sparkles className="inline-block w-3 h-3 text-indigo-500 mr-1" />}
                        Overall Health
                      </th>
                      <th className="px-4 py-3 font-medium text-gray-500">Churn Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockHealthScores.map((score, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">{score.partner}</td>
                        <td className="px-4 py-3 text-gray-600">{score.nps}</td>
                        <td className="px-4 py-3 text-gray-600">{score.csat.toFixed(1)}</td>
                        <td className="px-4 py-3 text-gray-600">{score.engagement}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2 max-w-[80px]">
                              <div 
                                className={cn("h-2 rounded-full", score.aiScore > 80 ? "bg-emerald-500" : score.aiScore > 50 ? "bg-amber-500" : "bg-red-500")} 
                                style={{ width: `${score.aiScore}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700">{score.aiScore}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={cn(
                            score.churnRisk === 'Low' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            score.churnRisk === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-red-50 text-red-700 border-red-200 animate-pulse'
                          )}>
                            {score.churnRisk}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {isAIEnabled && (
            <Card className="border-indigo-100 shadow-sm bg-indigo-50/50">
              <CardHeader className="pb-3 border-b border-indigo-100/50">
                <CardTitle className="text-base text-indigo-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" /> AI Churn Warning
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" /> Nexus Systems (High Risk)
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Partner has not logged into the portal in 45 days. Support ticket volume increased by 30% prior to inactivity. Expected churn within 60 days.
                  </p>
                  <Button size="sm" variant="outline" className="text-red-700 border-red-200 hover:bg-red-50">Generate Playbook</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">QBR Automations</CardTitle>
              <CardDescription>Generate and schedule Quarterly Business Reviews.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-3 mt-2">
                 <div className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer">
                   <div>
                     <p className="font-medium text-gray-900 text-sm">Acme Corp Q2 QBR</p>
                     <p className="text-xs text-gray-500 mt-0.5">Drafting • AI populated data</p>
                   </div>
                   <Button size="sm" variant="ghost">Edit</Button>
                 </div>
                 <div className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer">
                   <div>
                     <p className="font-medium text-gray-900 text-sm">Global IT Q2 QBR</p>
                     <p className="text-xs text-green-600 mt-0.5">Scheduled for next week</p>
                   </div>
                   <Button size="sm" variant="ghost">View</Button>
                 </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
