import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { extractContractTerms } from '@/services/ai';
import { FileSignature, Upload, FileText, Loader2, AlertCircle, Sparkles, Building2, Calendar, FileCheck2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAI } from '@/contexts/AIContext';
import { cn } from '@/lib/utils';

// Mock data
const initialContracts = [
  { 
    id: 'contract-1', 
    partnerName: 'Acme Corp', 
    contractValue: '$150,000 / year',
    startDate: '2025-01-15', 
    endDate: '2026-07-20',
    status: 'Active', 
    isHighValue: true,
    renewalTerms: 'Auto-renews for 1 year unless cancelled 60 days prior.',
    slaMetrics: ['99.9% Uptime', '24/7 Support'],
    keyClauses: ['Net-30 payment terms', 'Standard liability cap'],
    slaBreach: false
  },
  { 
    id: 'contract-2', 
    partnerName: 'TechStart Inc', 
    contractValue: '$45,000 / year',
    startDate: '2024-03-01', 
    endDate: '2026-05-30', 
    status: 'Active', 
    isHighValue: false,
    renewalTerms: 'Manual renewal based on mutual agreement.',
    slaMetrics: ['99% Uptime', 'Business hours support'],
    keyClauses: ['Net-45 payment terms'],
    slaBreach: true
  },
  { 
    id: 'contract-3', 
    partnerName: 'Legacy Systems', 
    contractValue: '$25,000 / year',
    startDate: '2023-01-01', 
    endDate: '2025-12-31', 
    status: 'Expired', 
    isHighValue: false,
    renewalTerms: 'No auto-renewal.',
    slaMetrics: ['Best effort support'],
    keyClauses: [],
    slaBreach: false
  },
];

const MOCK_PDF_TEXT = `SERVICING AND PARTNERSHIP AGREEMENT
This agreement is entered into as of October 1, 2025, between Omni B2B and Global Retailers.

1. Term
The initial term of this agreement shall commence on October 1, 2025, and expire on September 30, 2026.

2. Contract Value
The total contract value is estimated at $85,000 annually.

3. Renewal
This agreement shall automatically renew for successive one-year terms unless either party provides written notice of termination at least 30 days prior to the expiration of the current term.

4. Service Level Agreements (SLAs)
- Platform Availability: 99.95% uptime guaranteed.
- Issue Resolution: Critical severity issues must be resolved within 4 hours.

5. Key Clauses
- Confidentiality: Standard NDA applies.
- Termination: Either party may terminate for cause with a 15-day cure period.`;

export function ContractsPage() {
  const [contracts, setContracts] = useState(initialContracts);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedContracts, setExpandedContracts] = useState<Set<string>>(new Set());
  const [contractToDelete, setContractToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAIEnabled } = useAI();

  const isExpired = (endDateStr: string) => {
    return new Date(endDateStr) < new Date();
  };

  const isNearRenewal = (endDateStr: string) => {
    const today = new Date();
    const end = new Date(endDateStr);
    const diffTime = end.getTime() - today.getTime();
    if (diffTime < 0) return false;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAIEnabled) {
      alert("AI must be enabled to process and extract terms from contract documents.");
      return;
    }

    setIsUploading(true);
    try {
      const extractedContent = await extractContractTerms(MOCK_PDF_TEXT);
      if (extractedContent) {
        const newContract = {
          id: `contract-${Date.now()}`,
          partnerName: extractedContent.partnerName || 'Unknown Partner',
          contractValue: extractedContent.contractValue || 'N/A',
          startDate: extractedContent.startDate || 'Unknown',
          endDate: extractedContent.endDate || 'Unknown',
          status: 'Active',
          isHighValue: true, 
          renewalTerms: extractedContent.renewalTerms || 'No renewal terms specified.',
          slaMetrics: extractedContent.slaMetrics || [],
          keyClauses: extractedContent.keyClauses || [],
          slaBreach: false
        };
        setContracts([...contracts, newContract]);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to extract contract terms. Check console for details.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const deleteContract = (id: string) => {
    setContracts(contracts.filter(c => c.id !== id));
    setContractToDelete(null);
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedContracts);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedContracts(newExpanded);
  };

  return (
    <div className="space-y-6 relative">
      {contractToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Contract</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this contract? This action cannot be undone.</p>
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setContractToDelete(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => deleteContract(contractToDelete)}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <FileSignature className="w-6 h-6 text-blue-600" />
            Contracts & SLAs
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track partner contracts, renewals, and compliance SLAs.</p>
        </div>
        <div>
          <input 
            type="file" 
            accept=".pdf,.txt,.doc,.docx" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading || !isAIEnabled}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Upload Contract
          </Button>
        </div>
      </div>

      {!isAIEnabled && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-amber-800 font-medium text-sm">AI Processing Disabled</h3>
              <p className="text-amber-700 text-sm mt-1">Enable AI in the global settings to automate term extraction and receive smart renewal alerts for uploaded contracts.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contract AI Alerts Stack */}
      {isAIEnabled && contracts.find(c => isNearRenewal(c.endDate) && c.isHighValue) && (
        <Card className="border-indigo-100 shadow-sm bg-gradient-to-r from-indigo-50/80 to-blue-50/50">
          <CardHeader className="pb-3 border-b border-indigo-50 flex flex-row items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" /> 
            <CardTitle className="text-base text-indigo-900">AI Renewal Alerts</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {contracts.filter(c => isNearRenewal(c.endDate) && c.isHighValue).map(c => (
              <div key={`alert-${c.id}`} className="bg-white border text-sm border-indigo-100 rounded-lg p-3 shadow-sm flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 pr-2 flex items-center gap-2">
                    Action Required: Upcoming Renewal for {c.partnerName}
                  </h4>
                  <p className="text-gray-600 text-xs mt-1">
                    This high-value partner ({c.contractValue}) is within 90 days of contract expiration 
                    ({new Date(c.endDate).toLocaleDateString()}). 
                  </p>
                  <p className="text-gray-500 text-xs mt-1 italic">
                    Renewal Clause: {c.renewalTerms}
                  </p>
                </div>
                <Badge variant="destructive" className="shrink-0 bg-red-100 text-red-700 hover:bg-red-200 border-red-200">Action Needed</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 gap-6">
        {contracts.map(contract => {
          const expired = isExpired(contract.endDate) || contract.status === 'Expired';
          const nearingRenewal = isNearRenewal(contract.endDate);
          return (
            <Card key={contract.id} className={cn("flex flex-col transition-all", expandedContracts.has(contract.id) ? "shadow-md" : "hover:shadow-sm")}>
              <CardHeader 
                className="pb-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl cursor-pointer hover:bg-gray-100/50 transition-colors"
                onClick={() => toggleExpand(contract.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      {contract.partnerName}
                    </CardTitle>
                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-4">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> End: {new Date(contract.endDate).toLocaleDateString()}</span>
                      {contract.isHighValue && <Badge variant="outline" className="text-[10px] text-blue-600 bg-blue-50 border-blue-200">High Value</Badge>}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {expired && (
                        <Badge variant="destructive" className="text-[10px] bg-red-100 text-red-800 hover:bg-red-200 border border-red-200">
                          Expired
                        </Badge>
                      )}
                      {contract.slaBreach && (
                        <Badge variant="destructive" className="text-[10px] bg-red-600 text-white animate-pulse">
                          SLA Breach
                        </Badge>
                      )}
                      {!expired && nearingRenewal && (
                        <Badge variant="warning" className="text-[10px] bg-amber-100 text-amber-800 border-amber-200">
                          Renewing Soon
                        </Badge>
                      )}
                      {!expired && !contract.slaBreach && !nearingRenewal && (
                        <Badge variant="success" className="text-[10px] bg-emerald-100 text-emerald-800 border-emerald-200">
                          Active
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50" onClick={(e) => {
                        e.stopPropagation();
                        setContractToDelete(contract.id);
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                        {expandedContracts.has(contract.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" /> }
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              {expandedContracts.has(contract.id) && (
                <CardContent className="pt-6 flex-1 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div>
                      <div className="text-xs text-gray-500 font-medium mb-1 tracking-wider uppercase">Contract Value</div>
                      <div className="text-base font-semibold text-gray-900">{contract.contractValue}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium mb-1 tracking-wider uppercase">Start Date</div>
                      <div className="text-base text-gray-900">{new Date(contract.startDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium mb-1 tracking-wider uppercase">End Date</div>
                      <div className="text-base text-gray-900">{new Date(contract.endDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                    <div className="space-y-6">
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                          <FileCheck2 className="w-4 h-4 text-emerald-600" />
                          Service Level Agreements (SLAs)
                        </h4>
                        <ul className="space-y-2">
                          {contract.slaMetrics.map((sla, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                              {sla}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          Renewal Terms
                        </h4>
                        <p className="text-sm text-gray-600 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                          {contract.renewalTerms}
                        </p>
                      </div>
                    </div>

                    {contract.keyClauses && contract.keyClauses.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                          <FileText className="w-4 h-4 text-indigo-500" />
                          Extracted Key Clauses
                        </h4>
                        <div className="space-y-3">
                          {contract.keyClauses.map((clause, i) => (
                            <div key={i} className="bg-gray-50 text-sm text-gray-700 p-3 rounded-lg border border-gray-200/60 leading-relaxed shadow-sm">
                              {clause}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
