import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, ShieldCheck, Mail, AlertTriangle, AlertCircle, CheckCircle2, XCircle, Settings2, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAI } from '@/contexts/AIContext';

const initialUsers = [
  { id: 'usr_1', name: 'Alice Admin', email: 'alice@acmecorp.com', role: 'HQ Admin', branch: 'Global HQ', limit: null, spend: 45000 },
  { id: 'usr_2', name: 'Bob Buyer', email: 'bob@emea.acmecorp.com', role: 'Branch Buyer', branch: 'Acme Corp (EMEA)', limit: 10000, spend: 8500 },
  { id: 'usr_3', name: 'Charlie Chen', email: 'charlie@apac.acmecorp.com', role: 'Branch Buyer', branch: 'Acme Corp (APAC)', limit: 15000, spend: 1200 },
  { id: 'usr_4', name: 'Diana Davis', email: 'diana@na.acmecorp.com', role: 'Procurement', branch: 'Acme Corp (NA)', limit: 25000, spend: 20000 },
];

const initialApprovals = [
  { id: 'ORD-52500', date: '2024-11-04', buyer: 'Bob Buyer', branch: 'Acme Corp (EMEA)', items: 'High-Density Server Racks (x2)', total: 9500, buyerLimit: 10000, status: 'Needs Approval' },
  { id: 'ORD-52501', date: '2024-11-05', buyer: 'Diana Davis', branch: 'Acme Corp (NA)', items: 'Cloud Security Software License', total: 26000, buyerLimit: 25000, status: 'Needs Approval (Over Limit)' }
];

export function PartnerTeamManagementPage() {
  const { isAIEnabled } = useAI();
  const [activeTab, setActiveTab] = useState<'team' | 'approvals'>('team');
  const [team, setTeam] = useState(initialUsers);
  const [approvals, setApprovals] = useState(initialApprovals);
  const [isInviting, setIsInviting] = useState(false);

  const approveOrder = (id: string) => {
    setApprovals(approvals.filter(a => a.id !== id));
  };

  const rejectOrder = (id: string) => {
    setApprovals(approvals.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Simulation Header */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold tracking-tight">Acme Corp - Portal Admin Hub</h1>
          </div>
          <p className="text-sm text-slate-400">Manage procurement team, spending limits, and approvals.</p>
        </div>
        <div>
           {activeTab === 'team' && (
             <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setIsInviting(true)}>
               <Plus className="w-4 h-4 mr-2" /> Invite User
             </Button>
           )}
        </div>
      </div>

      {isAIEnabled && activeTab === 'team' && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-2 bg-purple-100 rounded-lg shrink-0 mt-1">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900 text-sm">AI Spend Limit Advisory</h3>
              <p className="text-sm text-purple-800 mt-1 leading-relaxed">
                <strong>Diana Davis (NA)</strong> is frequently hitting her $25,000 monthly limit, triggering 3 manual approval requests this week. AI predicts her average necessary spend is $32,000 based on cyclical business needs.
                <button className="ml-2 px-2 py-0.5 bg-purple-600 text-white font-medium rounded text-xs hover:bg-purple-700 transition">Auto-adjust limit to $35k</button>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isAIEnabled && activeTab === 'approvals' && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-2 bg-emerald-100 rounded-lg shrink-0 mt-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-900 text-sm">AI Contract Compliance Check</h3>
              <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                Order <strong>ORD-52500</strong> contains items that classify for your pre-negotiated volume discount under the current master MSA. Approving this order will automatically apply a 15% markdown.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex bg-gray-100/80 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('team')}
          className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2', activeTab === 'team' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}
        >
          <Users className="w-4 h-4" /> Team Settings
        </button>
        <button
          onClick={() => setActiveTab('approvals')}
          className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2', activeTab === 'approvals' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}
        >
          <CheckCircle2 className="w-4 h-4" /> Pending Approvals
          {approvals.length > 0 && (
            <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-[10px] font-bold">{approvals.length}</span>
          )}
        </button>
      </div>

      {activeTab === 'team' ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-sm border-b border-gray-100">
                  <th className="px-6 py-4 font-medium text-gray-500">User / Buyer</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Role</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Assigned Branch (Child)</th>
                  <th className="px-6 py-4 font-medium text-gray-500 text-right">Spend Limit / Mo</th>
                  <th className="px-6 py-4 font-medium text-gray-500 text-right">Current Spend</th>
                  <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {team.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 text-sm">{user.name}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-gray-50">{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        {user.branch}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                      {user.limit === null ? (
                        <span className="text-gray-400 text-xs uppercase tracking-wider">No Limit</span>
                      ) : (
                        `$${user.limit.toLocaleString()}`
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className={cn("text-sm font-bold", 
                          user.limit !== null && user.spend >= user.limit * 0.9 ? 'text-red-600' : 'text-gray-900'
                        )}>${user.spend.toLocaleString()}</span>
                        {user.limit !== null && (
                          <div className="w-24 bg-gray-100 h-1.5 rounded-full mt-1.5 overflow-hidden flex">
                            <div className={cn("h-full", user.spend >= user.limit ? 'bg-red-500' : 'bg-blue-500')} style={{ width: `${Math.min(100, (user.spend / user.limit) * 100)}%` }}></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900 h-8 w-8 p-0">
                        <Settings2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card>
           <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-sm border-b border-gray-100">
                  <th className="px-6 py-4 font-medium text-gray-500">Order ID</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Buyer & Branch</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Items Requested</th>
                  <th className="px-6 py-4 font-medium text-gray-500 text-right">Order Total</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Alert</th>
                  <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {approvals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      <CheckCircle2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      No pending approvals.
                    </td>
                  </tr>
                ) : (
                  approvals.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {order.id}
                        <div className="text-xs text-gray-500 font-normal mt-0.5">{order.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{order.buyer}</span>
                          <span className="text-xs text-gray-500">{order.branch}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{order.items}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                        ${order.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {order.status.includes('Over Limit') ? (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Over Buyer Limit</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Requires Sign-off</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => rejectOrder(order.id)}>
                             Reject
                           </Button>
                           <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => approveOrder(order.id)}>
                             Approve
                           </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
