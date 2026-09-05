import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Transaction {
  id: string | number;
  title: string;
  amount: number;
  type: string;
  date: string;
}

export const Finance: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Income');
  const [date, setDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const user = JSON.parse(localStorage.getItem('erp_user') || '{}');
  const isAdmin = user.role === 'Admin';

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('erp_token');
      const res = await fetch('http://https://amdox-backend-1.onrender.com:5000/api/finance', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      toast.error('Failed to load transactions');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('erp_token');
      const res = await fetch('http://https://amdox-backend-1.onrender.com:5000/api/finance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, amount: Number(amount), type, date }),
      });
      if (res.ok) {
        setTitle('');
        setAmount('');
        setType('Income');
        setDate('');
        toast.success('Transaction logged!');
        fetchTransactions();
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const handleDeleteTransaction = async (id: string | number) => {
    try {
      const token = localStorage.getItem('erp_token');
      const res = await fetch(`http://https://amdox-backend-1.onrender.com:5000/api/finance/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        toast.success('Transaction deleted');
        fetchTransactions();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to delete');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || t.type === selectedType;
    return matchesSearch && matchesType;
  });

  const exportToCSV = () => {
    const headers = ['ID,Title,Amount,Type,Date\n'];
    const rows = filteredTransactions.map((t) => `"${t.id}","${t.title}","${t.amount}","${t.type}","${t.date}"\n`);
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success('CSV downloaded!');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Finance & Payroll Module</h1>
        <button onClick={exportToCSV} style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Export CSV
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
        <input
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff', outline: 'none' }}
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff', outline: 'none' }}
        >
          <option value="All">Type: All</option>
          <option value="Income">Type: Income</option>
          <option value="Expense">Type: Expense</option>
        </select>
      </div>

      <form onSubmit={handleAddTransaction} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input placeholder="Title / Description" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff' }} />
        <input type="number" placeholder="Amount ($)" value={amount} onChange={(e) => setAmount(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff' }} />
        <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff' }}>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff' }} />
        <button type="submit" style={{ padding: '10px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add Entry
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#0f172a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e293b' }}>
        <thead>
          <tr style={{ backgroundColor: '#1e293b', textAlign: 'left', color: '#94a3b8' }}>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>TITLE</th>
            <th style={{ padding: '12px' }}>AMOUNT</th>
            <th style={{ padding: '12px' }}>TYPE</th>
            <th style={{ padding: '12px' }}>DATE</th>
            {isAdmin && <th style={{ padding: '12px' }}>ACTIONS</th>}
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((t) => (
            <tr key={t.id} style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '12px', color: '#64748b' }}>{t.id}</td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{t.title}</td>
              <td style={{ padding: '12px', color: t.type === 'Income' ? '#34d399' : '#ef4444', fontWeight: 'bold' }}>${t.amount}</td>
              <td style={{ padding: '12px' }}>{t.type}</td>
              <td style={{ padding: '12px' }}>{t.date}</td>
              {isAdmin && (
                <td style={{ padding: '12px' }}>
                  <button onClick={() => handleDeleteTransaction(t.id)} style={{ padding: '4px 8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
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
