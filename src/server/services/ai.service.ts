import { GoogleGenAI, Type } from '@google/genai';

let genAI: any | null = null;

function getAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined');
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export async function generateMarketingInsights(salesData: any[], kpiData: any) {
  const ai = getAI();
  const prompt = `
    You are an expert E-commerce Data Analyst. Analyze the following KPI and Sales Data.
    Provide 3 actionable insights to optimize marketing campaigns and partner engagement.
    Keep them concise and focus on ROI.

    Data:
    KPIs: ${JSON.stringify(kpiData)}
    Recent Sales Data Summary: First day: ${salesData[0]?.sales}, Last day: ${salesData[salesData.length - 1]?.sales}
  `;

  const result = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          insights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING }
              },
              required: ["title", "description", "impact"]
            }
          }
        }
      }
    }
  });

  return JSON.parse(result.text || '{}').insights || [];
}

export async function generateProductRecommendations(inventoryData: any[]) {
  const ai = getAI();
  const prompt = `
    Based on this current inventory list:
    ${JSON.stringify(inventoryData)}

    Predict the next 3 best products to feature in our "Deal of the week" campaign.
    Prioritize products with high stock or high value.
    Provide a brief rationale.
  `;

  const result = await ai.models.generateContent({
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
        }
      }
    }
  });

  return JSON.parse(result.text || '{}').recommendations || [];
}

export async function detectAnomalies(kpiData: any) {
  const ai = getAI();
  const prompt = `
    You are an expert E-commerce Anomaly Detection AI. Analyze the existing system KPIs: ${JSON.stringify(kpiData)}.
    Identify 2-3 significant deviations from expected patterns.
    Provide the metric, the deviation, a description of the anomaly, and a list of 3 potential causes.
  `;

  const result = await ai.models.generateContent({
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
        }
      }
    }
  });

  return JSON.parse(result.text || '{}').anomalies || [];
}

export async function generateProcurementInsights(procurementData: any) {
  const ai = getAI();
  const prompt = `
    You are a Predictive Procurement AI. Analyze this supply chain and partner data: ${JSON.stringify(procurementData)}.
    Predict when major partners are likely to place bulk orders in the next 3 months.
    Output a JSON array of 3 distinct, high-impact suggestions.
  `;

  const result = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          insights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                urgency: { type: Type.STRING },
                partner: { type: Type.STRING },
                recommendedAction: { type: Type.STRING }
              },
              required: ["title", "urgency", "partner", "recommendedAction"]
            }
          }
        }
      }
    }
  });

  return JSON.parse(result.text || '{}').insights || [];
}

export async function generatePartnerSegments(partnerData: any, rfmParams?: any) {
  const ai = getAI();
  const rfmContext = rfmParams ? `\n\nTarget Segmentation Parameters:\n- Recency: ${rfmParams.recency}\n- Frequency: ${rfmParams.frequency}\n- Monetary Value: ${rfmParams.monetary}` : '';
  
  const prompt = `
    You are a Predictive Partner Segmentation AI. We have some recent partner activity: ${JSON.stringify(partnerData)}.\nBased on typical business behavior, predict 3 distinct partner segments.${rfmContext}
    Provide name, description, PLV, and growth strategies.
  `;

  const result = await ai.models.generateContent({
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
        }
      }
    }
  });

  return JSON.parse(result.text || '{}').segments || [];
}

export async function extractContractTerms(contractText: string) {
  const ai = getAI();
  const prompt = `
    You are a Legal & Compliance AI. Extract the key terms from the following contract:\n"${contractText}"
  `;

  const result = await ai.models.generateContent({
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
            items: { type: Type.STRING }
          },
          keyClauses: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    }
  });

  return JSON.parse(result.text || '{}');
}
