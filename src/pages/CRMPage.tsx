import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Mail, Settings2, Shield, UserSquare2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const initialUsers = [
  { id: '1', name: 'Sarah Jenkins', email: 'sarah@example.com', role: 'System Admin', lastActive: '2 mins ago', status: 'Active' },
  { id: '2', name: 'Michael Chen', email: 'michael@example.com', role: 'Sales Manager', lastActive: '1 hr ago', status: 'Active' },
  { id: '3', name: 'Elena Rodriguez', email: 'elena@example.com', role: 'Support Agent', lastActive: '3 hrs ago', status: 'Away' },
  { id: '4', name: 'James Wilson', email: 'james@example.com', role: 'Read-only API', lastActive: '5 days ago', status: 'Revoked' },
];

const availableRoles = ['System Admin', 'Sales Manager', 'Support Agent', 'Read-only API'];

export function CRMPage() {
  const [users, setUsers] = useState(initialUsers);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/crm/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setIsLoadingCustomers(false);
      })
      .catch(console.error);
  }, []);

  const handleRoleChange = (id: string, newRole: string) => {
    setUsers(users.map(u => (u.id === id ? { ...u, role: newRole } : u)));
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Partners
          </h1>
          <p className="text-sm text-gray-500 mt-1">View and manage partner data and interactions.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Partner Directory</CardTitle>
            <CardDescription>View and manage partner data and interactions.</CardDescription>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search partners..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-3 pr-10 py-2 border rounded-md text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 bg-gray-50/50 uppercase border-y border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Partner Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Last Interaction</th>
                  <th className="px-6 py-4 font-medium">Value Segment</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingCustomers ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                      Loading partners...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No partners found.
                    </td>
                  </tr>
                ) : filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                    <td className="px-6 py-4 text-gray-500">{customer.lastInteraction}</td>
                    <td className="px-6 py-4">
                      <Badge variant={customer.segment === 'High Value' ? 'success' : customer.segment === 'Medium Value' ? 'warning' : 'outline'}>
                        {customer.segment}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Integrations</CardTitle>
            <CardDescription>Active connections to 3rd party ERPs and tools.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="font-bold text-green-700">SF</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Salesforce</h4>
                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Connected
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="font-bold text-blue-700">SAP</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">SAP ERP</h4>
                    <p className="text-xs text-gray-500 font-medium">
                      Last sync: 2 hours ago
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-400">
                    +
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Add Integration</h4>
                    <p className="text-xs text-gray-500">Connect to Netsuite, Hubspot, etc.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
