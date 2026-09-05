import React, { useEffect, useRef } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';

export const SidebarLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const user = JSON.parse(localStorage.getItem('erp_user') || '{"name":"Priya","role":"HR Manager"}');

  const handleLogout = () => {
    localStorage.removeItem('erp_token');
    localStorage.removeItem('erp_user');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Employees', path: '/employees', icon: '👥' },
    { label: 'Departments', path: '/departments', icon: '🏢' },
    { label: 'Attendance', path: '/attendance', icon: '📅' },
    { label: 'Finance & Payroll', path: '/finance', icon: '💳' },
    { label: 'Payroll', path: '/payroll', icon: '💰' },
    { label: 'Reports', path: '/reports', icon: '📈' },
    { label: 'Profile', path: '/profile', icon: '👤' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Interactive Background Engine: Antigravity Particles + Mouse Water Ripples
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Antigravity Particle Array
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      vy: -(Math.random() * 0.4 + 0.1), // Floating upward against gravity
      vx: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.3,
    }));

    // Interactive Water Ripples Array
    const ripples: Array<{ x: number; y: number; radius: number; alpha: number; maxRadius: number }> = [];

    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() < 0.3) {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 2,
          alpha: 0.6,
          maxRadius: Math.random() * 40 + 30,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Main Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep Nebula Gradient Background
      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, '#030712');
      bgGradient.addColorStop(0.5, '#0b0f19');
      bgGradient.addColorStop(1, '#090d16');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Render Floating Antigravity Particles
      ctx.fillStyle = '#60a5fa';
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        if (p.y < 0) p.y = height;
        if (p.x < 0 || p.x > width) p.x = Math.random() * width;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#3b82f6';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Render Expanding Water Wave Ripples
      ripples.forEach((r, idx) => {
        r.radius += 1.2;
        r.alpha -= 0.012;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(idx, 1);
        } else {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(56, 189, 248, ${r.alpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Background Interactive Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Main Glassmorphism Container */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', minHeight: '100vh' }}>
        {/* Glass Sidebar */}
        <aside
          style={{
            width: '240px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(16px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingLeft: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  color: '#fff',
                  boxShadow: '0 0 12px rgba(124, 58, 237, 0.5)',
                }}
              >
                ⚡
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '0.05em' }}>AMDOX</h3>
                <p style={{ margin: 0, fontSize: '10px', color: '#38bdf8', fontWeight: '600' }}>ERP PRO</p>
              </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      color: isActive ? '#ffffff' : '#94a3b8',
                      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                      border: isActive ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: isActive ? '600' : '500',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
          >
            Logout
          </button>
        </aside>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <header
            style={{
              height: '64px',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              padding: '0 32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(30, 41, 59, 0.6)', padding: '8px 16px', borderRadius: '20px', width: '380px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <span style={{ color: '#64748b', marginRight: '8px', fontSize: '14px' }}>🔍</span>
              <input
                placeholder="Search employees, projects, reports..."
                style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '13px', outline: 'none', width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>🔔</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #a855f7)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', boxShadow: '0 0 10px rgba(168, 85, 247, 0.4)' }}>
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'PS'}
                </div>
                <div style={{ lineHeight: '1.2' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{user.name || 'Priya'}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#38bdf8' }}>{user.role || 'HR Manager'}</p>
                </div>
              </div>
            </div>
          </header>

          <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
            <Outlet context={{ currentDate }} />
          </main>
        </div>
      </div>
    </div>
  );
};
