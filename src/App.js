import React, { useState, useEffect, useCallback } from 'react';

// --- SHA-256 ENCRYPTION CORE ---
const hashKey = async (key) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
};

const App = () => {
  // Security & System State
  const [unlocked, setUnlocked] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [storedHash, setStoredHash] = useState(localStorage.getItem('vault_hash'));
  const [isSettingUp, setIsSettingUp] = useState(!localStorage.getItem('vault_hash'));
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());

  // Lab State
  const [view, setView] = useState('splicer'); 
  const [slotA, setSlotA] = useState(null);
  const [slotB, setSlotB] = useState(null);
  const [ageA, setAgeA] = useState(25);
  const [ageB, setAgeB] = useState(25);
  const [inventory, setInventory] = useState([]);
  const [hybridName, setHybridName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredGene, setHoveredGene] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- GENOME DATABASE GENERATION ---
  useEffect(() => {
    const regions = ["Arctic", "Tundra", "Desert", "Amazon", "Mountain", "Volcanic", "Subterranean", "Savanna", "Highland"];
    const speciesData = {
      Mammalian: { icons: ["🐺", "🐅", "🐻"], features: ["Insulated Fur", "Thermal Claws", "Muscle Density"], manifest: ["growth of coarse fur", "keratinized claws", "hyper-densification of muscle"], traits: ["Night-Vision", "Stamina"] },
      Avian: { icons: ["🦅", "🦉"], features: ["Aero-Keel", "Hollow Bones"], manifest: ["sternum extension", "bone pneumatization"], traits: ["Dive-Speed", "Telescopic Sight"] },
      Aquatic: { icons: ["🦈", "🐙"], features: ["Electro-Sense", "Gills"], manifest: ["Ampullae formation", "cervical slit formation"], traits: ["Blood-Scent", "Mimicry"] },
      Arachnid: { icons: ["🕷️", "🦂"], features: ["Exoskeleton", "Tail Stinger"], manifest: ["chitinous plating", "caudal stinger extension"], traits: ["Wall-Climbing", "Paralytic Strike"] },
      Human: { icons: ["👤"], features: ["Frontal Lobe", "Opposable Thumbs"], manifest: ["neocortical expansion", "refined digital dexterity"], traits: ["Logic", "Adaptability"] }
    };
    const tempInv = [];
    let count = 0;
    const types = Object.keys(speciesData);
    for (let i = 0; i < 50; i++) {
      types.forEach(type => {
        const data = speciesData[type];
        const featIdx = count % data.features.length;
        tempInv.push({
          id: `DB-${count}`,
          name: type === "Human" ? `${i % 2 === 0 ? "Male" : "Female"} Human` : `${regions[i % regions.length]} ${type}`,
          type, feature: data.features[featIdx], manifestation: data.manifest[featIdx],
          trait: data.traits[count % data.traits.length],
          compound: `${type.substring(0,3).toUpperCase()}-${count}`,
          basePh: (7.2 + (Math.random() * 0.4 - 0.2)).toFixed(2),
          color: { Mammalian: "#FFD699", Avian: "#99EBFF", Aquatic: "#99B2FF", Human: "#FFFFFF", Arachnid: "#E066FF" }[type],
          icon: data.icons[count % data.icons.length]
        });
        count++;
      });
    }
    setInventory(tempInv);
  }, []);

  const handleAuth = async () => {
    const enteredHash = await hashKey(passkey);
    if (isSettingUp) {
      localStorage.setItem('vault_hash', enteredHash);
      setStoredHash(enteredHash);
      setIsSettingUp(false);
    } else if (enteredHash === storedHash) {
      setUnlocked(true);
    } else {
      alert("AUTH_FAILED: ACCESS DENIED");
    }
    setPasskey("");
  };

  const getAnalysis = (g1, g2) => {
    if (!g1 || !g2) return null;
    const stability = Math.max(5, (g1.type === g2.type ? 90 : 65) - (Math.abs(g1.basePh - g2.basePh) * 50)).toFixed(0);
    return {
      isLethal: stability < 40, stability, color: view === 'splicer' ? "#99EBFF" : "#EBBBFF",
      physical: `Immediate ${g1.manifestation} and ${g2.manifestation}.`,
      neural: `Instincts: ${g1.trait}. Behavioral loops: ${g2.trait}.`,
      protocol: [
        `1. Bypass MHC T-cell recognition via MHC-Suppressor complex.`,
        `2. Maintain pH ${((parseFloat(g1.basePh)+parseFloat(g2.basePh))/2).toFixed(2)} stability.`,
        `3. Continuous 80,000 kcal/hr ATP drip for rapid cellular division.`,
        `4. Mitigate 108°F metabolic thermal spike via cryogenic immersion.`
      ]
    };
  };

  const res = getAnalysis(slotA, slotB);

  const handleDownload = () => {
    const content = `GENETIC RECOMBINATION REPORT\nDATE: ${new Date().toLocaleDateString()}\nSTABILITY: ${res.stability}%\nPHYSICAL: ${res.physical}\nNEURAL: ${res.neural}\n\nPROTOCOL:\n${res.protocol.join('\n')}`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([content], {type: 'text/plain'}));
    link.download = `REPORT_${hybridName.toUpperCase() || 'SUBJECT'}.txt`;
    link.click();
  };

  if (!unlocked) {
    return (
      <div style={{ height: '100vh', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'monospace' }}>
        <div style={{ width: '400px', border: '1px solid #333', padding: '40px', textAlign: 'center' }}>
          <h2 style={{ color: '#2563EB', letterSpacing: '4px' }}>VAULT_LOCKED</h2>
          <p style={{ color: '#444', fontSize: '12px' }}>SYSTEM_TIME: {systemTime}</p>
          <input type="password" placeholder={isSettingUp ? "CREATE_MASTER_KEY" : "ENTER_CREDENTIALS"} value={passkey} 
                 onChange={(e) => setPasskey(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAuth()} 
                 style={{ width: '100%', background: '#080808', color: '#FFF', border: '1px solid #444', padding: '15px', marginTop: '20px', textAlign: 'center' }} />
          <button onClick={handleAuth} style={{ width: '100%', marginTop: '10px', padding: '10px', background: '#2563EB', border: 'none', color: '#FFF', fontWeight: 'bold', cursor: 'pointer' }}>AUTHENTICATE</button>
        </div>
      </div>
    );
  }

  return (
    <div onMouseMove={(e) => setMousePos({ x: e.clientX + 15, y: e.clientY + 15 })} 
         style={{ minHeight: '100vh', backgroundColor: '#000', color: '#EEE', fontFamily: 'monospace' }}>
      
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid #222', background: '#050505' }}>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, color: '#2563EB' }}>GENOME_VAULT_v3</span>
          <button onClick={() => setView('splicer')} style={{ color: view === 'splicer' ? '#99EBFF' : '#444', background: 'none', border: 'none', cursor: 'pointer' }}>🧬 SPLICER</button>
          <button onClick={() => setView('serum')} style={{ color: view === 'serum' ? '#EBBBFF' : '#444', background: 'none', border: 'none', cursor: 'pointer' }}>🧪 SERUM_LAB</button>
        </div>
        <div style={{ color: '#444', fontSize: '12px' }}>{systemTime} | SAMPLES: {inventory.length}</div>
      </nav>

      <div style={{ display: 'flex', height: 'calc(100vh - 65px)' }}>
        <div style={{ width: '350px', borderRight: '1px solid #222', padding: '20px', overflowY: 'auto' }}>
          <input type="text" placeholder="FILTER_DB..." onChange={(e) => setSearchTerm(e.target.value)} 
                 style={{ width: '100%', padding: '12px', background: '#0a0a0a', color: '#FFF', border: '1px solid #333', marginBottom: '20px' }} />
          {inventory.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())).map(g => (
            <div key={g.id} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} onMouseEnter={() => setHoveredGene(g)} onMouseLeave={() => setHoveredGene(null)}
                 style={{ padding: '12px', margin: '8px 0', background: '#0a0a0a', borderLeft: `4px solid ${g.color}`, cursor: 'grab', fontSize: '13px' }}>
              {g.icon} {g.name}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
            {[ {s: slotA, set: setSlotA, age: ageA, setAge: setAgeA}, {s: slotB, set: setSlotB, age: ageB, setAge: setAgeB} ].map((item, i) => (
              <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => item.set(JSON.parse(e.dataTransfer.getData("gene")))}
                   style={{ width: '220px', height: '280px', border: '1px solid #222', background: '#020202', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {item.s ? (
                  <>
                    <div style={{fontSize: '60px'}}>{item.s.icon}</div>
                    <b style={{color: item.s.color}}>{item.s.name}</b>
                    {item.s.type === 'Human' && <input type="number" value={item.age} onChange={(e) => item.setAge(e.target.value)} style={{width: '45px', background: '#000', color: '#0F0', border: '1px solid #333', marginTop: '10px'}} />}
                  </>
                ) : <span style={{color: '#111'}}>EMPTY_SLOT</span>}
              </div>
            ))}
          </div>

          {res && (
            <div style={{ width: '100%', maxWidth: '800px', padding: '35px', border: `1px solid ${res.color}`, background: '#050505' }}>
              <h2 style={{ color: res.color }}>{res.isLethal ? 'VIABILITY_FAILURE' : `STABILITY: ${res.stability}%`}</h2>
              <div style={{fontSize: '15px', lineHeight: '1.6', margin: '25px 0'}}>
                {view === 'splicer' ? <p><b>MANIFEST:</b> {res.physical}</p> : 
                  res.protocol.map((s, i) => <p key={i} style={{fontSize: '12px', color: '#888'}}>{s}</p>)}
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input placeholder="SPECIMEN_ID" value={hybridName} onChange={(e) => setHybridName(e.target.value)} style={{ background: '#000', color: '#FFF', border: '1px solid #222', padding: '12px', flex: 1 }} />
                <button onClick={() => { setInventory([{...slotA, id: Date.now(), name: hybridName.toUpperCase(), isHybrid: true, color: res.color, parents: [slotA.name, slotB.name], feature: res.physical, trait: res.neural}, ...inventory]); setSlotA(null); setSlotB(null); setHybridName(""); }} 
                        style={{ background: res.color, color: '#000', border: 'none', padding: '0 30px', fontWeight: 'bold', cursor: 'pointer' }}>SAVE</button>
                {view === 'serum' && <button onClick={handleDownload} style={{ background: '#222', color: '#FFF', border: 'none', padding: '0 20px', cursor: 'pointer' }}>DOC</button>}
              </div>
            </div>
          )}
        </div>
      </div>

      {hoveredGene && (
        <div style={{ position: 'fixed', left: mousePos.x, top: mousePos.y, background: '#0a0a0a', border: `1px solid ${hoveredGene.color}`, padding: '12px', zIndex: 1000, pointerEvents: 'none' }}>
          <b style={{ color: hoveredGene.color }}>{hoveredGene.name}</b>
          <p style={{fontSize: '11px', color: '#888'}}>{hoveredGene.feature}</p>
        </div>
      )}
    </div>
  );
};

export default App;
