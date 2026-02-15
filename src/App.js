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
    const sameKingdom = g1.type === g2.type;
    const stability = sameKingdom ? 98 : (g1.type === 'Human' || g1.type === 'Arachnid' ? 45 : 72);
    const toxicity = g1.baseTox + g2.baseTox + (sameKingdom ? 0 : 25);
    const ph = ((g1.basePh + g2.basePh) / 2).toFixed(2);
    const isLethal = stability < 50 || toxicity > 120 || (g1.type === 'Human' && g2.type === 'Botanical');

    return {
      isLethal, stability, toxicity, ph,
      color: isLethal ? "#FF4444" : (view === 'splicer' ? "#99EBFF" : "#EBBBFF"),
      report: {
        phys: `${g1.feature} integrated with ${g2.trait}.`,
        chem: `Base: ${g1.compound} + ${g2.compound} | Buffer: Saline`
      }
    };
  };

  const res = getAnalysis(slotA, slotB);

  const save = () => {
    if (!hybridName) return;
    const entry = { ...slotA, name: hybridName.toUpperCase(), isHybrid: true, reportData: res, mode: view, id: Date.now() };
    setInventory([entry, ...inventory]);
    setSlotA(null); setSlotB(null); setHybridName("");
  };

  return (
    <div onMouseMove={(e) => setMousePos({ x: e.clientX + 15, y: e.clientY + 15 })} style={{ display: 'flex', height: '100vh', background: '#000', color: '#eee', fontFamily: 'monospace' }}>
      
      {/* TOOLTIP */}
      {hoveredGene && (
        <div style={{ position: 'fixed', left: mousePos.x, top: mousePos.y, zIndex: 100, background: '#111', border: `1px solid ${hoveredGene.color}`, padding: '10px', pointerEvents: 'none' }}>
          <div style={{ color: hoveredGene.color, fontWeight: 'bold' }}>{hoveredGene.name}</div>
          <div>STRUCT: {hoveredGene.feature}</div>
          <div>TRAIT: {hoveredGene.trait}</div>
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{ width: '350px', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px' }}>
          <button onClick={() => setView(view === 'splicer' ? 'serum' : 'splicer')} style={{ width: '100%', padding: '10px', marginBottom: '10px', background: view === 'serum' ? '#EBBBFF' : '#99EBFF', border: 'none', fontWeight: 'bold' }}>SWITCH MODALITY</button>
          <input placeholder="FILTER GENES..." onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px', background: '#111', border: '1px solid #444', color: '#fff' }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {inventory.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.type.toLowerCase().includes(searchTerm.toLowerCase())).map(g => (
            <div key={g.id} onMouseEnter={() => setHoveredGene(g)} onMouseLeave={() => setHoveredGene(null)} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} 
                 style={{ padding: '10px', margin: '5px 0', borderLeft: `3px solid ${g.color}`, background: '#111', cursor: 'grab', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{g.icon} {g.name}</span>
              {g.isHybrid && <button onClick={() => {
                const blob = new Blob([`REPORT: ${g.name}\n${g.reportData.report.phys}`], {type: 'text/plain'});
                const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${g.name}.txt`; link.click();
              }} style={{ color: '#99EBFF', background: 'none', border: 'none', cursor: 'pointer' }}>DOC</button>}
            </div>
          ))}
        </div>
      </div>

      {/* WORKSPACE */}
      <div style={{ flex: 1, padding: '40px', textAlign: 'center', overflowY: 'auto' }}>
        <h2>{view === 'splicer' ? 'GENOME SPLICER' : 'SERUM DISTILLERY'}</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', margin: '30px 0' }}>
          {[slotA, slotB].map((slot, i) => (
            <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const d = JSON.parse(e.dataTransfer.getData("gene")); i === 0 ? setSlotA(d) : setSlotB(d); }}
                 style={{ width: '180px', height: '220px', border: '1px dashed #555', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#050505' }}>
              {slot ? <><div style={{fontSize: '40px'}}>{slot.icon}</div><div style={{color: slot.color}}>{slot.name}</div></> : 'DROP GENE'}
            </div>
          ))}
        </div>

        {res && (
          <div style={{ border: `1px solid ${res.color}`, padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'left', background: '#050505' }}>
            <h3 style={{ color: res.color, marginTop: 0 }}>{res.isLethal ? 'Lethal Mutation' : 'Stable Sequence'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
              <div>STABILITY: <span style={{ color: res.stability < 60 ? '#ff4444' : '#00ff00' }}>{res.stability}%</span></div>
              <div>TOXICITY: <span style={{ color: res.toxicity > 80 ? '#ff4444' : '#00ff00' }}>{res.toxicity}%</span></div>
              <div>pH LEVEL: {res.ph}</div>
            </div>
            <p style={{ fontSize: '14px' }}>{res.report.phys}</p>
            {!res.isLethal && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <input placeholder="ASSIGN NAME..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} style={{ flex: 1, padding: '10px', background: '#000', border: '1px solid #444', color: '#fff' }} />
                <button onClick={save} style={{ padding: '10px 20px', background: res.color, color: '#000', fontWeight: 'bold', border: 'none' }}>ARCHIVE</button>
              </div>
            )}
            <button onClick={() => {setSlotA(null); setSlotB(null);}} style={{ marginTop: '10px', width: '100%', background: '#222', color: '#fff', border: 'none', padding: '5px' }}>RESET EXPERIMENT</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
