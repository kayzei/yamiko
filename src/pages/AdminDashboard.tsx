import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Plus, 
  Search,
  MoreVertical,
  Bell
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const markAsRead = async (id: number) => {
    await fetch('/api/admin/alerts/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    setStats({ ...stats, alerts: stats.alerts.filter((a: any) => a.id !== id) });
  };

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <div className="p-20 text-center">Loading Analytics...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-white p-8 space-y-10 hidden lg:block">
        <div className="text-2xl font-display font-bold">YAMIKO<span className="text-gold">.</span> Admin</div>
        
        <nav className="space-y-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'orders', icon: ShoppingBag, label: 'Orders' },
            { id: 'customers', icon: Users, label: 'Customers' },
            { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-gold text-white' : 'text-white/60 hover:bg-white/10'}`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold">Dashboard Overview</h1>
            <p className="text-dark/40">Welcome back, Admin</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" size={18} />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 rounded-full border border-dark/10 outline-none focus:ring-2 focus:ring-gold" />
            </div>
            <button className="bg-dark text-white p-2 rounded-full"><Plus size={20} /></button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: 'Total Sales', value: `K${stats.totalSales}`, trend: '+12.5%', color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Total Orders', value: stats.orderCount, trend: '+5.2%', color: 'bg-blue-50 text-blue-600' },
            { label: 'Total Products', value: stats.productCount, trend: '0%', color: 'bg-gold/10 text-gold' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-dark/5">
              <p className="text-sm font-semibold uppercase tracking-widest text-dark/40 mb-2">{stat.label}</p>
              <div className="flex justify-between items-end">
                <span className="text-4xl font-display font-bold">{stat.value}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.color}`}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Alerts Section */}
        {stats.alerts && stats.alerts.length > 0 && (
          <div className="mb-12 space-y-4">
            <h2 className="text-xl font-display font-bold flex items-center gap-2">
              <Bell className="text-pink-primary" size={20} />
              Inventory Alerts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.alerts.map((alert: any) => (
                <div key={alert.id} className="bg-pink-soft/20 border border-pink-primary/20 p-4 rounded-2xl flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-pink-primary text-white p-2 rounded-full"><Package size={16} /></div>
                    <p className="text-sm font-medium">{alert.message}</p>
                  </div>
                  <button onClick={() => markAsRead(alert.id)} className="text-xs font-bold text-pink-primary hover:underline">Dismiss</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-dark/5 overflow-hidden">
          <div className="p-8 border-b border-dark/5 flex justify-between items-center">
            <h2 className="text-xl font-display font-bold">Recent Orders</h2>
            <button className="text-sm font-bold text-gold hover:underline">View All</button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-widest text-dark/40">
              <tr>
                <th className="px-8 py-4">Order ID</th>
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Total</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/5">
              {stats.recentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6 font-mono text-sm">#ORD-{order.id.toString().padStart(4, '0')}</td>
                  <td className="px-8 py-6 font-medium">Guest User</td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-bold">K{order.total_price}</td>
                  <td className="px-8 py-6 text-sm text-dark/40">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-dark/20 hover:text-dark"><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
