import React, { useState } from 'react';
import { Bell, AlertTriangle, FileSignature, Receipt, Clock, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'contract', title: 'Contract Renewal', message: 'Acme Corp contract expires in 30 days.', time: '2 hours ago', unread: true, platform: 'Slack' },
    { id: 2, type: 'sla', title: 'SLA Breach Warning', message: 'Nexus Systems support ticket #8492 is approaching SLA breach limit.', time: '5 hours ago', unread: true, platform: 'Teams' },
    { id: 3, type: 'invoice', title: 'Overdue Invoice', message: 'Invoice INV-2026-002 for Global IT Solutions is 15 days overdue.', time: '1 day ago', unread: false, platform: 'Email' }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="relative">
      <button 
        className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden text-left">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={cn(
                      "p-4 hover:bg-gray-50 transition-colors cursor-pointer",
                      notification.unread ? "bg-blue-50/30" : ""
                    )}
                  >
                    <div className="flex gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        notification.type === 'contract' ? "bg-blue-100 text-blue-600" :
                        notification.type === 'sla' ? "bg-amber-100 text-amber-600" :
                        "bg-red-100 text-red-600"
                      )}>
                        {notification.type === 'contract' && <FileSignature size={14} />}
                        {notification.type === 'sla' && <Clock size={14} />}
                        {notification.type === 'invoice' && <Receipt size={14} />}
                      </div>
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={cn("text-sm font-medium", notification.unread ? "text-gray-900" : "text-gray-700")}>
                            {notification.title}
                          </h4>
                          <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-gray-200 text-gray-500">
                            {notification.platform}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-3 border-t border-gray-100 text-center bg-gray-50">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full flex items-center justify-center gap-1">
                View All Notifications
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
