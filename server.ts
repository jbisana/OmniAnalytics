import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { inventoryData, crmCustomers, crmActivity } from './src/data/mockData.ts';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json());

  // In-memory data store for server updates
  let serverInventory = inventoryData.map(item => ({
    ...item,
    threshold: 20,
    criticalThreshold: 5,
    lastUpdated: Date.now()
  }));

  // Simple SSE clients pool
  const inventoryClients = new Set<express.Response>();

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Inventory Endpoints
  app.get('/api/inventory', (req, res) => {
    res.json(serverInventory);
  });

  app.post('/api/inventory/thresholds', (req, res) => {
    const { id, field, value } = req.body;
    serverInventory = serverInventory.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Recalculate status
        updated.status = updated.stock === 0 ? 'Out of Stock' 
          : updated.stock <= updated.criticalThreshold ? 'Critical Stock'
          : updated.stock <= updated.threshold ? 'Low Stock' : 'In Stock';
        return updated;
      }
      return item;
    });
    
    // Broadcast whole inventory on change to keep simple, or just a change event
    inventoryClients.forEach(client => {
      client.write(`data: ${JSON.stringify(serverInventory)}\n\n`);
    });
    
    res.json({ success: true });
  });

  // SSE Stream for Inventory updates
  app.get('/api/inventory/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE

    // Send initial data
    res.write(`data: ${JSON.stringify(serverInventory)}\n\n`);

    inventoryClients.add(res);

    req.on('close', () => {
      inventoryClients.delete(res);
    });
  });

  // CRM Endpoints
  // Use in-memory store for CRM so updates persist in-session
  let serverCrmCustomers = [...crmCustomers];
  let serverCrmActivity = [...crmActivity];

  app.get('/api/crm/customers', (req, res) => {
    res.json(serverCrmCustomers);
  });

  app.get('/api/crm/activity', (req, res) => {
    res.json(serverCrmActivity);
  });

  // Alert Settings Endpoint
  let serverAlertSettings = {
    criticalStock: true,
    lowStock: true,
    newCustomer: false,
    anomalies: true,
  };

  app.get('/api/settings/alerts', (req, res) => {
    res.json(serverAlertSettings);
  });

  // AI Endpoints
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  app.post('/api/ai/marketing-insights', async (req, res) => {
    try {
      const { salesData, kpiData } = req.body;
      const prompt = `
        You are an expert E-commerce Data Analyst. Analyze the following KPI and Sales Data.
        Provide 3 actionable insights to optimize marketing campaigns and partner engagement.
        Keep them concise and focus on ROI.

        Data:
        KPIs: ${JSON.stringify(kpiData)}
        Recent Sales Data Summary: First day: ${salesData[0]?.sales}, Last day: ${salesData[salesData.length - 1]?.sales}
      `;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
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

      const responseText = result.text;
      const data = JSON.parse(responseText || '{}');
      res.json(data.insights || []);
    } catch (error) {
      console.error("AI Insights Error:", error);
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  app.post('/api/ai/product-recommendations', async (req, res) => {
    try {
      const { inventoryData } = req.body;
      const prompt = `
        Based on this current inventory list:
        ${JSON.stringify(inventoryData)}

        Predict the next 3 best products to feature in our "Deal of the week" campaign.
        Prioritize products with high stock or high value.
        Provide a brief rationale.
      `;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
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

      const responseText = result.text;
      const data = JSON.parse(responseText || '{}');
      res.json(data.recommendations || []);
    } catch (error) {
      console.error("AI Recommendations Error:", error);
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  app.post('/api/ai/detect-anomalies', async (req, res) => {
    try {
      const { kpiData } = req.body;
      const prompt = `
        You are an expert E-commerce Anomaly Detection AI. Analyze the existing system KPIs: ${JSON.stringify(kpiData)}.
        Identify 2-3 significant deviations from expected patterns (make up realistic scenarios that could happen, such as a drop in conversion rate, or an unexpected spike in a specific category's sales).
        Provide the metric, the deviation, a description of the anomaly, and a list of 3 potential causes.
      `;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
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

      const responseText = result.text;
      const data = JSON.parse(responseText || '{}');
      res.json(data.anomalies || []);
    } catch (error) {
      console.error("Anomaly Detection Error:", error);
      res.status(500).json({ error: "Failed to detect anomalies" });
    }
  });

  app.post('/api/ai/procurement-insights', async (req, res) => {
    try {
      const { procurementData } = req.body;
      const prompt = `
        You are a Predictive Procurement AI. Analyze this supply chain and partner data: ${JSON.stringify(procurementData)}.
        Predict when major partners are likely to place bulk orders in the next 3 months, and suggest when we need to purchase raw materials or restock to avoid stockouts.
        Output a JSON array of 3 distinct, high-impact suggestions.
      `;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
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

      const responseText = result.text;
      const data = JSON.parse(responseText || '{}');
      res.json(data.insights || []);
    } catch (error) {
      console.error("Procurement Insights Error:", error);
      res.status(500).json({ error: "Failed to generate procurement insights" });
    }
  });

  app.post('/api/ai/partner-segments', async (req, res) => {
    try {
      const { partnerData, rfmParams } = req.body;
      const rfmContext = rfmParams ? `\n\nTarget Segmentation Parameters:\n- Recency: ${rfmParams.recency}\n- Frequency: ${rfmParams.frequency}\n- Monetary Value: ${rfmParams.monetary}\nPlease weight these parameters heavily when forming the segment predictions.` : '';
      
      const prompt = `
        You are a Predictive Partner Segmentation AI. We have some recent partner activity: ${JSON.stringify(partnerData)}.
        Based on typical business behavior, predict 3 distinct partner segments and their future lifetime value (PLV).${rfmContext}
        Provide the segment name, description, average predicted PLV, and 2-3 suggested growth strategies for each segment.
      `;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
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

      const responseText = result.text;
      const data = JSON.parse(responseText || '{}');
      res.json(data.segments || []);
    } catch (error) {
      console.error("Partner Segmentation Error:", error);
      res.status(500).json({ error: "Failed to generate partner segments" });
    }
  });

  app.post('/api/ai/extract-contract', async (req, res) => {
    try {
      const { contractText } = req.body;
      const prompt = `
        You are a Legal & Compliance AI. Extract the key terms, SLA metrics, start date, end date, and renewal clauses from the following contract text:
        
        Contract Text:
        "${contractText}"
        
        Provide your findings in a structured JSON format.
      `;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
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

      const responseText = result.text;
      res.json(JSON.parse(responseText || '{}'));
    } catch (error) {
      console.error("Contract Extraction Error:", error);
      res.status(500).json({ error: "Failed to extract contract terms" });
    }
  });

  app.get('/api/settings/alerts', (req, res) => {
    res.json(serverAlertSettings);
  });

  app.post('/api/settings/alerts', (req, res) => {
    serverAlertSettings = { ...serverAlertSettings, ...req.body };
    res.json({ success: true, settings: serverAlertSettings });
  });

  // Simulate server-side stock drop logic (moved from client)
  setInterval(() => {
    let changed = false;
    serverInventory = serverInventory.map(item => {
      const oldStock = item.stock;
      if (oldStock > 0 && Math.random() > 0.7) {
        changed = true;
        const drop = Math.floor(Math.random() * 3) + 1;
        const newStock = Math.max(0, oldStock - drop);
        
        let newStatus = 'In Stock';
        if (newStock === 0) newStatus = 'Out of Stock';
        else if (newStock <= item.criticalThreshold) newStatus = 'Critical Stock';
        else if (newStock <= item.threshold) newStatus = 'Low Stock';
        
        // Critical stock alert email notification
        if (serverAlertSettings.criticalStock && newStock <= item.criticalThreshold && oldStock > item.criticalThreshold) {
          const admins = serverCrmCustomers.filter(c => c.role === 'System Admin');
          admins.forEach(admin => {
            console.log(`[EMAIL NOTIFICATION] To: ${admin.email} | Subject: CRITICAL STOCK ALERT - ${item.name} | Body: Stock has dropped to ${newStock}.`);
          });
        }
        
        const newHistoryItem = { 
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          change: `-${oldStock - newStock}`, 
          reason: 'Live Sale (API)' 
        };
        const updatedHistory = [newHistoryItem, ...(item.history || [])].slice(0, 5);
        
        return { ...item, stock: newStock, status: newStatus, history: updatedHistory, lastUpdated: Date.now() };
      }
      return item;
    });

    if (changed) {
      inventoryClients.forEach(client => {
        client.write(`data: ${JSON.stringify(serverInventory)}\n\n`);
      });
    }
  }, 4000);

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
