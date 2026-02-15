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
    const bioData = {
      Mammalian: {
        Wolf: { feat: "Neural Pack-Link", trait: "Night-Vision", comp: "Lup-G", ph: 7.2, tox: 12 },
        Tiger: { feat: "Thermal Claws", trait: "Ambush Reflex", comp: "Fel-X", ph: 7.1, tox: 18 },
        Bear: { feat: "Hibernation Reserve", trait: "Crushing Force", comp: "Urs-B", ph: 7.3, tox: 15 },
        Elephant: { feat: "Infrasonic Pulse", trait: "Trunk Dexterity", comp: "Pach-A", ph: 7.4, tox: 8 }
      },
      Avian: {
        Falcon: { feat: "Nictitating Membrane", trait: "Dive-Speed", comp: "Fal-9", ph: 7.5, tox: 10 },
        Owl: { feat: "Silent Feathers", trait: "270° Rotation", comp: "Stri-Z", ph: 7.4, tox: 12 },
        Eagle: { feat: "Retinal Zoom", trait: "High-Alt Lungs", comp: "Acci-K", ph: 7.6, tox: 11 }
      },
      Botanical: {
        Lotus: { feat: "Hydrophobic Layer", trait: "Nutrient Siphon", comp: "Nym-L", ph: 5.5, tox: 5 },
        Cactus: { feat: "Water Storage", trait: "Needle Defense", comp: "Cac-S", ph: 4.8, tox: 22 },
        VenusFlytrap: { feat: "Snap-Closure Hairs", trait: "Enzymatic Trap", comp: "Dio-F", ph: 4.2, tox: 35 }
      },
      Aquatic: {
        Shark: { feat: "Electro-Receptors", trait: "Cartilage Growth", comp: "Sel-8", ph: 8.2, tox: 14 },
        Axolotl: { feat: "Blastema Regen", trait: "Neotenic State", comp: "Amb-Q", ph: 7.9, tox: 5 },
        Eel: { feat: "Electric Organ", trait: "Mucus Defense", comp: "Ang-E", ph: 8.0, tox: 28 }
      },
      Arachnid: {
        BlackWidow: { feat: "Neurotoxin Gland", trait: "Silk Reservoir", comp: "Lat-W", ph: 6.5, tox: 75 },
        Scorpion: { feat: "Segmented Stinger", trait: "UV Exoskeleton", comp: "Sco-V", ph: 6.2, tox: 68 },
        JumpingSpider: { feat: "Hydraulic Legs", trait: "360° Vision", comp: "Sal-J", ph: 6.7, tox: 45 }
      },
      Human: {
        Cybernetic: { feat: "Titanium Graft", trait: "HUD Overlay", comp: "Cyb-1", ph: 7.0, tox: 40 },
        Oracle: { feat: "Temporal Synapse", trait: "Theta Waves", comp: "Psi-9", ph: 7.6, tox: 55 },
        Sapiens: { feat: "Logic Engine", trait: "Tool Use", comp: "Hom-S", ph: 7.4, tox: 25 }
      }
    };

    const baseGenes = Array.from({ length: 600 }, (_, i) => {
      const types = Object.keys(bioData);
      const type = types[i % 6];
      const speciesKeys = Object.keys(bioData[type]);
      const animal = speciesKeys[Math.floor((i / 6) % speciesKeys.length)];
      const info = bioData[type][animal];
      return {
        id: `G-${i}`, name: `${prefixes[i % 10]} ${animal}`, type,
        ...info, color: { Mammalian: "#FFD699", Avian: "#99EBFF", Botanical: "#A3FFD6", Aquatic: "#99B2FF", Human: "#FFFFFF", Arachnid: "#E066FF" }[type],
        icon: { Mammalian: "🐺", Avian: "🦅", Botanical: "🌿", Aquatic: "🦈", Human: "👤", Arachnid: "🕷️" }[type]
      };
    });
    setInventory(baseGenes);
  }, []);

  const getAnalysis = (g1, g2) => {
    if (!g1 || !g2) return null;
    const combo = [g1.type, g2.type].sort().join('+');
    
    // GENETIC STABILITY CALCULATION
    let stability = (g1.type === g2.type) ? 98 : 70;
    if (combo.includes("Human") || combo.includes("Arachnid")) stability -= 25;
    if (combo.includes("Botanical") && !combo.includes("Botanical+Botanical")) stability -= 35;

    const tox = (g1.baseTox + g2.baseTox + (g1.type === g2.type ? 0 : 20));
    const isLethal = stability < 45 || tox > 130;

    return {
      isLethal, stability, toxicity: `${tox}%`, ph: ((g1.basePh + g2.basePh) / 2).toFixed(1),
      color: isLethal ? "#FF6666" : (view === 'splicer' ? "#99EBFF" : "#EBBBFF"),
      report: {
        physical: `Primary Bio-Structure: ${g1.feature} (Source: ${g1.name})`,
        secondary: `Secondary Ability: ${g2.trait} (Source: ${g2.name})`,
        reasoning: isLethal 
          ? `Lethal Failure: DNA strands from ${g1.type} and ${g2.type} collapsed due to ${stability < 45 ? 'Stability Collapse' : 'Toxicity Shock'}.`
          : `Stability Success: Recombined ${g1.compound} and ${g2.compound} using ${stability}% genomic alignment.`
      },
      serumSteps: [
        `1. Distill ${g1.compound} from ${g1.name}`,
        `2. Introduce ${g2.compound} from ${g2.name}`,
        `3. Buffer solution to pH ${((g1.basePh + g2.basePh) / 2).toFixed(1)}`,
        `4. Synthesize final ${view === 'splicer' ? 'Hybrid' : 'Serum'}`
      ]
    };
  };

  const res = getAnalysis(slotA, slotB);

  const archiveResult = () => {
    if (!hybridName) return alert("NAME REQUIRED");
    const newEntry = { ...slotA, id: Date.now(), name: hybridName.toUpperCase(), isHybrid: true, color: res.color, reportData: res, mode: view };
    setInventory([newEntry, ...inventory]);
    setSlotA(null); setSlotB(null); setHybridName(""); setSearchTerm("");
  };

  return (
    <div onMouseMove={(e) => setMousePos({ x: e.clientX + 20, y: e.clientY + 20 })} 
         style={{ display: 'flex', height: '100vh', backgroundColor: '#000', color: '#EEE', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      
      {/* HOVER TOOLTIP */}
      {hoveredGene && (
        <div style={{ position: 'fixed', left: mousePos.x, top: mousePos.y, zIndex: 100, background: '#111', border: `2px solid ${hoveredGene.color}`, padding: '15px', borderRadius: '8px', pointerEvents: 'none' }}>
          <b style={{ color: hoveredGene.color, fontSize: '18px' }}>{hoveredGene.name}</b>
          <p style={{ margin: '5px 0' }}>STRUCT: {hoveredGene.feature}</p>
          <p style={{ color: '#888' }}>TRAIT: {hoveredGene.trait}</p>
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{ width: '380px', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', background: '#080808' }}>
        <div style={{ padding: '20px' }}>
          <button onClick={() => {setView(view === 'splicer' ? 'serum' : 'splicer'); setSlotA(null); setSlotB(null);}} 
                  style={{ width: '100%', padding: '14px', background: view === 'serum' ? '#EBBBFF' : '#99EBFF', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px', fontSize: '16px' }}>
            {view === 'splicer' ? '🧪 GO TO SERUM LAB' : '🧬 GO TO SPLICER'}
          </button>
          <input type="text" placeholder="FILTER 600+ SAMPLES..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                 style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#FFF' }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {inventory.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.type.toLowerCase().includes(searchTerm.toLowerCase())).map(g => (
            <div key={g.id} onMouseEnter={() => setHoveredGene(g)} onMouseLeave={() => setHoveredGene(null)} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} 
                 style={{ padding: '12px', margin: '8px 0', background: '#111', borderLeft: `5px solid ${g.color}`, cursor: 'grab', display: 'flex', justifyContent: 'space-between' }}>
              <span>{g.icon} {g.name}</span>
              {g.isHybrid && <button onClick={() => {
                const blob = new Blob([`REPORT: ${g.name}\n${g.reportData.report.physical}`], {type: 'text/plain'});
                const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${g.name}.txt`; link.click();
              }} style={{ color: '#99EBFF', background: 'none', border: 'none', cursor: 'pointer' }}>DOC</button>}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN LAB */}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
              <h2 style={{ color: res.color, margin: 0 }}>{res.isLethal ? 'ANALYSIS FAILED' : 'STABLE RESULT'}</h2>
              <button onClick={() => {setSlotA(null); setSlotB(null);}} style={{ background: '#333', color: '#FFF', border: 'none', padding: '8px 20px', cursor: 'pointer', borderRadius: '5px' }}>RESET LAB</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', background: '#000', padding: '15px', border: '1px solid #222' }}>
              <div>STABILITY: <span style={{color: res.stability < 50 ? '#ff4444' : '#00ff00'}}>{res.stability}%</span></div>
              <div>TOXICITY: <span style={{color: '#ff4444'}}>{res.toxicity}</span></div>
              <div>PH LEVEL: <span style={{color: '#99EBFF'}}>{res.ph}</span></div>
              <div>RECOMBINATION: {res.isLethal ? 'FAILED' : 'ACTIVE'}</div>
            </div>

            <div style={{ fontSize: '18px', lineHeight: '1.6' }}>
              <p>🧬 {res.report.physical}</p>
              <p>🧬 {res.report.secondary}</p>
              <p style={{ color: res.color, fontWeight: 'bold' }}>{res.report.reasoning}</p>
            </div>

            {!res.isLethal && (
              <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                <input placeholder="ENTER NOMENCLATURE..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} 
                       style={{ background: '#000', color: '#FFF', border: '1px solid #444', padding: '15px', flex: 1, fontSize: '16px' }} />
                <button onClick={archiveResult} style={{ background: res.color, color: '#000', border: 'none', padding: '0 25px', fontWeight: 'bold', cursor: 'pointer' }}>SAVE TO ARCHIVE</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
