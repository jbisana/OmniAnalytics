# OmniAnalytics

An Enterprise E-commerce Analytics Dashboard packed with AI insights, real-time stock monitoring, customer segments, and predictive sales tracking. Powered by Gemini AI.

## Features

- **Dashboard**: High-level KPI tracking and AI predictive sales charts.
- **AI Insights**: Gemini-driven marketing optimizations and product recommendations.
- **Anomaly Detection**: Flags statistical deviations in common KPIs.
- **Customer Segmentation**: Predicts customer lifetime value (CLV) and provides actionable marketing strategies locally or with Gemini AI.
- **Inventory Management**: Real-time mock stream of stock data highlighting low & critical stock thresholds.
- **CRM Roles**: Access management UI reflecting different roles and connected integrators.
- **Audit Trails**: Security tracking logs of user actions.

## Getting Started

To get the application up and running locally, run the setup script:

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Environment Configuration
The setup script will copy `.env.example` into `.env`. 
Make sure you update the `.env` file with your relevant environment credentials:
- `GEMINI_API_KEY`: Required for Gemini AI generation features (Insights, Segment tracking, Anomalies).

After completing setup, launch the Vite development server:
```bash
npm run dev
```

## Structure

- `/src/` - React application source code
  - `/components/` - React components, layout and shadcn UI parts.
  - `/pages/` - Key application routes and views (Dashboard, Inventory, CRM, etc).
  - `/services/` - External data fetching and AI logic.
  - `/contexts/` - Global states (like AI Feature flags).
  - `/data/` - Mock data objects tracking store sales and inventory simulation.
- `/scripts/` - Helpful bash scripts (e.g. `setup.sh`).
- `/tests/` - Application unit/integration test suites.
- `/.github/workflows/` - CI/CD orchestration scripts.
