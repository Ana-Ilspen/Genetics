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
    const regions = ["Arctic", "Tundra", "Siberian", "Amazonian", "Sahara", "Alpine", "Coastal", "Island", "Congo", "Mojave", "Andean", "Himalayan", "Pacific", "Atlantic", "Savanna", "Volcanic", "Subterranean", "Prairie", "Highland", "Basin"];
    const baseAnimals = [
      { name: "Wolf", type: "Mammalian", feat: "Neural Pack-Link", trait: "Night-Vision", comp: "Lup", ph: 7.2, tox: 12, icon: "🐺" },
      { name: "Tiger", type: "Mammalian", feat: "Thermal Claws", trait: "Ambush Reflex", comp: "Pan", ph: 7.1, tox: 18, icon: "🐅" },
      { name: "Fox", type: "Mammalian", feat: "Bushy Rudder", trait: "Pounce Accuracy", comp: "Vul", ph: 7.0, tox: 10, icon: "🦊" },
      { name: "Bear", type: "Mammalian", feat: "Fat Storage", trait: "Crushing Force", comp: "Urs", ph: 7.4, tox: 15, icon: "🐻" },
      { name: "Falcon", type: "Avian", feat: "Aero-Keel", trait: "Dive-Speed", comp: "Fal", ph: 7.5, tox: 10, icon: "🦅" },
      { name: "Owl", type: "Avian", feat: "Silent Feathers", trait: "270° Rotation", comp: "Bub", ph: 7.4, tox: 12, icon: "🦉" },
      { name: "Shark", type: "Aquatic", feat: "Electro-Sense", trait: "Cartilage Frame", comp: "Sel", ph: 8.2, tox: 14, icon: "🦈" },
      { name: "Octopus", type: "Aquatic", feat: "Ink Camo", trait: "Flexible Body", comp: "Oct", ph: 7.8, tox: 35, icon: "🐙" },
      { name: "Human", type: "Human", feat: "Brain Logic", trait: "Tool Use", comp: "Hom", ph: 7.4, tox: 25, icon: "👤" },
      { name: "Flytrap", type: "Botanical", feat: "Jaw Trap", trait: "Digestive Fluid", comp: "Dio", ph: 3.5, tox: 60, icon: "🪴" },
      { name: "Spider", type: "Arachnid", feat: "Silk Gland", trait: "Web Architecture", comp: "Ara", ph: 6.5, tox: 75, icon: "🕷️" },
      { name: "Scorpion", type: "Arachnid", feat: "Tail Stinger", trait: "UV Exoskeleton", comp: "Sco", ph: 6.2, tox: 68, icon: "🦂" },
      { name: "Eagle", type: "Avian", feat: "Talon Grip", trait: "Retinal Zoom", comp: "Aqu", ph: 7.6, tox: 11, icon: "🦅" },
      { name: "Raven", type: "Avian", feat: "Logic Center", trait: "Mimicry Engine", comp: "Cor", ph: 7.2, tox: 14, icon: "🐦" },
      { name: "Eel", type: "Aquatic", feat: "Electric Spark", trait: "Mucus Defense", comp: "Ang", ph: 8.0, tox: 45, icon: "🐍" },
      { name: "Lotus", type: "Botanical", feat: "Water Shield", trait: "Root Siphon", comp: "Nym", ph: 5.5, tox: 5, icon: "🪷" },
      { name: "Cactus", type: "Botanical", feat: "Water Storage", trait: "Spine Defense", comp: "Cac", ph: 4.8, tox: 22, icon: "🌵" },
      { name: "Elephant", type: "Mammalian", feat: "Prehensile Trunk", trait: "Infrasonic Pulse", comp: "Lox", ph: 7.5, tox: 8, icon: "🐘" },
      { name: "Gorilla", feat: "Muscle Density", trait: "Climbing Grip", comp: "Gor", ph: 7.3, tox: 5, icon: "🦍", type: "Mammalian" },
      { name: "Lionfish", feat: "Neurotoxin Spine", trait: "Fan Flare", comp: "Pte", ph: 7.9, tox: 80, icon: "🐠", type: "Aquatic" },
      { name: "Oracle", type: "Human", feat: "Mind Link", trait: "Neural Waves", comp: "Psi", ph: 7.6, tox: 55, icon: "👁️" },
      { name: "Rebel", type: "Human", feat: "Pain Block", trait: "Adrenaline Burst", comp: "Riot", ph: 7.1, tox: 65, icon: "✊" },
      { name: "Rhino", feat: "Keratin Plate", trait: "Kinetic Charge", comp: "Cera", ph: 7.5, tox: 10, icon: "🦏", type: "Mammalian" },
      { name: "Vulture", feat: "Stomach Acid", trait: "Immunity", comp: "Cath", ph: 1.2, tox: 55, icon: "🦅", type: "Avian" },
      { name: "Mantis", feat: "Impact Strike", trait: "Trifocal Vision", comp: "Odon", ph: 8.0, tox: 18, icon: "🦐", type: "Aquatic" },
      { name: "Redwood", feat: "Bark Armor", trait: "Height Growth", comp: "Seq", ph: 5.8, tox: 10, icon: "🌲", type: "Botanical" },
      { name: "Widow", feat: "Latrodectus Gland", trait: "Neurotoxic Silk", comp: "Lat", ph: 6.2, tox: 85, icon: "🕷️", type: "Arachnid" },
      { name: "Scholar", type: "Human", feat: "Memory Storage", trait: "Data Analysis", comp: "Log", ph: 7.4, tox: 10, icon: "🎓" },
      { name: "Panther", feat: "Stealth Padding", trait: "Apex Power", comp: "Pan", ph: 7.2, tox: 14, icon: "🐆", type: "Mammalian" },
      { name: "Fern", type: "Botanical", feat: "Spore Cloud", trait: "Frond Resilience", comp: "Pte", ph: 6.0, tox: 2, icon: "🌿" }
    ];

    const tempInventory = [];
    let count = 0;
    regions.forEach(reg => {
      baseAnimals.forEach(ani => {
        if (count < 600) {
          tempInventory.push({
            id: `GEN-${count}`,
            name: `${reg} ${ani.name}`,
            type: ani.type,
            feature: ani.feat,
            trait: ani.trait,
            compound: `${ani.comp}-${reg.substring(0,2).toUpperCase()}`,
            basePh: ani.ph,
            baseTox: ani.tox,
            color: { Mammalian: "#FFD699", Avian: "#99EBFF", Botanical: "#A3FFD6", Aquatic: "#99B2FF", Human: "#FFFFFF", Arachnid: "#E066FF" }[ani.type],
            icon: ani.icon
          });
          count++;
        }
      });
    });
    setInventory(tempInventory);
  }, []);

  const getAnalysis = (g1, g2) => {
    if (!g1 || !g2) return null;
    const combo = [g1.type, g2.type].sort().join('+');
    let stability = (g1.type === g2.type) ? 98 : 70;
    if (combo.includes("Human") || combo.includes("Arachnid")) stability -= 25;
    if (combo.includes("Botanical") && !combo.includes("Botanical+Botanical")) stability -= 35;

    const toxVal = (g1.baseTox + g2.baseTox + (g1.type === g2.type ? 0 : 20));
    const phVal = ((g1.basePh + g2.basePh) / 2).toFixed(1);
    const isLethal = stability < 45 || toxVal > 150;

    const isHumanMix = g1.type === "Human" || g2.type === "Human";
    const animalA = g1.type !== "Human" ? g1 : g2;
    const animalB = g2.type !== "Human" ? g2 : g1;

    return {
      isLethal, stability, toxicity: `${toxVal}%`, ph: phVal,
      color: isLethal ? "#FF6666" : (view === 'splicer' ? "#99EBFF" : "#EBBBFF"),
      report: {
        physical: `PRIMARY: Receiving ${g1.feature} from ${g1.name}.`,
        secondary: `SECONDARY: Inheriting ${g2.trait} from ${g2.name}.`,
        reasoning: isLethal ? `CRITICAL FAILURE: ${g1.type} and ${g2.type} strands caused cellular collapse.` : `SUCCESS: ${stability}% match. ${g1.type} nodes accepted ${g2.type} sequences.`
      },
      serumA: {
        title: isHumanMix ? "HUMAN AUGMENTATION SERUM" : `TRANS-SPECIES SERUM: ${animalA.name} focus`,
        desc: isHumanMix ? `Inject into Human to grant ${animalB.trait}.` : `Inject into ${animalA.name} to grant ${animalB.trait}.`,
        steps: [
          `1. Isolate ${g2.compound} catalytic agent.`,
          `2. Stabilize in ${g1.compound} base at pH ${phVal}.`,
          `3. Filter through ${g1.type} membrane.`,
          `4. Administer intravenously via slow drip.`
        ]
      },
      serumB: {
        title: "HYBRID CONVERGENCE SERUM (FOR HUMAN)",
        desc: `Inject into Human to grant the full abilities of the ${g1.name}/${g2.name} hybrid.`,
        steps: [
          `1. Combine ${g1.compound} and ${g2.compound} into a dual-helix solution.`,
          `2. Counter-act ${toxVal}% toxicity with neural buffers.`,
          `3. Incubate serum at 37°C for 24 hours.`,
          `4. Inject into spinal column for full nervous system integration.`
        ]
      }
    };
  };

  const res = getAnalysis(slotA, slotB);

  const downloadData = (g) => {
    const content = `LAB REPORT: ${g.name}\n${res.report.physical}\n${res.report.secondary}\nSTABILITY: ${res.stability}%\n\nSERUM DATA:\n${res.serumB.title}\n${res.serumB.steps.join('\n')}`;
    const element = document.createElement("a");
    element.href = URL.createObjectURL(new Blob([content], {type: 'text/plain'}));
    element.download = `${g.name}_DATA.txt`;
    element.click();
  };

  return (
    <div onMouseMove={(e) => setMousePos({ x: e.clientX + 20, y: e.clientY + 20 })} 
         style={{ display: 'flex', height: '100vh', backgroundColor: '#000', color: '#EEE', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      
      {hoveredGene && (
        <div style={{ position: 'fixed', left: mousePos.x, top: mousePos.y, zIndex: 100, background: '#111', border: `2px solid ${hoveredGene.color}`, padding: '15px', borderRadius: '8px', pointerEvents: 'none', boxShadow: '0 0 15px rgba(0,0,0,0.5)' }}>
          <b style={{ color: hoveredGene.color, fontSize: '18px' }}>{hoveredGene.name}</b>
          <p style={{ margin: '5px 0' }}>STRUCT: {hoveredGene.feature}</p>
          <p style={{ color: '#888', margin: '0' }}>TRAIT: {hoveredGene.trait}</p>
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{ width: '380px', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', background: '#080808' }}>
        <div style={{ padding: '20px' }}>
          <button onClick={() => {setView(view === 'splicer' ? 'serum' : 'splicer'); setSlotA(null); setSlotB(null);}} 
                  style={{ width: '100%', padding: '14px', background: view === 'serum' ? '#EBBBFF' : '#99EBFF', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
            {view === 'splicer' ? '🧪 SWITCH TO SERUM LAB' : '🧬 SWITCH TO GENE SPLICER'}
          </button>
          <input type="text" placeholder="FILTER 600 SAMPLES..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                 style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#FFF' }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {inventory.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())).map(g => (
            <div key={g.id} onMouseEnter={() => setHoveredGene(g)} onMouseLeave={() => setHoveredGene(null)} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} 
                 style={{ padding: '12px', margin: '8px 0', background: '#111', borderLeft: `5px solid ${g.color}`, cursor: 'grab', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{g.icon} {g.name}</span>
              {g.isHybrid && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => downloadData(g)} style={{ color: '#99EBFF', background: 'none', border: 'none', cursor: 'pointer', fontSize: '10px' }}>DOC</button>
                  <button onClick={() => setInventory(inventory.filter(i => i.id !== g.id))} style={{ color: '#FF6666', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN LAB AREA */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '32px', letterSpacing: '2px', marginBottom: '30px' }}>{view === 'splicer' ? 'GENOMIC RECOMBINATION UNIT' : 'SERUM DISTILLERY & AUGMENTATION'}</h1>
        
        <div style={{ display: 'flex', gap: '40px', marginBottom: '30px' }}>
          {[slotA, slotB].map((slot, i) => (
            <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const d = JSON.parse(e.dataTransfer.getData("gene")); i === 0 ? setSlotA(d) : setSlotB(d); }}
              style={{ width: '200px', height: '260px', border: '2px dashed #444', background: '#050505', textAlign: 'center', padding: '20px', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: slot ? `inset 0 0 20px ${slot.color}44` : 'none' }}>
              {slot ? <> <div style={{ fontSize: '60px' }}>{slot.icon}</div> <b style={{color: slot.color, marginTop: '10px'}}>{slot.name}</b> </> : <p style={{color: '#444'}}>DRAG SAMPLE HERE</p>}
            </div>
          ))}
        </div>

        {res && (
          <div style={{ width: '100%', maxWidth: '900px', padding: '30px', border: `2px solid ${res.color}`, background: '#0A0A0A', borderRadius: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
              <h2 style={{ color: res.color, margin: 0 }}>{res.isLethal ? '⚠️ INCOMPATIBLE SEQUENCE' : `STABILITY: ${res.stability}%`}</h2>
              <button onClick={() => {setSlotA(null); setSlotB(null);}} style={{ background: '#333', color: '#FFF', border: 'none', padding: '10px 25px', cursor: 'pointer', borderRadius: '5px' }}>RESET SLOTS</button>
            </div>
            
            {view === 'splicer' ? (
              <div style={{ fontSize: '18px', lineHeight: '1.8' }}>
                <p>🧬 <b>{res.report.physical}</b></p>
                <p>🧬 <b>{res.report.secondary}</b></p>
                <div style={{ padding: '15px', background: '#000', border: `1px solid ${res.color}`, marginTop: '20px' }}>
                  <b>ANALYSIS:</b> {res.report.reasoning}
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#000', padding: '20px', border: '1px solid #333' }}>
                  <h4 style={{ color: '#EBBBFF', marginTop: 0 }}>SERUM A: {res.serumA.title}</h4>
                  <p style={{ fontSize: '13px', color: '#AAA' }}>{res.serumA.desc}</p>
                  {res.serumA.steps.map((s, i) => <div key={i} style={{fontSize: '13px', margin: '5px 0'}}>• {s}</div>)}
                </div>
                <div style={{ background: '#000', padding: '20px', border: '1px solid #333' }}>
                  <h4 style={{ color: '#99EBFF', marginTop: 0 }}>SERUM B: {res.serumB.title}</h4>
                  <p style={{ fontSize: '13px', color: '#AAA' }}>{res.serumB.desc}</p>
                  {res.serumB.steps.map((s, i) => <div key={i} style={{fontSize: '13px', margin: '5px 0'}}>• {s}</div>)}
                </div>
              </div>
            )}

            {!res.isLethal && (
              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                <input placeholder="ENTER HYBRID DESIGNATION..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} 
                       style={{ background: '#000', color: '#FFF', border: '1px solid #444', padding: '15px', flex: 1, fontSize: '16px' }} />
                <button onClick={() => {
                  const newEntry = { ...slotA, id: Date.now(), name: hybridName.toUpperCase(), isHybrid: true, color: res.color, reportData: res };
                  setInventory([newEntry, ...inventory]);
                  setSlotA(null); setSlotB(null); setHybridName("");
                }} style={{ background: res.color, color: '#000', border: 'none', padding: '0 30px', fontWeight: 'bold', cursor: 'pointer' }}>SAVE TO ARCHIVE</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
