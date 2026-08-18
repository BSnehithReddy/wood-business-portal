import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { ParticleBackground } from './ParticleBackground';
import { ShieldCheck, HardHat, Store, KeyRound, Phone, ArrowRight, AlertTriangle, Lock, UserPlus, ShieldAlert, RefreshCw, Building, User } from 'lucide-react';

export const LoginScreen = () => {
  const {
    login,
    registerDealer,
    registerOwner,
    registerWorker,
    resetAllRegistrations,
    registeredOwners,
    maxRegisteredOwners
  } = useApp();

  const [activeRole, setActiveRole] = useState('DEALER'); // 'DEALER' | 'OWNER' | 'WORKER'
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Login Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Dealer Registration Form State
  const [dealerReg, setDealerReg] = useState({ firmName: '', phone: '', password: '', address: 'Industrial Area, Hyderabad' });

  // Owner Registration Form State
  const [ownerReg, setOwnerReg] = useState({ name: '', phone: '', password: '', secretKey: '' });

  // Worker Registration Form State
  const [workerReg, setWorkerReg] = useState({ name: '', phone: '', password: '', bayNo: 'Bay 4' });

  const ownerAccountCount = registeredOwners.length;
  const isOwnerRegistrationFull = ownerAccountCount >= maxRegisteredOwners;

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier || !password) {
      setErrorMsg('Please enter both Phone/Username and Password.');
      triggerShake();
      return;
    }

    const success = login(activeRole, identifier, password);
    if (!success) {
      setErrorMsg(`Access Denied! Incorrect Phone Number or Password for ${activeRole}.`);
      triggerShake();
    }
  };

  const handleDealerRegister = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!dealerReg.firmName || !dealerReg.phone || !dealerReg.password) {
      setErrorMsg('Please enter Shop Name, Phone Number, and Password.');
      triggerShake();
      return;
    }

    const success = registerDealer(dealerReg);
    if (!success) {
      triggerShake();
    }
  };

  const handleOwnerRegister = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isOwnerRegistrationFull) {
      setErrorMsg(`Registration Locked! Maximum 3 owner phone numbers are already registered.`);
      triggerShake();
      return;
    }

    if (!ownerReg.name || !ownerReg.phone || !ownerReg.password) {
      setErrorMsg('Please fill in all required fields.');
      triggerShake();
      return;
    }

    const success = registerOwner(ownerReg);
    if (!success) {
      triggerShake();
    }
  };

  const handleWorkerRegister = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!workerReg.name || !workerReg.phone || !workerReg.password) {
      setErrorMsg('Please enter Staff Name, Phone Number, and Password.');
      triggerShake();
      return;
    }

    const success = registerWorker(workerReg);
    if (!success) {
      triggerShake();
    }
  };

  const fillCredentials = (role) => {
    setErrorMsg('');
    setActiveRole(role);
    setIsRegisterMode(false);
    if (role === 'OWNER') {
      setIdentifier('owner');
      setPassword('owner123');
    } else if (role === 'WORKER') {
      setIdentifier('worker');
      setPassword('worker123');
    } else {
      setIdentifier('9849012345');
      setPassword('dealer123');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 20%, #2e2016 0%, #120e0b 80%)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Golden Particle Canvas Sparkles */}
      <ParticleBackground />

      <div className={`animate-fade-in ${isShaking ? 'animate-shake' : ''}`} style={{
        width: '100%',
        maxWidth: '540px',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(24px)',
        border: activeRole === 'OWNER' ? '1.5px solid var(--timber-gold)' : '1px solid var(--timber-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        boxShadow: activeRole === 'OWNER' ? 'var(--shadow-glow)' : 'var(--shadow-lg)',
        zIndex: 10
      }}>
        {/* Header Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem', textAlign: 'center' }}>
          <Logo size="large" />
        </div>

        {/* Role Portal Selector */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.4rem',
          background: 'rgba(0,0,0,0.4)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.25rem'
        }}>
          <button
            type="button"
            onClick={() => { setActiveRole('DEALER'); setIsRegisterMode(false); setErrorMsg(''); setIdentifier(''); setPassword(''); }}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              background: activeRole === 'DEALER' ? 'var(--timber-gold)' : 'transparent',
              color: activeRole === 'DEALER' ? '#0d0a08' : 'var(--text-muted)'
            }}
          >
            <Store size={16} /> Dealer Portal
          </button>

          <button
            type="button"
            onClick={() => { setActiveRole('OWNER'); setIsRegisterMode(false); setErrorMsg(''); setIdentifier(''); setPassword(''); }}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              background: activeRole === 'OWNER' ? '#f59e0b' : 'transparent',
              color: activeRole === 'OWNER' ? '#0d0a08' : 'var(--text-muted)',
              boxShadow: activeRole === 'OWNER' ? '0 0 12px rgba(245, 158, 11, 0.4)' : 'none'
            }}
          >
            <ShieldCheck size={16} /> Owner
          </button>

          <button
            type="button"
            onClick={() => { setActiveRole('WORKER'); setIsRegisterMode(false); setErrorMsg(''); setIdentifier(''); setPassword(''); }}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              background: activeRole === 'WORKER' ? '#10b981' : 'transparent',
              color: activeRole === 'WORKER' ? '#022c22' : 'var(--text-muted)'
            }}
          >
            <HardHat size={16} /> Worker Login
          </button>
        </div>

        {/* Sub-Header Tabs (Sign In vs Register for ALL 3 ROLES) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--timber-border)',
          paddingBottom: '0.65rem',
          marginBottom: '1.25rem'
        }}>
          <div>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--timber-gold-light)' }}>
              {activeRole === 'OWNER' ? '👑 Owner Master Portal' : activeRole === 'WORKER' ? 'Godown Worker Terminal' : 'Dealer Wholesale Store'}
            </span>

            {/* SLOTS BADGE DISPLAYED STRICTLY IN OWNER TAB */}
            {activeRole === 'OWNER' && (
              <span style={{ display: 'block', fontSize: '0.72rem', color: isOwnerRegistrationFull ? '#ef4444' : '#10b981', fontWeight: 800, marginTop: '2px' }}>
                🔒 Slots: {ownerAccountCount} / {maxRegisteredOwners} Phone Numbers Registered
              </span>
            )}
          </div>

          {/* SIGN IN VS REGISTER TOGGLE BUTTONS FOR ALL 3 ROLES */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setIsRegisterMode(false)}
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: !isRegisterMode ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: !isRegisterMode ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid var(--timber-border)'
              }}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => setIsRegisterMode(true)}
              disabled={activeRole === 'OWNER' && isOwnerRegistrationFull}
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: isRegisterMode ? 'var(--timber-gold)' : 'transparent',
                color: isRegisterMode ? '#000000' : (activeRole === 'OWNER' && isOwnerRegistrationFull) ? 'var(--text-muted)' : 'var(--timber-gold)',
                border: (activeRole === 'OWNER' && isOwnerRegistrationFull) ? '1px solid var(--timber-border)' : '1px solid var(--timber-gold)'
              }}
            >
              {activeRole === 'OWNER' && isOwnerRegistrationFull ? 'Slots Full (3/3)' : `+ Register ${activeRole === 'OWNER' ? 'Owner' : activeRole === 'WORKER' ? 'Worker' : 'Dealer'}`}
            </button>
          </div>
        </div>

        {/* Access Denied Error Banner */}
        {errorMsg && (
          <div style={{
            background: 'var(--accent-red-bg)',
            border: '1.5px solid #ef4444',
            color: '#fca5a5',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <AlertTriangle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
            <div>
              <strong style={{ color: '#ffffff', display: 'block' }}>Access Denied!</strong>
              {errorMsg}
            </div>
          </div>
        )}

        {/* --- SIGN IN FORM (STRICT PHONE + PASSWORD VALIDATION) --- */}
        {!isRegisterMode && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                {activeRole === 'DEALER' ? 'Dealer Registered Phone Number' : activeRole === 'OWNER' ? 'Owner Phone Number or Username' : 'Worker Registered Mobile / Username'} *
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder={activeRole === 'OWNER' ? 'father or 9849000000' : activeRole === 'WORKER' ? 'worker or 9000000000' : '9849012345'}
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Account Password *
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.4rem', fontSize: '0.95rem' }}>
              <Lock size={18} />
              <span>Verify & Sign In to {activeRole === 'OWNER' ? 'Owner Portal' : activeRole === 'WORKER' ? 'Worker Terminal' : 'Dealer Store'}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* --- DEALER SHOP REGISTRATION FORM --- */}
        {isRegisterMode && activeRole === 'DEALER' && (
          <form onSubmit={handleDealerRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--timber-gold-light)' }}>
              Register Dealer Shop Account
            </h4>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Shop / Firm Name *
              </label>
              <div style={{ position: 'relative' }}>
                <Building size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sri Balaji Hardware & Plywoods"
                  value={dealerReg.firmName}
                  onChange={e => setDealerReg({ ...dealerReg, firmName: e.target.value })}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Phone Number *
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="9849012345"
                  value={dealerReg.phone}
                  onChange={e => setDealerReg({ ...dealerReg, phone: e.target.value })}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Create Password *
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={dealerReg.password}
                  onChange={e => setDealerReg({ ...dealerReg, password: e.target.value })}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.4rem' }}>
              <UserPlus size={18} /> Complete Dealer Registration & Sign In
            </button>
          </form>
        )}

        {/* --- OWNER REGISTRATION FORM --- */}
        {isRegisterMode && activeRole === 'OWNER' && (
          isOwnerRegistrationFull ? (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.5rem',
              textAlign: 'center',
              color: '#fca5a5'
            }}>
              <ShieldAlert size={36} style={{ color: '#ef4444', marginBottom: '0.5rem' }} />
              <h4 style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>
                Owner Registration Limit Reached (3 / 3 Max)
              </h4>
              <p style={{ fontSize: '0.82rem', marginTop: '0.35rem', color: 'var(--text-muted)' }}>
                Maximum 3 owner phone numbers are registered. No further owner accounts can be created.
              </p>
              <button
                onClick={() => setIsRegisterMode(false)}
                className="btn-secondary"
                style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.82rem' }}
              >
                Return to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleOwnerRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--timber-gold-light)' }}>
                Register New Owner Account (Slot {ownerAccountCount + 1}/3)
              </h4>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Owner Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Owner Name"
                  value={ownerReg.name}
                  onChange={e => setOwnerReg({ ...ownerReg, name: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Phone Number / Username *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="9849000000"
                    value={ownerReg.phone}
                    onChange={e => setOwnerReg({ ...ownerReg, phone: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Create Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={ownerReg.password}
                    onChange={e => setOwnerReg({ ...ownerReg, password: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.4rem' }}>
                <UserPlus size={18} /> Register Owner Account ({ownerAccountCount + 1}/3)
              </button>
            </form>
          )
        )}

        {/* --- GODOWN WORKER REGISTRATION FORM --- */}
        {isRegisterMode && activeRole === 'WORKER' && (
          <form onSubmit={handleWorkerRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#34d399' }}>
              Register Godown Worker Account
            </h4>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Worker Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={workerReg.name}
                  onChange={e => setWorkerReg({ ...workerReg, name: e.target.value })}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Mobile Number / Username *
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="9000000000 or worker"
                  value={workerReg.phone}
                  onChange={e => setWorkerReg({ ...workerReg, phone: e.target.value })}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Create Password *
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={workerReg.password}
                  onChange={e => setWorkerReg({ ...workerReg, password: e.target.value })}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.4rem', background: '#10b981', color: '#022c22' }}>
              <UserPlus size={18} /> Complete Worker Registration & Sign In
            </button>
          </form>
        )}

        {/* DEMO CREDENTIALS HINT CARDS */}
        <div style={{
          borderTop: '1px dashed var(--timber-border)',
          marginTop: '1.5rem',
          paddingTop: '1.1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
              ⚡ 1-Click Demo Login Shortcuts:
            </p>
            <button
              type="button"
              onClick={resetAllRegistrations}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-red)',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <RefreshCw size={12} /> Reset System & Restart
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <button
              type="button"
              onClick={() => fillCredentials('OWNER')}
              style={{
                background: 'rgba(245, 158, 11, 0.12)',
                color: 'var(--timber-gold-light)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>👑 Owner: <strong>father</strong></span>
              <span style={{ fontSize: '0.72rem', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>Pass: owner123</span>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('WORKER')}
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>👷 Godown Worker: <strong>worker</strong></span>
              <span style={{ fontSize: '0.72rem', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>Pass: worker123</span>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('DEALER')}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--timber-border)',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>🏪 Dealer Shop: <strong>9849012345</strong></span>
              <span style={{ fontSize: '0.72rem', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>Pass: dealer123</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
