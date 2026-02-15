import React, { useState, useEffect } from 'react';

const App = () => {
  const [view, setView] = useState('splicer'); 
  const [slotA, setSlotA] = useState(null);
  const [slotB, setSlotB] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [hybridName, setHybridName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredGene, setHoveredGene] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const baseGenes = Array.from({ length: 50 }, (_, i) => {
      const types = ["Mammalian", "Avian", "Botanical", "Aquatic", "Human"];
      const icons = ["🐺", "🦅", "🌿", "🦈", "👤"];
      const type = types[i % 5];
      const colors = ["#FFD699", "#99EBFF", "#A3FFD6", "#99B2FF", "#FFFFFF"]; 
      
      const traits = {
        Mammalian: { feature: "Dense Muscular Fibers", trait: "Adrenaline Response System", comp: "Mammal-Beta" },
        Avian: { feature: "Hollow Bone Architecture", trait: "Enhanced Optical Processing", comp: "Avian-C" },
        Botanical: { feature: "Chlorophyll Dermal Layer", trait: "Rapid Cellular Regeneration", comp: "Phyto-K" },
        Aquatic: { feature: "Internal Gilled Filtration", trait: "Pressure-Resistant Organs", comp: "Aqua-Lipid" },
        Human: { feature: "Advanced Neural Cortex", trait: "High-Precision Motor Control", comp: "Cerebro-V" }
      };

      return {
        id: `G-${String(i + 1).padStart(3, '0')}`,
        name: `Alpha ${type}`,
        type,
        trait: traits[type].trait,
        feature: traits[type].feature,
        icon: icons[i % 5],
        color: colors[i % 5],
        compound: traits[type].comp,
        isHybrid: false
      };
    });
    setInventory(baseGenes);
  }, []);

  const getAnalysis = (g1, g2) => {
    if (!g1 || !g2) return null;
    const combo = [g1.type, g2.type].sort().join('+');
    const isLethal = (combo.includes("Botanical") && !combo.includes("Botanical+Botanical")) || (combo.includes("Human") && combo.includes("Botanical"));
    
    let ph = 7.0; let toxicity = 5.0;
    if (combo.includes("Human")) toxicity += 45.0;
    if (combo.includes("Botanical")) ph -= 2.8;
    if (g1.type !== g2.type) toxicity += 12.0;

    return {
      isLethal, canSave: !isLethal,
      color: isLethal ? "#FF6666" : (view === 'splicer' ? "#99EBFF" : "#EBBBFF"),
      splicerReport: {
        physical: `The specimen exhibits ${g1.feature} as the primary structure, reinforced by ${g2.trait} for systemic stability.`,
        alignment: isLethal ? "CRITICAL FAILURE: Cellular walls collapsed during fusion." : "SUCCESS: Genomic strands have successfully woven into a stable double-helix."
      },
      serumData: { ph: ph.toFixed(1), tox: `${toxicity.toFixed(1)}%`, steps: [
        `1. Distill ${g1.compound} Extract (40%)`,
        `2. Infuse ${g2.compound} Stabilizer (35%)`,
        `3. Apply Saline Buffer (20%)`,
        `4. Activate with Reactive Catalyst (5%)`
      ]}
    };
  };

  const res = getAnalysis(slotA, slotB);
  
  const archiveResult = () => {
    if (!hybridName) return alert("ENTER NAME");
    const newEntry = {
      ...slotA,
      id: `${view === 'splicer' ? 'HYB' : 'SRM'}-${Math.floor(Math.random() * 9000)}`,
      name: hybridName.toUpperCase(),
      isHybrid: true,
      color: res.color,
      reportData: res, // Store the specific report for downloading later
      mode: view
    };
    setInventory([newEntry, ...inventory]);
    setSlotA(null); setSlotB(null); setHybridName("");
  };

  const downloadReport = (item) => {
    let content = `LAB REPORT: ${item.name}\nID: ${item.id}\n--------------------------\n`;
    if (item.mode === 'splicer') {
      content += `TYPE: GENOMIC HYBRID\nPHYSICAL: ${item.reportData.splicerReport.physical}\nSTATUS: ${item.reportData.splicerReport.alignment}`;
    } else {
      content += `TYPE: SYNTHETIC SERUM\npH LEVEL: ${item.reportData.serumData.ph}\nTOXICITY: ${item.reportData.serumData.tox}\n\nSTEPS:\n${item.reportData.serumData.steps.join('\n')}`;
    }

    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${item.name}_Report.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div onMouseMove={(e) => setMousePos({ x: e.clientX + 20, y: e.clientY + 20 })} 
         style={{ display: 'flex', height: '100vh', backgroundColor: '#000', color: '#EEE', fontFamily: 'Arial, sans-serif', overflow: 'hidden', fontSize: '18px' }}>
      
      {/* TOOLTIP */}
      {hoveredGene && (
        <div style={{ position: 'fixed', left: mousePos.x, top: mousePos.y, zIndex: 100, background: '#111', border: `2px solid ${hoveredGene.color}`, padding: '15px', pointerEvents: 'none', borderRadius: '8px' }}>
          <b style={{ color: hoveredGene.color, fontSize: '20px' }}>{hoveredGene.name}</b>
          <p style={{ fontSize: '14px', margin: '5px 0' }}>{hoveredGene.feature}</p>
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{ width: '420px', borderRight: '2px solid #222', display: 'flex', flexDirection: 'column', background: '#080808' }}>
        <div style={{ padding: '20px' }}>
          <button onClick={() => {setView(view === 'splicer' ? 'serum' : 'splicer'); setSlotA(null); setSlotB(null);}} 
                  style={{ width: '100%', padding: '18px', background: view === 'serum' ? '#EBBBFF' : '#99EBFF', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px', fontSize: '18px' }}>
            {view === 'splicer' ? '🧪 GO TO SERUM LAB' : '🧬 GO TO SPLICER'}
          </button>
          <input type="text" placeholder="SEARCH SAMPLES..." onChange={(e) => setSearchTerm(e.target.value)} 
                 style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #444', color: '#FFF', fontSize: '16px' }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {inventory.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())).map(g => (
            <div key={g.id} onMouseEnter={() => setHoveredGene(g)} onMouseLeave={() => setHoveredGene(null)} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} 
                 style={{ padding: '15px', margin: '10px 0', background: '#151515', borderLeft: `5px solid ${g.color}`, cursor: 'grab', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: g.isHybrid ? '10px' : '0' }}>
                <span>{g.icon} {g.name}</span>
                {g.isHybrid && <span style={{fontSize: '10px', color: '#666'}}>{g.id}</span>}
              </div>
              {g.isHybrid && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => downloadReport(g)} style={{ flex: 1, background: '#222', border: 'none', color: '#99EBFF', cursor: 'pointer', fontSize: '12px', padding: '5px' }}>REPORT</button>
                  <button onClick={() => setInventory(inventory.filter(i => i.id !== g.id))} style={{ flex: 1, background: '#222', border: 'none', color: '#FF6666', cursor: 'pointer', fontSize: '12px', padding: '5px' }}>DELETE</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN LAB AREA */}
      <div style={{ flex: 1, padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: '42px', letterSpacing: '2px', marginBottom: '40px' }}>{view === 'splicer' ? 'GENOME RECOMBINATOR' : 'SERUM DISTILLERY'}</h1>
        
        <div style={{ display: 'flex', gap: '50px', margin: '20px 0' }}>
          {[slotA, slotB].map((slot, i) => (
            <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const d = JSON.parse(e.dataTransfer.getData("gene")); i === 0 ? setSlotA(d) : setSlotB(d); }}
              style={{ width: '220px', height: '280px', border: '3px dashed #444', background: '#050505', textAlign: 'center', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '15px' }}>
              {slot ? <> <div style={{ fontSize: '60px' }}>{slot.icon}</div> <b style={{fontSize: '18px', color: slot.color}}>{slot.name}</b> </> : <p style={{color: '#666'}}>DRAG SAMPLE</p>}
            </div>
          ))}
        </div>

        {res && (
          <div style={{ width: '100%', maxWidth: '900px', padding: '30px', border: `2px solid ${res.color}`, background: '#0A0A0A', marginTop: '30px', borderRadius: '12px' }}>
            <h2 style={{ color: res.color, marginTop: 0 }}>{res.isLethal ? 'ANALYSIS FAILED' : 'STABLE RESULT'}</h2>
            
            {view === 'splicer' ? (
              <div style={{ lineHeight: '1.6' }}>
                <p style={{ color: '#DDD', fontSize: '24px' }}>{res.splicerReport.physical}</p>
                <p style={{ color: res.color, fontSize: '18px', fontStyle: 'italic', marginTop: '10px' }}>{res.splicerReport.alignment}</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                <div>
                  <p style={{fontSize: '24px'}}>pH: <span style={{color: '#99EBFF'}}>{res.serumData.ph}</span></p>
                  <p style={{fontSize: '24px'}}>TOXICITY: <span style={{color: '#FF6666'}}>{res.serumData.tox}</span></p>
                </div>
                <div style={{background: '#000', padding: '20px', border: '1px solid #333', borderRadius: '8px' }}>
                  <p style={{color: '#EBBBFF', marginBottom: '10px', fontWeight: 'bold', fontSize: '20px'}}>PREPARATION STEPS:</p>
                  {res.serumData.steps.map((s, i) => <p key={i} style={{fontSize: '18px', margin: '8px 0'}}>{s}</p>)}
                </div>
              </div>
            )}

            {res.canSave && (
              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                <input placeholder="ENTER NEW NAME..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} 
                       style={{ background: '#000', color: '#FFF', border: '2px solid #444', padding: '15px', flex: 1, fontSize: '18px', borderRadius: '5px' }} />
                <button onClick={archiveResult} style={{ background: res.color, color: '#000', border: 'none', padding: '0 30px', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px', borderRadius: '5px' }}>SAVE RESULT</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
