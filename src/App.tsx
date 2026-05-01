import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { SalesTrendsPage } from './pages/SalesTrendsPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { InventoryPage } from './pages/InventoryPage';
import { ProcurementPage } from './pages/ProcurementPage';
import { AuditPage } from './pages/AuditPage';
import { CRMPage } from './pages/CRMPage';
import { ContractsPage } from './pages/ContractsPage';
import { PipelinePage } from './pages/PipelinePage';
import { AnomalyDetectionPage } from './pages/AnomalyDetectionPage';
import { PartnerSegmentsPage } from './pages/PartnerSegmentsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdministrationPage } from './pages/AdministrationPage';
import { InvoicingPage } from './pages/InvoicingPage';
import { CPQPage } from './pages/CPQPage';
import { SupportTicketsPage } from './pages/SupportTicketsPage';
import { AIProvider } from './contexts/AIContext';

import { PartnerPortalPage } from './pages/PartnerPortalPage';
import { PartnerOnboardingPage } from './pages/PartnerOnboardingPage';
import { PartnerDealRegistrationPage } from './pages/PartnerDealRegistrationPage';
import { PartnerSupportPortalPage } from './pages/PartnerSupportPortalPage';

export default function App() {
  return (
    <AIProvider>
      <DashboardLayout>
        {(activePath) => {
          switch (activePath) {
            case 'dashboard':
              return <DashboardPage />;
            case 'sales':
              return <SalesTrendsPage />;
            case 'insights':
              return <AIInsightsPage />;
            case 'anomalies':
              return <AnomalyDetectionPage />;
            case 'segments':
              return <PartnerSegmentsPage />;
            case 'inventory':
              return <InventoryPage />;
            case 'procurement':
              return <ProcurementPage />;
            case 'audit':
              return <AuditPage />;
            case 'crm':
              return <CRMPage />;
            case 'contracts':
              return <ContractsPage />;
            case 'pipeline':
              return <PipelinePage />;
            case 'cpq':
              return <CPQPage />;
            case 'invoicing':
              return <InvoicingPage />;
            case 'tickets':
              return <SupportTicketsPage />;
            case 'portal':
              return <PartnerPortalPage />;
            case 'deal-reg':
              return <PartnerDealRegistrationPage />;
            case 'onboarding':
              return <PartnerOnboardingPage />;
            case 'partner-support':
              return <PartnerSupportPortalPage />;
            case 'administration':
              return <AdministrationPage />;
            case 'settings':
              return <SettingsPage />;
            default:
              return (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700">Module Component Under Construction</h2>
                    <p className="text-gray-500 mt-2">The {activePath} module is currently being built.</p>
                  </div>
                </div>
              );
          }
        }}
      </DashboardLayout>
    </AIProvider>
  );
}

