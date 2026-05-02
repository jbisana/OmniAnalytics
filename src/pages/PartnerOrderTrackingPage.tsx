import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, Calendar, MapPin, CheckCircle2, Box, ArrowRight, AlertCircle, Clock, Map, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAI } from '@/contexts/AIContext';

const activeOrders = [
  { 
    id: 'ORD-52011', 
    date: '2024-10-28', 
    status: 'Split Shipment', 
    items: 12, 
    total: 8200.50,
    shipments: [
      { id: 'TRK-9810-A', status: 'In Transit', carrier: 'FreightCorp', eta: '2024-11-06', type: 'Pallet', currentLat: 39.95, currentLng: -75.16, origin: 'New York, NY', destination: 'Miami, FL', progress: 75, items: 'Server Nodes (x10)' },
      { id: 'TRK-9810-B', status: 'Preparing', carrier: 'AirLogistics', eta: '2024-11-09', type: 'Parcel', origin: 'Austin, TX', destination: 'Miami, FL', progress: 10, items: 'Network Cables (x2)' }
    ]
  },
  { 
    id: 'ORD-52104', 
    date: '2024-11-02', 
    status: 'Processing', 
    items: 3, 
    total: 3400.00,
    shipments: [
      { id: 'TRK-9905', status: 'Label Created', carrier: 'FastFreight', eta: '2024-11-12', type: 'Pallet', origin: 'Chicago, IL', destination: 'Miami, FL', progress: 5, items: 'Edge Routers (x3)' }
    ]
  }
];

export function PartnerOrderTrackingPage() {
  const { isAIEnabled } = useAI();
  const [selectedOrder, setSelectedOrder] = useState(activeOrders[0]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Preparing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Label Created': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Header */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Navigation className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold tracking-tight">Acme Corp - Portal Tracking</h1>
          </div>
          <p className="text-sm text-slate-400">Order Tracking & Fulfillment View</p>
        </div>
      </div>

      {isAIEnabled && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-2 bg-amber-100 rounded-lg shrink-0 mt-1">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 text-sm">AI Freight Delay Alert</h3>
              <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                Weather patterns near Atlanta, GA indicate a high probability of delay for shipment <strong>TRK-9810-A</strong>. The estimated ETA has been automatically adjusted by +24 hours. Your local installation team has been notified of the schedule change.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left sidebar: Order List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Active Fulfillments</h3>
          
          <div className="space-y-3">
            {activeOrders.map(order => (
              <Card 
                key={order.id} 
                className={cn('cursor-pointer transition-all', selectedOrder.id === order.id ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/20' : 'hover:border-gray-300')}
                onClick={() => setSelectedOrder(order)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900">{order.id}</h4>
                    <span className="text-xs text-gray-500">{order.date}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <Badge variant="outline" className={cn("bg-gray-50", order.status === 'Split Shipment' ? 'text-amber-700 border-amber-200 bg-amber-50' : '')}>
                      {order.status}
                    </Badge>
                    <span className="font-medium text-gray-700">${order.total.toLocaleString()}</span>
                  </div>
                  <div className="mt-3 text-xs text-gray-500 flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5" /> {order.items} Items • {order.shipments.length} Deliveries
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right side: Tracking Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-200">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Order {selectedOrder.id}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Placed on {selectedOrder.date}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="bg-white">
                  Download Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {selectedOrder.shipments.map((shipment, index) => (
                  <div key={shipment.id} className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                          {shipment.type === 'Pallet' ? <Truck className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <h4 className="font-semibold text-gray-900 tracking-tight">Shipment {index + 1}</h4>
                             <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", getStatusColor(shipment.status))}>{shipment.status}</Badge>
                          </div>
                          <div className="text-sm text-gray-500 mt-0.5">{shipment.id} • {shipment.carrier}</div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Items Included</div>
                        <div className="text-sm font-medium text-gray-900">{shipment.items}</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100 relative overflow-hidden">
                      {/* Fake map background for "In Transit" */}
                      {shipment.status === 'In Transit' && (
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                      )}
                      
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                          <div>
                             <div className="text-xs text-gray-500 mb-0.5">Origin</div>
                             <div className="font-medium text-gray-900">{shipment.origin}</div>
                          </div>
                        </div>
                        
                        <div className="flex-1 hidden md:flex items-center mx-4">
                          <div className="h-0.5 bg-gray-200 flex-1 relative rounded-full">
                            <div className="absolute left-0 top-0 h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${shipment.progress}%` }}></div>
                            <div className="absolute top-1/2 -translate-y-1/2 text-blue-500 bg-white border-2 border-blue-500 w-4 h-4 rounded-full transition-all duration-1000" style={{ left: `calc(${shipment.progress}% - 8px)` }}></div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 md:text-right flex-row md:flex-row-reverse">
                          <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                          <div>
                             <div className="text-xs text-gray-500 mb-0.5">Destination</div>
                             <div className="font-medium text-gray-900">{shipment.destination}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Estimated Delivery:</span>
                        <span className="font-semibold text-gray-900">{shipment.eta}</span>
                      </div>
                      <Button variant="ghost" className="text-blue-600 h-auto p-0 gap-1 hover:bg-transparent hover:text-blue-700">
                        View Detailed Tracking <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
