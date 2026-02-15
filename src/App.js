import React, { useState, useEffect } from 'react';

const App = () => {
  const [view, setView] = useState('splicer'); 
  const [slotA, setSlotA] = useState(null);
  const [slotB, setSlotB] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [hybridName, setHybridName] = useState("");

  // Initialize Database with 500 Genes including Humans
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
    const isLethal = (combo.includes("Botanical") && !combo.includes("Botanical+Botanical")) || 
                     (combo.includes("Human") && combo.includes("Botanical"));

    const constituents = [`${g1.compound} (Base)`, `${g2.compound} (Stabilizer)`, `Distilled H2O`, `Enzyme Catalyst` ];

    return {
      status: isLethal ? (view === 'splicer' ? "LETHAL MUTATION" : "CORROSIVE REACTION") : "STABLE",
      color: isLethal ? "#ff3333" : (view === 'splicer' ? "#00d4ff" : "#bb00ff"),
      canSave: !isLethal,
      reason: isLethal ? "Cross-kingdom cellular rejection detected." : "Taxonomic alignment confirmed.",
      shifts: [
        { label: "Dominant Feature", value: g1.feature, source: g1.name },
        { label: "Recessive Trait", value: g2.trait, source: g2.name }
      ],
      constituents
    };
  };

  const analysis = getAnalysis(slotA, slotB);

  const archiveResult = () => {
    if (!hybridName) return alert("Label your creation.");
    const newEntry = {
      ...slotA,
      id: `${view === 'splicer' ? 'HYB' : 'SRM'}-${Math.floor(Math.random() * 8999 + 1000)}`,
      name: hybridName.toUpperCase(),
      type: `${slotA.type}/${slotB.type}`,
      isHybrid: true,
      icon: view === 'splicer' ? "🧬" : "🧪",
      reportData: analysis
    };
    setInventory([newEntry, ...inventory]);
    setSlotA(null); setSlotB(null); setHybridName("");
  };

  const downloadReport = () => {
    const hybrids = inventory.filter(g => g.isHybrid);
    const text = hybrids.map(h => (
      `REPORT: ${h.name} (${h.id})\n` +
      `TYPE: ${h.type}\n` +
      `DOMINANT: ${h.reportData.shifts[0].value} (Source: ${h.reportData.shifts[0].source})\n` +
      `RECESSIVE: ${h.reportData.shifts[1].value} (Source: ${h.reportData.shifts[1].source})\n` +
      `COMPOSITION: ${h.reportData.constituents.join(', ')}\n` +
      `------------------------------------------`
    )).join('\n\n');
    const blob = new Blob([text], {type: 'text/plain'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "LAB_ARCHIVE_DATA.txt";
    link.click();
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#050505', color: '#ccc', fontFamily: 'monospace' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '320px', borderRight: '1px solid #222', overflowY: 'auto', padding: '15px', background: '#0a0a0a' }}>
        <button onClick={downloadReport} style={{ width: '100%', padding: '10px', background: '#00d4ff', color: '#000', border: 'none', fontWeight: 'bold', marginBottom: '10px', cursor: 'pointer' }}>DOWNLOAD LOGS</button>
        <button onClick={() => {setView(view === 'splicer' ? 'serum' : 'splicer'); setSlotA(null); setSlotB(null);}} style={{ width: '100%', padding: '10px', background: '#222', color: '#fff', border: '1px solid #444', cursor: 'pointer', marginBottom: '20px' }}>
            SWITCH TO {view.toUpperCase() === 'SPLICER' ? 'SERUM DEPT' : 'SPLICING DEPT'}
        </button>
        {inventory.map(g => (
          <div key={g.id} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} style={{ padding: '8px', margin: '4px 0', background: '#111', borderLeft: `3px solid ${g.color}`, cursor: 'grab', fontSize: '11px' }}>
            {g.id} | {g.name}
          </div>
        ))}
      </div>

      {/* WORKSPACE */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: '#fff', letterSpacing: '4px' }}>{view === 'splicer' ? '🧬 GENOMIC_SPLICER' : '🧪 SERUM_SYNTHESIZER'}</h1>
        
        <div style={{ display: 'flex', gap: '40px', margin: '30px 0' }}>
          {[slotA, slotB].map((slot, i) => (
            <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const d = JSON.parse(e.dataTransfer.getData("gene")); i === 0 ? setSlotA(d) : setSlotB(d); }}
              style={view === 'splicer' ? { width: '180px', height: '220px', border: '2px solid #333', background: '#0e0e0e', textAlign: 'center', padding: '15px' } : { width: '110px', height: '190px', border: '2px solid #555', borderRadius: '5px 5px 40px 40px', background: '#000', overflow: 'hidden', position: 'relative' }}>
              {view === 'serum' && slot && <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '70%', background: slot.color, opacity: 0.5 }} />}
              <div style={{ position: 'relative', zIndex: 2, marginTop: view === 'serum' ? '40px' : '0' }}>
                {slot ? <> <div style={{ fontSize: '30px' }}>{slot.icon}</div> <p style={{fontSize: '12px'}}>{slot.name}</p> </> : <p style={{marginTop: '40%', color: '#444'}}>EMPTY</p>}
              </div>
            </div>
          ))}
        </div>

        {analysis && (
          <div style={{ width: '100%', maxWidth: '700px', padding: '25px', border: `1px solid ${analysis.color}`, background: '#0d0d0f' }}>
            <h3 style={{ color: analysis.color, margin: '0 0 15px 0' }}>STATUS: {analysis.status}</h3>
            
            <div style={{ background: '#000', padding: '15px', marginBottom: '15px', border: '1px solid #222' }}>
              <p style={{ color: '#00d4ff', fontSize: '11px', margin: '0 0 10px 0' }}>// INHERITANCE_DATA</p>
              {analysis.shifts.map((s, idx) => (
                <p key={idx} style={{ fontSize: '13px', margin: '5px 0' }}>
                  <span style={{ color: '#888' }}>{s.label}:</span> {s.value} <span style={{ color: '#555' }}>[Source: {s.source}]</span>
                </p>
              ))}
            </div>

            {view === 'serum' && analysis.canSave && (
              <div style={{ marginBottom: '15px' }}>
                <p style={{ color: '#888', fontSize: '11px' }}>CONSTITUENTS:</p>
                <p style={{ fontSize: '12px', color: '#bb00ff' }}>{analysis.constituents.join(' + ')}</p>
              </div>
            )}

            {analysis.canSave ? (
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <input placeholder="LABEL SEQUENCE..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} style={{ background: '#000', color: '#00ff88', border: '1px solid #333', padding: '10px', flex: 1 }} />
                <button onClick={archiveResult} style={{ background: analysis.color, color: '#000', border: 'none', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>ARCHIVE</button>
              </div>
            ) : <button onClick={() => {setSlotA(null); setSlotB(null);}} style={{ width: '100%', padding: '12px', background: '#ff3333', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>PURGE VOLATILE SAMPLES</button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
