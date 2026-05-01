import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { kpiData, salesData, inventoryData } from '@/data/mockData';
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, Percent, Tag, Activity, LayoutDashboard, Plus, X, GripHorizontal } from 'lucide-react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAI } from '@/contexts/AIContext';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const AVAILABLE_WIDGETS = [
  { id: 'kpi-revenue', title: 'Total Revenue', type: 'kpi' },
  { id: 'kpi-orders', title: 'Total Orders', type: 'kpi' },
  { id: 'kpi-conversion', title: 'Conversion Rate', type: 'kpi' },
  { id: 'kpi-aov', title: 'Avg. Order Value', type: 'kpi' },
  { id: 'sales-chart', title: 'Sales & Predictive Trends', type: 'chart' },
  { id: 'forecast-chart', title: 'AI Sales Forecast', type: 'chart' },
  { id: 'recent-activity', title: 'Recent CRM Activity', type: 'list' },
  { id: 'inventory', title: 'Live Inventory Monitor', type: 'table' },
  { id: 'top-products', title: 'Top Products', type: 'list' },
  { id: 'cac-chart', title: 'Customer Acquisition Cost', type: 'chart' },
];

const DEFAULT_LAYOUTS = {
  lg: [
    { i: 'kpi-revenue', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'kpi-orders', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'kpi-conversion', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'kpi-aov', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'sales-chart', x: 0, y: 2, w: 8, h: 6, minW: 4, minH: 4 },
    { i: 'forecast-chart', x: 8, y: 2, w: 4, h: 6, minW: 3, minH: 4 },
    { i: 'recent-activity', x: 8, y: 8, w: 4, h: 6, minW: 3, minH: 4 },
    { i: 'inventory', x: 0, y: 8, w: 8, h: 6, minW: 6, minH: 4 },
  ]
};

export function DashboardPage() {
  const [timeView, setTimeView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [crmActivity, setCrmActivity] = useState<any[]>([]);
  const { isAIEnabled } = useAI();
  const [expandedInventoryItem, setExpandedInventoryItem] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [layouts, setLayouts] = useState<any>(
    JSON.parse(localStorage.getItem('dashboard-layout-v2') || JSON.stringify(DEFAULT_LAYOUTS))
  );
  
  const activeWidgetIds = useMemo(() => layouts.lg.map((l: any) => l.i), [layouts]);

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

  const onLayoutChange = (layout: Layout, allLayouts: any) => {
    setLayouts(allLayouts);
    if (!isEditing) {
      localStorage.setItem('dashboard-layout-v2', JSON.stringify(allLayouts));
    }
  };

  const addWidget = (widgetId: string) => {
    if (activeWidgetIds.includes(widgetId)) return;
    
    const newLayouts: any = { ...layouts };
    Object.keys(newLayouts).forEach(bp => {
      newLayouts[bp] = [
        ...newLayouts[bp],
        { i: widgetId, x: 0, y: Infinity, w: 4, h: 4, minW: 2, minH: 2 }
      ];
    });
    setLayouts(newLayouts);
  };

  const removeWidget = (widgetId: string) => {
    const newLayouts: any = { ...layouts };
    Object.keys(newLayouts).forEach(bp => {
      newLayouts[bp] = newLayouts[bp].filter((l: any) => l.i !== widgetId);
    });
    setLayouts(newLayouts);
  };

  const renderWidgetContent = (widgetId: string) => {
    switch (widgetId) {
      case 'kpi-revenue':
        return <KPICard title="Total Revenue" value={kpiData.revenue.value} change={kpiData.revenue.change} trend={kpiData.revenue.trend} icon={DollarSign} />;
      case 'kpi-orders':
        return <KPICard title="Total Orders" value={kpiData.orders.value} change={kpiData.orders.change} trend={kpiData.orders.trend} icon={ShoppingCart} />;
      case 'kpi-conversion':
        return <KPICard title="Conversion Rate" value={kpiData.conversionRate.value} change={kpiData.conversionRate.change} trend={kpiData.conversionRate.trend} icon={Percent} />;
      case 'kpi-aov':
        return <KPICard title="Avg. Order Value" value={kpiData.avgOrderValue.value} change={kpiData.avgOrderValue.change} trend={kpiData.avgOrderValue.trend} icon={Tag} />;
      case 'sales-chart':
        return (
          <Card className="flex flex-col h-full w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
              <CardTitle className="text-base">Sales & Predictive Trends</CardTitle>
              <div className="flex bg-gray-100 rounded-lg p-1">
                 <button onClick={(e) => { e.stopPropagation(); setTimeView('daily') }} className={cn('px-2 py-1 text-xs font-medium rounded-md transition-colors', timeView === 'daily' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900')}>D</button>
                 <button onClick={(e) => { e.stopPropagation(); setTimeView('weekly') }} className={cn('px-2 py-1 text-xs font-medium rounded-md transition-colors', timeView === 'weekly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900')}>W</button>
                 <button onClick={(e) => { e.stopPropagation(); setTimeView('monthly') }} className={cn('px-2 py-1 text-xs font-medium rounded-md transition-colors', timeView === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900')}>M</button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey={timeView === 'daily' ? 'displayDate' : 'date'} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                  {isAIEnabled && (
                    <Line type="monotone" dataKey="predicted" stroke="#6366f1" strokeDasharray="5 5" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      case 'forecast-chart':
        const forecastData = chartData.slice(-7); // Just show the last 7 periods for forecast emphasis
        return (
          <Card className="flex flex-col h-full w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
              <CardTitle className="text-base">AI Sales Forecast</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey={timeView === 'daily' ? 'displayDate' : 'date'} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="sales" name="Actual Sales" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                  {isAIEnabled && (
                    <Bar dataKey="predicted" name="AI Forecast" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  )}
                </BarChart>
              </ResponsiveContainer>
              {!isAIEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                  <p className="text-sm font-medium text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">Enable AI to see forecast</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'recent-activity':
        return (
          <Card className="flex flex-col h-full w-full overflow-hidden">
            <CardHeader className="pb-2 shrink-0">
              <CardTitle className="text-base">Recent CRM Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {crmActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 lg:truncate">{activity.user}</p>
                      <p className="text-xs text-gray-500">{activity.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      case 'inventory':
        return (
          <Card className="flex flex-col h-full w-full overflow-hidden">
            <CardHeader className="pb-2 shrink-0">
              <CardTitle className="text-base">Live Inventory Monitor</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-auto custom-scrollbar p-0">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs text-gray-500 bg-gray-50/50 uppercase border-b border-gray-100 sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="px-4 py-2 font-medium">Product</th>
                    <th className="px-4 py-2 font-medium">Stock</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr 
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => setExpandedInventoryItem(expandedInventoryItem === item.id ? null : item.id)}
                      >
                        <td className="px-4 py-2 font-medium text-gray-900 truncate max-w-[150px]">{item.name}</td>
                        <td className="px-4 py-2 text-gray-900 font-mono">{item.stock}</td>
                        <td className="px-4 py-2">
                          <Badge variant={item.stock === 0 ? "destructive" : item.stock < 20 ? "warning" : "success"} className="text-[10px] px-1.5 py-0.5">
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                      {expandedInventoryItem === item.id && (
                        <tr>
                          <td colSpan={3} className="bg-gray-50 p-4 border-b border-gray-100 whitespace-normal">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">History</h4>
                                <div className="text-xs space-y-2">
                                  {item.history && item.history.map((h: any, i: number) => (
                                    <div key={i} className="flex justify-between border-b border-gray-100 pb-1 last:border-0">
                                      <span className="text-gray-500">{h.date}</span>
                                      <span className={String(h.change).startsWith('+') ? 'text-green-600' : 'text-red-600'}>{h.change}</span>
                                      <span className="text-gray-700">{h.reason}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {item.reviews && item.reviews.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Reviews</h4>
                                  <div className="text-xs space-y-2">
                                    <div className="bg-white p-2 rounded border border-gray-200">
                                      <div className="font-medium text-gray-900">{item.reviews[0].user} <span className="text-yellow-500 ml-1">★ {item.reviews[0].rating}</span></div>
                                      <p className="text-gray-600 mt-1">{item.reviews[0].comment}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        );
      case 'top-products':
         return (
          <Card className="flex flex-col h-full w-full overflow-hidden">
            <CardHeader className="pb-2 shrink-0">
              <CardTitle className="text-base">Top Products</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {[...inventoryData].sort((a,b) => b.price - a.price).slice(0,5).map((item, i) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">#{i + 1}</div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{item.name}</p>
                    </div>
                    <p className="text-sm font-semibold">${item.price}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      case 'cac-chart':
        const mockCAC = [
          { month: 'Jan', cac: 45 }, { month: 'Feb', cac: 52 }, { month: 'Mar', cac: 48 }, 
          { month: 'Apr', cac: 61 }, { month: 'May', cac: 55 }, { month: 'Jun', cac: 50 },
        ];
        return (
          <Card className="flex flex-col h-full w-full">
            <CardHeader className="pb-2 shrink-0">
              <CardTitle className="text-base">CAC Trend</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockCAC} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="cac" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Check your key metrics and adjust layout.</p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => {
                setLayouts(JSON.parse(localStorage.getItem('dashboard-layout-v2') || JSON.stringify(DEFAULT_LAYOUTS)));
                setIsEditing(false);
              }}>Cancel</Button>
              <Button onClick={() => {
                localStorage.setItem('dashboard-layout-v2', JSON.stringify(layouts));
                setIsEditing(false);
              }}>Save Layout</Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Customize Layout
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-start gap-6">
        {/* Main Dashboard Area */}
        <div className={cn("flex-1 px-1 transition-all", isEditing ? "opacity-90" : "")}>
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={60}
            onLayoutChange={onLayoutChange}
            isDraggable={isEditing}
            isResizable={isEditing}
            margin={[16, 16]}
            draggableHandle=".drag-handle"
          >
            {layouts.lg.map((l: any) => (
              <div key={l.i} className={cn("relative group h-full widget-container", isEditing && "ring-1 ring-blue-500 rounded-xl overflow-hidden")}>
                {isEditing && (
                  <div className="absolute top-2 right-2 z-50 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-md text-white rounded p-1">
                    <div className="drag-handle cursor-grab active:cursor-grabbing p-1 hover:bg-white/20 rounded">
                      <GripHorizontal className="w-4 h-4" />
                    </div>
                    <button 
                      onClick={() => removeWidget(l.i)}
                      className="p-1 hover:bg-red-500/80 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {/* Content */}
                <div className={cn("h-full w-full", isEditing ? "pointer-events-none" : "")}>
                  {renderWidgetContent(l.i)}
                </div>
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>

        {/* Sidebar for Available Widgets when Editing */}
        {isEditing && (
          <Card className="w-80 shrink-0 sticky top-6">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-lg">Available Widgets</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 h-[calc(100vh-200px)] overflow-y-auto">
              {AVAILABLE_WIDGETS.map((widget) => {
                const isActive = activeWidgetIds.includes(widget.id);
                return (
                  <div 
                    key={widget.id} 
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      isActive ? "bg-gray-50 border-gray-100 opacity-50" : "bg-white border-gray-200 hover:border-blue-300 transition-colors"
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{widget.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{widget.type}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => addWidget(widget.id)}
                      disabled={isActive}
                      className={cn(isActive && "text-green-600")}
                    >
                      {isActive ? 'Added' : <Plus className="w-4 h-4" />}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function KPICard({ title, value, change, trend, icon: Icon }: any) {
  const isUp = trend === 'up';
  return (
    <Card className="flex flex-col h-full w-full justify-center">
      <CardContent className="p-4 sm:p-6 pb-2 sm:pb-4 flex flex-col justify-center h-full">
        <div className="flex items-center justify-between space-y-0 mb-1 sm:mb-2">
          <p className="text-xs sm:text-sm font-medium text-gray-500 line-clamp-1">{title}</p>
          <Icon className="h-4 w-4 text-gray-400 shrink-0 ml-2" />
        </div>
        <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">{value}</h2>
          <span className={cn(
            "flex items-center text-[10px] sm:text-xs font-medium",
            isUp ? "text-green-600" : "text-red-600"
          )}>
            {isUp ? <ArrowUpRight className="h-3 w-3 sm:mr-1 shrink-0" /> : <ArrowDownRight className="h-3 w-3 sm:mr-1 shrink-0" />}
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

