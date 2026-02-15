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
        type = "Mammalian"; name = `${pre} Wolf`; trait = "Endothermic Regulation"; 
        icon = "🐺"; color = "#ffaa00"; compound = "Myostatin-A"; feature = "Skeletal Musculature";
      } else if (i < 200) { 
        type = "Avian"; name = `${pre} Falcon`; trait = "Feather-Keratin Structure"; 
        icon = "🦅"; color = "#00d4ff"; compound = "Avian-Neuro-T"; feature = "Optical Tracking";
      } else if (i < 300) { 
        type = "Botanical"; name = `${pre} Lotus`; trait = "Cellulose Wall Density"; 
        icon = "🌿"; color = "#00ff88"; compound = "Chlorophyll-K"; feature = "Photosynthetic Skin";
      } else if (i < 400) {
        type = "Aquatic"; name = `${pre} Orca`; trait = "Hydrostatic Resistance"; 
        icon = "🦈"; color = "#3366ff"; compound = "Hydro-Lipid"; feature = "Gilled Respiration";
      } else { 
        type = "Human"; name = `${pre} Sapiens`; trait = "Neural Synapse Speed"; 
        icon = "👤"; color = "#ffffff"; compound = "Cerebro-X"; feature = "Fine Motor Dexterity";
      }

      return { id, name, type, trait, icon, color, compound, feature, isHybrid: false };
    });
    setInventory(baseGenes);
  }, []);

  const getAnalysis = (g1, g2) => {
    if (!g1 || !g2) return null;
    const combo = [g1.type, g2.type].sort().join('+');
    
    // Compatibility Engine
    const isLethal = (combo.includes("Botanical") && !combo.includes("Botanical+Botanical")) || 
                     (combo.includes("Human") && combo.includes("Botanical"));
    
    // A) Splicer Features
    const splicerData = {
      dominant: { feature: g1.feature, source: g1.name },
      recessive: { trait: g2.trait, source: g2.name },
      reason: isLethal ? "Molecular rejection: Cross-kingdom cellular walls cannot fuse." : 
              (g1.type === g2.type ? "High alignment: Shared taxonomic lineage." : "Stable hybrid: Forced genomic splicing successful.")
    };

    // B) Serum Features
    let ph = 7.0; 
    let toxicity = 5.0;
    if (combo.includes("Human")) toxicity += 45.0;
    if (combo.includes("Botanical")) ph -= 2.8;
    if (combo.includes("Aquatic")) ph += 1.4;
    if (g1.type !== g2.type) toxicity += 12.0;

    const serumData = {
      ph: ph.toFixed(1),
      tox: `${toxicity.toFixed(1)}%`,
      composition: [
        { label: "Primary Extract", val: `${g1.compound} (40%)` },
        { label: "Secondary Isolate", val: `${g2.compound} (35%)` },
        { label: "Diluent", val: "Saline Buffer (20%)" },
        { label: "Catalyst", val: "Reactive Enzyme (5%)" }
      ]
    };

    return { isLethal, canSave: !isLethal, color: isLethal ? "#ff3333" : (view === 'splicer' ? "#00d4ff" : "#bb00ff"), splicerData, serumData };
  };

  const res = getAnalysis(slotA, slotB);
  const clear = () => { setSlotA(null); setSlotB(null); setHybridName(""); };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#050505', color: '#ccc', fontFamily: 'monospace' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '300px', borderRight: '1px solid #222', overflowY: 'auto', padding: '15px', background: '#0a0a0a' }}>
        <button onClick={() => {setView(view === 'splicer' ? 'serum' : 'splicer'); clear();}} 
                style={{ width: '100%', padding: '12px', background: view === 'serum' ? '#bb00ff' : '#00d4ff', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px' }}>
            SWITCH TO {view === 'splicer' ? 'SERUM LAB' : 'G-SPLICER'}
        </button>
        {inventory.map(g => (
          <div key={g.id} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} 
               style={{ padding: '8px', margin: '4px 0', background: '#111', borderLeft: `3px solid ${g.color}`, cursor: 'grab', fontSize: '11px' }}>
            {g.id} | {g.name}
          </div>
        ))}
      </div>

      {/* LAB WORKSPACE */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: '#fff' }}>{view === 'splicer' ? '🧬 GENOME_SPLICER' : '🧪 SERUM_LAB'}</h1>
        
        <div style={{ display: 'flex', gap: '30px', margin: '30px 0' }}>
          {[slotA, slotB].map((slot, i) => (
            <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const d = JSON.parse(e.dataTransfer.getData("gene")); i === 0 ? setSlotA(d) : setSlotB(d); }}
              style={view === 'splicer' ? { width: '150px', height: '200px', border: '2px solid #333', background: '#0e0e0e', textAlign: 'center', padding: '15px' } : { width: '100px', height: '170px', border: '2px solid #555', borderRadius: '0 0 35px 35px', background: '#000', overflow: 'hidden', position: 'relative' }}>
              {view === 'serum' && slot && <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '70%', background: slot.color, opacity: 0.5 }} />}
              <div style={{ position: 'relative', zIndex: 2, marginTop: view === 'serum' ? '40px' : '5px' }}>
                {slot ? <> <div style={{ fontSize: '24px' }}>{slot.icon}</div> <p style={{fontSize: '10px'}}>{slot.name}</p> </> : <p style={{marginTop: '40%', color: '#333'}}>EMPTY</p>}
              </div>
            </div>
          ))}
        </div>

        {res && (
          <div style={{ width: '100%', maxWidth: '800px', padding: '25px', border: `1px solid ${res.color}`, background: '#0d0d0f' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ color: res.color, margin: 0 }}>{res.isLethal ? 'SYSTEM_FAILURE' : 'STABLE_ANALYSIS'}</h2>
                <button onClick={clear} style={{ background: '#222', color: '#888', border: '1px solid #444', cursor: 'pointer' }}>RESET</button>
            </div>

            {view === 'splicer' ? (
              /* A) GENOME SPLICER REPORT */
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#000', padding: '15px', border: '1px solid #222' }}>
                    <p style={{ color: '#00d4ff', fontSize: '10px' }}>// PHENOTYPE_DISTRIBUTION</p>
                    <p style={{ fontSize: '13px' }}><strong>Dominant:</strong> {res.splicerData.dominant.feature}</p>
                    <p style={{ fontSize: '10px', color: '#555' }}>Source: {res.splicerData.dominant.source}</p>
                    <hr style={{borderColor: '#111'}}/>
                    <p style={{ fontSize: '13px' }}><strong>Recessive:</strong> {res.splicerData.recessive.trait}</p>
                    <p style={{ fontSize: '10px', color: '#555' }}>Source: {res.splicerData.recessive.source}</p>
                </div>
                <div style={{ background: '#000', padding: '15px', border: '1px solid #222' }}>
                    <p style={{ color: '#00d4ff', fontSize: '10px' }}>// COMPATIBILITY_LOG</p>
                    <p style={{fontSize: '12px', lineHeight: '1.5'}}>{res.splicerData.reason}</p>
                </div>
              </div>
            ) : (
              /* B) SERUM LAB REPORT */
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ background: '#000', padding: '10px', border: '1px solid #222' }}>
                        <p style={{ fontSize: '9px', color: '#555' }}>pH_LEVEL</p>
                        <p style={{ color: '#00d4ff', fontSize: '18px' }}>{res.serumData.ph}</p>
                    </div>
                    <div style={{ background: '#000', padding: '10px', border: '1px solid #222' }}>
                        <p style={{ fontSize: '9px', color: '#555' }}>TOXICITY</p>
                        <p style={{ color: parseFloat(res.serumData.tox) > 40 ? '#ff3333' : '#00ff88', fontSize: '18px' }}>{res.serumData.tox}</p>
                    </div>
                </div>
                <div style={{ background: '#000', padding: '15px', border: '1px solid #222' }}>
                    <p style={{ color: '#bb00ff', fontSize: '10px' }}>// MOLECULAR_COMPOSITION</p>
                    {res.serumData.composition.map((c, i) => (
                        <p key={i} style={{fontSize: '11px', margin: '5px 0'}}>• {c.label}: <span style={{color: '#fff'}}>{c.val}</span></p>
                    ))}
                </div>
              </div>
            )}

            {res.canSave && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #222' }}>
                <input placeholder="ENTER NOMENCLATURE..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} style={{ background: '#000', color: '#00ff88', border: '1px solid #333', padding: '10px', flex: 1 }} />
                <button style={{ background: res.color, color: '#000', border: 'none', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {view === 'splicer' ? 'ARCHIVE_SPECIMEN' : 'DISTILL_SERUM'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
