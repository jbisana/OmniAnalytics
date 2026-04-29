import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { kpiData, salesData, inventoryData } from '@/data/mockData';
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, Percent, Tag, Activity } from 'lucide-react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAI } from '@/contexts/AIContext';

export function DashboardPage() {
  const [timeView, setTimeView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [crmActivity, setCrmActivity] = useState<any[]>([]);
  const { isAIEnabled } = useAI();

  useEffect(() => {
    fetch('/api/crm/activity')
      .then(res => res.json())
      .then(data => setCrmActivity(data))
      .catch(console.error);
  }, []);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Check your key metrics and recent activities.</p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Revenue" value={kpiData.revenue.value} change={kpiData.revenue.change} trend={kpiData.revenue.trend} icon={DollarSign} />
        <KPICard title="Total Orders" value={kpiData.orders.value} change={kpiData.orders.change} trend={kpiData.orders.trend} icon={ShoppingCart} />
        <KPICard title="Conversion Rate" value={kpiData.conversionRate.value} change={kpiData.conversionRate.change} trend={kpiData.conversionRate.trend} icon={Percent} />
        <KPICard title="Avg. Order Value" value={kpiData.avgOrderValue.value} change={kpiData.avgOrderValue.change} trend={kpiData.avgOrderValue.trend} icon={Tag} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-4">
            <div className="space-y-1">
              <CardTitle>Sales & Predictive Trends</CardTitle>
              <p className="text-sm text-gray-500">Historical data vs AI predictive model</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                 <button onClick={() => setTimeView('daily')} className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-colors', timeView === 'daily' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900')}>Daily</button>
                 <button onClick={() => setTimeView('weekly')} className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-colors', timeView === 'weekly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900')}>Weekly</button>
                 <button onClick={() => setTimeView('monthly')} className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-colors', timeView === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900')}>Monthly</button>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Actual</div>
                {isAIEnabled && <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-indigo-500"></div> AI Predicted</div>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey={timeView === 'daily' ? 'displayDate' : 'date'} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                  {isAIEnabled && (
                    <Line type="monotone" dataKey="predicted" stroke="#6366f1" strokeDasharray="5 5" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent CRM Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent CRM Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {crmActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-500">{activity.action}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Live Inventory Monitory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 bg-gray-50/50 uppercase border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-tl-lg">Product</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-gray-500">{item.category}</td>
                      <td className="px-4 py-3 text-gray-900">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-900 font-mono">{item.stock}</td>
                      <td className="px-4 py-3">
                        <Badge variant={item.stock === 0 ? "destructive" : item.stock < 20 ? "warning" : "success"}>
                          {item.status}
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
    </div>
  );
}

function KPICard({ title, value, change, trend, icon: Icon }: any) {
  const isUp = trend === 'up';
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">{value}</h2>
          <span className={cn(
            "flex items-center text-xs font-medium",
            isUp ? "text-green-600" : "text-red-600"
          )}>
            {isUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
