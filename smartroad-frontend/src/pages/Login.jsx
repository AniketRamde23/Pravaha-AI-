import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, KeyRound, Mail, AlertCircle, Shield, Car, Wrench } from 'lucide-react';
import pravahaLogo from '../assets/logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login(email, password);
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      if (redirect) {
        navigate(redirect);
      } else if (data.role === 'DRIVER') {
        navigate('/driver');
      } else if (data.role === 'SERVICE_PROVIDER') {
        navigate('/provider');
      } else if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (roleType) => {
    if (roleType === 'DRIVER') {
      setEmail('driver@smartroad.ai');
      setPassword('Driver@123');
    } else if (roleType === 'PROVIDER') {
      setEmail('provider@smartroad.ai');
      setPassword('Provider@123');
    } else if (roleType === 'ADMIN') {
      setEmail('2311it010159@mallareddyuniversity.ac.in');
      setPassword('Aniket@123');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '520px', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div className="glass-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img 
            src={pravahaLogo} 
            alt="Pravaha AI Logo" 
            style={{ 
              height: '68px', 
              width: '68px', 
              objectFit: 'cover', 
              borderRadius: '16px', 
              marginBottom: '0.85rem',
              boxShadow: '0 8px 24px rgba(6, 182, 212, 0.3)',
              border: '2px solid rgba(56, 189, 248, 0.4)' 
            }} 
          />
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Sign in to access your Pravaha AI portal
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  background: '#111827',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  color: 'white',
                  fontFamily: 'inherit',
                  fontSize: '0.95rem'
                }}
              />
              <Mail size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  background: '#111827',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  color: 'white',
                  fontFamily: 'inherit',
                  fontSize: '0.95rem'
                }}
              />
              <KeyRound size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In with JWT'}
          </button>
        </form>

        {/* Demo Fast Autofill */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', marginBottom: '0.75rem' }}>
            Quick Demo Autofill
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleDemoFill('DRIVER')}
              className="btn btn-secondary"
              style={{ padding: '0.45rem', fontSize: '0.75rem' }}
            >
              <Car size={14} color="var(--accent-cyan)" /> Driver
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('PROVIDER')}
              className="btn btn-secondary"
              style={{ padding: '0.45rem', fontSize: '0.75rem' }}
            >
              <Wrench size={14} color="var(--accent-amber)" /> Provider
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('ADMIN')}
              className="btn btn-secondary"
              style={{ padding: '0.45rem', fontSize: '0.75rem' }}
            >
              <Shield size={14} color="var(--accent-purple)" /> Admin
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600' }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
