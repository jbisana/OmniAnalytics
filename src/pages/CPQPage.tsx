import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { inventoryData } from '@/data/mockData';
import { Calculator, Plus, Trash2, Send, Save, Download, Percent, AlertCircle, Search, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAI } from '@/contexts/AIContext';

interface QuoteItem {
  id: string;
  product: any;
  quantity: number;
  customDiscount: number;
}

export function CPQPage() {
  const { isAIEnabled } = useAI();
  const [searchTerm, setSearchTerm] = useState('');
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [partnerFilter, setPartnerFilter] = useState('Acme Corp');

  const filteredProducts = inventoryData.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()));

  const addItemToQuote = (product: any) => {
    const existing = quoteItems.find(i => i.product.id === product.id);
    if (existing) {
      setQuoteItems(quoteItems.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setQuoteItems([...quoteItems, { id: Math.random().toString(), product, quantity: 1, customDiscount: 0 }]);
    }
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) return;
    setQuoteItems(quoteItems.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const updateDiscount = (id: string, discount: number) => {
    if (discount < 0 || discount > 100) return;
    setQuoteItems(quoteItems.map(i => i.id === id ? { ...i, customDiscount: discount } : i));
  };

  const removeItem = (id: string) => {
    setQuoteItems(quoteItems.filter(i => i.id !== id));
  };

  // Calculate totals
  const subtotals = quoteItems.map(i => {
    const basePrice = i.product.price * i.quantity;
    
    // Auto volume discount tier
    let volumeDiscountPct = 0;
    if (i.quantity >= 100) volumeDiscountPct = 15;
    else if (i.quantity >= 50) volumeDiscountPct = 10;
    else if (i.quantity >= 10) volumeDiscountPct = 5;

    // Use custom discount if it's explicitly set and greater, or just stack them? 
    // Let's use custom discount overriding volume if > 0, otherwise volume discount.
    const effectiveDiscountPct = i.customDiscount > 0 ? i.customDiscount : volumeDiscountPct;
    
    const discountAmt = basePrice * (effectiveDiscountPct / 100);
    const finalPrice = basePrice - discountAmt;
    
    return { ...i, basePrice, discountAmt, finalPrice, effectiveDiscountPct, volumeDiscountPct };
  });

  const totalBase = subtotals.reduce((acc, curr) => acc + curr.basePrice, 0);
  const totalDiscount = subtotals.reduce((acc, curr) => acc + curr.discountAmt, 0);
  const finalTotal = totalBase - totalDiscount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quote Builder (CPQ)</h1>
          <p className="text-sm text-gray-500 mt-1">Configure products, apply volume pricing, and generate B2B proposals.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-white gap-2">
            <Save className="w-4 h-4" /> Save Draft
          </Button>
          <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" /> Generate & Send
          </Button>
        </div>
      </div>

      {isAIEnabled && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg shrink-0 mt-1">
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 text-sm">AI Pricing Guidance for {partnerFilter}</h3>
              <p className="text-sm text-blue-800 mt-1 leading-relaxed">
                Based on previous closed-won deals with {partnerFilter}, an overall discount between <strong>8% - 12%</strong> on high-volume electronics maximizes conversion probability. 
                <button className="ml-2 px-2 py-0.5 bg-blue-600 text-white font-medium rounded text-xs hover:bg-blue-700 transition">Apply optimal discounts</button>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Product Catalog */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products, SKUs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="cursor-pointer hover:border-blue-300 transition-colors" onClick={() => addItemToQuote(product)}>
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">{product.name}</h4>
                    <p className="text-xs text-gray-500">{product.id} • {product.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold text-sm text-gray-900">${product.price.toFixed(2)}</div>
                    <div className="text-[10px] text-gray-500">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0 text-blue-600 opacity-60 hover:opacity-100">
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Quote Configuration */}
        <Card className="lg:col-span-7 flex flex-col h-full border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base text-gray-700 font-medium tracking-normal mb-1">Proposal Configuration</CardTitle>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-gray-900">QT-2849</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">Draft</Badge>
                </div>
              </div>
              <div className="text-right">
                 <label className="text-xs font-medium text-gray-500 block mb-1">Prepared For</label>
                 <select 
                   className="text-sm font-semibold border-0 bg-transparent p-0 text-right focus:ring-0 cursor-pointer text-gray-900"
                   value={partnerFilter}
                   onChange={(e) => setPartnerFilter(e.target.value)}
                 >
                   <option>Acme Corp</option>
                   <option>TechStart Inc</option>
                   <option>Global Retailers</option>
                   <option>Fusion Logistics</option>
                 </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col">
            {quoteItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-medium mb-1">No items selected</h3>
                <p className="text-sm text-gray-500 max-w-[200px]">Click on products from the catalog to add them to this proposal.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col" style={{ minHeight: '400px' }}>
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                  {subtotals.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden shrink-0 hidden sm:block">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm text-gray-900 pr-4">{item.product.name}</h4>
                          <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
                          <div>
                            <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1.5 block">Quantity</label>
                            <input 
                              type="number" 
                              min="1"
                              value={item.quantity} 
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {item.volumeDiscountPct > 0 && item.customDiscount === 0 && (
                               <div className="text-[10px] text-green-600 mt-1 flex items-center gap-1">
                                 <Percent className="w-3 h-3" /> {item.volumeDiscountPct}% Vol. Discount
                               </div>
                            )}
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1.5 block">Custom Disc. %</label>
                            <input 
                              type="number" 
                              min="0"
                              max="100"
                              value={item.customDiscount || ''}
                              onChange={(e) => updateDiscount(item.id, parseInt(e.target.value) || 0)}
                              placeholder="0"
                              className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1.5 block">Unit Price</label>
                            <div className="px-2 py-1.5 text-sm text-gray-700 bg-gray-50 rounded border border-gray-100">
                              ${item.product.price.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-right pb-1">
                            {item.discountAmt > 0 && (
                              <div className="text-[10px] text-gray-400 line-through mb-0.5">${item.basePrice.toFixed(2)}</div>
                            )}
                            <div className="font-semibold text-gray-900">${item.finalPrice.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Proposal Summary */}
                <div className="bg-gray-50 p-6 border-t border-gray-200">
                  <div className="space-y-3 mb-6 max-w-xs ml-auto">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal (Base)</span>
                      <span>${totalBase.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Total Discounts</span>
                      <span>-${totalDiscount.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Net Estimated Total</span>
                      <span className="text-2xl font-bold text-gray-900">${finalTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-500">
                      <span>Estimated Tax (0%)</span>
                      <span>$0.00</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Quote is valid for 30 days. Final taxes and shipping will be calculated during the formal invoicing stage based on delivery location.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
