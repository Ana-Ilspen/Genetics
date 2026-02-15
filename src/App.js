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
      return {
        id: `GENE-${String(i + 1).padStart(3, '0')}`,
        name: `Alpha ${type}`,
        type,
        trait: "Standard Sequence",
        icon: icons[i % 5],
        color: ["#ffaa00", "#00d4ff", "#00ff88", "#3366ff", "#ffffff"][i % 5],
        compound: `${type}-X`,
        feature: "Base Strain",
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
      color: isLethal ? "#ff3333" : (view === 'splicer' ? "#00d4ff" : "#bb00ff"),
      splicerData: { dominant: g1, recessive: g2, reason: isLethal ? "INCOMPATIBLE" : "STABLE HYBRID" },
      serumData: { ph: ph.toFixed(1), tox: `${toxicity.toFixed(1)}%`, steps: [
        `1. Distill ${g1.compound} Extract (40%)`,
        `2. Infuse ${g2.compound} Stabilizer (35%)`,
        `3. Apply Saline Buffer Diluent (20%)`,
        `4. Activate with Reactive Catalyst (5%)`
      ]}
    };
  };

  const res = getAnalysis(slotA, slotB);
  const clear = () => { setSlotA(null); setSlotB(null); setHybridName(""); };

  const archiveResult = () => {
    if (!hybridName) return alert("ENTER NOMENCLATURE.");
    const newEntry = {
      ...slotA,
      id: `${view === 'splicer' ? 'HYB' : 'SRM'}-${Math.floor(Math.random() * 9000)}`,
      name: hybridName.toUpperCase(),
      isHybrid: true,
      color: res.color,
      scienceData: res
    };
    setInventory([newEntry, ...inventory]);
    clear();
  };

  const deleteItem = (id) => setInventory(inventory.filter(item => item.id !== id));
  
  const downloadData = (item) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(item, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${item.name}_report.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div onMouseMove={(e) => setMousePos({ x: e.clientX + 15, y: e.clientY + 15 })} style={{ display: 'flex', height: '100vh', backgroundColor: '#050505', color: '#ccc', fontFamily: 'monospace', overflow: 'hidden' }}>
      
      {/* TOOLTIP */}
      {hoveredGene && (
        <div style={{ position: 'fixed', left: mousePos.x, top: mousePos.y, zIndex: 100, background: '#111', border: `1px solid ${hoveredGene.color}`, padding: '10px', pointerEvents: 'none' }}>
          <p style={{ color: hoveredGene.color, margin: 0 }}>{hoveredGene.name}</p>
          <p style={{ fontSize: '10px' }}>TYPE: {hoveredGene.type} | {hoveredGene.isHybrid ? 'HYBRID' : 'PURE'}</p>
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{ width: '320px', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', background: '#0a0a0a' }}>
        <div style={{ padding: '15px' }}>
          <button onClick={() => {setView(view === 'splicer' ? 'serum' : 'splicer'); clear();}} style={{ width: '100%', padding: '12px', background: view === 'serum' ? '#bb00ff' : '#00d4ff', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
            {view === 'splicer' ? '🧪 GOTO: SERUM LAB' : '🧬 GOTO: SPLICER'}
          </button>
          <input type="text" placeholder="SEARCH SAMPLES..." onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '8px', background: '#000', border: '1px solid #333', color: '#00d4ff', fontSize: '11px' }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 15px' }}>
          {inventory.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())).map(g => (
            <div key={g.id} onMouseEnter={() => setHoveredGene(g)} onMouseLeave={() => setHoveredGene(null)} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} 
                 style={{ padding: '8px', margin: '4px 0', background: '#111', borderLeft: `3px solid ${g.color}`, cursor: 'grab', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{g.icon} {g.name}</span>
              {g.isHybrid && (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => downloadData(g)} style={{ background: 'none', border: 'none', color: '#00ff88', cursor: 'pointer' }}>↓</button>
                  <button onClick={() => deleteItem(g.id)} style={{ background: 'none', border: 'none', color: '#ff3333', cursor: 'pointer' }}>×</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* WORKSPACE */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1>{view === 'splicer' ? '🧬 GENOME_RECOMBINATOR' : '🧪 SERUM_DISTILLERY'}</h1>
        
        <div style={{ display: 'flex', gap: '30px', margin: '30px 0' }}>
          {[slotA, slotB].map((slot, i) => (
            <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const d = JSON.parse(e.dataTransfer.getData("gene")); i === 0 ? setSlotA(d) : setSlotB(d); }}
              style={{ width: '140px', height: '180px', border: '2px solid #333', background: '#0e0e0e', textAlign: 'center', padding: '15px', position: 'relative' }}>
              {slot ? <> <div style={{ fontSize: '30px' }}>{slot.icon}</div> <p style={{fontSize: '10px'}}>{slot.name}</p> </> : <p style={{marginTop: '40%'}}>DRAG_HERE</p>}
            </div>
          ))}
        </div>

        {res && (
          <div style={{ width: '100%', maxWidth: '700px', padding: '20px', border: `1px solid ${res.color}`, background: '#0d0d0f' }}>
            <h3 style={{ color: res.color }}>{res.isLethal ? 'ANALYSIS_FAILED' : 'STABLE_RESULT'}</h3>
            
            {view === 'splicer' ? (
              <p style={{fontSize: '12px'}}>Inheriting <strong>{res.splicerData.dominant.feature}</strong> from {res.splicerData.dominant.name} and <strong>{res.splicerData.recessive.trait}</strong> from {res.splicerData.recessive.name}.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }}>
                <div>
                  <p style={{fontSize: '10px'}}>pH: {res.serumData.ph}</p>
                  <p style={{fontSize: '10px'}}>TOX: {res.serumData.tox}</p>
                </div>
                <div style={{background: '#000', padding: '10px', border: '1px solid #222'}}>
                  <p style={{color: '#bb00ff', fontSize: '10px'}}>PREPARATION_STEPS:</p>
                  {res.serumData.steps.map((s, i) => <p key={i} style={{fontSize: '10px', margin: '2px 0'}}>{s}</p>)}
                </div>
              </div>
            )}

            {res.canSave && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <input placeholder="NOMENCLATURE..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} style={{ background: '#000', color: '#fff', border: '1px solid #444', padding: '8px', flex: 1 }} />
                <button onClick={archiveResult} style={{ background: res.color, color: '#000', border: 'none', padding: '8px 15px', fontWeight: 'bold', cursor: 'pointer' }}>SAVE_RESULT</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
