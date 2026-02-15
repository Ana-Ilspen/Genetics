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
      Mammalian: ["Wolf", "Tiger", "Bear", "Elephant", "Rhino"],
      Avian: ["Falcon", "Owl", "Eagle", "Raven", "Vulture"],
      Botanical: ["Lotus", "Oak", "Fern", "Ivy", "Cactus"],
      Aquatic: ["Orca", "Shark", "Axolotl", "Kraken", "Manta"],
      Human: ["Sapiens", "Cybernetic", "Neural", "Augmented", "Oracle"],
      // NEW KINGDOM: Arachnid
      Arachnid: ["Black Widow", "Tarantula", "Orb Weaver", "Scorpion", "Jumping Spider", "Trapdoor Spider", "Recluse", "Wolf Spider", "Funnel Web", "Huntsman"]
    };

    const baseGenes = Array.from({ length: 600 }, (_, i) => {
      const keys = Object.keys(animals);
      const type = keys[i % 6];
      const animalList = animals[type];
      const animal = animalList[Math.floor((i / 6) % animalList.length)];
      const prefix = prefixes[Math.floor((i / 60) % prefixes.length)];
      
      const traitLibrary = {
        Mammalian: { feat: "Dense Muscular Fibers", trait: "Adrenaline Response", comp: "Mammal-Beta", ph: 7.2, tox: 12 },
        Avian: { feat: "Hollow Bone Architecture", trait: "Enhanced Optics", comp: "Avian-C", ph: 7.5, tox: 8 },
        Botanical: { feat: "Chlorophyll Dermal Layer", trait: "Cellular Regen", comp: "Phyto-K", ph: 5.2, tox: 15 },
        Aquatic: { feat: "Gilled Filtration", trait: "Pressure Resistance", comp: "Aqua-Lipid", ph: 8.1, tox: 10 },
        // Expanded Arachnid Library
        Arachnid: { feat: "Chitinous Exoskeleton", trait: "Tensile Silk Production", comp: "Venom-X", ph: 6.8, tox: 55 },
        // Human Sub-Types
        Human_Sapiens: { feat: "Advanced Frontal Lobe", trait: "Fine Motor Control", comp: "Cerebro-V", ph: 7.4, tox: 35 },
        Human_Cybernetic: { feat: "Sub-Dermal Neural Mesh", trait: "Digital Interfacing", comp: "Nano-Logic", ph: 7.0, tox: 45 },
        Human_Oracle: { feat: "Pre-Cognitive Synapse", trait: "Hyper-Focus State", comp: "Psionic-X", ph: 7.6, tox: 50 }
      };

      let traitKey = type;
      if (type === "Human") {
        const humanType = animal;
        traitKey = traitLibrary[`Human_${humanType}`] ? `Human_${humanType}` : "Human_Sapiens";
      }

      const activeTrait = traitLibrary[traitKey] || traitLibrary[type];

      return {
        id: `G-${String(i + 1).padStart(3, '0')}`,
        name: `${prefix} ${animal}`,
        type,
        trait: activeTrait.trait,
        feature: activeTrait.feat,
        icon: { Mammalian: "🐺", Avian: "🦅", Botanical: "🌿", Aquatic: "🦈", Human: "👤", Arachnid: "🕷️" }[type],
        color: { Mammalian: "#FFD699", Avian: "#99EBFF", Botanical: "#A3FFD6", Aquatic: "#99B2FF", Human: "#FFFFFF", Arachnid: "#E066FF" }[type],
        compound: activeTrait.comp,
        basePh: activeTrait.ph,
        baseTox: activeTrait.tox,
        isHybrid: false
      };
    });
    setInventory(baseGenes);
  }, []);

  const getAnalysis = (g1, g2) => {
    if (!g1 || !g2) return null;
    const combo = [g1.type, g2.type].sort().join('+');
    
    // Updated Lethal Logic
    const isLethal = (combo.includes("Botanical") && !combo.includes("Botanical") && !combo.includes("Arachnid")) || 
                     (combo.includes("Human") && combo.includes("Botanical")) ||
                     (combo.includes("Arachnid") && combo.includes("Avian")); // New: Birds vs Spiders

    const failReason = combo.includes("Arachnid+Avian") 
        ? "Enzymatic Conflict: Avian stomach acids dissolve arachnid silk-glands instantly." 
        : combo.includes("Human+Botanical") 
        ? "Cytotoxic Shock: Human neural tissue rejected botanical alkaloids."
        : "Molecular Incompatibility: Structure failed to stabilize.";

    const avgPh = ((g1.basePh + g2.basePh) / 2).toFixed(1);
    let finalTox = (g1.baseTox + g2.baseTox);
    if (g1.type !== g2.type) finalTox += 25;

    return {
      isLethal, canSave: !isLethal,
      color: isLethal ? "#FF6666" : (view === 'splicer' ? "#99EBFF" : "#EBBBFF"),
      splicerReport: {
        physical: `Primary: ${g1.feature} (${g1.name})`,
        secondary: `Secondary: ${g2.trait} (${g2.name})`,
        alignment: isLethal ? `CRITICAL FAILURE: ${failReason}` : "SUCCESS: Genetic stability achieved."
      },
      serumData: { ph: avgPh, tox: `${finalTox}%`, failReason, steps: [
        `1. Centrifuge ${g1.compound} from ${g1.name}`,
        `2. Titrate ${g2.compound} from ${g2.name}`,
        `3. Apply pH Stabilizer`,
        `4. Finalize molecular bond`
      ]}
    };
  };

  const res = getAnalysis(slotA, slotB);
  const clear = () => { setSlotA(null); setSlotB(null); setHybridName(""); };

  const archiveResult = () => {
    if (!hybridName) return alert("ENTER NAME");
    const newEntry = { ...slotA, id: `HYB-${Math.floor(Math.random() * 9000)}`, name: hybridName.toUpperCase(), isHybrid: true, color: res.color, reportData: res, mode: view };
    setInventory([newEntry, ...inventory]);
    setSearchTerm(""); 
    clear();
  };

  const downloadReport = (item) => {
    let content = `LAB REPORT: ${item.name}\n--------------------------\n`;
    content += item.mode === 'splicer' ? `PHYSICAL: ${item.reportData.splicerReport.physical}` : `pH: ${item.reportData.serumData.ph} | TOX: ${item.reportData.serumData.tox}`;
    const element = document.createElement("a");
    element.href = URL.createObjectURL(new Blob([content], {type: 'text/plain'}));
    element.download = `${item.name}_Profile.txt`;
    element.click();
  };

  return (
    <div onMouseMove={(e) => setMousePos({ x: e.clientX + 20, y: e.clientY + 20 })} 
         style={{ display: 'flex', height: '100vh', backgroundColor: '#000', color: '#EEE', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      
      {/* HOVER TOOLTIP */}
      {hoveredGene && (
        <div style={{ position: 'fixed', left: mousePos.x, top: mousePos.y, zIndex: 100, background: '#111', border: `2px solid ${hoveredGene.color}`, padding: '15px', borderRadius: '8px', pointerEvents: 'none' }}>
          <b style={{ color: hoveredGene.color }}>{hoveredGene.name}</b>
          <p style={{ fontSize: '13px', margin: '5px 0' }}>FEATURE: {hoveredGene.feature}</p>
          <p style={{ fontSize: '12px', color: '#888' }}>TRAIT: {hoveredGene.trait}</p>
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{ width: '380px', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', background: '#080808' }}>
        <div style={{ padding: '20px' }}>
          <button onClick={() => {setView(view === 'splicer' ? 'serum' : 'splicer'); clear();}} 
                  style={{ width: '100%', padding: '14px', background: view === 'serum' ? '#EBBBFF' : '#99EBFF', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
            {view === 'splicer' ? '🧪 GO TO SERUM LAB' : '🧬 GO TO SPLICER'}
          </button>
          <input type="text" placeholder="SEARCH SAMPLES (Try 'Arachnid')..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                 style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#FFF' }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {inventory.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.type.toLowerCase().includes(searchTerm.toLowerCase())).map(g => (
            <div key={g.id} onMouseEnter={() => setHoveredGene(g)} onMouseLeave={() => setHoveredGene(null)} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} 
                 style={{ padding: '12px', margin: '8px 0', background: '#111', borderLeft: `5px solid ${g.color}`, cursor: 'grab', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{g.icon} {g.name}</span>
                {g.isHybrid && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => downloadReport(g)} style={{ color: '#99EBFF', background: 'none', border: 'none', cursor: 'pointer' }}>DOC</button>
                    <button onClick={() => setInventory(inventory.filter(i => i.id !== g.id))} style={{ color: '#FF6666', background: 'none', border: 'none', cursor: 'pointer' }}>X</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN LAB AREA */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '30px' }}>{view === 'splicer' ? 'GENOME RECOMBINATOR' : 'SERUM DISTILLERY'}</h1>
        
        <div style={{ display: 'flex', gap: '40px', marginBottom: '30px' }}>
          {[slotA, slotB].map((slot, i) => (
            <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const d = JSON.parse(e.dataTransfer.getData("gene")); i === 0 ? setSlotA(d) : setSlotB(d); }}
              style={{ width: '180px', height: '240px', border: '2px dashed #444', background: '#050505', textAlign: 'center', padding: '20px', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {slot ? <> <div style={{ fontSize: '50px' }}>{slot.icon}</div> <b style={{color: slot.color}}>{slot.name}</b> </> : <p style={{color: '#444'}}>DRAG SAMPLE</p>}
            </div>
          ))}
        </div>

        {res && (
          <div style={{ width: '100%', maxWidth: '800px', padding: '30px', border: `2px solid ${res.color}`, background: '#0A0A0A', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ color: res.color, margin: 0 }}>{res.isLethal ? 'ANALYSIS FAILED' : 'STABLE RESULT'}</h2>
              <button onClick={clear} style={{ background: '#333', color: '#FFF', border: 'none', padding: '8px 20px', cursor: 'pointer', borderRadius: '5px' }}>RESET LAB</button>
            </div>
            
            <div style={{ fontSize: '18px' }}>
              {view === 'splicer' ? (
                <>
                  <p>🧬 {res.splicerReport.physical}</p>
                  <p>🧬 {res.splicerReport.secondary}</p>
                </>
              ) : (
                <>
                  {res.isLethal ? (
                     <p style={{ color: '#FF6666' }}>{res.serumData.failReason}</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                      <div>
                        <p style={{fontSize: '22px'}}>pH: <span style={{color: '#99EBFF'}}>{res.serumData.ph}</span></p>
                        <p style={{fontSize: '22px'}}>TOX: <span style={{color: '#FF6666'}}>{res.serumData.tox}</span></p>
                      </div>
                      <div style={{background: '#000', padding: '20px', border: '1px solid #333'}}>
                        {res.serumData.steps.map((s, i) => <p key={i} style={{fontSize: '14px', margin: '10px 0'}}>{s}</p>)}
                      </div>
                    </div>
                  )}
                </>
              )}
              <p style={{ color: res.color, fontWeight: 'bold', marginTop: '10px' }}>{view === 'splicer' ? res.splicerReport.alignment : ""}</p>
            </div>

            {res.canSave && (
              <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                <input placeholder="ENTER NAME..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} 
                       style={{ background: '#000', color: '#FFF', border: '1px solid #444', padding: '15px', flex: 1 }} />
                <button onClick={archiveResult} style={{ background: res.color, color: '#000', border: 'none', padding: '0 25px', fontWeight: 'bold', cursor: 'pointer' }}>SAVE RESULT</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
