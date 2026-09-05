import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Employee {
  id: string | number;
  name: string;
  role: string;
  department: string;
}

export const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const user = JSON.parse(localStorage.getItem('erp_user') || '{}');
  const isAdmin = user.role === 'Admin';

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('erp_token');
      const res = await fetch('http://https://amdox-backend-1.onrender.com:5000/api/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (err) {
      toast.error('Error fetching employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('erp_token');
      const res = await fetch('http://https://amdox-backend-1.onrender.com:5000/api/employees', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, role, department }),
      });
      if (res.ok) {
        setName('');
        setRole('');
        setDepartment('');
        setIsModalOpen(false);
        toast.success('Employee added successfully!');
        fetchEmployees();
      }
    } catch (err) {
      toast.error('Failed to create employee');
    }
  };

  const handleDeleteEmployee = async (id: string | number) => {
    try {
      const token = localStorage.getItem('erp_token');
      const res = await fetch(`http://https://amdox-backend-1.onrender.com:5000/api/employees/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Employee deleted');
        fetchEmployees();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message);
      }
    } catch (err) {
      toast.error('Error deleting employee');
    }
  };

  const departments = ['All', ...Array.from(new Set(employees.map((e) => e.department)))];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const exportToCSV = () => {
    const headers = ['ID,Name,Role,Department\n'];
    const rows = filteredEmployees.map((e) => `"${e.id}","${e.name}","${e.role}","${e.department}"\n`);
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success('CSV downloaded!');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#ffffff' }}>Employee Directory</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Manage company personnel records and departments</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setIsModalOpen(true)} style={{ padding: '10px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
            + Add Employee
          </button>
          <button onClick={exportToCSV} style={{ padding: '10px 16px', backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
        <input
          placeholder="Search by name or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff', fontSize: '13px', outline: 'none' }}
        />
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff', fontSize: '13px', outline: 'none' }}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>Department: {dept}</option>
          ))}
        </select>
      </div>

      {/* Data Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#0f172a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e293b' }}>
        <thead>
          <tr style={{ backgroundColor: '#1e293b', textAlign: 'left', color: '#94a3b8', fontSize: '12px' }}>
            <th style={{ padding: '14px', borderBottom: '1px solid #334155' }}>ID</th>
            <th style={{ padding: '14px', borderBottom: '1px solid #334155' }}>NAME</th>
            <th style={{ padding: '14px', borderBottom: '1px solid #334155' }}>ROLE</th>
            <th style={{ padding: '14px', borderBottom: '1px solid #334155' }}>DEPARTMENT</th>
            {isAdmin && <th style={{ padding: '14px', borderBottom: '1px solid #334155' }}>ACTIONS</th>}
          </tr>
        </thead>
        <tbody style={{ fontSize: '14px', color: '#f8fafc' }}>
          {filteredEmployees.map((emp) => (
            <tr key={emp.id} style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '14px', color: '#64748b' }}>{emp.id}</td>
              <td style={{ padding: '14px', fontWeight: 'bold' }}>{emp.name}</td>
              <td style={{ padding: '14px', color: '#38bdf8' }}>{emp.role}</td>
              <td style={{ padding: '14px' }}>{emp.department}</td>
              {isAdmin && (
                <td style={{ padding: '14px' }}>
                  <button onClick={() => handleDeleteEmployee(emp.id)} style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleAddEmployee} style={{ backgroundColor: '#0f172a', padding: '28px', borderRadius: '12px', width: '380px', border: '1px solid #1e293b' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#ffffff', fontSize: '18px' }}>Add New Employee</h3>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#94a3b8' }}>Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#94a3b8' }}>Role / Title</label>
              <input value={role} onChange={(e) => setRole(e.target.value)} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#94a3b8' }}>Department</label>
              <input value={department} onChange={(e) => setDepartment(e.target.value)} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" style={{ padding: '10px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Save Employee
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};