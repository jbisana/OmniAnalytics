import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAI } from '@/contexts/AIContext';
import { Sparkles, CheckCircle2, XCircle, Clock, DollarSign, TrendingUp, BarChart3, Users, Filter, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

type ChartSize = {
  width: number;
  height: number;
};

function MeasuredChart({
  children,
  className = '',
  minHeight = 250,
}: {
  children: (size: ChartSize) => React.ReactNode;
  className?: string;
  minHeight?: number;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState<ChartSize>({ width: 0, height: 0 });

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      const nextSize = {
        width: Math.max(0, Math.floor(rect.width)),
        height: Math.max(0, Math.floor(rect.height)),
      };

      setSize((currentSize) => {
        if (currentSize.width === nextSize.width && currentSize.height === nextSize.height) {
          return currentSize;
        }

        return nextSize;
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const canRenderChart = size.width > 0 && size.height > 0;

  return (
    <div ref={containerRef} className={cn('h-full w-full', className)} style={{ minHeight }}>
      {canRenderChart ? children(size) : null}
    </div>
  );
}

type FundRequest = {
  id: string;
  partner: string;
  campaign: string;
  amount: number;
  expectedROI: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  aiFraudScore?: number;
  aiRecommendation?: string;
};

const initialRequests: FundRequest[] = [
  { id: 'MDF-8210', partner: 'TechFlow Solutions', campaign: 'Q3 Enterprise Demand Gen', amount: 15000, expectedROI: '250%', status: 'Pending', date: '2024-06-15', aiFraudScore: 12, aiRecommendation: 'Approve - High historical ROI' },
  { id: 'MDF-8211', partner: 'Global IT Services', campaign: 'Cloud Migration Webinar', amount: 5000, expectedROI: '150%', status: 'Approved', date: '2024-06-10' },
  { id: 'MDF-8212', partner: 'Nexus Systems', campaign: 'Local Trade Show Booth', amount: 25000, expectedROI: '100%', status: 'Pending', date: '2024-06-14', aiFraudScore: 85, aiRecommendation: 'Review - Budget exceeds usual allocation and ROI is vague' },
  { id: 'MDF-8213', partner: 'Alpha Integrators', campaign: 'Digital Ads Q3', amount: 8000, expectedROI: '300%', status: 'Rejected', date: '2024-06-05' },
];

const roiData = [
  { quarter: 'Q1', investment: 120000, revenue: 380000 },
  { quarter: 'Q2', investment: 150000, revenue: 470000 },
  { quarter: 'Q3', investment: 180000, revenue: 620000 },
  { quarter: 'Q4 (Proj)', investment: 200000, revenue: 750000 },
];

export function MDFPage() {
  const { isAIEnabled } = useAI();
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState('All');

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: action } : r));
  };

  const filteredRequests = requests.filter(r => filter === 'All' || r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Market Development Funds (MDF)</h1>
          <p className="text-gray-500 text-sm mt-1">Manage budget, approve partner requests, and track ROI.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            Allocate Budget
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <DollarSign className="w-5 h-5" />
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">FY 2024</Badge>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Allocated</p>
            <h3 className="text-2xl font-bold text-gray-900">$1,000,000</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Funds Used</p>
            <h3 className="text-2xl font-bold text-gray-900">$450,000</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Pending Approval</p>
            <h3 className="text-2xl font-bold text-gray-900">$40,000</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              {isAIEnabled && <Sparkles className="w-4 h-4 text-purple-600" />}
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Average ROI</p>
            <h3 className="text-2xl font-bold text-gray-900">315%</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
              <div>
                <CardTitle className="text-lg">MDF History</CardTitle>
                <CardDescription>Past and pending partner campaign proposals</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48" />
                </div>
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                  {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={cn(
                        "px-3 py-1 text-xs font-medium rounded-md transition-all",
                        filter === status ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-500">Request ID</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Partner & Campaign</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Date</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Amount</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 font-medium text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRequests.map(request => (
                      <React.Fragment key={request.id}>
                        <tr className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 text-gray-500">{request.id}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{request.campaign}</div>
                            <div className="text-gray-500 text-xs mt-0.5">{request.partner}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{new Date(request.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">${request.amount.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={cn(
                              request.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              request.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              'bg-red-50 text-red-700 border-red-200'
                            )}>
                              {request.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {request.status === 'Pending' && (
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  size="sm"
                                  className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                                  onClick={() => handleAction(request.id, 'Approved')}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                  onClick={() => handleAction(request.id, 'Rejected')}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                        {isAIEnabled && request.status === 'Pending' && request.aiRecommendation && (
                          <tr className={cn(
                            "border-b border-gray-100",
                            request.aiFraudScore && request.aiFraudScore > 50 ? "bg-red-50/30" : "bg-blue-50/30"
                          )}>
                            <td colSpan={6} className="px-4 py-2.5">
                              <div className="flex items-start gap-2">
                                <Sparkles className={cn("w-4 h-4 shrink-0 mt-0.5", request.aiFraudScore && request.aiFraudScore > 50 ? "text-red-500" : "text-blue-500")} />
                                <div>
                                  <span className={cn("text-xs font-semibold mr-2", request.aiFraudScore && request.aiFraudScore > 50 ? "text-red-800" : "text-blue-800")}>
                                    AI Recommendation:
                                  </span>
                                  <span className={cn("text-xs", request.aiFraudScore && request.aiFraudScore > 50 ? "text-red-700" : "text-blue-700")}>
                                    {request.aiRecommendation}
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                    {filteredRequests.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No requests found matching the current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">MDF ROI Performance</CardTitle>
              <CardDescription>Generated revenue vs funds invested</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <MeasuredChart minHeight={250}>
                  {({ width, height }) => (
                  <BarChart width={width} height={height} data={roiData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                    <Bar dataKey="investment" name="MDF Invested" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="revenue" name="Revenue Gen" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                  )}
                </MeasuredChart>
              </div>
            </CardContent>
          </Card>

          {isAIEnabled ? (
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  AI Optimizations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/60 p-3 rounded-lg border border-indigo-100 text-sm text-indigo-800">
                  <strong className="block text-indigo-900 font-semibold mb-1">Shift investment to Q4</strong>
                  Historical data suggests 40% higher ROI for end-of-year enterprise IT webinars. Consider moving $50k from Q3 to Q4.
                </div>
                <div className="bg-white/60 p-3 rounded-lg border border-indigo-100 text-sm text-indigo-800">
                  <strong className="block text-indigo-900 font-semibold mb-1">High-Risk Partner Focus</strong>
                  2 partners generate 80% of rejected MDF claims. Auto-enforcing strict proof-of-performance for "Nexus Systems".
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-900">AI Optimization Disabled</h4>
                <p className="text-sm text-gray-500 mt-2">Enable AI to receive automated budget allocation recommendations and fraud detection.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
