# Omni B2B Business Solutions

A comprehensive B2B Enterprise Dashboard featuring AI-powered contract analysis, deal pipeline tracking, predictive revenue analytics, and partner management. Powered by Gemini AI.

## Features

- **Dashboard**: Customizable high-level KPI tracking (Revenue, Active Deals, Win Rate, ACV) and AI predictive revenue charts.
- **Deals & Pipeline**: Track enterprise deals through various stages of the sales cycle.
- **Quotes (CPQ)**: Advanced Configure, Price, Quote builder for constructing B2B orders with volume and custom discounting.
- **Invoicing & Billing**: Streamline B2B billing with quote tracking, invoice status, and automated AI assistance for overdues.
- **Partner Portal Catalog**: Provide a self-service B2B storefront for re-ordering, observing tier-based pricing, and order history tracking.
- **Partner Deal Registration**: Allows external partners to register opportunities they have uncovered to lock in margins and prevent channel conflict.
- **Partner Admin Hub (Team & Spend)**: A self-serve interface for HQ accounts to invite branch buyers, configure max monthly spend limits, and manually approve orders.
- **Partner Support & RMA Portal**: A Helpdesk simulation for partners to submit RMAs, defect reports, and general support tickets, complete with an AI-vision approval mockup.
- **Support & Ticketing (Post-Sale)**: Handle post-sale requests, RMA requests, defect tracking, and monitor SLA breaches with AI remediation alerts.
- **Contracts & SLA**: Centralized contract management with automated AI extraction of key terms, SLAs, and renewal alerts.
- **Sales & Trends**: Deep dive into revenue performance, sector analysis, and pipeline velocity.
- **AI Insights**: Gemini-driven performance insights, automated sales cycle analysis, and projections.
- **Anomaly Detection**: Flags statistical deviations in common business KPIs.
- **Partner Segmentation**: Predicts partner lifetime value (PLV) and provides actionable growth strategies locally or with Gemini AI.
- **Inventory & Supply Chain**: Manage partner feedback and supply chain data.
- **Company Account Hierarchies**: Manage parent accounts (HQs) and their child locations within the Partner Relations CRM view for centralized corporate oversight.
- **Self-Service Business Onboarding**: A portal simulator where new businesses upload tax-exempt certificates, credit apps, and specify structures without salesperson assistance.
- **Partner Relations**: Access management UI reflecting different roles and connected integrators.
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
