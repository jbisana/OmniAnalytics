import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import aiRoutes from './routes/ai.routes.ts';
import * as inventoryController from './controllers/inventory.controller.ts';
import * as crmController from './controllers/crm.controller.ts';
import * as settingsController from './controllers/settings.controller.ts';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  
  // AI Sub-router
  app.use('/api/ai', aiRoutes);

  // Inventory Routes
  app.get('/api/inventory', inventoryController.getInventory);
  app.post('/api/inventory/thresholds', inventoryController.updateThresholds);
  app.get('/api/inventory/stream', inventoryController.streamInventory);

  // CRM Routes
  app.get('/api/crm/customers', crmController.getCustomers);
  app.get('/api/crm/activity', crmController.getActivity);

  // Settings Routes
  app.get('/api/settings/alerts', settingsController.getAlertSettings);
  app.post('/api/settings/alerts', settingsController.updateAlertSettings);

  // Simulated background background logic
  setInterval(() => {
    const settings = settingsController.getInternalSettings();
    const { customers } = crmController.getCrmData();
    inventoryController.simulateStockDrop(settings, customers);
  }, 4000);

  // Vite middleware for development
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
    // Static serving for production
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
