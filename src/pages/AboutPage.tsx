import React from 'react';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About Omni B2B Solutions</h1>
        <p className="text-lg text-gray-600 mb-8">
          Omni B2B Solutions is a comprehensive business-to-business platform designed to bridge the gap between unified analytics, partner management, and AI-driven insights. It serves as a centralized hub for managing sales, inventory, CRM, and partner portal interactions.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Project Overview</h2>
            <p className="text-gray-600 leading-relaxed">
              In the modern B2B landscape, fragmented tools lead to data silos, making it difficult to understand partner performance, supply chain anomalies, and total pipeline value. Conceptually built as an "all-in-one" ERP and Partner Portal, this application enables System Administrators to seamlessly oversee their entire B2B operation from a single pane of glass.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Core Workflows</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">Sales & Pipeline Management</h3>
                <p className="text-sm text-gray-600">Track current deals, register new partner opportunities, configure quotes (CPQ), and manage invoicing and compliance data.</p>
              </div>
              <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">Partner Portal Operations</h3>
                <p className="text-sm text-gray-600">Simulate partner interactions ranging from business onboarding and deal registration to tracking Marketing Development Funds (MDF).</p>
              </div>
              <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">Inventory & Procurement</h3>
                <p className="text-sm text-gray-600">Monitor live stock levels across the supply chain, manage vendors, and trigger automated low-stock warnings.</p>
              </div>
              <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
                <p className="text-sm text-gray-600">Leverage built-in AI models to analyze data anomalies, generate predictive market strategies, and automatically extract contract terms.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">AI Integration</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              This system leverages advanced Large Language Models to transform raw data points into actionable intelligence. Integrated AI workflows include:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li><strong>Marketing Insights:</strong> Evaluates recent KPI changes and sales metrics to suggest immediate partner engagement optimizations.</li>
              <li><strong>Product Recommendations:</strong> Analyzes current warehouse inventory and suggests items for bulk-discount campaigns or "Deal of the week".</li>
              <li><strong>Anomaly Detection:</strong> Proactively scans KPI metrics for unexpected drops or spikes, detailing potential root causes before they become systemic failures.</li>
              <li><strong>Procurement Analytics:</strong> Identifies upcoming shortages based on seasonal partner orders and recommends preventative supply actions.</li>
              <li><strong>Partner Segmentation:</strong> Uses Recency, Frequency, and Monetary (RFM) parameters to automatically categorize B2B buyers and suggest lifetime value growth strategies.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
