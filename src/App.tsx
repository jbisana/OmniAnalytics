import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { SalesTrendsPage } from './pages/SalesTrendsPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { InventoryPage } from './pages/InventoryPage';
import { AuditPage } from './pages/AuditPage';
import { CRMPage } from './pages/CRMPage';
import { AnomalyDetectionPage } from './pages/AnomalyDetectionPage';
import { CustomerSegmentsPage } from './pages/CustomerSegmentsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdministrationPage } from './pages/AdministrationPage';
import { AIProvider } from './contexts/AIContext';

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
              return <CustomerSegmentsPage />;
            case 'inventory':
              return <InventoryPage />;
            case 'audit':
              return <AuditPage />;
            case 'crm':
              return <CRMPage />;
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

