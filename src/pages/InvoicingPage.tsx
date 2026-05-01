import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { quotesData, invoicesData } from '@/data/mockData';
import { Plus, Download, FileText, CheckCircle2, Clock, AlertCircle, FileSignature, Receipt, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAI } from '@/contexts/AIContext';

export function InvoicingPage() {
  const [activeTab, setActiveTab] = useState<'quotes' | 'invoices'>('quotes');
  const { isAIEnabled } = useAI();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
      case 'Accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
      case 'Sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Draft':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
      case 'Accepted':
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      case 'Pending':
      case 'Sent':
        return <Clock className="w-3.5 h-3.5 mr-1" />;
      case 'Overdue':
        return <AlertCircle className="w-3.5 h-3.5 mr-1" />;
      case 'Draft':
      default:
        return <FileText className="w-3.5 h-3.5 mr-1" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Invoicing & Billing</h1>
          <p className="text-sm text-gray-500 mt-1">Manage B2B quoting, billing, and payment tracking.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-white gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> New {activeTab === 'quotes' ? 'Quote' : 'Invoice'}
          </Button>
        </div>
      </div>

      {isAIEnabled && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg shrink-0 mt-1">
              <Receipt className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 text-sm">AI Receivable Insights</h3>
              <p className="text-sm text-blue-800 mt-1 leading-relaxed">
                You have <strong>1 overdue invoice</strong> (Quantum Dynamics) totaling $9,800.00. Based on previous payment patterns, an automated friendly reminder has been drafted. 
                <button className="ml-2 px-2 py-0.5 bg-blue-600 text-white font-medium rounded text-xs hover:bg-blue-700 transition">Review & Send</button>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex bg-gray-100/80 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('quotes')}
          className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-all', activeTab === 'quotes' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}
        >
          Active Quotes
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-all', activeTab === 'invoices' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}
        >
          Invoices
        </button>
      </div>

      {/* Data Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm bg-gray-50/50">
                <th className="px-6 py-4 font-medium text-gray-500">{activeTab === 'quotes' ? 'Quote #' : 'Invoice #'}</th>
                <th className="px-6 py-4 font-medium text-gray-500">Partner</th>
                <th className="px-6 py-4 font-medium text-gray-500">Date Issued</th>
                <th className="px-6 py-4 font-medium text-gray-500">{activeTab === 'quotes' ? 'Valid Until' : 'Due Date'}</th>
                <th className="px-6 py-4 font-medium text-gray-500 text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-gray-500 text-center">Status</th>
                <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(activeTab === 'quotes' ? quotesData : invoicesData).map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className="font-medium text-sm text-gray-900">{item.partner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(item.dueDate || item.validUntil).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                    ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="outline" className={cn("inline-flex items-center text-xs px-2.5 py-0.5 border", getStatusColor(item.status))}>
                      {getStatusIcon(item.status)}
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900">
                      <Download className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
