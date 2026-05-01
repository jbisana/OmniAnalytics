import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Mail, Settings2, Shield, Bell, Key, Sparkles, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAI } from '@/contexts/AIContext';

const initialUsers = [
  { id: '1', name: 'Sarah Jenkins', email: 'sarah@example.com', role: 'System Admin', lastActive: '2 mins ago', status: 'Active', alerts: { criticalStock: true, lowStock: true, newCustomer: true, anomalies: true } },
  { id: '2', name: 'Michael Chen', email: 'michael@example.com', role: 'Sales Manager', lastActive: '1 hr ago', status: 'Active', alerts: { criticalStock: false, lowStock: false, newCustomer: true, anomalies: false } },
  { id: '3', name: 'Elena Rodriguez', email: 'elena@example.com', role: 'Support Agent', lastActive: '3 hrs ago', status: 'Away', alerts: { criticalStock: false, lowStock: false, newCustomer: false, anomalies: true } },
  { id: '4', name: 'James Wilson', email: 'james@example.com', role: 'Read-only API', lastActive: '5 days ago', status: 'Revoked', alerts: { criticalStock: false, lowStock: false, newCustomer: false, anomalies: false } },
];

const availableRoles = ['System Admin', 'Sales Manager', 'Support Agent', 'Read-only API'];

const initialRolePermissions = {
  'Sales Manager': { viewDashboard: true, manageInventory: false, viewCRM: true, exportData: true },
  'Support Agent': { viewDashboard: true, manageInventory: false, viewCRM: true, exportData: false },
  'Read-only API': { viewDashboard: false, manageInventory: false, viewCRM: false, exportData: true }
};

export function AdministrationPage() {
  const [users, setUsers] = useState(initialUsers);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  
  // Simulator for current user role
  const [currentUserRole, setCurrentUserRole] = useState('System Admin');
  
  // Role Permissions
  const [rolePermissions, setRolePermissions] = useState<Record<string, Record<string, boolean>>>(initialRolePermissions);

  const { isAIEnabled, setIsAIEnabled } = useAI();
  const [apiKey, setApiKey] = useState('');

  const isSystemAdmin = currentUserRole === 'System Admin';

  const handleRoleChange = (id: string, newRole: string) => {
    if (!isSystemAdmin) return;
    setUsers(users.map(u => (u.id === id ? { ...u, role: newRole } : u)));
  };

  const handleAlertToggle = (userId: string, alertKey: string) => {
    // We allow users to change alerts or maybe just admin
    setUsers(users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          alerts: { ...u.alerts, [alertKey as keyof typeof u.alerts]: !u.alerts[alertKey as keyof typeof u.alerts] }
        };
      }
      return u;
    }));
  };

  const handlePermissionToggle = (role: string, permKey: string) => {
    if (!isSystemAdmin) return;
    setRolePermissions(prev => ({
      ...prev,
      [role]: { ...prev[role], [permKey]: !prev[role][permKey] }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Role Simulator Header */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-yellow-600 mr-2" />
          <p className="text-sm text-yellow-800 font-medium">Simulator: Select your role to test access controls</p>
        </div>
        <select 
          value={currentUserRole} 
          onChange={e => setCurrentUserRole(e.target.value)}
          className="ml-4 border border-yellow-300 bg-white rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm"
        >
          {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Administration
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage team roles, access controls, and system preferences.</p>
        </div>
        <Button disabled={!isSystemAdmin}>
          <Users className="w-4 h-4 mr-2" /> Invite User
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Team Roles & Access</CardTitle>
            <CardDescription>Manage your internal team members and their permission levels.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 bg-gray-50/50 uppercase border-y border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Member</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <React.Fragment key={user.id}>
                      <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <select 
                              value={user.role} 
                              disabled={!isSystemAdmin}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              className="bg-transparent font-medium text-gray-700 border-b border-dashed border-gray-300 focus:border-blue-500 focus:ring-0 cursor-pointer pb-0.5 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={user.status === 'Active' ? 'success' : user.status === 'Away' ? 'warning' : 'destructive'}>
                            {user.status}
                          </Badge>
                          <div className="text-xs text-gray-400 mt-1">{user.lastActive}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                            className={cn(expandedUser === user.id && "bg-blue-50 text-blue-700")}
                          >
                            <Bell className="w-4 h-4 mr-2" /> Alerts
                          </Button>
                        </td>
                      </tr>
                      {expandedUser === user.id && (
                        <tr>
                          <td colSpan={4} className="bg-gray-50 p-6 border-b border-gray-200">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Bell className="w-4 h-4 text-blue-500" /> Alert Subscriptions for {user.name}
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                                  <div className="flex items-center h-5">
                                    <input 
                                      type="checkbox" 
                                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50" 
                                      checked={user.alerts.criticalStock}
                                      disabled={!isSystemAdmin}
                                      onChange={() => handleAlertToggle(user.id, 'criticalStock')}
                                    />
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm text-gray-900">Critical Stock Alerts</div>
                                    <div className="text-xs text-gray-500">Immediate notifications for critical stock levels.</div>
                                  </div>
                                </label>
                                <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                                  <div className="flex items-center h-5">
                                    <input 
                                      type="checkbox" 
                                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50" 
                                      checked={user.alerts.lowStock}
                                      disabled={!isSystemAdmin}
                                      onChange={() => handleAlertToggle(user.id, 'lowStock')}
                                    />
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm text-gray-900">Low Stock Alerts</div>
                                    <div className="text-xs text-gray-500">Daily digests when items fall below normal thresholds.</div>
                                  </div>
                                </label>
                                <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                                  <div className="flex items-center h-5">
                                    <input 
                                      type="checkbox" 
                                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50" 
                                      checked={user.alerts.newCustomer}
                                      disabled={!isSystemAdmin}
                                      onChange={() => handleAlertToggle(user.id, 'newCustomer')}
                                    />
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm text-gray-900">New Customer Signups</div>
                                    <div className="text-xs text-gray-500">Notifications for new enterprise or major signups.</div>
                                  </div>
                                </label>
                                <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                                  <div className="flex items-center h-5">
                                    <input 
                                      type="checkbox" 
                                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50" 
                                      checked={user.alerts.anomalies}
                                      disabled={!isSystemAdmin}
                                      onChange={() => handleAlertToggle(user.id, 'anomalies')}
                                    />
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm text-gray-900">AI Anomaly Detection</div>
                                    <div className="text-xs text-gray-500">Alerts for unusual patterns in sales or traffic.</div>
                                  </div>
                                </label>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* AI Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-600" /> AI Features Setup</CardTitle>
              <CardDescription>Configure AI capabilities across the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Enable AI Features</p>
                  <p className="text-xs text-gray-500">System-wide toggle for AI insights.</p>
                </div>
                <button
                  onClick={() => isSystemAdmin && setIsAIEnabled(!isAIEnabled)}
                  disabled={!isSystemAdmin}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                    isAIEnabled ? "bg-indigo-600" : "bg-gray-200"
                  )}
                >
                  <span className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    isAIEnabled ? "translate-x-5" : "translate-x-0"
                  )} />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Key className="w-4 h-4 text-gray-500" /> Gemini API Key
                </label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  disabled={!isSystemAdmin}
                  placeholder="AI_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                {!isSystemAdmin && (
                  <p className="text-xs flex items-center gap-1 text-gray-500 mt-1">
                    <AlertCircle className="w-3 h-3" /> Contact System Admin to change keys.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Role Permissions Configurator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings2 className="w-5 h-5 text-gray-700" /> Default Role Policies</CardTitle>
              <CardDescription>Configure accessible features per role type.</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(rolePermissions).map(role => (
                <div key={role} className="mb-6 last:mb-0">
                  <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-3">{role}</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={rolePermissions[role].viewDashboard} 
                        disabled={!isSystemAdmin}
                        onChange={() => handlePermissionToggle(role, 'viewDashboard')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                      <span className="text-sm text-gray-700">View Dashboard & KPIs</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={rolePermissions[role].manageInventory} 
                        disabled={!isSystemAdmin}
                        onChange={() => handlePermissionToggle(role, 'manageInventory')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                      <span className="text-sm text-gray-700">Manage Inventory & Pricing</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={rolePermissions[role].viewCRM} 
                        disabled={!isSystemAdmin}
                        onChange={() => handlePermissionToggle(role, 'viewCRM')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                      <span className="text-sm text-gray-700">Access CRM Data</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={rolePermissions[role].exportData} 
                        disabled={!isSystemAdmin}
                        onChange={() => handlePermissionToggle(role, 'exportData')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                      <span className="text-sm text-gray-700">Allow Global Data Export</span>
                    </label>
                  </div>
                </div>
              ))}
              {!isSystemAdmin && (
                 <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                   <p className="text-xs text-center text-gray-500">Only System Admin can edit default policies.</p>
                 </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
