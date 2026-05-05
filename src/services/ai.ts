
export async function generateMarketingInsights(salesData: any[], kpiData: any) {
  try {
    const response = await fetch('/api/ai/marketing-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salesData, kpiData }),
    });
    if (!response.ok) throw new Error('Failed to fetch AI insights');
    return await response.json();
  } catch (error) {
    console.error("AI Insights Error:", error);
    return [];
  }
}

export async function generateProductRecommendations(inventoryData: any[]) {
  try {
    const response = await fetch('/api/ai/product-recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inventoryData }),
    });
    if (!response.ok) throw new Error('Failed to fetch AI recommendations');
    return await response.json();
  } catch (error) {
    console.error("AI Recommendations Error:", error);
    return [];
  }
}

export async function detectAnomalies(kpiData: any) {
  try {
    const response = await fetch('/api/ai/detect-anomalies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kpiData }),
    });
    if (!response.ok) throw new Error('Failed to fetch AI anomalies');
    return await response.json();
  } catch (error) {
    console.error("Anomaly Detection Error:", error);
    return [];
  }
}

export async function generateProcurementInsights(procurementData: any) {
  try {
    const response = await fetch('/api/ai/procurement-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ procurementData }),
    });
    if (!response.ok) throw new Error('Failed to fetch procurement insights');
    return await response.json();
  } catch (error) {
    console.error("Procurement Insights Error:", error);
    return [];
  }
}

export async function generatePartnerSegments(partnerData: any, rfmParams?: { recency: string, frequency: string, monetary: string }) {
  try {
    const response = await fetch('/api/ai/partner-segments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerData, rfmParams }),
    });
    if (!response.ok) throw new Error('Failed to fetch partner segments');
    return await response.json();
  } catch (error) {
    console.error("Partner Segmentation Error:", error);
    return [];
  }
}

export async function extractContractTerms(contractText: string) {
  try {
    const response = await fetch('/api/ai/extract-contract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractText }),
    });
    if (!response.ok) throw new Error('Failed to extract contract terms');
    return await response.json();
  } catch (error) {
    console.error("Contract Extraction Error:", error);
    return null;
  }
}
