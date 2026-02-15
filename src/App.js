import React, { useState, useEffect } from 'react';

const App = () => {
  const [view, setView] = useState('splicer'); 
  const [slotA, setSlotA] = useState(null);
  const [slotB, setSlotB] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [hybridName, setHybridName] = useState("");

  useEffect(() => {
    const baseGenes = Array.from({ length: 500 }, (_, i) => {
      const prefixes = ["Neon", "Primal", "Void", "Solar", "Cryo", "Toxic", "Apex", "Shadow", "Alpha", "Nano"];
      const id = `GENE-${String(i + 1).padStart(3, '0')}`;
      let type, name, trait, icon, color, compound, feature;
      const pre = prefixes[i % prefixes.length];

      if (i < 100) { 
        type = "Mammalian"; name = `${pre} Wolf`; trait = "Muscle Density"; 
        icon = "🐺"; color = "#ffaa00"; compound = "Myostatin-A"; feature = "Limbic Strength";
      } else if (i < 200) { 
        type = "Avian"; name = `${pre} Falcon`; trait = "Neural Velocity"; 
        icon = "🦅"; color = "#00d4ff"; compound = "Avian-Toxin"; feature = "Optical Tracking";
      } else if (i < 300) { 
        type = "Botanical"; name = `${pre} Lotus`; trait = "Regeneration"; 
        icon = "🌿"; color = "#00ff88"; compound = "Chlorophyll-K"; feature = "Dermal Shielding";
      } else if (i < 400) {
        type = "Aquatic"; name = `${pre} Orca`; trait = "Pressure Resistance"; 
        icon = "🦈"; color = "#3366ff"; compound = "Hydro-Lipid"; feature = "Gilled Respiration";
      } else { 
        type = "Human"; name = `${pre} Sapiens`; trait = "Neural Plasticity"; 
        icon = "👤"; color = "#ffffff"; compound = "Cerebro-Fluid"; feature = "Cognitive Processing";
      }

      return { id, name, type, trait, icon, color, compound, feature, isHybrid: false };
    });
    setInventory(baseGenes);
  }, []);

  const getAnalysis = (g1, g2) => {
    if (!g1 || !g2) return null;
    const combo = [g1.type, g2.type].sort().join('+');
    const isLethal = (combo.includes("Botanical") && !combo.includes("Botanical+Botanical")) || (combo.includes("Human") && combo.includes("Botanical"));
    
    // pH & Toxicity Logic
    let ph = 7.0; // Neutral
    let toxicity = 5.0; // Low base

    if (combo.includes("Human")) toxicity += 40.5; // High rejection risk
    if (combo.includes("Botanical")) ph = 4.2; // Acidic
    if (combo.includes("Aquatic")) ph = 8.4; // Alkaline
    if (g1.type !== g2.type) toxicity += 15.0; // Hybridization stress

    return {
      status: isLethal ? "UNSTABLE_REACTION" : "VIABLE_SEQUENCE",
      color: isLethal ? "#ff3333" : (view === 'splicer' ? "#00d4ff" : "#bb00ff"),
      canSave: !isLethal,
      ph: ph.toFixed(1),
      tox: `${toxicity.toFixed(1)}%`,
      report: isLethal ? "SEQUENCE TERMINATED: Chemical bonds failed to hold." : "Sequence aligned and verified.",
      composition: {
        base: `${g1.compound} (45%)`,
        stabilizer: `${g2.compound} (35%)`,
        purpose: `Integration of ${g1.feature} and ${g2.trait}.`
      }
    };
  };

  const analysis = getAnalysis(slotA, slotB);
  const reset = () => { setSlotA(null); setSlotB(null); setHybridName(""); };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#050505', color: '#ccc', fontFamily: 'monospace' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '300px', borderRight: '1px solid #222', overflowY: 'auto', padding: '15px', background: '#0a0a0a' }}>
        <button onClick={() => {setView(view === 'splicer' ? 'serum' : 'splicer'); reset();}} 
                style={{ width: '100%', padding: '12px', background: view === 'serum' ? '#bb00ff' : '#00d4ff', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px' }}>
            {view === 'splicer' ? 'ENTER_SERUM_LAB' : 'ENTER_G_SPLICER'}
        </button>
        {inventory.map(g => (
          <div key={g.id} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} 
               style={{ padding: '8px', margin: '4px 0', background: '#111', borderLeft: `3px solid ${g.color}`, cursor: 'grab', fontSize: '11px' }}>
            {g.id} | {g.name}
          </div>
        ))}
      </div>

      {/* LAB AREA */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: '#fff' }}>{view === 'splicer' ? 'GENOMIC_SPLICER_V5' : 'SERUM_SYNTHESIZER_V5'}</h1>
        
        <div style={{ display: 'flex', gap: '40px', margin: '30px 0' }}>
          {[slotA, slotB].map((slot, i) => (
            <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const d = JSON.parse(e.dataTransfer.getData("gene")); i === 0 ? setSlotA(d) : setSlotB(d); }}
              style={view === 'splicer' ? { width: '160px', height: '200px', border: '2px solid #333', background: '#0e0e0e', textAlign: 'center', padding: '15px' } : { width: '100px', height: '170px', border: '2px solid #555', borderRadius: '0 0 35px 35px', background: '#000', overflow: 'hidden', position: 'relative' }}>
              {view === 'serum' && slot && <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '70%', background: slot.color, opacity: 0.5 }} />}
              <div style={{ position: 'relative', zIndex: 2, marginTop: view === 'serum' ? '40px' : '0' }}>
                {slot ? <> <div style={{ fontSize: '30px' }}>{slot.icon}</div> <p style={{fontSize: '10px'}}>{slot.name}</p> </> : <p style={{marginTop: '40%', color: '#333'}}>IDLE</p>}
              </div>
            </div>
          ))}
        </div>

        {analysis && (
          <div style={{ width: '100%', maxWidth: '750px', padding: '25px', border: `1px solid ${analysis.color}`, background: '#0d0d0f' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ color: analysis.color, margin: 0 }}>{analysis.status}</h3>
                <button onClick={reset} style={{ background: 'none', border: '1px solid #444', color: '#666', cursor: 'pointer' }}>CLEAR</button>
            </div>

            {/* CHEMICAL TELEMETRY */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <div style={{ background: '#000', padding: '10px', border: '1px solid #222' }}>
                    <p style={{ fontSize: '9px', color: '#555' }}>pH_LEVEL</p>
                    <p style={{ color: '#00d4ff', fontSize: '16px' }}>{analysis.ph}</p>
                </div>
                <div style={{ background: '#000', padding: '10px', border: '1px solid #222' }}>
                    <p style={{ fontSize: '9px', color: '#555' }}>TOXICITY</p>
                    <p style={{ color: parseFloat(analysis.tox) > 50 ? '#ff3333' : '#00ff88', fontSize: '16px' }}>{analysis.tox}</p>
                </div>
                <div style={{ background: '#000', padding: '10px', border: '1px solid #222' }}>
                    <p style={{ fontSize: '9px', color: '#555' }}>STABILITY</p>
                    <p style={{ color: '#ffcc00', fontSize: '16px' }}>{analysis.canSave ? 'SECURE' : 'FAIL'}</p>
                </div>
                <div style={{ background: '#000', padding: '10px', border: '1px solid #222' }}>
                    <p style={{ fontSize: '9px', color: '#555' }}>REACTIVITY</p>
                    <p style={{ color: '#fff', fontSize: '16px' }}>NOMINAL</p>
                </div>
            </div>

            <div style={{ background: '#000', padding: '15px', border: '1px solid #222', fontSize: '12px' }}>
                <p style={{ color: '#00d4ff', margin: '0 0 5px 0' }}>// MOLECULAR_LOG</p>
                <p>• BASE: {analysis.composition.base}</p>
                <p>• STABILIZER: {analysis.composition.stabilizer}</p>
                <p style={{marginTop: '10px', color: '#888'}}><em>{analysis.composition.purpose}</em></p>
            </div>

            {analysis.canSave && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <input placeholder="LABEL_ID..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '10px', flex: 1 }} />
                <button style={{ background: analysis.color, color: '#000', border: 'none', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>ARCHIVE_DATA</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
