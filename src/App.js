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
    const prefixes = ["Neon", "Primal", "Void", "Solar", "Cryo", "Toxic", "Apex", "Shadow", "Alpha", "Nano"];
    const animals = {
      Mammalian: ["Wolf", "Tiger", "Bear", "Elephant", "Rhino", "Bat", "Panther", "Ape", "Bison", "Hyena"],
      Avian: ["Falcon", "Owl", "Eagle", "Raven", "Vulture", "Phoenix", "Hawk", "Swift", "Heron", "Condor"],
      Botanical: ["Lotus", "Oak", "Fern", "Ivy", "Cactus", "Brier", "Willow", "Redwood", "Moss", "Orchid"],
      Aquatic: ["Orca", "Shark", "Axolotl", "Kraken", "Manta", "Eel", "Hydra", "Dolphin", "Ray", "Urchin"],
      Human: ["Sapiens", "Cybernetic", "Neural", "Augmented", "Prime", "Ancient", "Nomad", "Oracle", "Elite", "Origin"]
    };

    const baseGenes = Array.from({ length: 500 }, (_, i) => {
      const keys = Object.keys(animals);
      const type = keys[i % 5];
      const animalList = animals[type];
      const animal = animalList[Math.floor((i / 5) % animalList.length)];
      const prefix = prefixes[Math.floor((i / 50) % prefixes.length)];
      
      const colors = { Mammalian: "#FFD699", Avian: "#99EBFF", Botanical: "#A3FFD6", Aquatic: "#99B2FF", Human: "#FFFFFF" };
      const traits = {
        Mammalian: { feat: "Dense Muscular Fibers", trait: "Adrenaline Response", comp: "Mammal-Beta" },
        Avian: { feat: "Hollow Bone Architecture", trait: "Enhanced Optics", comp: "Avian-C" },
        Botanical: { feat: "Chlorophyll Dermal Layer", trait: "Cellular Regen", comp: "Phyto-K" },
        Aquatic: { feat: "Gilled Filtration", trait: "Pressure Resistance", comp: "Aqua-Lipid" },
        Human: { feat: "Neural Cortex", trait: "Motor Control", comp: "Cerebro-V" }
      };

      return {
        id: `G-${String(i + 1).padStart(3, '0')}`,
        name: `${prefix} ${animal}`,
        type,
        trait: traits[type].trait,
        feature: traits[type].feat,
        icon: { Mammalian: "🐺", Avian: "🦅", Botanical: "🌿", Aquatic: "🦈", Human: "👤" }[type],
        color: colors[type],
        compound: traits[type].comp,
        isHybrid: false
      };
    });
    setInventory(baseGenes);
  }, []);

  // ADVANCED FILTER: Search Name OR Species Type
  const filteredInventory = inventory.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        physical: `Primary Structure: ${g1.feature} (Source: ${g1.name})`,
        secondary: `Secondary Trait: ${g2.trait} (Source: ${g2.name})`,
        alignment: isLethal ? "CRITICAL FAILURE: Kingdom cross-contamination." : "SUCCESS: Recombination complete."
      },
      serumData: { ph: ph.toFixed(1), tox: `${toxicity.toFixed(1)}%`, steps: [
        `Step 1: Extract ${g1.compound} isolate from ${g1.name} (40% volume)`,
        `Step 2: Infuse ${g2.compound} catalytic agent from ${g2.name} (35% volume)`,
        `Step 3: Stabilize with 20% Saline Buffer solution`,
        `Step 4: Introduce Reactive Catalyst to bond molecules (5% volume)`
      ]}
    };
  };

  const res = getAnalysis(slotA, slotB);
  const clear = () => { setSlotA(null); setSlotB(null); setHybridName(""); };

  const archiveResult = () => {
    if (!hybridName) return alert("ENTER NAME");
    const newEntry = {
      ...slotA,
      id: `${view === 'splicer' ? 'HYB' : 'SRM'}-${Math.floor(Math.random() * 9000)}`,
      name: hybridName.toUpperCase(),
      isHybrid: true,
      color: res.color,
      reportData: res,
      mode: view
    };
    setInventory([newEntry, ...inventory]);
    clear();
  };

  return (
    <div onMouseMove={(e) => setMousePos({ x: e.clientX + 20, y: e.clientY + 20 })} 
         style={{ display: 'flex', height: '100vh', backgroundColor: '#000', color: '#EEE', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      
      {/* RESTORED HOVER DESCRIPTIONS */}
      {hoveredGene && (
        <div style={{ position: 'fixed', left: mousePos.x, top: mousePos.y, zIndex: 100, background: '#111', border: `2px solid ${hoveredGene.color}`, padding: '15px', borderRadius: '8px', pointerEvents: 'none', boxShadow: '0 0 15px rgba(0,0,0,0.8)' }}>
          <b style={{ color: hoveredGene.color, fontSize: '18px' }}>{hoveredGene.name}</b>
          <p style={{ fontSize: '14px', margin: '5px 0' }}>FEATURE: {hoveredGene.feature}</p>
          <p style={{ fontSize: '14px', margin: '0', color: '#888' }}>TRAIT: {hoveredGene.trait}</p>
        </div>
      )}

      {/* SIDEBAR WITH SPECIES FILTERING */}
      <div style={{ width: '380px', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', background: '#080808' }}>
        <div style={{ padding: '20px' }}>
          <button onClick={() => {setView(view === 'splicer' ? 'serum' : 'splicer'); clear();}} 
                  style={{ width: '100%', padding: '14px', background: view === 'serum' ? '#EBBBFF' : '#99EBFF', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px', fontSize: '16px' }}>
            {view === 'splicer' ? '🧪 GO TO SERUM LAB' : '🧬 GO TO SPLICER'}
          </button>
          <input type="text" placeholder="SEARCH SAMPLES OR SPECIES..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                 style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#FFF', fontSize: '14px' }} />
          <div style={{ fontSize: '10px', color: '#555', marginTop: '5px' }}>TIP: Type "Aquatic" or "Mammalian" to filter by type.</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {filteredInventory.map(g => (
            <div key={g.id} onMouseEnter={() => setHoveredGene(g)} onMouseLeave={() => setHoveredGene(null)} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} 
                 style={{ padding: '12px', margin: '8px 0', background: '#111', borderLeft: `5px solid ${g.color}`, cursor: 'grab', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{g.icon} {g.name}</span>
              {g.isHybrid && <button onClick={() => setInventory(inventory.filter(i => i.id !== g.id))} style={{ color: '#FF6666', background: 'none', border: 'none', cursor: 'pointer' }}>X</button>}
            </div>
          ))}
        </div>
      </div>

      {/* WORKSPACE AREA */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '30px' }}>{view === 'splicer' ? 'GENOME RECOMBINATOR' : 'SERUM DISTILLERY'}</h1>
        
        <div style={{ display: 'flex', gap: '40px', marginBottom: '30px' }}>
          {[slotA, slotB].map((slot, i) => (
            <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const d = JSON.parse(e.dataTransfer.getData("gene")); i === 0 ? setSlotA(d) : setSlotB(d); }}
              style={{ width: '180px', height: '240px', border: '2px dashed #444', background: '#050505', textAlign: 'center', padding: '20px', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {slot ? <> <div style={{ fontSize: '50px' }}>{slot.icon}</div> <b style={{color: slot.color, fontSize: '16px'}}>{slot.name}</b> </> : <p style={{color: '#444'}}>DRAG SAMPLE</p>}
            </div>
          ))}
        </div>

        {res && (
          <div style={{ width: '100%', maxWidth: '800px', padding: '30px', border: `2px solid ${res.color}`, background: '#0A0A0A', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
              <h2 style={{ color: res.color, margin: 0 }}>{res.isLethal ? 'ANALYSIS FAILED' : 'STABLE RESULT'}</h2>
              <button onClick={clear} style={{ background: '#333', color: '#FFF', border: 'none', padding: '8px 20px', cursor: 'pointer', borderRadius: '5px' }}>RESET LAB</button>
            </div>
            
            {view === 'splicer' ? (
              <div style={{ fontSize: '18px', lineHeight: '1.6' }}>
                <p>🧬 {res.splicerReport.physical}</p>
                <p>🧬 {res.splicerReport.secondary}</p>
                <p style={{ color: res.color, fontWeight: 'bold', marginTop: '10px' }}>{res.splicerReport.alignment}</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                <div>
                  <p style={{fontSize: '22px'}}>pH: <span style={{color: '#99EBFF'}}>{res.serumData.ph}</span></p>
                  <p style={{fontSize: '22px'}}>TOX: <span style={{color: '#FF6666'}}>{res.serumData.tox}</span></p>
                </div>
                <div style={{background: '#000', padding: '20px', border: '1px solid #333', borderRadius: '8px'}}>
                  <b style={{color: '#EBBBFF', fontSize: '18px'}}>SYNTHESIS STEPS:</b>
                  {res.serumData.steps.map((s, i) => <p key={i} style={{fontSize: '14px', margin: '10px 0'}}>{s}</p>)}
                </div>
              </div>
            )}

            {res.canSave && (
              <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                <input placeholder="ENTER NOMENCLATURE..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} 
                       style={{ background: '#000', color: '#FFF', border: '1px solid #444', padding: '15px', flex: 1, fontSize: '16px' }} />
                <button onClick={archiveResult} style={{ background: res.color, color: '#000', border: 'none', padding: '0 25px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>SAVE TO ARCHIVE</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
