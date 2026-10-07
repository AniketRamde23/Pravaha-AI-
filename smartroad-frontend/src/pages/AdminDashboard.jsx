import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Shield, 
  Users, 
  Wrench, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Cpu
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await api.get('/health');
        setHealthStatus(res.data);
      } catch (err) {
        console.warn('Health fetch error:', err);
      }
    };
    fetchHealth();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', marginBottom: '0.5rem' }}>
            Pravaha AI • System Administration
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
            Platform Operations & Analytics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Logged in as {user?.fullName} ({user?.email})
          </p>
        </div>

        <span className="badge badge-online">
          <span className="pulse-dot"></span> System Operational
        </span>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registered Drivers</span>
            <Users size={18} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginTop: '0.5rem' }}>
            Active in MongoDB
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>Vehicle owners</div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Service Providers</span>
            <Wrench size={18} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginTop: '0.5rem' }}>
            Verified
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>Highway rescue units</div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>MongoDB Status</span>
            <Database size={18} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#34d399', marginTop: '0.5rem' }}>
            {healthStatus?.mongodb?.status || 'CONNECTED'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>Port 27017</div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>AI Microservice</span>
            <Cpu size={18} color="var(--accent-purple)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#c084fc', marginTop: '0.5rem' }}>
            {healthStatus?.ai_microservice?.status || 'ONLINE'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>FastAPI port 8000</div>
        </div>
      </div>

      {/* Admin Modules Overview */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={18} color="var(--accent-purple)" />
          Security & Access Control Enforcement
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Spring Security role-based enforcement is active. Only users authenticated with JWTs bearing <code>ROLE_ADMIN</code> can access this administrative plane.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#0a0e17', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: '600', color: 'white', marginBottom: '0.25rem' }}>User Management</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Audit driver accounts, verified vehicles, and account statuses.</p>
          </div>
          <div style={{ padding: '1rem', background: '#0a0e17', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: '600', color: 'white', marginBottom: '0.25rem' }}>Provider Verification</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Review business registrations, service scopes, and base rates.</p>
          </div>
          <div style={{ padding: '1rem', background: '#0a0e17', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: '600', color: 'white', marginBottom: '0.25rem' }}>Assistance Telemetry</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monitor active dispatches, response times, and AI recommendations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
