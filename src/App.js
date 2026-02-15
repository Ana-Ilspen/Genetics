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
    
    const speciesData = {
      Mammalian: [
        { name: "Wolf", feat: "Neural Pack-Link", trait: "Night-Vision", comp: "Lup-G", ph: 7.2, tox: 12 },
        { name: "Tiger", feat: "Thermal Claws", trait: "Ambush Reflex", comp: "Fel-X", ph: 7.1, tox: 18 },
        { name: "Bear", feat: "Hibernation Reserve", trait: "Crushing Force", comp: "Urs-B", ph: 7.3, tox: 15 },
        { name: "Elephant", feat: "Infrasonic Pulse", trait: "Trunk Dexterity", comp: "Pach-A", ph: 7.4, tox: 8 }
      ],
      Avian: [
        { name: "Falcon", feat: "Nictitating Membrane", trait: "Dive-Speed", comp: "Fal-9", ph: 7.5, tox: 10 },
        { name: "Owl", feat: "Silent Feathers", trait: "270° Rotation", comp: "Stri-Z", ph: 7.4, tox: 12 },
        { name: "Eagle", feat: "Retinal Zoom", trait: "High-Alt Lungs", comp: "Acci-K", ph: 7.6, tox: 11 }
      ],
      Botanical: [
        { name: "Lotus", feat: "Hydrophobic Layer", trait: "Nutrient Siphon", comp: "Nym-L", ph: 5.5, tox: 5 },
        { name: "Cactus", feat: "Water Storage", trait: "Needle Defense", comp: "Cac-S", ph: 4.8, tox: 22 },
        { name: "Orchid", feat: "Pheromone Mimicry", trait: "Aerial Rooting", comp: "Orc-D", ph: 5.2, tox: 14 }
      ],
      Aquatic: [
        { name: "Shark", feat: "Electro-Receptors", trait: "Cartilage Growth", comp: "Sel-8", ph: 8.2, tox: 14 },
        { name: "Axolotl", feat: "Blastema Regen", trait: "Neotenic State", comp: "Amb-Q", ph: 7.9, tox: 5 },
        { name: "Eel", feat: "Electric Organ", trait: "Mucus Defense", comp: "Ang-E", ph: 8.0, tox: 28 }
      ],
      Arachnid: [
        { name: "BlackWidow", feat: "Neurotoxin Gland", trait: "Silk Reservoir", comp: "Lat-W", ph: 6.5, tox: 75 },
        { name: "Scorpion", feat: "Segmented Stinger", trait: "UV Exoskeleton", comp: "Sco-V", ph: 6.2, tox: 68 },
        { name: "OrbWeaver", feat: "Web Architecture", trait: "Tensile Strength", comp: "Aran-O", ph: 6.8, tox: 40 }
      ],
      Human: [
        { name: "Cybernetic", feat: "Titanium Graft", trait: "HUD Overlay", comp: "Cyb-1", ph: 7.0, tox: 40 },
        { name: "Oracle", feat: "Temporal Synapse", trait: "Theta Waves", comp: "Psi-9", ph: 7.6, tox: 55 },
        { name: "Sapiens", feat: "Logic Engine", trait: "Tool Use", comp: "Hom-S", ph: 7.4, tox: 25 }
      ]
    };

    const kingdoms = Object.keys(speciesData);
    const baseGenes = Array.from({ length: 600 }, (_, i) => {
      const kingdomType = kingdoms[i % 6];
      const speciesList = speciesData[kingdomType];
      const species = speciesList[Math.floor((i / 6) % speciesList.length)];
      
      return {
        id: `G-${i}`,
        name: `${prefixes[Math.floor(i / 60) % 10]} ${species.name}`,
        type: kingdomType,
        feature: species.feat,
        trait: species.trait,
        compound: species.comp,
        basePh: species.ph,
        baseTox: species.tox,
        color: { Mammalian: "#FFD699", Avian: "#99EBFF", Botanical: "#A3FFD6", Aquatic: "#99B2FF", Human: "#FFFFFF", Arachnid: "#E066FF" }[kingdomType],
        icon: { Mammalian: "🐺", Avian: "🦅", Botanical: "🌿", Aquatic: "🦈", Human: "👤", Arachnid: "🕷️" }[kingdomType]
      };
    });
    setInventory(baseGenes);
  }, []);

  const getAnalysis = (g1, g2) => {
    if (!g1 || !g2) return null;
    const combo = [g1.type, g2.type].sort().join('+');
    let stability = (g1.type === g2.type) ? 98 : 70;
    if (combo.includes("Human") || combo.includes("Arachnid")) stability -= 25;
    if (combo.includes("Botanical") && !combo.includes("Botanical+Botanical")) stability -= 35;

    const toxVal = (g1.baseTox + g2.baseTox + (g1.type === g2.type ? 0 : 20));
    const phVal = ((g1.basePh + g2.basePh) / 2).toFixed(1);
    const isLethal = stability < 45 || toxVal > 130;

    return {
      isLethal, stability, toxicity: `${toxVal}%`, ph: phVal,
      color: isLethal ? "#FF6666" : (view === 'splicer' ? "#99EBFF" : "#EBBBFF"),
      report: {
        physical: `Primary Bio-Structure: ${g1.feature} (Source: ${g1.name})`,
        secondary: `Secondary Ability: ${g2.trait} (Source: ${g2.name})`,
        reasoning: isLethal ? `FAILURE: Genomic Strands collapsed.` : `SUCCESS: ${stability}% genomic match.`
      },
      serumSteps: [
        `Step 1: Centrifuge ${g1.compound} isolate from ${g1.name}.`,
        `Step 2: Titrate ${g2.compound} catalytic agent into solution.`,
        `Step 3: Stabilize mixture to target pH ${phVal} with buffer.`,
        `Step 4: Incubate at 37°C to finalize bonding.`
      ]
    };
  };

  const res = getAnalysis(slotA, slotB);

  const archiveResult = () => {
    if (!hybridName) return alert("NAME REQUIRED");
    const newEntry = { ...slotA, id: Date.now(), name: hybridName.toUpperCase(), isHybrid: true, color: res.color, reportData: res, mode: view };
    setInventory([newEntry, ...inventory]);
    setSlotA(null); setSlotB(null); setHybridName("");
  };

  const downloadReport = (g) => {
    let content = `LAB DATA: ${g.name}\n`;
    content += `TYPE: ${g.reportData.mode === 'splicer' ? 'RECOMBINANT ORGANISM' : 'SYNTHETIC SERUM'}\n`;
    content += `------------------------------------\n`;
    content += `GENETIC ORIGIN A: ${slotA ? slotA.name : 'Unknown'}\n`;
    content += `GENETIC ORIGIN B: ${slotB ? slotB.name : 'Unknown'}\n`;
    content += `------------------------------------\n`;
    
    if (g.reportData.mode === 'splicer') {
      content += `MORPHOLOGY:\n- ${g.reportData.report.physical}\n- ${g.reportData.report.secondary}\n`;
      content += `STABILITY RATING: ${g.reportData.stability}%\n`;
    } else {
      content += `CHEMICAL PROPERTIES:\n- pH: ${g.reportData.ph}\n- Toxicity: ${g.reportData.toxicity}\n\n`;
      content += `SYNTHESIS PROTOCOL:\n${g.reportData.serumSteps.join('\n')}\n`;
    }
    
    const blob = new Blob([content], {type: 'text/plain'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${g.name}_Report.txt`;
    link.click();
  };

  return (
    <div onMouseMove={(e) => setMousePos({ x: e.clientX + 20, y: e.clientY + 20 })} 
         style={{ display: 'flex', height: '100vh', backgroundColor: '#000', color: '#EEE', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      
      {hoveredGene && (
        <div style={{ position: 'fixed', left: mousePos.x, top: mousePos.y, zIndex: 100, background: '#111', border: `2px solid ${hoveredGene.color}`, padding: '15px', borderRadius: '8px', pointerEvents: 'none' }}>
          <b style={{ color: hoveredGene.color, fontSize: '18px' }}>{hoveredGene.name}</b>
          <p style={{ margin: '5px 0' }}>STRUCT: {hoveredGene.feature}</p>
          <p style={{ color: '#888', margin: '0' }}>TRAIT: {hoveredGene.trait}</p>
        </div>
      )}

      <div style={{ width: '380px', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', background: '#080808' }}>
        <div style={{ padding: '20px' }}>
          <button onClick={() => {setView(view === 'splicer' ? 'serum' : 'splicer'); setSlotA(null); setSlotB(null);}} 
                  style={{ width: '100%', padding: '14px', background: view === 'serum' ? '#EBBBFF' : '#99EBFF', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
            {view === 'splicer' ? '🧪 GO TO SERUM LAB' : '🧬 GO TO SPLICER'}
          </button>
          <input type="text" placeholder="FILTER..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                 style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#FFF' }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {inventory.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.type.toLowerCase().includes(searchTerm.toLowerCase())).map(g => (
            <div key={g.id} onMouseEnter={() => setHoveredGene(g)} onMouseLeave={() => setHoveredGene(null)} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} 
                 style={{ padding: '12px', margin: '8px 0', background: '#111', borderLeft: `5px solid ${g.color}`, cursor: 'grab', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{g.icon} {g.name}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {g.isHybrid && (
                  <>
                    <button onClick={() => downloadReport(g)} style={{ color: '#99EBFF', background: 'none', border: 'none', cursor: 'pointer' }}>DOC</button>
                    <button onClick={() => setInventory(inventory.filter(i => i.id !== g.id))} style={{ color: '#FF6666', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

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
              <button onClick={() => {setSlotA(null); setSlotB(null);}} style={{ background: '#333', color: '#FFF', border: 'none', padding: '8px 20px', cursor: 'pointer', borderRadius: '5px' }}>RESET</button>
            </div>
            
            {view === 'splicer' ? (
              <div style={{ fontSize: '18px', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '15px', padding: '10px', background: '#000', border: '1px solid #222' }}>STABILITY: <span style={{color: res.stability < 50 ? '#ff4444' : '#00ff00'}}>{res.stability}%</span></div>
                <p>🧬 {res.report.physical}</p>
                <p>🧬 {res.report.secondary}</p>
                <p style={{ color: res.color, fontWeight: 'bold' }}>{res.report.reasoning}</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                <div style={{ background: '#000', padding: '20px', border: '1px solid #333' }}>
                  <p style={{fontSize: '20px', margin: '0 0 10px 0'}}>pH: <span style={{color: '#99EBFF'}}>{res.ph}</span></p>
                  <p style={{fontSize: '20px', margin: '0'}}>TOX: <span style={{color: '#ff6666'}}>{res.toxicity}</span></p>
                </div>
                <div style={{ fontSize: '16px' }}>
                  <b style={{color: '#EBBBFF'}}>SYNTHESIS PROTOCOL:</b>
                  {res.serumSteps.map((step, idx) => <p key={idx} style={{margin: '8px 0'}}>{step}</p>)}
                </div>
              </div>
            )}
            {!res.isLethal && (
              <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                <input placeholder="NAME..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} 
                       style={{ background: '#000', color: '#FFF', border: '1px solid #444', padding: '15px', flex: 1 }} />
                <button onClick={archiveResult} style={{ background: res.color, color: '#000', border: 'none', padding: '0 25px', fontWeight: 'bold', cursor: 'pointer' }}>SAVE</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
