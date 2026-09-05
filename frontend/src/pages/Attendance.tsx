import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const Attendance: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const user = JSON.parse(localStorage.getItem('erp_user') || '{"name":"NITHISH","role":"Employee"}');

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('erp_token');
      const res = await fetch('http://https://amdox-backend-1.onrender.com:5000/api/attendance', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setLogs(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem('erp_token');
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const res = await fetch('http://https://amdox-backend-1.onrender.com:5000/api/attendance', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeName: user.name, date: new Date().toLocaleDateString(), status: `Checked In (${timeString})` }),
      });
      if (res.ok) {
        setIsCheckedIn(true);
        toast.success('Check-In Successful!');
        fetchAttendance();
      }
    } catch (err) {
      toast.error('Check-In Failed');
    }
  };

  const handleCheckOut = async () => {
    setIsCheckedIn(false);
    toast.success('Check-Out Successful!');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: '0 0 4px 0' }}>Attendance Portal</h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>Logged in as: {user.name} ({user.role})</p>
        </div>
        <div>
          {!isCheckedIn ? (
            <button onClick={handleCheckIn} style={{ padding: '10px 20px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Check In
            </button>
          ) : (
            <button onClick={handleCheckOut} style={{ padding: '10px 20px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Check Out
            </button>
          )}
        </div>
      </div>

      <table style={{ width: '100%', backgroundColor: 'rgba(15, 23, 42, 0.75)', borderCollapse: 'collapse', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: '#94a3b8', textAlign: 'left' }}>
            <th style={{ padding: '14px' }}>EMPLOYEE</th>
            <th style={{ padding: '14px' }}>DATE</th>
            <th style={{ padding: '14px' }}>STATUS / TIMESTAMP</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <td style={{ padding: '14px', fontWeight: 'bold' }}>{log.employeeName}</td>
              <td style={{ padding: '14px', color: '#94a3b8' }}>{log.date}</td>
              <td style={{ padding: '14px', color: '#38bdf8' }}>{log.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
