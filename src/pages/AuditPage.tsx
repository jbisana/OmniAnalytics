import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auditLogs } from '@/data/mockData';
import { ShieldCheck, Download, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function AuditPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            System Audit Trail
          </h1>
          <p className="text-sm text-gray-500 mt-1">Comprehensive logging of user activities and system events.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          <Button><Download className="w-4 h-4 mr-2" /> Export Logs</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 bg-gray-50/50 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Log ID</th>
                  <th className="px-6 py-4 font-medium">Timestamp</th>
                  <th className="px-6 py-4 font-medium">User/System</th>
                  <th className="px-6 py-4 font-medium">Action Performed</th>
                  <th className="px-6 py-4 font-medium">IP Address</th>
                  <th className="px-6 py-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{log.id}</td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{log.user}</td>
                    <td className="px-6 py-4 text-gray-600">{log.action}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{log.ip}</td>
                    <td className="px-6 py-4 text-right">
                      <Badge variant={log.status === 'Success' ? 'success' : 'destructive'}>
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center text-sm text-gray-500 px-2">
        <span>Showing {auditLogs.length} recent system events</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}
