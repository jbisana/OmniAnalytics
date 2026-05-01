import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LifeBuoy, Plus, UploadCloud, MessageSquare, Clock, Search, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAI } from '@/contexts/AIContext';

// Mock data for partner's own tickets
const partnerTickets = [
  { id: 'TKT-1084', type: 'Defect', status: 'Open', subject: 'Server Node Failure - Batch A', date: '2024-11-01', slaCountdown: 'Breached' },
  { id: 'TKT-1022', type: 'Billing', status: 'Resolved', subject: 'Invoice INV-2024-001 Inquiry', date: '2024-10-25', slaCountdown: '-' },
];

const resentOrders = [
  { id: 'ORD-51920', date: '2024-10-15', items: 'Server Batch A (x50)' },
  { id: 'ORD-51888', date: '2024-09-02', items: 'Edge Router (x10)' },
];

export function PartnerSupportPortalPage() {
  const { isAIEnabled } = useAI();
  const [activeTab, setActiveTab] = useState<'tickets' | 'new'>('tickets');
  const [requestType, setRequestType] = useState('rma');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setActiveTab('tickets');
      // In a real app, we would add the new ticket to the list
    }, 1500);
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

  return (
    <div className="space-y-6">
      {/* Simulation Header */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LifeBuoy className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-bold tracking-tight">Acme Corp - Partner Portal</h1>
          </div>
          <p className="text-sm text-slate-400">Helpdesk & Return Merchandise Authorization (RMA)</p>
        </div>
        <div>
           <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setActiveTab('new')}>
             <Plus className="w-4 h-4 mr-2" /> New Request
           </Button>
        </div>
      </div>

      {isAIEnabled && activeTab === 'new' && requestType === 'rma' && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-2 bg-indigo-100 rounded-lg shrink-0 mt-1">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900 text-sm">AI Instant RMA Approval eligible</h3>
              <p className="text-sm text-indigo-800 mt-1 leading-relaxed">
                As a Premium Partner, returns on orders under $10,000 are eligible for <strong>Instant AI Approval</strong>. Upload a clear photo of the defect, and our vision model will automatically authorize the return shipping label without waiting for manual agent review.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex bg-gray-100/80 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('tickets')}
          className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-all', activeTab === 'tickets' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}
        >
          My Tickets
        </button>
        <button
          onClick={() => setActiveTab('new')}
          className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-all', activeTab === 'new' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}
        >
          Submit Request
        </button>
      </div>

      {activeTab === 'tickets' ? (
        <Card>
          <div className="p-4 border-b border-gray-100 flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search ticket number, subject..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-sm border-b border-gray-100">
                  <th className="px-6 py-4 font-medium text-gray-500">Ticket #</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Subject</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Type</th>
                  <th className="px-6 py-4 font-medium text-gray-500 text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-gray-500 border-l border-gray-100 bg-red-50/30">SLA Countdown</th>
                  <th className="px-6 py-4 font-medium text-gray-500 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {partnerTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{ticket.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{ticket.subject}</span>
                        <span className="text-xs text-gray-500">Opened: {ticket.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ticket.type}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className={cn("inline-flex items-center text-xs px-2.5 py-0.5 border", getStatusColor(ticket.status))}>
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 border-l border-gray-100 bg-red-50/10">
                      {ticket.slaCountdown === 'Breached' ? (
                        <div className="inline-flex items-center gap-1 text-red-600 font-medium text-sm">
                          <Clock className="w-4 h-4" /> Breached
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">{ticket.slaCountdown}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">
                        <MessageSquare className="w-3.5 h-3.5 mr-1 inline" /> View Thread
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="max-w-3xl border-indigo-100 shadow-md">
          <form onSubmit={handleSubmit}>
            <CardHeader className="bg-indigo-50/50 border-b border-indigo-100">
              <CardTitle>Submit a Request</CardTitle>
              <CardDescription>Open a support ticket or request a return authorization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">Request Type *</label>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                   {['rma', 'defect', 'billing', 'general'].map(type => (
                     <div 
                       key={type}
                       onClick={() => setRequestType(type)}
                       className={cn(
                         "border rounded-lg p-3 text-center cursor-pointer transition-all",
                         requestType === type ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600" : "border-gray-200 hover:border-indigo-300 bg-white text-gray-600"
                       )}
                     >
                       <div className="text-sm font-medium">
                         {type === 'rma' ? 'Return (RMA)' : type === 'defect' ? 'Report Defect' : type === 'billing' ? 'Billing Issue' : 'General Support'}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               {(requestType === 'rma' || requestType === 'defect') && (
                 <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                   <label className="text-sm font-medium text-gray-900">Which order does this relate to? *</label>
                   <select required className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                     <option value="">Select an order...</option>
                     {resentOrders.map(o => (
                       <option key={o.id} value={o.id}>{o.id} ({o.date}) - {o.items}</option>
                     ))}
                   </select>
                   <p className="text-xs text-gray-500 pt-1">Only orders from the last 90 days are eligible for standard RMA.</p>
                 </div>
               )}

               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">Subject *</label>
                 <input required type="text" className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Brief description of the issue" />
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">Details *</label>
                 <textarea required className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-32" placeholder="Please provide as much context as possible..."></textarea>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">Attachments (Photos, Logs, Invoices)</label>
                 <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="mx-auto w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1">Click or drag files to upload</h4>
                    <p className="text-xs text-gray-500">Required for RMAs: Photo of the defect and serial number.</p>
                 </div>
               </div>

            </CardContent>
            <CardFooter className="justify-end border-t border-gray-100 pt-5 bg-gray-50">
               <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" type="submit" disabled={isSubmitting}>
                 {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
               </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}
