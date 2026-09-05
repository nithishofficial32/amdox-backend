import React from 'react';

export const Profile: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('erp_user') || '{"name":"Priya","email":"priya@amdox.com","role":"HR Manager"}');
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', color: '#fff', backgroundColor: '#0f172a', padding: '24px', borderRadius: '12px', border: '1px solid #1e293b' }}>
      <h1>User Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
};
