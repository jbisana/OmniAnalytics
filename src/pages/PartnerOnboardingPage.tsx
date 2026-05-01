import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAI } from '@/contexts/AIContext';

export function PartnerOnboardingPage() {
  const { isAIEnabled } = useAI();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4); // Success step
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Partner Registration</h1>
        <p className="text-gray-500 mt-2">Self-service onboarding for new business accounts.</p>
      </div>

      <div className="flex justify-between items-center mb-8 px-4 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-medium border-2 transition-colors",
            step >= s ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-200 text-gray-400"
          )}>
            {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
          </div>
        ))}
      </div>

      <Card className="shadow-lg border-gray-200">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Tell us a bit about your business and operations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Legal Company Name *</label>
                    <input required type="text" className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Acme Corporation" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">DBA (Doing Business As)</label>
                    <input type="text" className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Acme Corp" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Industry / Sector *</label>
                  <select required className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Select an industry...</option>
                    <option value="retail">Retail / Wholesale</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="technology">Technology & IT</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Estimated Annual Volume *</label>
                    <select required className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="">Select volume...</option>
                      <option value="tier1">&lt; $50k</option>
                      <option value="tier2">$50k - $250k</option>
                      <option value="tier3">$250k - $1M</option>
                      <option value="tier4">$1M+</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tax ID / EIN *</label>
                    <input required type="text" className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="XX-XXXXXXX" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t pt-6">
                <Button type="button" onClick={() => setStep(2)}>Next Step</Button>
              </CardFooter>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Locations & Hierarchy</CardTitle>
                <CardDescription>Do you have multiple locations that need separate billing or shipping accounts?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex border border-blue-200 bg-blue-50 text-blue-900 p-4 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                    <input defaultChecked type="radio" name="hierarchy" className="mt-1" />
                    <div className="ml-3">
                      <h4 className="font-medium">Single Location</h4>
                      <p className="text-sm text-blue-800 mt-1">Single HQ for billing and shipping.</p>
                    </div>
                  </div>
                  <div className="flex border border-gray-200 p-4 rounded-lg cursor-pointer hover:border-blue-200 transition-colors">
                    <input type="radio" name="hierarchy" className="mt-1" />
                    <div className="ml-3">
                      <h4 className="font-medium">Multiple Subsidiaries / Branches</h4>
                      <p className="text-sm text-gray-500 mt-1">We will create a parent account and you can add child locations later for centralized billing.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Primary HQ Address *</label>
                    <input required type="text" className="w-full border-gray-300 rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-2" placeholder="Street Address" />
                    <div className="grid grid-cols-3 gap-2">
                      <input required type="text" className="col-span-1 border-gray-300 rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="City" />
                      <input required type="text" className="col-span-1 border-gray-300 rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="State/Province" />
                      <input required type="text" className="col-span-1 border-gray-300 rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Postal Code" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between border-t pt-6">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button type="button" onClick={() => setStep(3)}>Next Step</Button>
              </CardFooter>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle>Verification Documents</CardTitle>
                <CardDescription>Upload your tax exemptions and business licenses to unlock wholesale purchasing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Upload Resale/Tax Exemption Certificate</h4>
                  <p className="text-xs text-gray-500 mb-4">PDF, JPG, or PNG up to 10MB.</p>
                  <Button variant="outline" size="sm" type="button">Browse Files</Button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600 shrink-0" />
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-900">Credit_Application_Form.pdf</h5>
                    <p className="text-xs text-gray-500">245 KB • Uploaded</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">Remove</Button>
                </div>
                
                {isAIEnabled && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 mt-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">AI Lead Routing</h4>
                    <p className="text-xs text-blue-800">Based on your selection of "Technology & IT" with expected volume "$1M+", your application will be instantly routed to the Enterprise Team upon submission, avoiding the standard 48-hour queue.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-between border-t pt-6">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                </Button>
              </CardFooter>
            </>
          )}

          {step === 4 && (
            <CardContent className="py-12 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-6">Your business application has been submitted successfully. Our team will review your tax-exempt documents.</p>
              
              <div className="bg-gray-50 p-4 rounded-lg inline-block text-left mb-6 mx-auto">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  <span className="block font-medium text-gray-900 mb-1">Next Steps:</span>
                  1. You will receive an email verification link.<br/>
                  2. Document review typically takes &lt; 24 hours.<br/>
                  3. If approved, you can invite your child-branch buyers to the portal.
                </p>
              </div>
              
              <div>
                <Button variant="outline" onClick={() => setStep(1)} className="mr-3">Register Another</Button>
                <Button onClick={() => window.location.href = '/'}>Return to Home</Button>
              </div>
            </CardContent>
          )}
        </form>
      </Card>
    </div>
  );
}
