import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

interface Stats {
  totalRevenue: number;
  employees: number;
  attendanceRate: number;
  departments: number;
}

export const Dashboard: React.FC = () => {
  const context = useOutletContext<{ currentDate?: string }>() || {};
  const currentDate = context.currentDate || new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const user = JSON.parse(localStorage.getItem('erp_user') || '{"name":"Priya"}');

  const [stats, setStats] = useState<Stats>({
    totalRevenue: 998000,
    employees: 120,
    attendanceRate: 94.2,
    departments: 6,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('erp_token');
        const res = await fetch('http://https://amdox-backend-1.onrender.com:5000/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalRevenue: data.totalRevenue || 998000,
            employees: data.employees || 120,
            attendanceRate: 94.2,
            departments: data.departments || 6,
          });
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#ffffff' }}>Welcome back, {user.name || 'Priya'}</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>Here's what's happening across AMDOX today · {currentDate}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '20px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '18px' }}>💵</span>
            <span style={{ backgroundColor: '#064e3b', color: '#34d399', fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>📈 12.5%</span>
          </div>
          <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>Total Revenue</p>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>${stats.totalRevenue.toLocaleString()}</h2>
        </div>

        <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '20px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '18px' }}>👥</span>
            <span style={{ backgroundColor: '#064e3b', color: '#34d399', fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>📈 4.2%</span>
          </div>
          <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>Employees</p>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>{stats.employees}</h2>
        </div>

        <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '20px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '18px' }}>📅</span>
            <span style={{ backgroundColor: '#064e3b', color: '#34d399', fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>📈 1.8%</span>
          </div>
          <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>Attendance Rate</p>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>{stats.attendanceRate}%</h2>
        </div>

        <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '20px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '18px' }}>🏢</span>
            <span style={{ backgroundColor: '#1e293b', color: '#34d399', fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>~ 0%</span>
          </div>
          <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>Departments</p>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>{stats.departments}</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '24px', border: '1px solid #1e293b' }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>Revenue vs Expense</h3>
          <p style={{ margin: '0 0 24px 0', fontSize: '12px', color: '#64748b' }}>Last 12 months</p>

          <svg viewBox="0 0 500 180" style={{ width: '100%', height: '180px', overflow: 'visible' }}>
            <line x1="0" y1="20" x2="500" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="0" y1="60" x2="500" y2="60" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2="500" y2="100" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="0" y1="140" x2="500" y2="140" stroke="#1e293b" strokeDasharray="3 3" />

            <path d="M 0 120 C 100 100, 200 110, 300 80 C 400 50, 450 30, 500 20 L 500 160 L 0 160 Z" fill="rgba(37, 99, 235, 0.15)" />
            <path d="M 0 120 C 100 100, 200 110, 300 80 C 400 50, 450 30, 500 20" fill="none" stroke="#2563eb" strokeWidth="3" />
            <path d="M 0 145 C 100 135, 200 140, 300 125 C 400 110, 450 100, 500 95" fill="none" stroke="#a855f7" strokeWidth="2.5" />
          </svg>

          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '11px', marginTop: '12px' }}>
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '24px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>Department Distribution</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#64748b' }}>Headcount by team</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '140px' }}>
            <svg width="130" height="130" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2563eb" strokeWidth="4.5" strokeDasharray="35, 100" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#a855f7" strokeWidth="4.5" strokeDasharray="25, 100" strokeDashoffset="-35" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#06b6d4" strokeWidth="4.5" strokeDasharray="20, 100" strokeDashoffset="-60" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray="20, 100" strokeDashoffset="-80" />
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '11px', color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }}></span> Engineering
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a855f7' }}></span> Product
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
