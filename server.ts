import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { inventoryData, crmCustomers, crmActivity } from './src/data/mockData.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

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
      server: { middlewareMode: true },
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
