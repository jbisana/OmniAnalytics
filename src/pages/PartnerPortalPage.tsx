import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { inventoryData } from '@/data/mockData';
import { Search, ShoppingCart, Package, RefreshCcw, History, Store, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAI } from '@/contexts/AIContext';

// Simple mock for order history
const orderHistory = [
  { id: 'ORD-51920', date: '2024-10-15', status: 'Delivered', total: 12450.00, items: 45 },
  { id: 'ORD-52011', date: '2024-10-28', status: 'In Transit', total: 8200.50, items: 12 },
  { id: 'ORD-52104', date: '2024-11-02', status: 'Processing', total: 3400.00, items: 3 },
];

export function PartnerPortalPage() {
  const { isAIEnabled } = useAI();
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{product: any, quantity: number}[]>([]);
  const [partnerTier, setPartnerTier] = useState<'Standard' | 'Premium' | 'Enterprise'>('Premium');
  
  // Base on tier, let's say they get a specific catalog discount
  const getTierDiscount = (tier: string) => {
    switch (tier) {
      case 'Enterprise': return 15;
      case 'Premium': return 8;
      case 'Standard': default: return 0;
    }
  };
  
  const discountPct = getTierDiscount(partnerTier);

  const filteredProducts = inventoryData.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: any, quantity: number = 1) => {
    const existing = cart.find(i => i.product.id === product.id);
    if (existing) {
      setCart(cart.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i));
    } else {
      setCart([...cart, { product, quantity }]);
    }
  };

  const updateCartQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart(cart.filter(i => i.product.id !== id));
    } else {
      setCart(cart.map(i => i.product.id === id ? { ...i, quantity: qty } : i));
    }
  };

  const getPrice = (basePrice: number) => {
    return basePrice * (1 - discountPct / 100);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (getPrice(item.product.price) * item.quantity), 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Simulation Header (Portal environment context) */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold tracking-tight">Acme Corp - Partner Portal</h1>
          </div>
          <p className="text-sm text-slate-400">Self-Service B2B Ordering & Account Management</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
             <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Partner Tier Simulation</div>
             <select 
               className="bg-slate-800 border-none text-sm font-medium text-white rounded-md py-1 px-3 focus:ring-0 cursor-pointer"
               value={partnerTier}
               onChange={(e) => setPartnerTier(e.target.value as any)}
             >
               <option value="Standard">Standard (0% Off)</option>
               <option value="Premium">Premium (8% Off)</option>
               <option value="Enterprise">Enterprise (15% Off)</option>
             </select>
           </div>
        </div>
      </div>

      {isAIEnabled && activeTab === 'catalog' && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg shrink-0 mt-1">
              <RefreshCcw className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 text-sm">AI Replenishment Recommendation</h3>
              <p className="text-sm text-blue-800 mt-1 leading-relaxed">
                Based on your historical order frequency, you typically reorder <strong>Server Nodes (Batch A)</strong> every 4 weeks. You are due for a reorder next week.
                <button 
                  onClick={() => addToCart(inventoryData.find(i => i.id === 'INV-001') || inventoryData[0], 25)}
                  className="ml-2 px-3 py-1 bg-blue-600 text-white font-medium rounded text-xs hover:bg-blue-700 transition"
                >
                  1-Click Add to Order (25 units)
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation & Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Main Content Area */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex bg-gray-100/80 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('catalog')}
              className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-all', activeTab === 'catalog' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}
            >
              <div className="flex items-center gap-2"><Package className="w-4 h-4"/> Order Catalog</div>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-all', activeTab === 'orders' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}
            >
              <div className="flex items-center gap-2"><History className="w-4 h-4"/> Order History</div>
            </button>
          </div>

          {activeTab === 'catalog' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name, SKU, or category..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <Button variant="outline" className="bg-white gap-2">
                  <Filter className="w-4 h-4" /> Category
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-32 bg-gray-100 w-full relative">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      {discountPct > 0 && (
                        <Badge className="absolute top-2 right-2 bg-blue-600 border-none text-white shadow-sm">
                          {discountPct}% Off Tier
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4 flex flex-1 flex-col">
                      <div className="text-xs text-blue-600 font-medium mb-1">{product.category}</div>
                      <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-xs text-gray-500 mb-3 flex-1 line-clamp-2">SKU: {product.id} • Min order: 1</p>
                      
                      <div className="flex items-end justify-between mt-auto">
                        <div>
                          {discountPct > 0 && (
                            <div className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</div>
                          )}
                          <div className="font-bold text-lg text-gray-900">
                            ${getPrice(product.price).toFixed(2)} <span className="text-xs font-normal text-gray-500">/ unit</span>
                          </div>
                        </div>
                        <Button 
                          onClick={() => addToCart(product)} 
                          size="sm" 
                          disabled={product.stock <= 0}
                          className={cn("px-4", product.stock <= 0 ? "bg-gray-100 text-gray-400" : "")}
                          variant={product.stock <= 0 ? "outline" : "default"}
                        >
                          {product.stock <= 0 ? 'Out of Stock' : 'Add'}
                        </Button>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Stock: {product.stock > 0 ? <span className="text-green-600 font-medium">{product.stock} available</span> : <span className="text-red-500">Backordered</span>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-sm bg-gray-50/50">
                      <th className="px-6 py-4 font-medium text-gray-500">Order #</th>
                      <th className="px-6 py-4 font-medium text-gray-500">Date</th>
                      <th className="px-6 py-4 font-medium text-gray-500 text-right">Items</th>
                      <th className="px-6 py-4 font-medium text-gray-500 text-right">Total</th>
                      <th className="px-6 py-4 font-medium text-gray-500 text-center">Status</th>
                      <th className="px-6 py-4 font-medium text-gray-500 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orderHistory.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right">{order.items}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                          ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant="outline" className={cn("inline-flex items-center text-xs px-2.5 py-0.5 border", 
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800 border-green-200' : 
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                          )}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                            <RefreshCcw className="w-3.5 h-3.5 mr-1 inline" /> Reorder
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

        {/* Sidebar: Shopping Cart / Active Order Context */}
        <div className="w-full lg:w-80 shrink-0 space-y-4 sticky top-6">
          <Card className="border-gray-200 shadow-sm flex flex-col h-[calc(100vh-180px)] min-h-[400px]">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> Current Order
                </CardTitle>
                <Badge variant="secondary" className="font-semibold">{cartItemCount}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-500">
                  <ShoppingCart className="w-12 h-12 text-gray-200 mb-3" />
                  <p className="text-sm">Your order is empty.</p>
                  <p className="text-xs mt-1">Browse the catalog to add items.</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate pr-2">{item.product.name}</h4>
                        <div className="text-xs text-gray-500 mb-2">${getPrice(item.product.price).toFixed(2)} / unit</div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                          >-</button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                          >+</button>
                        </div>
                      </div>
                      <div className="text-right font-semibold text-sm text-gray-900 shrink-0">
                        ${(getPrice(item.product.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="bg-gray-50 p-4 border-t border-gray-200 mt-auto shrink-0">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Estimated Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  {discountPct > 0 && (
                    <div className="flex justify-between text-xs text-blue-600 font-medium">
                      <span>{partnerTier} Tier Savings Applied</span>
                      <span>({discountPct}%)</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={cart.length === 0}>
                  Submit B2B Order
                </Button>
                <div className="text-center mt-3">
                  <Button variant="ghost" className="text-xs text-gray-500 hover:text-gray-900 h-auto p-0" onClick={() => setCart([])}>
                    Clear Order
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
