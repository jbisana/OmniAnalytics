import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileSignature, Globe, AlertCircle, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { useAI } from '@/contexts/AIContext';

const mockTaxRules = [
  { region: 'California (US)', taxType: 'Sales Tax', rate: '7.25%', nexus: true, status: 'Compliant' },
  { region: 'New York (US)', taxType: 'Sales Tax', rate: '4.00%', nexus: true, status: 'Action Needed' },
  { region: 'United Kingdom', taxType: 'VAT', rate: '20.00%', nexus: true, status: 'Compliant' },
  { region: 'Germany', taxType: 'VAT', rate: '19.00%', nexus: false, status: 'Monitoring' },
];

export function TaxCompliancePage() {
  const { isAIEnabled } = useAI();
  const [taxRules, setTaxRules] = useState(mockTaxRules);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <FileSignature className="w-6 h-6 text-indigo-600" />
            Tax & Compliance Engine
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage multi-jurisdiction tax calculations and compliance tracking.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><Globe className="w-4 h-4 mr-2" /> Sync Engine (Avalara/TaxJar)</Button>
        </div>
      </div>

      {isAIEnabled && (
        <Card className="border-indigo-100 shadow-sm bg-indigo-50/50">
          <CardHeader className="pb-3 border-b border-indigo-100/50">
            <CardTitle className="text-base text-indigo-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" /> AI Compliance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" /> Approaching Economic Nexus in Germany
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Based on recent partner sales velocity in the EU region, you are projected to pass the €10,000 threshold for VAT registration in Germany next month.
                </p>
              </div>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Review Nexus</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Jurisdiction Monitor</CardTitle>
            <CardDescription>Track active tax nexus and registration status.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {taxRules.map((rule, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div>
                    <h4 className="font-medium text-gray-900">{rule.region}</h4>
                    <p className="text-sm text-gray-500">{rule.taxType} • Standard Rate: {rule.rate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {rule.nexus ? (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">Nexus Met</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-gray-500">No Nexus</Badge>
                    )}
                    
                    {rule.status === 'Compliant' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : rule.status === 'Action Needed' ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Tax Transactions</CardTitle>
            <CardDescription>Automated tax calculations on recent invoices.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-gray-100">
               {[1, 2, 3].map(i => (
                 <div key={i} className="p-4 flex items-center justify-between">
                   <div>
                     <p className="font-medium text-gray-900">INV-2026-00{i}</p>
                     <p className="text-sm text-gray-500">{['California', 'New York', 'United Kingdom'][i-1]} Customer</p>
                   </div>
                   <div className="text-right">
                     <p className="font-medium text-gray-900">${(75 * i).toFixed(2)}</p>
                     <p className="text-xs text-gray-500">Tax Collected</p>
                   </div>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
