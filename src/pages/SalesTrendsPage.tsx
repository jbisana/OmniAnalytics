import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { salesData, kpiData } from '@/data/mockData';
import { DollarSign, Briefcase, Percent, FileSignature, TrendingUp, Calendar, Filter } from 'lucide-react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend, Cell, PieChart, Pie } from 'recharts';
import { cn } from '@/lib/utils';
import { useAI } from '@/contexts/AIContext';

type ChartSize = {
  width: number;
  height: number;
};

function MeasuredChart({
  children,
  className = '',
  minHeight = 300,
}: {
  children: (size: ChartSize) => React.ReactNode;
  className?: string;
  minHeight?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<ChartSize>({ width: 0, height: 0 });

  useEffect(() => {
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

export function SalesTrendsPage() {
  const [timeView, setTimeView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { isAIEnabled } = useAI();

  const chartData = useMemo(() => {
    if (timeView === 'daily') return salesData.slice(-30);
    
    if (timeView === 'weekly') {
      const weekly = [];
      for (let i = 0; i < salesData.length; i += 7) {
        const chunk = salesData.slice(i, i + 7);
        if(chunk.length === 0) continue;
        const sales = chunk.reduce((acc, curr) => acc + curr.sales, 0);
        const predicted = chunk.reduce((acc, curr) => acc + curr.predicted, 0);
        weekly.push({
          date: chunk[chunk.length - 1].date,
          displayDate: chunk[0].displayDate + ' - ' + chunk[chunk.length - 1].displayDate,
          sales,
          predicted
        });
      }
      return weekly.slice(-12);
    }
    
    if (timeView === 'monthly') {
      const monthly = [];
      for (let i = 0; i < salesData.length; i += 30) {
        const chunk = salesData.slice(i, i + 30);
        if(chunk.length === 0) continue;
        const sales = chunk.reduce((acc, curr) => acc + curr.sales, 0);
        const predicted = chunk.reduce((acc, curr) => acc + curr.predicted, 0);
        monthly.push({
          date: chunk[chunk.length - 1].date,
          displayDate: 'Month end ' + chunk[chunk.length - 1].displayDate,
          sales,
          predicted
        });
      }
      return monthly;
    }
    return salesData;
  }, [timeView]);

  const categoryData = [
    { name: 'Technology', value: 4500, color: '#3b82f6' },
    { name: 'Retail / CPG', value: 3200, color: '#10b981' },
    { name: 'Manufacturing', value: 2800, color: '#fbbf24' },
    { name: 'Healthcare', value: 1500, color: '#ef4444' },
    { name: 'Logistics', value: 2100, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Revenue & Quotas</h1>
          <p className="text-sm text-gray-500 mt-1">Deep dive into enterprise revenue performance and pipeline trends.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex bg-gray-100 rounded-lg p-1">
             <button onClick={() => setTimeView('daily')} className={cn('px-3 py-1.5 text-sm font-medium rounded-md transition-colors', timeView === 'daily' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900')}>Daily</button>
             <button onClick={() => setTimeView('weekly')} className={cn('px-3 py-1.5 text-sm font-medium rounded-md transition-colors', timeView === 'weekly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900')}>Weekly</button>
             <button onClick={() => setTimeView('monthly')} className={cn('px-3 py-1.5 text-sm font-medium rounded-md transition-colors', timeView === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900')}>Monthly</button>
           </div>
           <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200 lg:hidden">
             <Filter size={20} />
           </button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SalesKPICard title="Total Revenue" value={kpiData.revenue.value} icon={DollarSign} color="text-blue-600" />
        <SalesKPICard title="Active Deals" value={kpiData.activeDeals.value} icon={Briefcase} color="text-green-600" />
        <SalesKPICard title="ACV" value={kpiData.avgContractValue.value} icon={FileSignature} color="text-amber-600" />
        <SalesKPICard title="Win Rate" value={kpiData.winRate.value} icon={Percent} color="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Revenue Performance & Predictions</CardTitle>
            <CardDescription>Historical contract value data vs AI-driven predictive modeling.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[350px]">
            <MeasuredChart minHeight={350}>
              {({ width, height }) => (
              <ComposedChart width={width} height={height} data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey={timeView === 'daily' ? 'displayDate' : 'date'} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                <Area type="monotone" name="Actual Revenue generated" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
                {isAIEnabled && (
                  <Line type="monotone" name="AI Pipeline Prediction" dataKey="predicted" stroke="#6366f1" strokeDasharray="6 6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                )}
              </ComposedChart>
              )}
            </MeasuredChart>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Revenue by Sector</CardTitle>
            <CardDescription>Top performing partner industries.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[350px] flex flex-col items-center justify-center">
            <MeasuredChart minHeight={350}>
              {({ width, height }) => (
              <PieChart width={width} height={height}>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" layout="vertical" align="center" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
              )}
            </MeasuredChart>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Volume Chart */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Deal Volume Trend</CardTitle>
            <CardDescription>Number of closed-won deals over time.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <MeasuredChart minHeight={300}>
              {({ width, height }) => (
              <BarChart width={width} height={height} data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey={timeView === 'daily' ? 'displayDate' : 'date'} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '12px' }} />
                <Bar dataKey="sales" name="Deals" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              </BarChart>
              )}
            </MeasuredChart>
          </CardContent>
        </Card>

        {/* Seasonal Heatmap / Future Section */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Automated AI analysis of your B2B sales cycle.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-4">
               <TrendingUp className="text-blue-600 shrink-0" size={24} />
               <div>
                 <h4 className="font-semibold text-blue-900 text-sm">Pipeline Velocity Increase</h4>
                 <p className="text-blue-800 text-xs mt-1">Enterprise deals are closing 14% faster this quarter. This correlates with the decision to target technical decision-makers earlier in the cycle.</p>
               </div>
            </div>
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex gap-4">
               <Calendar className="text-indigo-600 shrink-0" size={24} />
               <div>
                 <h4 className="font-semibold text-indigo-900 text-sm">Quarterly Target Projection</h4>
                 <p className="text-indigo-800 text-xs mt-1">AI predicts you have a 85% chance of exceeding the Q2 $1.5M goal based on current committed active deals in the pipeline.</p>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SalesKPICard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="overflow-hidden border-none shadow-sm ring-1 ring-gray-100">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn("p-2.5 rounded-xl bg-gray-50", color)}>
            <Icon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
