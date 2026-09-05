import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Project {
  id: string | number;
  name: string;
  client: string;
  status: string;
  deadline: string;
}

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [status, setStatus] = useState('Planning');
  const [deadline, setDeadline] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const user = JSON.parse(localStorage.getItem('erp_user') || '{}');
  const isAdmin = user.role === 'Admin';

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('erp_token');
      const res = await fetch('http://https://amdox-backend-1.onrender.com:5000/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      toast.error('Failed to load projects');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('erp_token');
      const res = await fetch('http://https://amdox-backend-1.onrender.com:5000/api/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, client, status, deadline }),
      });
      if (res.ok) {
        setName('');
        setClient('');
        setStatus('Planning');
        setDeadline('');
        toast.success('Project created!');
        fetchProjects();
      } else {
        toast.error('Failed to create project');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const handleDeleteProject = async (id: string | number) => {
    try {
      const token = localStorage.getItem('erp_token');
      const res = await fetch(`http://https://amdox-backend-1.onrender.com:5000/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        toast.success('Project deleted');
        fetchProjects();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to delete');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ['ID,Project Name,Client,Status,Deadline\n'];
    const rows = filteredProjects.map((p) => `"${p.id}","${p.name}","${p.client}","${p.status}","${p.deadline}"\n`);
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projects_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success('CSV Report downloaded!');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#0f172a' }}>Projects Management</h2>
        <button onClick={exportToCSV} style={{ padding: '8px 16px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Export CSV
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <input
          placeholder="Search by project name or client..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
        />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
        >
          <option value="All">Status: All</option>
          <option value="Planning">Status: Planning</option>
          <option value="In Progress">Status: In Progress</option>
          <option value="Completed">Status: Completed</option>
        </select>
      </div>

      <form onSubmit={handleAddProject} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <input placeholder="Client Name" value={client} onChange={(e) => setClient(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add Project
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>ID</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Project Name</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Client</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Deadline</th>
            {isAdmin && <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>{p.id}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>{p.name}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>{p.client}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>{p.status}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>{p.deadline}</td>
              {isAdmin && (
                <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                  <button
                    onClick={() => handleDeleteProject(p.id)}
                    style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};