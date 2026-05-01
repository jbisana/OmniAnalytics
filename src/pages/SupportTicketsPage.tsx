import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ticketsData } from '@/data/mockData';
import { Plus, Filter, MessageSquare, AlertCircle, CheckCircle2, Clock, LifeBuoy, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAI } from '@/contexts/AIContext';

export function SupportTicketsPage() {
  const { isAIEnabled } = useAI();
  const [filter, setFilter] = useState('All');

  const getSLAColor = (slaStatus: string) => {
    switch (slaStatus) {
      case 'Healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Breached':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <AlertTriangle className="w-3.5 h-3.5 mr-1 text-red-500" />;
      case 'Medium':
        return <Clock className="w-3.5 h-3.5 mr-1 text-yellow-500" />;
      case 'Low':
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredTickets = filter === 'All' ? ticketsData : ticketsData.filter(t => t.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Support & Ticketing</h1>
          <p className="text-sm text-gray-500 mt-1">Manage post-sale requests, RMAs, defect reporting, and SLAs.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-white gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> New Ticket
          </Button>
        </div>
      </div>

      {isAIEnabled && (
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-100">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-2 bg-red-100 rounded-lg shrink-0 mt-1">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900 text-sm">AI Defect & SLA Alert</h3>
              <p className="text-sm text-red-800 mt-1 leading-relaxed">
                Ticket <strong>TKT-1084 (Acme Corp)</strong> has breached its SLA. Furthermore, this is the 3rd report of "Server Node Failure" from Batch A. AI suggests initiating a proactive recall for remaining Batch A inventory.
                <div className="mt-2 flex gap-2">
                  <button className="px-2 py-0.5 bg-red-600 text-white font-medium rounded text-xs hover:bg-red-700 transition">View SLA Details</button>
                  <button className="px-2 py-0.5 bg-white text-red-700 border border-red-200 font-medium rounded text-xs hover:bg-red-50 transition">Draft Communication</button>
                </div>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex bg-gray-100/80 p-1 rounded-xl w-fit">
        {['All', 'Open', 'In Progress', 'Resolved'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-all', filter === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}
          >
            {tab}
          </button>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm bg-gray-50/50">
                <th className="px-6 py-4 font-medium text-gray-500">Ticket #</th>
                <th className="px-6 py-4 font-medium text-gray-500">Partner</th>
                <th className="px-6 py-4 font-medium text-gray-500">Subject</th>
                <th className="px-6 py-4 font-medium text-gray-500">Priority</th>
                <th className="px-6 py-4 font-medium text-gray-500">SLA Status</th>
                <th className="px-6 py-4 font-medium text-gray-500 text-center">Ticket Status</th>
                <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTickets.map((ticket: any) => (
                <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{ticket.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {ticket.partner}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{ticket.subject}</span>
                      <span className="text-xs text-gray-500">{ticket.type} • {new Date(ticket.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center text-sm">
                      {getPriorityIcon(ticket.priority)}
                      {ticket.priority}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={cn("inline-flex text-xs px-2.5 py-0.5 border", getSLAColor(ticket.slaStatus))}>
                      {ticket.slaStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="outline" className={cn("inline-flex text-xs px-2.5 py-0.5 border", getStatusColor(ticket.status))}>
                      {ticket.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTickets.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No tickets found for this filter.
            </div>
          )}
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium flex items-center gap-2">
              <LifeBuoy className="w-4 h-4" /> RMA Processing Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">4.2 Days</div>
            <div className="text-sm text-green-600 mt-1 flex items-center gap-1">
              ↓ 12% vs last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Defect Rate (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0.8%</div>
            <div className="text-sm text-yellow-600 mt-1 flex items-center gap-1">
              ↑ 0.1% vs last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> SLA Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">92%</div>
            <div className="text-sm text-red-600 mt-1 flex items-center gap-1">
              ↓ 3% vs target (95%)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
