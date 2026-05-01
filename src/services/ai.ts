import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google Gen AI Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateMarketingInsights(salesData: any[], kpiData: any) {
  try {
    const prompt = `
      You are an expert E-commerce Data Analyst. Analyze the following KPI and Sales Data.
      Provide 3 actionable insights to optimize marketing campaigns and partner engagement.
      Keep them concise and focus on ROI.

      Data:
      KPIs: ${JSON.stringify(kpiData)}
      Recent Sales Data Summary: First day: ${salesData[0].sales}, Last day: ${salesData[salesData.length - 1].sales}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              description: "List of actionable marketing insights",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  impact: { type: Type.STRING, description: "Low, Medium, or High" }
                },
                required: ["title", "description", "impact"]
              }
            }
          },
          required: ["insights"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.insights;
    }
    return [];
  } catch (error) {
    console.error("AI Insights Error:", error);
    return [];
  }
}

export async function generateProductRecommendations(inventoryData: any[]) {
  try {
    const prompt = `
      Based on this current inventory list:
      ${JSON.stringify(inventoryData)}

      Predict the next 3 best products to feature in our "Deal of the week" campaign.
      Prioritize products with high stock or high value.
      Provide a brief rationale.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  productName: { type: Type.STRING },
                  rationale: { type: Type.STRING }
                },
                required: ["productName", "rationale"]
              }
            }
          },
          required: ["recommendations"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.recommendations;
    }
    return [];
  } catch (error) {
    console.error("AI Recommendations Error:", error);
    return [];
  }
}

export async function detectAnomalies(kpiData: any) {
  try {
    const prompt = `
      You are an expert E-commerce Anomaly Detection AI. Analyze the existing system KPIs: ${JSON.stringify(kpiData)}.
      Identify 2-3 significant deviations from expected patterns (make up realistic scenarios that could happen, such as a drop in conversion rate, or an unexpected spike in a specific category's sales).
      Provide the metric, the deviation, a description of the anomaly, and a list of 3 potential causes.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            anomalies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  metric: { type: Type.STRING },
                  deviation: { type: Type.STRING },
                  description: { type: Type.STRING },
                  potentialCauses: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["metric", "deviation", "description", "potentialCauses"]
              }
            }
          },
          required: ["anomalies"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.anomalies;
    }
    return [];
  } catch (error) {
    console.error("Anomaly Detection Error:", error);
    return [];
  }
}

export async function generateProcurementInsights(procurementData: any) {
  try {
    const prompt = `
      You are a Predictive Procurement AI. Analyze this supply chain and partner data: ${JSON.stringify(procurementData)}.
      Predict when major partners are likely to place bulk orders in the next 3 months, and suggest when we need to purchase raw materials or restock to avoid stockouts.
      Output a JSON array of 3 distinct, high-impact suggestions.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              description: "List of actionable procurement insights",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  urgency: { type: Type.STRING, description: "Low, Medium, or High" },
                  partner: { type: Type.STRING },
                  recommendedAction: { type: Type.STRING }
                },
                required: ["title", "urgency", "partner", "recommendedAction"]
              }
            }
          },
          required: ["insights"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.insights;
    }
    return [];
  } catch (error) {
    console.error("Procurement Insights Error:", error);
    return [];
  }
}

export async function generatePartnerSegments(partnerData: any, rfmParams?: { recency: string, frequency: string, monetary: string }) {
  try {
    const rfmContext = rfmParams ? `\n\nTarget Segmentation Parameters:\n- Recency: ${rfmParams.recency}\n- Frequency: ${rfmParams.frequency}\n- Monetary Value: ${rfmParams.monetary}\nPlease weight these parameters heavily when forming the segment predictions.` : '';
    
    const prompt = `
      You are a Predictive Partner Segmentation AI. We have some recent partner activity: ${JSON.stringify(partnerData)}.
      Based on typical business behavior, predict 3 distinct partner segments and their future lifetime value (PLV).${rfmContext}
      Provide the segment name, description, average predicted PLV, and 2-3 suggested growth strategies for each segment.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            segments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  segmentName: { type: Type.STRING },
                  description: { type: Type.STRING },
                  averageCLV: { type: Type.STRING },
                  suggestedStrategies: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["segmentName", "description", "averageCLV", "suggestedStrategies"]
              }
            }
          },
          required: ["segments"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.segments;
    }
    return [];
  } catch (error) {
    console.error("Partner Segmentation Error:", error);
    return [];
  }
}

export async function extractContractTerms(contractText: string) {
  try {
    const prompt = `
      You are a Legal & Compliance AI. Extract the key terms, SLA metrics, start date, end date, and renewal clauses from the following contract text:
      
      Contract Text:
      "${contractText}"
      
      Provide your findings in a structured JSON format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            partnerName: { type: Type.STRING },
            contractValue: { type: Type.STRING },
            startDate: { type: Type.STRING },
            endDate: { type: Type.STRING },
            renewalTerms: { type: Type.STRING },
            slaMetrics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Service Level Agreement commitments."
            },
            keyClauses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Other key clauses and obligations."
            }
          },
          required: ["partnerName", "startDate", "endDate", "renewalTerms", "slaMetrics", "keyClauses"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Contract Extraction Error:", error);
    return null;
  }
}