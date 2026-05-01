import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Search, Plus, Clock, CheckCircle2, XCircle, ShieldAlert, Navigation, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAI } from '@/contexts/AIContext';

const initialDeals = [
  { id: 'DR-9021', clientName: 'Cyberdyne Systems', product: 'Enterprise Server Batch A', value: 120000, status: 'Approved', submittedDate: '2024-10-15', expiryDate: '2024-12-15' },
  { id: 'DR-9022', clientName: 'Initech', product: 'Cloud Migration Services', value: 45000, status: 'Pending', submittedDate: '2024-11-01', expiryDate: '-' },
  { id: 'DR-9018', clientName: 'Massive Dynamic', product: 'Data Warehouse Setup', value: 85000, status: 'Rejected', submittedDate: '2024-09-22', expiryDate: '-' },
  { id: 'DR-9015', clientName: 'Soylent Corp', product: 'Logistics Software Platform', value: 32000, status: 'Closed Won', submittedDate: '2024-08-10', expiryDate: '2024-11-10' },
];

export function PartnerDealRegistrationPage() {
  const { isAIEnabled } = useAI();
  const [deals, setDeals] = useState(initialDeals);
  const [isRegistering, setIsRegistering] = useState(false);
  const [newDealClient, setNewDealClient] = useState('');

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Approved': return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      case 'Pending': return <Clock className="w-3.5 h-3.5 mr-1" />;
      case 'Rejected': return <XCircle className="w-3.5 h-3.5 mr-1" />;
      case 'Closed Won': return <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Approved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Closed Won': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
       {/* Simulation Header (Portal environment context) */}
       <div className="bg-slate-900 text-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold tracking-tight">Acme Corp - Partner Portal</h1>
          </div>
          <p className="text-sm text-slate-400">Deal Registration & Opportunity Management</p>
        </div>
        <div>
           <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setIsRegistering(true)}>
             <Plus className="w-4 h-4 mr-2" /> Register New Deal
           </Button>
        </div>
      </div>

      {isAIEnabled && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-2 bg-emerald-100 rounded-lg shrink-0 mt-1">
              <ShieldAlert className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-900 text-sm">AI Channel Conflict Sentinel</h3>
              <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                Before submitting a new deal, our AI automatically cross-references the central CRM to ensure no direct sales reps or other partners are actively working this account. This guarantees your <strong>exclusive partner margin</strong> if the deal is approved.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isRegistering ? (
        <Card className="border-emerald-200 shadow-md">
          <CardHeader className="bg-emerald-50/50 border-b border-emerald-100">
            <CardTitle>Register a New Opportunity</CardTitle>
            <CardDescription>Submit client details to lock in your pricing and exclusivity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">End Client Name *</label>
                  <input 
                    type="text" 
                    value={newDealClient}
                    onChange={(e) => setNewDealClient(e.target.value)}
                    className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                    placeholder="Company Name" 
                  />
                  {newDealClient.toLowerCase() === 'acme corp' && (
                    <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
                      <XCircle className="w-3 h-3" /> Potential Conflict: Account already exists in CRM.
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Client Website</label>
                  <input type="text" className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="www.example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Estimated Deal Value ($) *</label>
                  <input type="number" className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="50000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Expected Close Date *</label>
                  <input type="date" className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Products / Services Scoped</label>
                  <textarea className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none h-24" placeholder="Describe the opportunity..."></textarea>
                </div>
             </div>
          </CardContent>
          <CardFooter className="justify-end border-t border-gray-100 pt-6 gap-3">
             <Button variant="outline" onClick={() => setIsRegistering(false)}>Cancel</Button>
             <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setIsRegistering(false)}>Submit Registration</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <div className="p-4 border-b border-gray-100 flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search registered deals..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-sm border-b border-gray-100">
                  <th className="px-6 py-4 font-medium text-gray-500">Deal ID</th>
                  <th className="px-6 py-4 font-medium text-gray-500">End Client</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Products</th>
                  <th className="px-6 py-4 font-medium text-gray-500 text-right">Est. Value</th>
                  <th className="px-6 py-4 font-medium text-gray-500 text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Dates</th>
                  <th className="px-6 py-4 font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{deal.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900 text-sm">{deal.clientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{deal.product}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                      ${deal.value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className={cn("inline-flex items-center text-xs px-2.5 py-0.5 border", getStatusColor(deal.status))}>
                        {getStatusIcon(deal.status)}
                        {deal.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500">Submitted: {deal.submittedDate}</div>
                      {deal.status === 'Approved' && <div className="text-xs text-blue-600 font-medium">Expires: {deal.expiryDate}</div>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
