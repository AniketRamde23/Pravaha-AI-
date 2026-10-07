import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  UserCheck, 
  GraduationCap, 
  ShieldAlert 
} from 'lucide-react';

import pravahaLogo from '../assets/logo.png';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 600);
  };

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
      {/* Top Header */}
      <section style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <img 
            src={pravahaLogo} 
            alt="Pravaha AI Logo" 
            style={{ 
              height: '75px', 
              width: '75px', 
              objectFit: 'cover', 
              borderRadius: '18px', 
              boxShadow: '0 8px 24px rgba(6, 182, 212, 0.3)',
              border: '2px solid rgba(56, 189, 248, 0.4)' 
            }} 
          />
        </div>
        <span className="badge badge-tech" style={{ marginBottom: '1rem', padding: '0.4rem 0.9rem' }}>
          Pravaha AI • Contact Support & Dispatch
        </span>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.2', maxWidth: '850px', margin: '0 auto 1.5rem' }}>
          We're Here to Help, <span className="gradient-text">24 Hours a Day</span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto' }}>
          Pravaha AI — Developed by <strong>Aniket Ramde</strong>. Need roadside emergency assistance, developer inquiry, or system partnership? Reach out directly.
        </p>
      </section>

      {/* Emergency Helpline Callout Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(17, 24, 39, 0.9) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        marginBottom: '3rem',
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.25)', borderRadius: '12px' }}>
            <ShieldAlert size={28} color="#f87171" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'white' }}>Immediate Highway Breakdown Emergency?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Call our central roadside assistance desk directly for immediate dispatch.
            </p>
          </div>
        </div>

        <a href="tel:6304886341" style={{ textDecoration: 'none' }}>
          <button className="btn btn-primary" style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            padding: '0.75rem 1.75rem',
            fontSize: '1rem'
          }}>
            <Phone size={18} /> Call +91 6304886341
          </button>
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Contact Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Developer Card */}
          <div className="glass-card" style={{
            borderLeft: '4px solid var(--accent-cyan)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <div style={{ padding: '0.75rem', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '12px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
              <UserCheck size={22} color="var(--accent-cyan)" />
            </div>
            <div>
              <span className="badge badge-tech" style={{ fontSize: '0.65rem', marginBottom: '0.3rem' }}>Lead Developer & Creator</span>
              <h3 style={{ fontSize: '1.15rem', color: 'white', marginBottom: '0.2rem' }}>Aniket Ramde</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <GraduationCap size={15} color="var(--accent-purple)" /> Malla Reddy University
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="glass-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <Phone size={22} color="var(--accent-blue)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Contact Number</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Direct Helpline & Priority Support
              </p>
              <a href="tel:6304886341" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem' }}>
                +91 6304886341
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="glass-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              <Mail size={22} color="var(--accent-purple)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Email Address</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Official University & Project Correspondence
              </p>
              <a 
                href="mailto:2311IT010159@mallareddyuniversity.ac.in" 
                style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: '600', fontSize: '0.92rem', wordBreak: 'break-all' }}
              >
                2311IT010159@mallareddyuniversity.ac.in
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="glass-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <MapPin size={22} color="var(--accent-emerald)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Location & Campus</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Malla Reddy University, Hyderabad
              </p>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: '600', fontSize: '0.92rem' }}>
                Hyderabad, Telangana, India
              </span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Send a Message</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Have a question or query for <strong>Aniket Ramde</strong>? Fill in the details below.
          </p>

          {submitted && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.88rem'
            }}>
              <CheckCircle2 size={18} />
              <span>Thank you! Your message has been received by Aniket Ramde.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul"
                  style={{ width: '100%', padding: '0.7rem 0.9rem', background: '#111827', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  style={{ width: '100%', padding: '0.7rem 0.9rem', background: '#111827', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  style={{ width: '100%', padding: '0.7rem 0.9rem', background: '#111827', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Major Project Feedback"
                  style={{ width: '100%', padding: '0.7rem 0.9rem', background: '#111827', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Your Message *
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message here..."
                style={{ width: '100%', padding: '0.7rem 0.9rem', background: '#111827', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              <Send size={16} />
              {loading ? 'Sending Message...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
