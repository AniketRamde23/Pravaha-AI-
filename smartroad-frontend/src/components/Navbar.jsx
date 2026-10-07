import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Car, Wrench, LogOut, LogIn, UserPlus } from 'lucide-react';

import pravahaLogo from '../assets/logo.png';

export default function Navbar() {
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (role === 'DRIVER') return '/driver';
    if (role === 'SERVICE_PROVIDER') return '/provider';
    if (role === 'ADMIN') return '/admin';
    return '/';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.25rem 2rem',
      background: 'rgba(10, 14, 23, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img 
            src={pravahaLogo} 
            alt="Pravaha AI Logo" 
            style={{ 
              height: '46px', 
              width: '46px', 
              objectFit: 'cover', 
              borderRadius: '12px',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              boxShadow: '0 4px 14px rgba(6, 182, 212, 0.25)'
            }} 
          />
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'white', lineHeight: 1.15 }}>
              Pravaha <span className="gradient-text">AI</span>
            </div>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
              Movement • Support • Safety
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link
            to="/"
            style={{
              color: isActive('/') ? 'var(--accent-blue)' : 'var(--text-muted)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: isActive('/') ? '600' : '500'
            }}
          >
            Home
          </Link>

          <Link
            to="/about"
            style={{
              color: isActive('/about') ? 'var(--accent-blue)' : 'var(--text-muted)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: isActive('/about') ? '600' : '500'
            }}
          >
            About
          </Link>

          <Link
            to="/contact"
            style={{
              color: isActive('/contact') ? 'var(--accent-blue)' : 'var(--text-muted)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: isActive('/contact') ? '600' : '500'
            }}
          >
            Contact Us
          </Link>

          {isAuthenticated && (
            <Link
              to={getDashboardPath()}
              style={{
                color: 'var(--accent-cyan)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              Dashboard
            </Link>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isAuthenticated ? (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '0.4rem 0.8rem',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              fontSize: '0.85rem'
            }}>
              {role === 'DRIVER' && <Car size={16} color="var(--accent-cyan)" />}
              {role === 'SERVICE_PROVIDER' && <Wrench size={16} color="var(--accent-amber)" />}
              {role === 'ADMIN' && <Shield size={16} color="var(--accent-purple)" />}
              
              <span style={{ fontWeight: '600', color: 'white' }}>{user?.fullName || 'User'}</span>
              <span className="badge badge-tech" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                {role}
              </span>
            </div>

            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
              <LogOut size={15} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                <LogIn size={15} />
                Sign In
              </button>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary" style={{ padding: '0.5rem 1.1rem' }}>
                <UserPlus size={15} />
                Register
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
