import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Bell, ChevronDown, ChevronUp, Image as ImageIcon, Star, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<{id: string, message: string}[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [exportFilter, setExportFilter] = useState('All');
  const [historyFilter, setHistoryFilter] = useState<'7d' | '30d' | 'all'>('all');

  const addToast = (message: string) => {
    const id = Math.random().toString(36);
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const handleThresholdChange = async (id: string, field: 'threshold' | 'criticalThreshold', newValue: number) => {
    try {
      await fetch('/api/inventory/thresholds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, field, value: newValue })
      });
    } catch (e) {
      console.error("Failed to update threshold", e);
      addToast("Failed to update threshold.");
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleExport = () => {
    const filtered = inventory.filter(i => exportFilter === 'All' ? true : i.status === exportFilter);
    addToast(`Exported ${filtered.length} items to CSV.`);
  };

  useEffect(() => {
    let oldInventoryMap = new Map<string, number>();

    // Also fetch alert settings
    let alertSettings = { criticalStock: true, lowStock: true, newPartner: false, anomalies: true };
    fetch('/api/settings/alerts')
      .then(res => res.json())
      .then(data => { alertSettings = data; })
      .catch(console.error);

    const es = new EventSource('/api/inventory/stream');
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        let alerts: string[] = [];
        data.forEach((newItem: any) => {
          const oldStock = oldInventoryMap.get(newItem.id);
          if (oldStock !== undefined && oldStock > newItem.stock) {
            // Did it just drop?
            if (alertSettings.criticalStock && newItem.stock <= newItem.criticalThreshold && oldStock > newItem.criticalThreshold) {
              alerts.push(`CRITICAL: ${newItem.name} stock dropped to ${newItem.stock}!!`);
            } else if (alertSettings.lowStock && newItem.stock <= newItem.threshold && oldStock > newItem.threshold) {
              alerts.push(`Alert: ${newItem.name} low stock (${newItem.stock})`);
            }
          }
          oldInventoryMap.set(newItem.id, newItem.stock);
        });

        alerts.forEach(msg => addToast(msg));
        setInventory(data);
        setIsLoading(false);
      } catch (e) {
        console.error("Error parsing SSE data", e);
      }
    };
    
    return () => {
      es.close();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast Notifications */}
      <div className="fixed top-20 right-8 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-white border rounded-lg shadow-lg p-4 flex items-start gap-3 w-80"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${toast.message.startsWith('CRITICAL') ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 leading-tight pr-4">{toast.message}</p>
              </div>
              <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600 mt-0.5 shrink-0">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Live Inventory Monitor</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time stock level synchronization and dynamic alerts.</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={exportFilter}
            onChange={e => setExportFilter(e.target.value)}
            className="border border-gray-200 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Critical Stock">Critical Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <Button onClick={handleExport}>Export CSV</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50/50 uppercase border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium w-16">Image</th>
                <th className="px-6 py-4 font-medium">Product Info</th>
                <th className="px-6 py-4 font-medium">Partner Feedback</th>
                <th className="px-6 py-4 font-medium">Available Stock</th>
                <th className="px-6 py-4 font-medium">Alert Thresholds (Low / Critical)</th>
                <th className="px-6 py-4 font-medium text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <React.Fragment key={item.id}>
                  <tr 
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                  >
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover border border-gray-200 bg-gray-50" />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="flex gap-2 items-center mt-1">
                        <span className="text-xs text-gray-500 font-mono">{item.id}</span>
                        <span className="text-xs text-gray-400">• {item.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-medium text-gray-900">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {item.rating}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{item.partnerFeedback?.length || 0} feedback notes</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <motion.span 
                          key={item.lastUpdated}
                          initial={{ color: '#ef4444', scale: 1.15 }}
                          animate={{ color: '#111827', scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="font-mono text-lg font-medium"
                        >
                          {item.stock}
                        </motion.span>
                        <Badge variant={
                          item.status === "Out of Stock" || item.status === "Critical Stock" ? "destructive" 
                          : item.status === "Low Stock" ? "warning" : "success"
                        }>
                          {item.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col gap-1.5 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-yellow-600 font-medium w-16"><Bell className="w-3.5 h-3.5" /> Low</span>
                          <input 
                            type="number" 
                            value={item.threshold} 
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleThresholdChange(item.id, 'threshold', parseInt(e.target.value) || 0)}
                            className="w-16 h-7 px-1.5 border border-gray-200 rounded text-center text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-shadow"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-red-600 font-medium w-16"><AlertCircle className="w-3.5 h-3.5" /> Critical</span>
                          <input 
                            type="number" 
                            value={item.criticalThreshold} 
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleThresholdChange(item.id, 'criticalThreshold', parseInt(e.target.value) || 0)}
                            className="w-16 h-7 px-1.5 border border-red-200 rounded text-center text-red-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm transition-shadow"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}>
                        {expandedRow === item.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </td>
                  </tr>
                  
                  {/* Expanded Row */}
                  <AnimatePresence>
                    {expandedRow === item.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <td colSpan={6} className="bg-gray-50/50 p-0 border-b border-gray-100">
                          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="flex gap-6">
                              <div className="w-48 h-48 rounded-xl bg-white border border-gray-200 flex-shrink-0 overflow-hidden hidden sm:block">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ImageIcon className="w-12 h-12" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 space-y-4">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Partner Feedback</h4>
                                  <div className="space-y-3">
                                    {item.partnerFeedback && item.partnerFeedback.length > 0 ? item.partnerFeedback.map((rev: any, idx: number) => (
                                      <div key={idx} className="bg-white p-3 rounded border border-gray-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="font-medium text-gray-900 text-xs">{rev.partner}</span>
                                          <div className="flex items-center gap-2">
                                            <div className="flex items-center text-yellow-400">
                                              <Star className="w-3 h-3 fill-current" />
                                              <span className="text-gray-700 text-xs ml-1 font-medium">{rev.rating}</span>
                                            </div>
                                            <span className="text-xs text-gray-400">{rev.date}</span>
                                          </div>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>
                                      </div>
                                    )) : (
                                      <p className="text-sm text-gray-500 italic">No feedback yet.</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col h-full">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-900">Stock History</h4>
                                <select 
                                  value={historyFilter} 
                                  onChange={(e) => setHistoryFilter(e.target.value as any)}
                                  className="border border-gray-200 rounded text-xs px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="7d">Last 7 Days</option>
                                  <option value="30d">Last 30 Days</option>
                                  <option value="all">All Time</option>
                                </select>
                              </div>
                              <div className="bg-white border text-sm border-gray-200 rounded-lg overflow-y-auto max-h-48 custom-scrollbar mb-6">
                                <table className="w-full text-left">
                                  <thead className="bg-gray-50 text-xs text-gray-500 sticky top-0">
                                    <tr>
                                      <th className="px-4 py-2 font-medium">Date/Time</th>
                                      <th className="px-4 py-2 font-medium">Change</th>
                                      <th className="px-4 py-2 font-medium">Reason</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(() => {
                                      const filtered = item.history ? item.history.slice(0, historyFilter === '7d' ? 7 : historyFilter === '30d' ? 30 : undefined) : [];
                                      return filtered.length > 0 ? filtered.map((hist: any, hIdx: number) => (
                                        <tr key={hIdx} className="border-t border-gray-100">
                                          <td className="px-4 py-2 text-gray-500">{hist.date}</td>
                                          <td className="px-4 py-2">
                                            <span className={`font-mono font-medium ${String(hist.change).startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                              {hist.change}
                                            </span>
                                          </td>
                                          <td className="px-4 py-2 text-gray-900">{hist.reason}</td>
                                        </tr>
                                      )) : (
                                        <tr><td colSpan={3} className="px-4 py-4 text-center text-gray-500 italic">No recent history</td></tr>
                                      );
                                    })()}
                                  </tbody>
                                </table>
                              </div>
                              
                              {(() => {
                                const filtered = item.history ? item.history.slice(0, historyFilter === '7d' ? 7 : historyFilter === '30d' ? 30 : undefined) : [];
                                let current = item.stock;
                                const dataPoints = [ { date: 'Now', stock: current } ];
                                for (let hist of filtered) {
                                  const change = parseInt(hist.change || '0', 10);
                                  current = current - change;
                                  dataPoints.unshift({ date: hist.date, stock: current });
                                }
                                return (
                                  <div className="flex-1 min-h-[200px] flex flex-col">
                                    <h4 className="font-semibold text-gray-900 mb-3">Historical Stock Level</h4>
                                    <div className="flex-1 w-full min-h-[200px] bg-white border border-gray-200 rounded-lg p-4">
                                      <ResponsiveContainer width="100%" height="100%" minHeight={200} minWidth={0}>
                                        <LineChart data={dataPoints} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} minTickGap={20} />
                                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                                          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                          <Line type="stepAfter" dataKey="stock" name="Stock" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }} />
                                        </LineChart>
                                      </ResponsiveContainer>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                            
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
