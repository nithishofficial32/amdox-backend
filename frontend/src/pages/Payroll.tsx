import React, { useState, useEffect } from 'react';

export const Payroll: React.FC = () => {
  const [payroll, setPayroll] = useState<any[]>([]);

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const token = localStorage.getItem('erp_token');
        const res = await fetch('http://https://amdox-backend-1.onrender.com:5000/api/payroll', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setPayroll(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchPayroll();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Payroll & Compensation</h1>
      <table style={{ width: '100%', backgroundColor: 'rgba(15, 23, 42, 0.75)', borderCollapse: 'collapse', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: '#94a3b8', textAlign: 'left' }}>
            <th style={{ padding: '14px' }}>EMPLOYEE</th>
            <th style={{ padding: '14px' }}>MONTH</th>
            <th style={{ padding: '14px' }}>SALARY</th>
            <th style={{ padding: '14px' }}>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {payroll.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No active payroll disbursements found.</td>
            </tr>
          ) : (
            payroll.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '14px', fontWeight: 'bold' }}>{p.employeeName}</td>
                <td style={{ padding: '14px' }}>{p.month}</td>
                <td style={{ padding: '14px', color: '#34d399', fontWeight: 'bold' }}>${p.salary}</td>
                <td style={{ padding: '14px' }}>{p.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
