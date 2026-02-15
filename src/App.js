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
    
    // Compatibility Logic
    const isSame = g1.type === g2.type;
    const isLethal = (combo.includes("Botanical") && !combo.includes("Botanical+Botanical")) || (combo.includes("Human") && combo.includes("Botanical"));
    
    let compatibility = isSame ? 99.9 : (isLethal ? 0.02 : 64.5);
    let drift = isSame ? 0.01 : (isLethal ? 99.9 : 14.8);

    let report = "";
    if (isSame) report = "Molecular structures aligned. Sequence utilizes identical protein folds, resulting in near-perfect integration.";
    else if (isLethal) report = "CRITICAL FAILURE: Cellulose-based cell walls are inducing rapid apoptosis in soft-tissue membranes. Sequence non-viable.";
    else report = "Hybridized sequence stable. Endothermic regulation maintains homeostasis despite taxonomic drift.";

    return {
      status: isLethal ? "LETHAL MUTATION" : "STABLE HYBRID",
      color: isLethal ? "#ff3333" : "#00d4ff",
      canSave: !isLethal,
      comp: `${compatibility}%`,
      drift: `${drift}%`,
      report,
      shifts: [
        { label: "Dominant Feature", value: g1.feature, source: g1.name },
        { label: "Systemic Trait", value: g2.trait, source: g2.name }
      ],
      constituents: [`${g1.compound}`, `${g2.compound}`, `Saline Catalyst`]
    };
  };

  const analysis = getAnalysis(slotA, slotB);

  const resetSlots = () => { setSlotA(null); setSlotB(null); setHybridName(""); };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#050505', color: '#ccc', fontFamily: 'monospace' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '320px', borderRight: '1px solid #222', overflowY: 'auto', padding: '15px', background: '#0a0a0a' }}>
        <h3 style={{ color: '#00d4ff', fontSize: '11px' }}>// ARCHIVE_CONTROLS</h3>
        <button onClick={() => {}} style={{ width: '100%', padding: '10px', background: '#222', color: '#00d4ff', border: '1px solid #333', cursor: 'not-allowed', marginBottom: '10px' }}>LOG_EXPORT_V4</button>
        <button onClick={() => {setView(view === 'splicer' ? 'serum' : 'splicer'); resetSlots();}} style={{ width: '100%', padding: '10px', background: '#00d4ff', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px' }}>
            SWITCH TO {view.toUpperCase() === 'SPLICER' ? 'SERUM LAB' : 'SPLICING DEPT'}
        </button>
        {inventory.map(g => (
          <div key={g.id} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} style={{ padding: '8px', margin: '4px 0', background: '#111', borderLeft: `3px solid ${g.color}`, cursor: 'grab', fontSize: '11px' }}>
            {g.id} | {g.name}
          </div>
        ))}
      </div>

      {/* WORKSPACE */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: '#fff' }}>{view === 'splicer' ? '🧬 GENOMIC_SPLICER' : '🧪 SERUM_SYNTHESIZER'}</h1>
        
        <div style={{ display: 'flex', gap: '40px', margin: '30px 0' }}>
          {[slotA, slotB].map((slot, i) => (
            <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const d = JSON.parse(e.dataTransfer.getData("gene")); i === 0 ? setSlotA(d) : setSlotB(d); }}
              style={view === 'splicer' ? { width: '180px', height: '220px', border: '2px solid #333', background: '#0e0e0e', textAlign: 'center', padding: '15px' } : { width: '110px', height: '190px', border: '2px solid #555', borderRadius: '5px 5px 40px 40px', background: '#000', overflow: 'hidden', position: 'relative' }}>
              {view === 'serum' && slot && <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '70%', background: slot.color, opacity: 0.5 }} />}
              <div style={{ position: 'relative', zIndex: 2, marginTop: view === 'serum' ? '40px' : '0' }}>
                {slot ? <> <div style={{ fontSize: '30px' }}>{slot.icon}</div> <p style={{fontSize: '11px'}}>{slot.name}</p> </> : <p style={{marginTop: '40%', color: '#444'}}>UPLOAD_DNA</p>}
              </div>
            </div>
          ))}
        </div>

        {analysis && (
          <div style={{ width: '100%', maxWidth: '750px', padding: '25px', border: `1px solid ${analysis.color}`, background: '#0d0d0f' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: analysis.color, margin: 0 }}>STATUS: {analysis.status}</h3>
                <button onClick={resetSlots} style={{ background: 'none', border: '1px solid #444', color: '#888', padding: '5px 10px', cursor: 'pointer', fontSize: '10px' }}>RESET_SEQUENCE</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', margin: '20px 0' }}>
                <div style={{ background: '#000', padding: '10px', border: '1px solid #222' }}>
                    <p style={{ fontSize: '9px', color: '#555' }}>COMPATIBILITY</p>
                    <p style={{ color: '#00ff88', fontSize: '14px' }}>{analysis.comp}</p>
                </div>
                <div style={{ background: '#000', padding: '10px', border: '1px solid #222' }}>
                    <p style={{ fontSize: '9px', color: '#555' }}>CELLULAR_DRIFT</p>
                    <p style={{ color: '#ffcc00', fontSize: '14px' }}>{analysis.drift}</p>
                </div>
                <div style={{ background: '#000', padding: '10px', border: '1px solid #222' }}>
                    <p style={{ fontSize: '9px', color: '#555' }}>VIABILITY</p>
                    <p style={{ color: analysis.canSave ? '#00d4ff' : '#f00', fontSize: '14px' }}>{analysis.canSave ? 'HIGH' : 'ZERO'}</p>
                </div>
            </div>

            <p style={{ fontSize: '13px', lineHeight: '1.4', marginBottom: '15px' }}><strong>BIO_REPORT:</strong> {analysis.report}</p>

            <div style={{ background: '#000', padding: '15px', border: '1px solid #222' }}>
              <p style={{ color: '#00d4ff', fontSize: '11px', margin: '0 0 10px 0' }}>// PHENOTYPE_INHERITANCE</p>
              {analysis.shifts.map((s, idx) => (
                <p key={idx} style={{ fontSize: '12px', margin: '5px 0' }}>
                  <span style={{ color: '#888' }}>{s.label}:</span> {s.value} <span style={{ color: '#555', fontSize: '10px' }}>[Drawn from: {s.source}]</span>
                </p>
              ))}
            </div>

            {analysis.canSave ? (
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <input placeholder="NOMENCLATURE..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '10px', flex: 1 }} />
                <button style={{ background: analysis.color, color: '#000', border: 'none', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>ARCHIVE_DATA</button>
              </div>
            ) : <button onClick={resetSlots} style={{ width: '100%', padding: '12px', background: '#ff3333', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px' }}>PURGE_FAILED_SAMPLES</button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
