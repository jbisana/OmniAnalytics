import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAI } from '@/contexts/AIContext';
import { Sparkles, DollarSign, Calendar, UploadCloud, X, LayoutTemplate, Briefcase, FileText, Send, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PartnerMDFPage() {
  const { isAIEnabled } = useAI();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const [campaignType, setCampaignType] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [predictedROI, setPredictedROI] = useState<{ leads: number, pipeline: number } | null>(null);
  const [expectedOutcome, setExpectedOutcome] = useState('');

  useEffect(() => {
    if (!isAIEnabled || !campaignType || !requestedAmount) {
      setPredictedROI(null);
      return;
    }
    
    const amount = parseFloat(requestedAmount) || 0;
    if (amount <= 0) {
      setPredictedROI(null);
      return;
    }

    let leadMultiplier = 0.005; 
    let pipelineMultiplier = 5;

    if (campaignType === 'Webinar / Virtual Event') {
      leadMultiplier = 0.015;
      pipelineMultiplier = 8;
    } else if (campaignType === 'Trade Show / In-Person Event') {
      leadMultiplier = 0.008;
      pipelineMultiplier = 12;
    } else if (campaignType === 'Digital Advertising (PPC/Social)') {
      leadMultiplier = 0.02;
      pipelineMultiplier = 4;
    }

    if (targetAudience === 'Enterprise' || targetAudience === 'Healthcare' || targetAudience === 'Financial Services') {
      leadMultiplier *= 0.5; // Fewer leads
      pipelineMultiplier *= 1.5; // Bigger deals
    } else if (targetAudience === 'SMB') {
      leadMultiplier *= 2; // More leads
      pipelineMultiplier *= 0.8; // Smaller deals
    }

    setPredictedROI({
      leads: Math.round(amount * leadMultiplier),
      pipeline: Math.round(amount * pipelineMultiplier)
    });

  }, [campaignType, targetAudience, requestedAmount, isAIEnabled]);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
    setTimeout(() => {
      setShowRequestForm(false);
      setRequestSubmitted(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Acme Corp - Partner Portal</h1>
          <p className="text-gray-500 text-sm mt-1">Market Development Funds (MDF) Request</p>
        </div>
        <Button onClick={() => setShowRequestForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <DollarSign className="w-4 h-4 mr-2" />
          Request New Funds
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-2">Available Balance</h3>
            <div className="text-3xl font-bold text-blue-900">$45,000</div>
            <p className="text-sm text-blue-600 mt-2">Refreshes Q4 (Dec 31)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Pending Approval</h3>
            <div className="text-3xl font-bold text-gray-900">$12,500</div>
            <p className="text-sm text-amber-600 mt-2 font-medium">1 Request Under Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">YTD Approved</h3>
            <div className="text-3xl font-bold text-gray-900">$32,000</div>
            <p className="text-sm text-emerald-600 mt-2 font-medium">3 Campaigns Funded</p>
          </CardContent>
        </Card>
      </div>

      {showRequestForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-full flex flex-col my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900">New MDF Request</h2>
                <p className="text-sm text-gray-500 mt-1">Submit your campaign details to request marketing funds.</p>
              </div>
              <button onClick={() => setShowRequestForm(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {requestSubmitted ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
                  <p className="text-gray-500">Your MDF request has been sent for HQ approval. You will be notified typically within 48 hours.</p>
                </div>
              ) : (
                <form id="mdfForm" onSubmit={handleRequestSubmit} className="space-y-6">
                  {isAIEnabled && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-5 flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">AI Co-Pilot: Campaign Builder</h4>
                        <p className="text-sm text-blue-800 mb-3 leading-relaxed">
                          Describe your goal below, and I'll auto-fill the campaign details, estimate the expected ROI based on your past performance, and suggest a budget.
                        </p>
                        <div className="flex gap-2">
                          <input type="text" placeholder="e.g. Host a cybersecurity webinar for healthcare clients in Texas" className="flex-1 text-sm px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                          <Button type="button" size="sm" className="bg-blue-600 hover:bg-blue-700">Generate</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Q3 Cloud Migration Push" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Type</label>
                        <select 
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          value={campaignType}
                          onChange={e => setCampaignType(e.target.value)}
                          required
                        >
                          <option value="">Select type...</option>
                          <option>Webinar / Virtual Event</option>
                          <option>Trade Show / In-Person Event</option>
                          <option>Digital Advertising (PPC/Social)</option>
                          <option>Email Marketing</option>
                          <option>Content Creation</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                        <select 
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          value={targetAudience}
                          onChange={e => setTargetAudience(e.target.value)}
                          required
                        >
                          <option value="">Select audience...</option>
                          <option>Enterprise</option>
                          <option>Mid-Market</option>
                          <option>SMB</option>
                          <option>Healthcare</option>
                          <option>Financial Services</option>
                          <option>Public Sector</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Requested Amount (USD)</label>
                        <div className="relative">
                          <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type="number" 
                            min="100" 
                            max="45000" 
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="5000" 
                            value={requestedAmount}
                            onChange={e => setRequestedAmount(e.target.value)}
                            required 
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Max available: $45,000</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <div className="relative">
                            <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input type="date" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <div className="relative">
                            <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input type="date" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected ROI / Outcomes</label>
                    <textarea 
                      rows={3} 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Describe expected leads, pipeline generated, or closed revenue..." 
                      value={expectedOutcome}
                      onChange={e => setExpectedOutcome(e.target.value)}
                      required
                    ></textarea>
                    {isAIEnabled && predictedROI ? (
                      <div className="flex items-start justify-between bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 mt-2">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-indigo-900 block">AI Expected ROI</span>
                            <span className="text-xs text-indigo-700 font-medium tracking-tight">Historically, {targetAudience ? targetAudience : 'similar'} {campaignType} campaigns yield ~{predictedROI.leads} leads & ${(predictedROI.pipeline / 1000).toFixed(0)}k pipeline.</span>
                          </div>
                        </div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 shrink-0"
                          onClick={() => setExpectedOutcome(`We expect to generate approximately ${predictedROI.leads} qualified leads, resulting in an estimated $${(predictedROI.pipeline / 1000).toFixed(0)}k in new pipeline.`)}
                        >
                          Use Suggestion
                        </Button>
                      </div>
                    ) : isAIEnabled && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-gray-400" /> Enter amount and campaign type to see AI estimations.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 border-gray-300">Proof of Execution & Invoice (Upload)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-50 transition-colors">
                        <UploadCloud className="w-6 h-6 text-gray-500 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <p className="text-sm text-gray-600 font-medium md:mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400">PDF, JPG, PNG (Max 10MB)</p>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {!requestSubmitted && (
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0 rounded-b-xl">
                <Button variant="outline" onClick={() => setShowRequestForm(false)}>Cancel</Button>
                <Button type="submit" form="mdfForm" className="bg-blue-600 hover:bg-blue-700"><Send className="w-4 h-4 mr-2" /> Submit Request</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>MDF History & Status</CardTitle>
          <CardDescription>Track the status of your past and present marketing fund requests.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {[
              { id: 'MDF-8212', type: 'Trade Show / In-Person Event', name: 'Q3 Cyber Security Expo Booth', amount: 12500, status: 'Pending', date: 'Oct 28, 2024' },
              { id: 'MDF-8190', type: 'Webinar / Virtual Event', name: 'Cloud Migration Masterclass', amount: 4500, status: 'Approved', date: 'Sep 15, 2024' },
              { id: 'MDF-8105', type: 'Digital Advertising', name: 'LinkedIn Lead Gen Q2', amount: 8000, status: 'Approved', date: 'Jul 10, 2024' },
              { id: 'MDF-8099', type: 'Content Creation', name: 'Healthcare Case Studies', amount: 15000, status: 'Rejected', date: 'Jun 05, 2024' },
            ].map(req => (
              <div key={req.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1",
                    req.type.includes('Event') ? 'bg-purple-100 text-purple-600' :
                    req.type.includes('Digital') ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                  )}>
                    {req.type.includes('Event') ? <Briefcase className="w-5 h-5" /> :
                     req.type.includes('Digital') ? <LayoutTemplate className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{req.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span>{req.id}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span>{req.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 sm:ml-auto">
                  <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Amount</div>
                    <div className="font-semibold text-gray-900">${req.amount.toLocaleString()}</div>
                  </div>
                  <Badge variant="outline" className={cn(
                    "w-24 justify-center py-1",
                    req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    req.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  )}>
                    {req.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
