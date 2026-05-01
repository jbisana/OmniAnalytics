import { format, subDays } from 'date-fns';

const today = new Date();

export const kpiData = {
  revenue: { value: '$1.4M', change: '+14.5%', trend: 'up' },
  activeDeals: { value: '42', change: '+8.2%', trend: 'up' },
  winRate: { value: '68%', change: '-1.1%', trend: 'down' },
  avgContractValue: { value: '$85k', change: '+5.4%', trend: 'up' },
};

export const salesData = Array.from({ length: 90 }).map((_, i) => ({
  date: format(subDays(today, 89 - i), 'yyyy-MM-dd'),
  displayDate: format(subDays(today, 89 - i), 'MMM dd'),
  sales: Math.floor(Math.random() * 5000) + 2000,
  predicted: Math.floor(Math.random() * 5000) + 2000,
}));

export const inventoryData = [
  { 
    id: 'PROD-001', name: 'Wireless Noise-Canceling Headphones', category: 'Electronics', stock: 45, status: 'In Stock', price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80',
    rating: 4.8,
    partnerFeedback: [
      { partner: 'TechStart Inc', comment: 'Defect rate consistently below 1%. High quality components.', rating: 5, date: 'Oct 12' },
      { partner: 'Quantum Dynamics', comment: 'Consistent lead times, but occasional packaging damage.', rating: 4.5, date: 'Oct 08' }
    ],
    history: [
      { date: 'Oct 20', change: '+50', reason: 'Restock PO-1029' },
      { date: 'Oct 25', change: '-5', reason: 'Online Sales' }
    ]
  },
  { 
    id: 'PROD-002', name: 'Ergonomic Office Chair', category: 'Furniture', stock: 12, status: 'Low Stock', price: 199.50,
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=200&q=80',
    rating: 4.2,
    partnerFeedback: [
      { partner: 'Acme Corp', comment: 'Sturdy build. Took some time to integrate into our workspace.', rating: 4, date: 'Oct 15' }
    ],
    history: [
     { date: 'Oct 10', change: '+20', reason: 'Restock PO-1020' },
     { date: 'Oct 12', change: '-8', reason: 'B2B Order' }
    ]
  },
  { 
    id: 'PROD-003', name: 'Mechanical Keyboard (Cherry MX)', category: 'Electronics', stock: 0, status: 'Out of Stock', price: 129.99,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=200&q=80',
    rating: 4.9,
    partnerFeedback: [
      { partner: 'Global Retailers', comment: 'Excellent tactile feedback for our data entry teams.', rating: 5, date: 'Oct 01' }
    ],
    history: [
      { date: 'Sep 28', change: '+10', reason: 'Restock PO-0990' },
      { date: 'Oct 05', change: '-10', reason: 'Flash Sale' }
    ]
  },
  { 
    id: 'PROD-004', name: 'Ceramic Pour-Over Coffee Maker', category: 'Kitchen', stock: 156, status: 'In Stock', price: 45.00,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&q=80',
    rating: 4.5,
    partnerFeedback: [
      { partner: 'Fusion Logistics', comment: 'Durable construction, great for our breakrooms.', rating: 5, date: 'Oct 21' },
      { partner: 'Acme Corp', comment: 'Aesthetic is great, but pricing for bulk needs review.', rating: 4, date: 'Oct 19' }
    ],
    history: [
      { date: 'Oct 01', change: '+200', reason: 'Initial Stock' },
      { date: 'Oct 15', change: '-44', reason: 'Online Sales' }
    ]
  },
  { 
    id: 'PROD-005', name: 'Smart Home Hub - 2nd Gen', category: 'Electronics', stock: 8, status: 'Low Stock', price: 89.99,
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=200&q=80',
    rating: 3.8,
    partnerFeedback: [
      { partner: 'Quantum Dynamics', comment: 'API integration required 2 patches. Hardware stability is good.', rating: 3, date: 'Oct 22' }
    ],
    history: [
      { date: 'Oct 10', change: '+15', reason: 'Restock PO-1022' },
      { date: 'Oct 24', change: '-7', reason: 'Online Sales' }
    ]
  },
];

export const crmActivity = [
  { id: 1, user: 'Sarah Jenkins', action: 'Upgraded to Premium Tier', date: format(subDays(today, 0), 'MMM dd, HH:mm') },
  { id: 2, user: 'Michael Chen', action: 'Abandoned Cart ($142.50)', date: format(subDays(today, 1), 'MMM dd, HH:mm') },
  { id: 3, user: 'Elena Rodriguez', action: 'Submitted Support Ticket', date: format(subDays(today, 1), 'MMM dd, HH:mm') },
  { id: 4, user: 'James Wilson', action: 'Completed Purchase ($89.00)', date: format(subDays(today, 2), 'MMM dd, HH:mm') },
];

export const auditLogs = Array.from({ length: 15 }).map((_, i) => ({
  id: `LOG-${1000 + i}`,
  user: ['Admin', 'Manager', 'System API'][Math.floor(Math.random() * 3)],
  action: ['Updated Inventory', 'Generated Report', 'Changed Role Settings', 'Data Sync'][Math.floor(Math.random() * 4)],
  timestamp: format(subDays(today, Math.floor(Math.random() * 5)), 'yyyy-MM-dd HH:mm:ss'),
  ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
  status: ['Success', 'Failed', 'Success'][Math.floor(Math.random() * 3)]
}));

export const crmCustomers = [
  { id: 'CUST-001', name: 'Acme Corp (Global HQ)', email: 'contact@acmecorp.com', lastInteraction: '2 hours ago', segment: 'High Value', role: 'Parent Company', parentId: null, locations: 3 },
  { id: 'CUST-001-A', name: 'Acme Corp (EMEA)', email: 'emea@acmecorp.com', lastInteraction: '4 hours ago', segment: 'High Value', role: 'Subsidiary', parentId: 'CUST-001', locations: 0 },
  { id: 'CUST-001-B', name: 'Acme Corp (APAC)', email: 'apac@acmecorp.com', lastInteraction: '1 day ago', segment: 'Medium Value', role: 'Subsidiary', parentId: 'CUST-001', locations: 0 },
  { id: 'CUST-001-C', name: 'Acme Corp (NA)', email: 'na@acmecorp.com', lastInteraction: '3 hours ago', segment: 'High Value', role: 'Subsidiary', parentId: 'CUST-001', locations: 0 },
  { id: 'CUST-002', name: 'Global Tech', email: 'info@globaltech.com', lastInteraction: '1 day ago', segment: 'Medium Value', role: 'Parent Company', parentId: null, locations: 1 },
  { id: 'CUST-003', name: 'Startup Inc', email: 'hello@startupinc.io', lastInteraction: '3 days ago', segment: 'Low Value', role: 'Parent Company', parentId: null, locations: 0 },
  { id: 'CUST-004', name: 'Enterprise LLC', email: 'admin@enterprisellc.com', lastInteraction: '5 mins ago', segment: 'High Value', role: 'Parent Company', parentId: null, locations: 2 },
  { id: 'CUST-004-A', name: 'Enterprise LLC (East Coast)', email: 'east@enterprisellc.com', lastInteraction: '2 hours ago', segment: 'Medium Value', role: 'Subsidiary', parentId: 'CUST-004', locations: 0 },
  { id: 'CUST-004-B', name: 'Enterprise LLC (West Coast)', email: 'west@enterprisellc.com', lastInteraction: '1 day ago', segment: 'High Value', role: 'Subsidiary', parentId: 'CUST-004', locations: 0 },
];

export const quotesData = [
  { id: 'QT-2024-001', partner: 'Acme Corp', date: '2024-10-25', amount: 15400.00, status: 'Accepted', validUntil: '2024-11-25' },
  { id: 'QT-2024-002', partner: 'TechStart Inc', date: '2024-10-26', amount: 8200.50, status: 'Pending', validUntil: '2024-11-26' },
  { id: 'QT-2024-003', partner: 'Global Retailers', date: '2024-10-28', amount: 45000.00, status: 'Draft', validUntil: '2024-11-28' },
];

export const invoicesData = [
  { id: 'INV-2024-001', partner: 'Acme Corp', date: '2024-10-20', dueDate: '2024-11-19', amount: 12500.00, status: 'Paid' },
  { id: 'INV-2024-002', partner: 'Fusion Logistics', date: '2024-10-24', dueDate: '2024-11-23', amount: 6400.00, status: 'Sent' },
  { id: 'INV-2024-003', partner: 'Quantum Dynamics', date: '2024-09-15', dueDate: '2024-10-15', amount: 9800.00, status: 'Overdue' },
  { id: 'INV-2024-004', partner: 'TechStart Inc', date: '2024-10-27', dueDate: '2024-11-26', amount: 3200.00, status: 'Draft' },
];

export const ticketsData = [
  { id: 'TKT-1084', partner: 'Acme Corp', type: 'Defect', priority: 'High', status: 'Open', subject: 'Server Node Failure - Batch A', date: '2024-11-01', slaStatus: 'Breached' },
  { id: 'TKT-1085', partner: 'TechStart Inc', type: 'RMA', priority: 'Medium', status: 'In Progress', subject: 'Return Authorization for 50 Laptops', date: '2024-11-02', slaStatus: 'Warning' },
  { id: 'TKT-1086', partner: 'Global Retailers', type: 'Support', priority: 'Low', status: 'Resolved', subject: 'Integration API Configuration', date: '2024-10-28', slaStatus: 'Healthy' },
  { id: 'TKT-1087', partner: 'Quantum Dynamics', type: 'Billing', priority: 'Medium', status: 'Open', subject: 'Disputing Invoice INV-2024-003', date: '2024-11-03', slaStatus: 'Healthy' },
];
