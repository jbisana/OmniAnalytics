import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAI } from '@/contexts/AIContext';
import { Box, Layers, FileText, Search, Plus, List } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockProducts = [
  { id: 'PRD-101', name: 'Enterprise Cloud Server X1', category: 'Hardware', price: 12000, stock: 45, status: 'Active' },
  { id: 'PRD-102', name: 'Managed Kubernetes Service', category: 'Software/SaaS', price: 500, stock: 'Unlimited', status: 'Active' },
  { id: 'PRD-103', name: 'Secure Router Pro', category: 'Hardware', price: 850, stock: 12, status: 'Low Stock' },
  { id: 'BDL-001', name: 'Starter Infrastructure Bundle', category: 'Bundle', price: 15500, stock: 'Mixed', status: 'Active' },
];

export function ProductCatalogPage() {
  const { isAIEnabled } = useAI();
  const [products, setProducts] = useState(mockProducts);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Box className="w-6 h-6 text-blue-600" />
            Product Catalog & PIM
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage product information, build bundles, and generate spec sheets.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><Layers className="w-4 h-4 mr-2" /> Bundle Builder</Button>
          <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" /> Add Product</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Master Catalog</CardTitle>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search products..." className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-500">ID</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Product Name</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Category</th>
                  <th className="px-4 py-3 font-medium text-gray-500">MSRP</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Stock Level</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{product.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                       {product.category === 'Bundle' ? <Layers className="w-4 h-4 text-purple-500"/> : <Box className="w-4 h-4 text-gray-400"/>}
                       {product.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{product.category}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">${product.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600">{product.stock}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={cn(
                        product.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      )}>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isAIEnabled && (
                           <Button size="sm" variant="ghost" className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" title="Auto-generate Spec Sheet">
                             <Sparkles className="w-4 h-4" />
                           </Button>
                        )}
                        <Button size="sm" variant="ghost" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Layers className="w-5 h-5 text-purple-500"/> Bundle Builder</CardTitle>
            <CardDescription>Combine products and software into salable solutions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="bg-purple-100 p-3 rounded-full mb-3">
                <Plus className="w-6 h-6 text-purple-600" />
              </div>
              <p className="font-medium text-gray-900">Create New Bundle</p>
              <p className="text-sm text-gray-500 mt-1 max-w-sm">Select hardware, software, and services to create a unique SKU with bundled pricing and automated margin calculations.</p>
            </div>
          </CardContent>
        </Card>
        
        {isAIEnabled && (
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
             <CardHeader className="pb-2">
               <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                 <Sparkles className="w-5 h-5 text-indigo-600"/> Copilot: PIM Automation
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="bg-white/70 p-4 rounded-lg border border-indigo-100 shadow-sm flex items-start gap-3">
                  <FileText className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-indigo-900 text-sm">Auto-Generate Spec Sheets</h4>
                    <p className="text-xs text-indigo-700 mt-1 leading-relaxed">AI can instantly generate marketing copy and technical spec sheets for partners by extracting data from manufacturer PDFs.</p>
                    <Button size="sm" variant="outline" className="mt-3 bg-white text-indigo-600 border-indigo-200">Start Extraction</Button>
                  </div>
                </div>
             </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
}
