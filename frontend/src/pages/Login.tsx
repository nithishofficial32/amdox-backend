import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Employee');
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background Engine: Antigravity Particles + Water Ripples
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

    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      vy: -(Math.random() * 0.4 + 0.1),
      vx: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.3,
    }));

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

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, '#030712');
      bgGradient.addColorStop(0.5, '#0b0f19');
      bgGradient.addColorStop(1, '#090d16');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister ? { name, email, password, role } : { email, password };

    try {
      const res = await fetch(`http://https://amdox-backend-1.onrender.com:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('erp_token', data.token);
        localStorage.setItem('erp_user', JSON.stringify(data.user));
        toast.success(isRegister ? 'Account Created Successfully!' : 'Login Successful');
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Authentication Failed');
      }
    } catch (err) {
      toast.error('Unable to connect to backend server');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(16px)',
            padding: '36px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            width: '360px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', color: '#fff' }}>
              ⚡
            </div>
            <div>
              <h2 style={{ color: '#fff', margin: 0, fontSize: '18px', fontWeight: 'bold' }}>AMDOX ERP PRO</h2>
              <p style={{ color: '#38bdf8', margin: 0, fontSize: '11px', fontWeight: '600' }}>Enterprise Suite</p>
            </div>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
            {isRegister ? 'Create a new account' : 'Sign in to access your dashboard'}
          </p>

          {isRegister && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: 'rgba(30, 41, 59, 0.6)', color: '#fff', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: 'rgba(30, 41, 59, 0.6)', color: '#fff', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: isRegister ? '14px' : '20px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 40px 10px 10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: 'rgba(30, 41, 59, 0.6)', color: '#fff', boxSizing: 'border-box', outline: 'none' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {isRegister && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: 'rgba(30, 41, 59, 0.6)', color: '#fff', outline: 'none' }}
              >
                <option value="Employee">Employee</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          )}

          <button type="submit" style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '16px' }}>
            {isRegister ? 'Register Account' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              style={{ backgroundColor: 'transparent', border: 'none', color: '#38bdf8', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
