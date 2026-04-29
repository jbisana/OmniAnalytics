import React from 'react';
import { cn } from '@/lib/utils';
import { useAI } from '@/contexts/AIContext';
import { 
  BarChart3, 
  LayoutDashboard, 
  Settings, 
  ShoppingBag, 
  Users, 
  Activity,
  Bell,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  History,
  AlertTriangle,
  PieChart,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activePath: string;
  setActivePath: (path: string) => void;
}

const navItems = [
  { name: 'Dashboard', path: 'dashboard', icon: LayoutDashboard },
  { name: 'Sales & Trends', path: 'sales', icon: BarChart3 },
  { name: 'AI Insights', path: 'insights', icon: Sparkles },
  { name: 'Anomaly Detection', path: 'anomalies', icon: AlertTriangle },
  { name: 'Customer Segments', path: 'segments', icon: PieChart },
  { name: 'CRM & Customers', path: 'crm', icon: Users },
  { name: 'Inventory', path: 'inventory', icon: ShoppingBag },
  { name: 'Audit Trail', path: 'audit', icon: History },
  { name: 'Settings', path: 'settings', icon: Settings },
];

export function DashboardLayout({ children }: { children: (activePath: string) => React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [activePath, setActivePath] = React.useState('dashboard');
  const { isAIEnabled, setIsAIEnabled } = useAI();

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col z-20 shadow-sm",
          isOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 shrink-0">
          {isOpen && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight truncate">OmniAnalytics</span>
            </div>
          )}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
          >
            {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 overflow-y-auto space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => setActivePath(item.path)}
                title={!isOpen ? item.name : undefined}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors group",
                  isActive 
                    ? "bg-blue-50 text-blue-700 font-medium" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon size={20} className={cn("shrink-0", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600")} />
                {isOpen && <span className="truncate">{item.name}</span>}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 shrink-0">
          <div className={cn("flex items-center gap-3", !isOpen && "justify-center")}>
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
              alt="Admin User" 
              className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 shrink-0"
            />
            {isOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">System Admin</p>
                <p className="text-xs text-gray-500 truncate">Enterprise Account</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0 z-10 shadow-sm">
          <div className="max-w-md w-full relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search reports, metrics, or insights..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAIEnabled(!isAIEnabled)} 
              className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isAIEnabled ? <ToggleRight className="w-5 h-5 text-blue-600" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
              AI {isAIEnabled ? 'Enabled' : 'Disabled'}
            </button>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <React.Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 backdrop-blur-sm z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }>
            {children(activePath)}
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}
