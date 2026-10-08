import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Cpu, 
  MapPin, 
  Clock, 
  Users, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Layers,
  GraduationCap,
  Mail,
  Phone,
  UserCheck
} from 'lucide-react';
import pravahaLogo from '../assets/logo.png';
import homeImg from '../assets/images/Home.jpg';

export default function About() {
  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
      {/* Top Banner */}
      <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <img 
            src={pravahaLogo} 
            alt="Pravaha AI Logo" 
            style={{ 
              height: '80px', 
              width: '80px', 
              objectFit: 'cover', 
              borderRadius: '20px', 
              boxShadow: '0 10px 30px rgba(6, 182, 212, 0.3)',
              border: '2px solid rgba(56, 189, 248, 0.4)' 
            }} 
          />
        </div>
        <span className="badge badge-tech" style={{ marginBottom: '1rem', padding: '0.4rem 0.9rem' }}>
          About Pravaha AI • Movement • Support • Safety
        </span>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.2', maxWidth: '850px', margin: '0 auto 1.5rem' }}>
          Revolutionizing Roadside Assistance with <span className="gradient-text">Intelligent Automation</span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
          An AI-powered, location-aware vehicle breakdown assistance and intelligent service dispatch system developed by <strong>Aniket Ramde</strong>.
        </p>
      </section>

      {/* Developer Profile Callout Card */}
      <section className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(17, 24, 39, 0.9) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.35)',
        padding: '2rem 2.5rem',
        marginBottom: '4rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(6, 182, 212, 0.3)'
            }}>
              <UserCheck size={32} color="white" />
            </div>

            <div>
              <span className="badge badge-tech" style={{ marginBottom: '0.3rem', fontSize: '0.7rem' }}>
                Major Project Lead
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', margin: 0 }}>
                Developed by Aniket Ramde
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <GraduationCap size={16} color="var(--accent-purple)" />
                <span>Department of Information Technology, <strong>Malla Reddy University</strong></span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <a href="tel:6304886341" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontSize: '0.95rem', fontWeight: '600' }}>
              <Phone size={16} /> +91 6304886341
            </a>
            <a href="mailto:2311IT010159@mallareddyuniversity.ac.in" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-purple)', fontSize: '0.95rem', fontWeight: '600' }}>
              <Mail size={16} /> 2311IT010159@mallareddyuniversity.ac.in
            </a>
          </div>
        </div>
      </section>

      {/* Story & Image Section */}
      <section className="glass-card" style={{ marginBottom: '4rem', padding: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
          <div>
            <span className="badge badge-online" style={{ marginBottom: '0.75rem' }}>Our Mission</span>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Zero Stranded Drivers Left Without Immediate Help</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1rem' }}>
              Traditional roadside assistance relies on frantic phone calls, guesswork about mechanic arrival times, and manual location explanations. Pravaha AI transforms this into an intelligent digital dispatch platform.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              By pairing GPS-based distance calculations with an AI breakdown classification microservice, we ensure the right specialist—whether a flatbed tow truck, battery technician, or tire mechanic—is dispatched to your exact highway coordinates within minutes.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: '#0a0e17', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>15 mins</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Response Target</div>
              </div>
              <div style={{ padding: '1rem', background: '#0a0e17', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>100%</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Providers</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
            }}>
              <img 
                src="/media/futuristic-road.jpg" 
                alt="Intelligent Highway Safety Network" 
                style={{
                  width: '100%',
                  maxHeight: '380px',
                  objectFit: 'cover',
                  display: 'block'
                }} 
              />
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                background: 'rgba(10, 14, 23, 0.8)',
                backdropFilter: 'blur(10px)',
                padding: '0.6rem 1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '600' }}>
                  Smart Highway Ecosystem
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Real-Time AI Telemetry
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Technologies */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-tech" style={{ marginBottom: '0.5rem' }}>Tri-Tier Architecture</span>
          <h2 style={{ fontSize: '2rem' }}>State-of-the-Art Technology Stack</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Three specialized engines working together in real time</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card" style={{ borderTop: '3px solid var(--accent-cyan)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.6rem', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '10px' }}>
                <Layers size={22} color="var(--accent-cyan)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>React.js Frontend</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive User Layer</span>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Responsive web application powered by Vite & React 19, featuring OpenStreetMap Leaflet live tracking, symptom capture, and role-based portals for Drivers, Providers, and Admins.
            </p>
          </div>

          <div className="glass-card" style={{ borderTop: '3px solid var(--accent-blue)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.6rem', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '10px' }}>
                <ShieldCheck size={22} color="var(--accent-blue)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>Spring Boot Backend</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enterprise Business Core</span>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Java Spring Boot backend handling JWT & BCrypt authentication, MongoDB persistence, dispatch orchestration, and Haversine geodesic proximity queries.
            </p>
          </div>

          <div className="glass-card" style={{ borderTop: '3px solid var(--accent-purple)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.6rem', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '10px' }}>
                <Cpu size={22} color="var(--accent-purple)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>Python FastAPI AI</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Intelligent ML Engine</span>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Microservice executing machine-learning breakdown symptom diagnosis, multi-criteria provider suitability scoring, and traffic-adjusted arrival time estimations.
            </p>
          </div>
        </div>
      </section>

      {/* Academic Algorithms */}
      <section className="glass-card" style={{ marginBottom: '4rem' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={20} color="var(--accent-amber)" />
          Key Algorithmic Components
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', color: 'white', marginBottom: '0.3rem' }}>1. Haversine Distance</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Computes great-circle geographical distance over Earth's curvature between driver coordinates and providers.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', color: 'white', marginBottom: '0.3rem' }}>2. Provider Suitability Scoring</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Weighted multi-criteria algorithm ranking providers by distance (35%), rating (30%), service match (25%), and availability (10%).
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', color: 'white', marginBottom: '0.3rem' }}>3. Dynamic ETA Prediction</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Predicts realistic arrival minutes factoring time-of-day traffic index, service prep overhead, and provider velocity.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ textAlign: 'center' }}>
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(10, 14, 23, 0.9) 100%)',
          padding: '3rem'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to Experience Smarter Roadside Safety?</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Register your vehicle today to receive instant assistance whenever you are on the road.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
                Get Started Now <ArrowRight size={18} />
              </button>
            </Link>
            <Link to="/contact" style={{ textDecoration: 'none' }}>
              <button className="btn btn-secondary" style={{ padding: '0.85rem 1.8rem' }}>
                Contact Aniket Ramde
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
