import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [head, setHead] = useState('');

  const fetchDepts = async () => {
    try {
      const token = localStorage.getItem('erp_token');
      const res = await fetch('http://https://amdox-backend-1.onrender.com:5000/api/departments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setDepartments(await res.json());
    } catch (err) {
      console.error('Error fetching departments', err);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('erp_token');
      const res = await fetch('http://https://amdox-backend-1.onrender.com:5000/api/departments', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, head, count: 0 }),
      });
      if (res.ok) {
        setName('');
        setHead('');
        toast.success('Department added successfully!');
        fetchDepts();
      } else {
        toast.error('Failed to add department');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Departments Management</h1>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input placeholder="Department Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: 'rgba(30, 41, 59, 0.6)', color: '#fff', outline: 'none' }} />
        <input placeholder="Department Head" value={head} onChange={(e) => setHead(e.target.value)} required style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: 'rgba(30, 41, 59, 0.6)', color: '#fff', outline: 'none' }} />
        <button type="submit" style={{ padding: '10px 18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>+ Add Department</button>
      </form>
      <table style={{ width: '100%', backgroundColor: 'rgba(15, 23, 42, 0.75)', borderCollapse: 'collapse', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: '#94a3b8', textAlign: 'left' }}>
            <th style={{ padding: '14px' }}>ID</th>
            <th style={{ padding: '14px' }}>NAME</th>
            <th style={{ padding: '14px' }}>HEAD</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <td style={{ padding: '14px', color: '#64748b' }}>{d.id || i + 1}</td>
              <td style={{ padding: '14px', fontWeight: 'bold' }}>{d.name}</td>
              <td style={{ padding: '14px', color: '#38bdf8' }}>{d.head}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
