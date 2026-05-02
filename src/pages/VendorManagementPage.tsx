import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAI } from '@/contexts/AIContext';
import { Truck, ShieldCheck, Mail, Star, ExternalLink, FileText, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const mockVendors = [
  { id: 'V-101', name: 'Cisco Systems', category: 'Hardware', status: 'Active', compliance: 'Verified', scorecard: 95 },
  { id: 'V-102', name: 'Microsoft Azure', category: 'Cloud Services', status: 'Active', compliance: 'Verified', scorecard: 98 },
  { id: 'V-103', name: 'Local Logistics Pro', category: 'Shipping', status: 'Onboarding', compliance: 'Pending', scorecard: null },
  { id: 'V-104', name: 'SecureTech', category: 'Security Configs', status: 'Active', compliance: 'Expired Info', scorecard: 72 },
];

export function VendorManagementPage() {
  const { isAIEnabled } = useAI();
  const [vendors, setVendors] = useState(mockVendors);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-emerald-600" />
            Vendor & Supplier Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Onboard suppliers, automate POs, and review vendor scorecards.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><FileText className="w-4 h-4 mr-2" /> PO Automation</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700"><Mail className="w-4 h-4 mr-2" /> Invite Vendor</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Supplier Directory</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-500">Vendor</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Category</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Compliance</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Scorecard</th>
                      <th className="px-4 py-3 font-medium text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {vendors.map((vendor) => (
                      <tr key={vendor.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">{vendor.name}</td>
                        <td className="px-4 py-3 text-gray-600">{vendor.category}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={cn(
                            vendor.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                          )}>
                            {vendor.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "flex items-center gap-1.5 text-xs font-medium",
                            vendor.compliance === 'Verified' ? 'text-emerald-600' :
                            vendor.compliance === 'Pending' ? 'text-amber-500' : 'text-red-500'
                          )}>
                            {vendor.compliance === 'Verified' && <ShieldCheck className="w-4 h-4" />}
                            {vendor.compliance}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {vendor.scorecard ? (
                             <div className="flex items-center gap-2">
                               <span className="font-semibold text-gray-900">{vendor.scorecard}</span>
                               <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                             </div>
                          ) : (
                             <span className="text-gray-400 text-xs italic">Not rated</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="ghost" className="h-8">Details</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gray-50/50 border-dashed">
            <CardContent className="p-6 text-center space-y-4">
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-100">
                 <ExternalLink className="w-6 h-6 text-emerald-600" />
               </div>
               <div>
                 <h3 className="font-semibold text-gray-900">Vendor Portal Access</h3>
                 <p className="text-sm text-gray-500 mt-1">Suppliers can log in here to upload W-9s, manage inventory, and receive POs.</p>
               </div>
               <Button variant="outline" className="w-full bg-white">Copy Portal Link</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Purchase Order Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                 <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                   <div className="flex items-center gap-3">
                     <FileText className="w-5 h-5 text-blue-500" />
                     <div>
                       <p className="text-sm font-medium text-gray-900">PO-4092</p>
                       <p className="text-xs text-gray-500">Cisco Systems</p>
                     </div>
                   </div>
                   <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Fulfilled</Badge>
                 </div>
                 <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                   <div className="flex items-center gap-3">
                     <FileText className="w-5 h-5 text-gray-400" />
                     <div>
                       <p className="text-sm font-medium text-gray-900">PO-4093 (Draft)</p>
                       <p className="text-xs text-amber-600 font-medium mt-0.5">Awaiting Low-Stock Trigger</p>
                     </div>
                   </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
