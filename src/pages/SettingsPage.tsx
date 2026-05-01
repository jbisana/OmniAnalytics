import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAI } from '@/contexts/AIContext';
import { Settings, Bell, Shield, Smartphone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_ALERTS = {
  criticalStock: true,
  lowStock: true,
  newPartner: false,
  anomalies: true,
};

export function SettingsPage() {
  const [alertSettings, setAlertSettings] = useState(DEFAULT_ALERTS);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings/alerts')
      .then(res => res.json())
      .then(data => {
        setAlertSettings(data);
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleToggle = async (key: keyof typeof DEFAULT_ALERTS) => {
    const newSettings = { ...alertSettings, [key]: !alertSettings[key] };
    setAlertSettings(newSettings);
    
    try {
      await fetch('/api/settings/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (e) {
      console.error(e);
      // Revert if failed
      setAlertSettings(alertSettings);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account preferences and system notifications.</p>
        </div>
        {isSaved && (
          <Badge variant="success" className="bg-green-100 text-green-800 border-none transition-all">
            Settings Saved
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <nav className="space-y-1" aria-label="Sidebar">
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors bg-blue-50 text-blue-700 font-medium">
              <Bell size={20} className="text-blue-600" />
              Alerts & Notifications
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 disabled:opacity-50" disabled>
              <Shield size={20} className="text-gray-400" />
              Security (WIP)
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 disabled:opacity-50" disabled>
              <Smartphone size={20} className="text-gray-400" />
              Devices (WIP)
            </button>
          </nav>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what events you want to be notified about.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" /> Inventory Alerts
                </h3>
                <div className="border border-gray-100 rounded-lg divide-y divide-gray-100">
                  <div className="flex items-center justify-between p-4 bg-gray-50/50">
                    <div>
                      <p className="text-sm border-gray-900 font-medium">Critical Stock Alerts</p>
                      <p className="text-xs text-gray-500 mt-0.5">Receive immediate email notifications when an item hits critical stock level.</p>
                    </div>
                    <ToggleSwitch checked={alertSettings.criticalStock} onChange={() => handleToggle('criticalStock')} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50/50">
                    <div>
                      <p className="text-sm text-gray-900 font-medium">Low Stock Alerts</p>
                      <p className="text-xs text-gray-500 mt-0.5">Receive digests when items fall below normal thresholds.</p>
                    </div>
                    <ToggleSwitch checked={alertSettings.lowStock} onChange={() => handleToggle('lowStock')} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-500" /> System Alerts
                </h3>
                <div className="border border-gray-100 rounded-lg divide-y divide-gray-100">
                  <div className="flex items-center justify-between p-4 bg-gray-50/50">
                    <div>
                      <p className="text-sm text-gray-900 font-medium">AI Anomaly Detection</p>
                      <p className="text-xs text-gray-500 mt-0.5">Get notified when AI detects unusual patterns in sales or traffic.</p>
                    </div>
                    <ToggleSwitch checked={alertSettings.anomalies} onChange={() => handleToggle('anomalies')} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50/50">
                    <div>
                      <p className="text-sm text-gray-900 font-medium">New Partner Signups</p>
                      <p className="text-xs text-gray-500 mt-0.5">Get daily summaries of new enterprise signups.</p>
                    </div>
                    <ToggleSwitch checked={alertSettings.newPartner} onChange={() => handleToggle('newPartner')} />
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean, onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2",
        checked ? "bg-blue-600" : "bg-gray-200"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}
