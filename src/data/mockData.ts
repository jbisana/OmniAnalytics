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
  { id: 'CUST-001', name: 'Acme Corp', email: 'contact@acmecorp.com', lastInteraction: '2 hours ago', segment: 'High Value', role: 'Customer' },
  { id: 'CUST-002', name: 'Global Tech', email: 'info@globaltech.com', lastInteraction: '1 day ago', segment: 'Medium Value', role: 'System Admin' },
  { id: 'CUST-003', name: 'Startup Inc', email: 'hello@startupinc.io', lastInteraction: '3 days ago', segment: 'Low Value', role: 'Customer' },
  { id: 'CUST-004', name: 'Enterprise LLC', email: 'admin@enterprisellc.com', lastInteraction: '5 mins ago', segment: 'High Value', role: 'Customer' },
];
