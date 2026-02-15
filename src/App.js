import React, { useState, useEffect } from 'react';

const App = () => {
  const [view, setView] = useState('splicer'); 
  const [slotA, setSlotA] = useState(null);
  const [slotB, setSlotB] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [hybridName, setHybridName] = useState("");

  useEffect(() => {
    const baseGenes = Array.from({ length: 500 }, (_, i) => {
      const prefixes = ["Glacial", "Volcanic", "Apex", "Shadow", "Neon", "Primal", "Cyber", "Ethereal", "Storm", "Deep-Sea"];
      const mammals = ["Lion", "Wolf", "Bear", "Rhino", "Stallion"];
      const id = `GENE-${String(i + 1).padStart(3, '0')}`;
      let type, name, trait, icon, color, compound;
      const pre = prefixes[i % prefixes.length];

      if (i < 125) { 
        type = "Mammalian"; name = `${pre} ${mammals[i % 5]}`; trait = "Muscle Density"; 
        icon = "🦁"; color = "#ffaa00"; compound = "Myostatin-Alpha"; 
      }
      else if (i < 250) { 
        type = "Avian"; name = `${pre} Falcon`; trait = "Neural Velocity"; 
        icon = "🦅"; color = "#00d4ff"; compound = "Avian-Neurotoxin"; 
      }
      else if (i < 375) { 
        type = "Botanical"; name = `${pre} Lotus`; trait = "Cellular Regeneration"; 
        icon = "🌿"; color = "#00ff88"; compound = "Chlorophyll-K"; 
      }
      else { 
        type = "Aquatic"; name = `${pre} Orca`; trait = "Pressure Resistance"; 
        icon = "🦈"; color = "#3366ff"; compound = "Hydro-Lipid"; 
      }

      return { id, name, type, trait, icon, color, compound, isHybrid: false };
    });
    setInventory(baseGenes);
  }, []);

  const getAnalysis = (g1, g2) => {
    if (!g1 || !g2) return null;
    const combo = [g1.type, g2.type].sort().join('+');
    const isLethal = combo.includes("Botanical") && !combo.includes("Botanical+Botanical");

    // Molecular constitution for Serum mode
    const constituents = [
      `${g1.compound} (Base)`,
      `${g2.compound} (Stabilizer)`,
      `Distilled H2O (9.2%)`,
      `${(Math.random() * 5).toFixed(2)}mg Trace Minerals`
    ];

    return {
      status: isLethal ? (view === 'splicer' ? "LETHAL MUTATION" : "CORROSIVE REACTION") : "STABLE",
      color: isLethal ? "#ff3333" : (view === 'splicer' ? "#00d4ff" : "#bb00ff"),
      canSave: !isLethal,
      reason: isLethal ? "Incompatible molecular structures. Cellular collapse imminent." : "Sequence alignment confirmed.",
      constituents: constituents
    };
  };

  const analysis = getAnalysis(slotA, slotB);

  const archiveResult = () => {
    if (!hybridName) return alert("Identify your creation.");
    const prefix = view === 'splicer' ? "HYB" : "SRM";
    const newEntry = {
      ...slotA,
      id: `${prefix}-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: hybridName.toUpperCase(),
      isHybrid: true,
      icon: view === 'splicer' ? "🧬" : "🧪",
      compound: `Refined ${slotA.compound}`
    };
    setInventory([newEntry, ...inventory]);
    setSlotA(null); setSlotB(null); setHybridName("");
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#050505', color: '#ccc', fontFamily: 'monospace' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '320px', borderRight: '1px solid #222', overflowY: 'auto', padding: '15px', background: '#0a0a0a' }}>
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #333', textAlign: 'center', background: '#111' }}>
            <p style={{fontSize: '10px', color: '#00d4ff', margin: '0'}}>ACTIVE TERMINAL</p>
            <h2 style={{margin: '10px 0', color: '#fff', fontSize: '18px'}}>{view.toUpperCase()}</h2>
            <button 
                onClick={() => {setView(view === 'splicer' ? 'serum' : 'splicer'); setSlotA(null); setSlotB(null);}}
                style={{ background: '#222', color: '#00d4ff', border: '1px solid #00d4ff', padding: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '10px', width: '100%' }}
            >
                GO TO {view === 'splicer' ? 'SERUM LAB' : 'SPLICING DEPT'}
            </button>
        </div>
        
        {inventory.map(gene => (
          <div 
            key={gene.id} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(gene))}
            style={{ padding: '10px', margin: '5px 0', background: '#111', borderLeft: `3px solid ${gene.color}`, cursor: 'grab', fontSize: '11px' }}>
            <span style={{color: '#666'}}>{gene.id}</span> | <strong>{gene.name}</strong>
          </div>
        ))}
      </div>

      {/* WORKSPACE */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: '#fff', letterSpacing: '4px' }}>{view === 'splicer' ? '🧬 GENOMIC_SPLICER_V4' : '🧪 SERUM_SYNTHESIZER_V4'}</h1>
        
        <div style={{ display: 'flex', gap: '40px', margin: '40px 0' }}>
          {[slotA, slotB].map((slot, i) => (
            <div 
              key={i} onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { const d = JSON.parse(e.dataTransfer.getData("gene")); i === 0 ? setSlotA(d) : setSlotB(d); }}
              style={view === 'splicer' ? {
                width: '180px', height: '220px', border: '2px solid #333', background: '#0e0e0e', textAlign: 'center', padding: '15px'
              } : {
                width: '110px', height: '190px', border: '2px solid #555', borderRadius: '5px 5px 40px 40px', background: '#000', position: 'relative', overflow: 'hidden'
              }}
            >
              {view === 'serum' && slot && (
                <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '75%', background: slot.color, opacity: 0.5, boxShadow: `inset 0 0 20px ${slot.color}` }} />
              )}
              <div style={{ position: 'relative', zIndex: 2, marginTop: view === 'serum' ? '40px' : '10px' }}>
                {slot ? ( <> <div style={{ fontSize: '35px' }}>{slot.icon}</div> <p style={{fontSize: '12px', fontWeight: 'bold'}}>{slot.name}</p> <p style={{fontSize: '9px', color: '#666'}}>{slot.compound}</p> </> ) : <p style={{color: '#444', marginTop: '40%'}}>EMPTY</p>}
              </div>
            </div>
          ))}
        </div>

        {analysis && (
          <div style={{ width: '100%', maxWidth: '700px', padding: '25px', border: `1px solid ${analysis.color}`, background: '#0d0d0f', boxShadow: `0 0 15px ${analysis.color}22` }}>
            <h3 style={{ color: analysis.color, marginTop: 0 }}>STATUS: {analysis.status}</h3>
            <p style={{fontSize: '13px'}}>{analysis.reason}</p>
            
            <hr style={{ borderColor: '#222', margin: '15px 0' }} />

            {/* MOLECULAR CONSTITUTION (Only for Serum View) */}
            {view === 'serum' && analysis.canSave && (
              <div style={{ marginBottom: '15px' }}>
                <h4 style={{ color: '#aaa', fontSize: '11px', textTransform: 'uppercase' }}>Chemical Constitution:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {analysis.constituents.map((c, idx) => (
                    <div key={idx} style={{ fontSize: '11px', color: '#00d4ff', background: '#000', padding: '5px', border: '1px solid #222' }}>
                      + {c}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.canSave ? (
              <div style={{marginTop: '20px', borderTop: '1px solid #222', paddingTop: '15px'}}>
                <input 
                    placeholder={view === 'splicer' ? "ASSIGN HYBRID NAME..." : "LABEL SERUM COMPOUND..."} 
                    value={hybridName} onChange={(e) => setHybridName(e.target.value)}
                    style={{ background: '#000', color: '#00ff88', border: '1px solid #333', padding: '12px', width: '250px', outline: 'none' }}
                />
                <button onClick={archiveResult} style={{ background: analysis.color, color: '#000', padding: '12px 20px', marginLeft: '10px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>
                    {view === 'splicer' ? 'ARCHIVE SPECIMEN' : 'SYNTHESIZE'}
                </button>
              </div>
            ) : <button onClick={() => {setSlotA(null); setSlotB(null);}} style={{width: '100%', padding: '12px', background: '#f00', border: 'none', color: '#fff', marginTop: '10px', cursor: 'pointer', fontWeight: 'bold'}}>PURGE CONTAMINATED MATERIAL</button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
