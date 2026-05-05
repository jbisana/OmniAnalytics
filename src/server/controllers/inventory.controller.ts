import { Request, Response } from 'express';
import { inventoryData } from '../../data/mockData.ts';

// In-memory data store for server updates (shared across requests in this runtime)
let serverInventory = inventoryData.map(item => ({
  ...item,
  threshold: 20,
  criticalThreshold: 5,
  lastUpdated: Date.now()
}));

const inventoryClients = new Set<Response>();

export function getInventory(req: Request, res: Response) {
  res.json(serverInventory);
}

export function updateThresholds(req: Request, res: Response) {
  const { id, field, value } = req.body;
  serverInventory = serverInventory.map(item => {
    if (item.id === id) {
      const updated = { ...item, [field]: value };
      updated.status = updated.stock === 0 ? 'Out of Stock' 
        : updated.stock <= updated.criticalThreshold ? 'Critical Stock'
        : updated.stock <= updated.threshold ? 'Low Stock' : 'In Stock';
      return updated;
    }
    return item;
  });
  
  broadcastInventory();
  res.json({ success: true });
}

export function streamInventory(req: Request, res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // @ts-ignore
  if (res.flushHeaders) res.flushHeaders();

  res.write(`data: ${JSON.stringify(serverInventory)}\n\n`);
  inventoryClients.add(res);

  req.on('close', () => {
    inventoryClients.delete(res);
  });
}

export function broadcastInventory() {
  inventoryClients.forEach(client => {
    client.write(`data: ${JSON.stringify(serverInventory)}\n\n`);
  });
}

export function simulateStockDrop(alertSettings: any, crmCustomers: any) {
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
      
      if (alertSettings.criticalStock && newStock <= item.criticalThreshold && oldStock > item.criticalThreshold) {
        const admins = crmCustomers.filter((c: any) => c.role === 'System Admin');
        admins.forEach((admin: any) => {
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
    broadcastInventory();
  }
}
