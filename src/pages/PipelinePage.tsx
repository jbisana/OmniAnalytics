import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Building2, Calendar, FileText, Plus, DollarSign, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for initial deals
const defaultDeals = [
  { id: 'deal-1', partner: 'Acme Corp', name: 'Q3 Enterprise Expansion', amount: 150000, stage: 'Lead', expectedClose: '2026-08-15', probability: 20 },
  { id: 'deal-2', partner: 'TechStart Inc', name: 'SaaS Platform License', amount: 45000, stage: 'Discovered', expectedClose: '2026-06-30', probability: 40 },
  { id: 'deal-3', partner: 'Global Retailers', name: 'Analytics Setup', amount: 85000, stage: 'Proposed', expectedClose: '2026-07-20', probability: 60 },
  { id: 'deal-4', partner: 'Quantum Dynamics', name: 'Predictive Modeling Suite', amount: 210000, stage: 'In Negotiation', expectedClose: '2026-05-30', probability: 80 },
  { id: 'deal-5', partner: 'Fusion Logistics', name: 'Logistics Optimization', amount: 120000, stage: 'Closed Won', expectedClose: '2026-05-01', probability: 100 },
];

const STAGES = ['Lead', 'Discovered', 'Proposed', 'In Negotiation', 'Closed Won', 'Closed Lost'];

export function PipelinePage() {
  const [deals, setDeals] = useState(defaultDeals);

  // Very basic implementation of dragging state
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedDealId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires setting data
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedDealId;
    if (!id) return;
    
    // Update probability based on stage just as a simple logic tie-in
    let newProbability = 0;
    if (targetStage === 'Lead') newProbability = 20;
    if (targetStage === 'Discovered') newProbability = 40;
    if (targetStage === 'Proposed') newProbability = 60;
    if (targetStage === 'In Negotiation') newProbability = 80;
    if (targetStage === 'Closed Won') newProbability = 100;
    if (targetStage === 'Closed Lost') newProbability = 0;

    setDeals(deals.map(deal => 
      deal.id === id 
        ? { ...deal, stage: targetStage, probability: newProbability } 
        : deal
    ));
    setDraggedDealId(null);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            Deals & Pipeline
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage partner deals across stages and track forecasted revenue.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Deal
        </Button>
      </div>

      <div className="flex-1 flex overflow-x-auto gap-4 pb-4">
        {STAGES.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.amount, 0);
          
          return (
            <div 
              key={stage}
              className="flex flex-col bg-gray-50/50 rounded-lg shrink-0 w-80 max-h-full border border-gray-200"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg shrink-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-gray-800">{stage}</h3>
                  <Badge variant="outline" className="bg-white text-xs">{stageDeals.length}</Badge>
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {formatCurrency(stageTotal)}
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
                {stageDeals.map(deal => (
                  <Card 
                    key={deal.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal.id)}
                    className={cn(
                      "cursor-grab active:cursor-grabbing border-l-4 hover:shadow-md transition-shadow",
                      deal.probability >= 80 ? "border-l-green-500" :
                      deal.probability >= 50 ? "border-l-blue-500" :
                      "border-l-gray-300"
                    )}
                  >
                    <CardContent className="p-3 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="font-medium text-sm text-gray-900 leading-tight">
                          {deal.name}
                        </div>
                        <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                      </div>
                      
                      <div className="text-xs text-gray-500 flex items-center gap-1.5 line-clamp-1">
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        {deal.partner}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(deal.amount)}
                        </div>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {deal.probability}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
