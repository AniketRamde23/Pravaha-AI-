import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, GraduationCap } from 'lucide-react';
import pravahaLogo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer style={{
      background: 'rgba(10, 14, 23, 0.95)',
      borderTop: '1px solid var(--border-color)',
      padding: '3rem 2rem 2rem',
      marginTop: 'auto'
    }}>
      <div className="container" style={{ padding: 0 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Brand & Project Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <img 
                src={pravahaLogo} 
                alt="Pravaha AI Logo" 
                style={{ 
                  height: '42px', 
                  width: '42px', 
                  objectFit: 'cover', 
                  borderRadius: '10px',
                  border: '1px solid rgba(56, 189, 248, 0.35)'
                }} 
              />
              <div>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white' }}>
                  Pravaha <span className="gradient-text">AI</span>
                </span>
                <div style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
                  Movement • Support • Safety
                </div>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>
              AI-Powered On-Road Vehicle Breakdown Assistance & Intelligent Service Dispatch System.
            </p>
          </div>

          {/* Developer Credits */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: 'white', fontWeight: '700', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Developer & Creator
            </h4>
            <div style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', fontWeight: '700', marginBottom: '0.3rem' }}>
              Aniket Ramde
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <GraduationCap size={15} color="var(--accent-purple)" />
              Malla Reddy University
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              Roll No: 2311IT010159
            </div>
          </div>

          {/* Quick Contact Info */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: 'white', fontWeight: '700', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Contact Details
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <a href="tel:6304886341" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={14} color="var(--accent-cyan)" /> +91 6304886341
              </a>
              <a href="mailto:2311IT010159@mallareddyuniversity.ac.in" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', wordBreak: 'break-all' }}>
                <Mail size={14} color="var(--accent-purple)" /> 2311IT010159@mallareddyuniversity.ac.in
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: 'white', fontWeight: '700', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
              <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About System</Link>
              <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact & Support</Link>
              <Link to="/login" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>Sign In</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.82rem',
          color: 'var(--text-subtle)'
        }}>
          <div>
            © {new Date().getFullYear()} Pravaha AI. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Developed by <strong style={{ color: 'white' }}>Aniket Ramde</strong> | Malla Reddy University
          </div>
        </div>
      </div>
    </footer>
  );
}
