import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- PHASE B: CRYPTO & LOCAL SHIELD ---
const hashKey = async (key) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
};

const App = () => {
  const [view, setView] = useState('analytics');
  const [passkey, setPasskey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [storedHash, setStoredHash] = useState(localStorage.getItem('vault_hash'));
  const [isSettingUp, setIsSettingUp] = useState(!localStorage.getItem('vault_hash'));
  const [inhibitionLevel, setInhibitionLevel] = useState(0.85);

  // --- AUTO-LOCK LOGIC (THE GHOST SHIELD) ---
  const lockVault = useCallback(() => {
    setUnlocked(false);
    setView('analytics');
    setPasskey("");
    console.log("VAULT_SECURED: INACTIVITY_TIMEOUT");
  }, []);

  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);
      // Set to 300,000ms (5 minutes) for standard hygiene
      timeout = setTimeout(lockVault, 300000); 
    };

    if (unlocked) {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keypress', resetTimer);
      resetTimer(); // Start timer on unlock
    }

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      if (timeout) clearTimeout(timeout);
    };
  }, [unlocked, lockVault]);

  // --- DATA GENERATION ---
  const chartData = Array.from({ length: 20 }, (_, i) => ({
    ms: i * 5,
    firing_rate: Math.max(0, Math.sin(i * 0.5) * 12 * (1 - inhibitionLevel) + (Math.random() * 2))
  }));

  const handleAuth = async () => {
    const enteredHash = await hashKey(passkey);
    if (isSettingUp) {
      localStorage.setItem('vault_hash', enteredHash);
      setStoredHash(enteredHash);
      setIsSettingUp(false);
    } else {
      if (enteredHash === storedHash) {
        setUnlocked(true);
        setView('splicer');
      } else {
        alert("AUTH_FAILED");
      }
    }
    setPasskey("");
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F3F4F6', color: '#111827', fontFamily: 'system-ui, sans-serif' }}>
      {/* THE MASK (NAV) */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 2rem', background: '#FFF', borderBottom: '1px solid #E5E7EB' }}>
        <span style={{ fontWeight: 800, color: '#2563EB', letterSpacing: '1px' }}>NEURAL_GATEWAY_v2</span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => setView('analytics')} style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '14px' }}>DASHBOARD</button>
          {!unlocked && (
            <div style={{ display: 'flex', background: '#F9FAFB', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '2px 8px' }}>
              <input 
                type="password" 
                placeholder={isSettingUp ? "INIT_KEY" : "ADMIN"} 
                value={passkey} 
                onChange={(e) => setPasskey(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                style={{ border: 'none', background: 'none', padding: '4px', outline: 'none', width: '100px', fontSize: '12px' }}
              />
              <button onClick={handleAuth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '10px', color: '#6B7280' }}>➜</button>
            </div>
          )}
          {unlocked && <button onClick={lockVault} style={{ background: '#EF4444', color: '#FFF', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>LOCK</button>}
        </div>
      </nav>

      {/* VIEW: ANALYTICS (PUBLIC MASK) */}
      {view === 'analytics' && (
        <main style={{ maxWidth: '800px', margin: '3rem auto', padding: '2rem', background: '#FFF', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Nociceptive Firing Analysis</h3>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '2rem' }}>Modeling SCN9A-targeted analgesic efficacy across peripheral pathways.</p>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis hide />
                <YAxis axisLine={false} tick={{fontSize: 12}} />
                <Tooltip />
                <Line type="monotone" dataKey="firing_rate" stroke="#2563EB" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151' }}>SIMULATION_INTENSITY: {(inhibitionLevel * 100).toFixed(0)}%</label>
            <input type="range" min="0" max="1" step="0.01" value={inhibitionLevel} onChange={(e) => setInhibitionLevel(e.target.value)} style={{ width: '100%', accentColor: '#2563EB' }} />
          </div>
        </main>
      )}

      {/* VIEW: THE SECRET LAB */}
      {view === 'splicer' && unlocked && (
        <main style={{ maxWidth: '800px', margin: '3rem auto', background: '#0F172A', color: '#10B981', padding: '3rem', borderRadius: '12px', border: '1px solid #1E293B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1E293B', paddingBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'monospace', margin: 0 }}>LAB_ACCESS: GRANTED</h2>
            <span style={{ fontSize: '12px', color: '#334155' }}>ENCRYPTION: SHA-256</span>
          </div>
          <div style={{ marginTop: '2rem', fontFamily: 'monospace', lineHeight: 1.6 }}>
            <p style={{ color: '#6EE7B7' }}>// CURRENT_SPLICER_VERSION: 1.0.4</p>
            <p>// DATASET: SCN9A_VARIANT_X6</p>
            <p style={{ color: '#F59E0B' }}>[WARNING]: LOCAL_STORAGE_ONLY. RELOAD PURGES CACHE.</p>
            <div style={{ marginTop: '2rem', padding: '1rem', background: '#020617', borderRadius: '4px' }}>
               {/* This area is where your secret research strings go */}
               $ ROOT_ACCESS_SEQUENCES_INIT...
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default App;
