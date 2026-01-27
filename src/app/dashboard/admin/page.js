'use client';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { BarChart3, Database, ShieldAlert, Users, MessageCircle, Map as MapIcon, Plus } from 'lucide-react';

export default function AdminDashboard() {
    const stats = [
        { label: 'Total Patients', value: '45,210', icon: <Users size={20} />, change: '+2.5%' },
        { label: 'Active Appointments', value: '1,280', icon: <BarChart3 size={20} />, change: '+5.1%' },
        { label: 'Chatbot Inquiries', value: '8,422', icon: <MessageCircle size={20} />, change: '+12.3%' },
        { label: 'System Alerts', value: '0', icon: <ShieldAlert size={20} />, change: 'All Clear' },
    ];

    return (
        <div className="dashboard-page admin-theme">
            <Header />

            <main className="dashboard-main">
                <div className="container">
                    <header className="dashboard-header-section">
                        <h1 className="welcome-title">System <span className="gradient-text">Administrator</span></h1>
                        <div className="admin-status-badge">
                            <span className="pulse-dot"></span>
                            System Live: {new Date().toLocaleDateString()}
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <section className="admin-stats-grid">
                        {stats.map((s, i) => (
                            <div key={i} className="admin-stat-card card-shadow">
                                <div className="stat-row-1">
                                    <div className="stat-icon-box">{s.icon}</div>
                                    <span className="stat-percent">{s.change}</span>
                                </div>
                                <div className="stat-row-2">
                                    <span className="stat-val">{s.value}</span>
                                    <span className="stat-lbl">{s.label}</span>
                                </div>
                            </div>
                        ))}
                    </section>

                    <div className="admin-main-grid">
                        {/* Management Portal */}
                        <div className="admin-col main">
                            <section className="dashboard-section card-shadow">
                                <h3 className="section-title mb-1.5">Management Portal</h3>
                                <div className="management-tiles">
                                    <div className="manage-tile">
                                        <Database size={32} />
                                        <h4>Hospital Data</h4>
                                        <p>Clinics, Rooms, Equipment</p>
                                        <button className="manage-btn">Configure</button>
                                    </div>
                                    <div className="manage-tile">
                                        <MapIcon size={32} />
                                        <h4>Mapping Engine</h4>
                                        <p>2D Floor Plans & Navigation</p>
                                        <button className="manage-btn">Edit Layout</button>
                                    </div>
                                    <div className="manage-tile">
                                        <Users size={32} />
                                        <h4>User Roles</h4>
                                        <p>Doctors, Staff, Permissions</p>
                                        <button className="manage-btn">Manage</button>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Recent Audit Logs */}
                        <div className="admin-col side">
                            <section className="dashboard-section card-shadow">
                                <div className="title-between">
                                    <h3 className="section-title">Audit Logs</h3>
                                    <button className="icon-btn"><Plus size={16} /></button>
                                </div>
                                <div className="audit-list">
                                    <div className="audit-entry">
                                        <span className="a-time">13:05</span>
                                        <p>Admin updated Cardiology clinic schedule</p>
                                    </div>
                                    <div className="audit-entry">
                                        <span className="a-time">12:40</span>
                                        <p>System auto-backup completed successfully</p>
                                    </div>
                                    <div className="audit-entry">
                                        <span className="a-time">11:15</span>
                                        <p>New doctor profile created: Dr. Omar Khalil</p>
                                    </div>
                                </div>
                                <button className="view-logs-btn">Full Audit Trail</button>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <style jsx>{`
        .dashboard-page { min-height: 100vh; background: #020617; color: #f8fafc; }
        .dashboard-main { padding-top: calc(var(--header-height) + 2rem); padding-bottom: 5rem; }
        .dashboard-header-section { display: flex; align-items: center; justify-content: space-between; margin-bottom: 3rem; }
        
        .admin-status-badge { display: flex; align-items: center; gap: 0.75rem; background: rgba(255,255,255,0.05); padding: 0.6rem 1.25rem; border-radius: 2rem; font-size: 0.85rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.1); }
        .pulse-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; animation: pulse 2s infinite; }
        
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

        .admin-stats-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1.5rem; margin-bottom: 3rem; }
        @media (min-width: 640px) { .admin-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .admin-stats-grid { grid-template-columns: repeat(4, 1fr); } }

        .admin-stat-card { background: #0f172a; border: 1px solid #1e293b; padding: 1.5rem; border-radius: 1.25rem; }
        .stat-row-1 { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
        .stat-icon-box { background: rgba(13, 148, 136, 0.1); color: var(--primary); width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .stat-percent { font-size: 0.75rem; font-weight: 700; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 0.25rem 0.5rem; border-radius: 4px; }
        .stat-val { display: block; font-size: 1.75rem; font-weight: 800; margin-bottom: 0.25rem; }
        .stat-lbl { font-size: 0.85rem; color: #94a3b8; font-weight: 500; }

        .admin-main-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 1024px) { .admin-main-grid { grid-template-columns: 2fr 1fr; } }

        .dashboard-section { background: #0f172a; border: 1px solid #1e293b; padding: 2rem; border-radius: 2rem; }
        .section-title { font-size: 1.25rem; font-weight: 700; color: white; }
        .mb-1.5 { margin-bottom: 2rem; }

        .management-tiles { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1.5rem; }
        @media (min-width: 640px) { .management-tiles { grid-template-columns: repeat(3, 1fr); } }
        
        .manage-tile { background: rgba(255,255,255,0.02); border: 1px solid #1e293b; padding: 1.5rem; border-radius: 1.5rem; text-align: center; transition: 0.3s; }
        .manage-tile:hover { background: rgba(255,255,255,0.05); border-color: var(--primary); transform: translateY(-5px); }
        .manage-tile :global(svg) { color: var(--primary); margin: 0 auto 1rem; }
        .manage-tile h4 { font-weight: 700; margin-bottom: 0.5rem; }
        .manage-tile p { font-size: 0.8rem; color: #94a3b8; margin-bottom: 1.5rem; }
        .manage-btn { width: 100%; padding: 0.6rem; border-radius: 0.75rem; background: #1e293b; color: white; font-weight: 600; font-size: 0.85rem; transition: 0.2s; }
        .manage-btn:hover { background: var(--primary); }

        .title-between { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
        .audit-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
        .audit-entry { display: flex; gap: 1rem; font-size: 0.85rem; }
        .a-time { color: var(--primary); font-weight: 700; flex-shrink: 0; }
        .audit-entry p { color: #94a3b8; line-height: 1.4; }
        
        .view-logs-btn { width: 100%; border: 1px solid #1e293b; padding: 0.8rem; border-radius: 0.75rem; font-weight: 600; font-size: 0.9rem; color: #94a3b8; }
        .view-logs-btn:hover { color: white; border-color: white; }
      `}</style>
        </div>
    );
}
