import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Percent, TrendingUp, Download, Settings, Users, Calculator, Gift } from 'lucide-react';
import { useAI } from '@/contexts/AIContext';

const mockCommissions = [
  { id: 'COM-001', partner: 'Acme Corp', type: 'Tier 1 Rebate', period: 'Q1 2026', totalSales: 450000, rate: 5, amount: 22500, status: 'Calculated' },
  { id: 'COM-002', partner: 'TechStart Inc', type: 'Spiff / Bonus', period: 'April 2026', totalSales: 0, rate: 0, amount: 5000, status: 'Paid' },
  { id: 'COM-003', partner: 'Global IT Solutions', type: 'Tier 2 Rebate', period: 'Q1 2026', totalSales: 1200000, rate: 8, amount: 96000, status: 'Pending Review' },
  { id: 'COM-004', partner: 'Nexus Partners', type: 'Standard Commission', period: 'March 2026', totalSales: 85000, rate: 3, amount: 2550, status: 'Paid' },
];

export function CommissionsPage() {
  const { isAIEnabled } = useAI();
  const [commissions, setCommissions] = useState(mockCommissions);
  const [isCalculating, setIsCalculating] = useState(false);

  const totalCommissions = commissions.reduce((sum, c) => sum + c.amount, 0);

  const runCalculation = () => {
    setIsCalculating(true);
    setTimeout(() => {
      // Simulate generated commission row
      const newCommission = {
        id: `COM-00${commissions.length + 1}`,
        partner: 'Quantum Tech',
        type: 'Tier 3 Rebate',
        period: 'Q2 2026',
        totalSales: 2500000,
        rate: 10,
        amount: 250000,
        status: 'Calculated'
      };
      setCommissions([newCommission, ...commissions]);
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-blue-600" />
            Commissions & Rebates
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage partner incentives, calculate tiered rebates, and tracking payouts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><Settings className="w-4 h-4 mr-2" /> Incentive Rules</Button>
          <Button onClick={runCalculation} disabled={isCalculating}>
            <Calculator className="w-4 h-4 mr-2" /> 
            {isCalculating ? 'Calculating...' : 'Run Calculation'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Payouts (YTD)</p>
              <h3 className="text-2xl font-bold text-gray-900">${totalCommissions.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <Percent className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Effective Rebate</p>
              <h3 className="text-2xl font-bold text-gray-900">4.8%</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <Gift className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Spiffs</p>
              <h3 className="text-2xl font-bold text-gray-900">12 Programs</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Calculations & Payouts</CardTitle>
              <CardDescription>Track partner rebate tiers and commission payouts.</CardDescription>
            </div>
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2"/> Export</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-500">ID</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Partner</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Type</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Period</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Qualifying Sales</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Rate</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Payout Amount</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {commissions.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-500">{c.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{c.partner}</td>
                    <td className="px-4 py-3 text-gray-600">{c.type}</td>
                    <td className="px-4 py-3 text-gray-600">{c.period}</td>
                    <td className="px-4 py-3 text-gray-900">${c.totalSales.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600">{c.rate}%</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">${c.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={
                        c.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        c.status === 'Calculated' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }>
                        {c.status}
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
  );
}
