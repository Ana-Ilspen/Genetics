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
    const prefixes = ["Neon", "Primal", "Void", "Solar", "Cryo", "Toxic", "Apex", "Shadow", "Alpha", "Nano", "Aether", "Cobalt", "Inferno", "Ghost", "Omega", "Titan", "Quantum", "Magma", "Plasma", "Static"];
    
    const speciesData = {
      Mammalian: [
        { name: "Wolf", feat: "Neural Pack-Link", trait: "Night-Vision", comp: "Lup-G", ph: 7.2, tox: 12 },
        { name: "Tiger", feat: "Thermal Claws", trait: "Ambush Reflex", comp: "Fel-X", ph: 7.1, tox: 18 },
        { name: "Bear", feat: "Hibernation Reserve", trait: "Crushing Force", comp: "Urs-B", ph: 7.3, tox: 15 },
        { name: "Elephant", feat: "Infrasonic Pulse", trait: "Trunk Dexterity", comp: "Pach-A", ph: 7.4, tox: 8 },
        { name: "Bat", feat: "Echolocation Node", trait: "Patagium Flight", comp: "Chir-V", ph: 6.9, tox: 22 },
        { name: "Rhino", feat: "Keratin Plate", trait: "Kinetic Charge", comp: "Cera-T", ph: 7.5, tox: 10 },
        { name: "Cheetah", feat: "Adrenal Spurt", trait: "Non-Retract Traction", comp: "Acin-S", ph: 7.0, tox: 25 },
        { name: "Platypus", feat: "Electro-Sensor Bill", trait: "Venomous Spur", comp: "Orni-M", ph: 6.8, tox: 45 },
        { name: "Gorilla", feat: "Sagittal Crest", trait: "Brachiation Strength", comp: "Homin-G", ph: 7.3, tox: 5 },
        { name: "Sloth", feat: "Low-Metabolic Flux", trait: "Syndactyly Grip", comp: "Brad-Y", ph: 6.5, tox: 2 }
      ],
      Avian: [
        { name: "Falcon", feat: "Nictitating Membrane", trait: "Dive-Speed", comp: "Fal-9", ph: 7.5, tox: 10 },
        { name: "Owl", feat: "Silent Feathers", trait: "270° Rotation", comp: "Stri-Z", ph: 7.4, tox: 12 },
        { name: "Eagle", feat: "Retinal Zoom", trait: "High-Alt Lungs", comp: "Acci-K", ph: 7.6, tox: 11 },
        { name: "Raven", feat: "Logic Synapse", trait: "Vocal Mimicry", comp: "Corv-X", ph: 7.2, tox: 14 },
        { name: "Hummingbird", feat: "Torpor Mechanism", trait: "Hover-Stabilization", comp: "Troch-H", ph: 7.8, tox: 30 },
        { name: "Vulture", feat: "Corrosive Gastric", trait: "Immune Shield", comp: "Cath-M", ph: 1.2, tox: 55 },
        { name: "Woodpecker", feat: "Shock-Absorb Skull", trait: "Barbed Tongue", comp: "Pici-D", ph: 7.4, tox: 4 },
        { name: "Albatross", feat: "Dynamic Soaring", trait: "Desalination Gland", comp: "Diom-E", ph: 8.1, tox: 7 },
        { name: "Parrot", feat: "Psittacine Beak", trait: "Zygodactyl Feet", comp: "Psit-B", ph: 7.3, tox: 3 },
        { name: "Swan", feat: "Syrinx Modulation", trait: "Aquatic Down", comp: "Cygn-U", ph: 7.5, tox: 2 }
      ],
      Botanical: [
        { name: "Lotus", feat: "Hydrophobic Layer", trait: "Nutrient Siphon", comp: "Nym-L", ph: 5.5, tox: 5 },
        { name: "Cactus", feat: "Water Storage", trait: "Needle Defense", comp: "Cac-S", ph: 4.8, tox: 22 },
        { name: "Orchid", feat: "Pheromone Mimicry", trait: "Aerial Rooting", comp: "Orc-D", ph: 5.2, tox: 14 },
        { name: "Flytrap", feat: "Trigger-Hair Snap", trait: "Digestive Fluid", comp: "Dion-F", ph: 3.5, tox: 60 },
        { name: "Redwood", feat: "Tannin Armor", trait: "Vertical Osmosis", comp: "Seq-H", ph: 5.8, tox: 10 },
        { name: "Bamboo", feat: "Rhizome Expansion", trait: "Tensile Lignin", comp: "Bamb-O", ph: 6.2, tox: 4 },
        { name: "Sundew", feat: "Mucilage Gland", trait: "Stalk Movement", comp: "Dros-E", ph: 4.0, tox: 45 },
        { name: "Pitcher", feat: "Slippery Peristome", trait: "Enzymatic Pool", comp: "Nepe-N", ph: 2.8, tox: 70 },
        { name: "Fern", feat: "Spore Proliferation", trait: "Frond Resilience", comp: "Pter-I", ph: 6.0, tox: 2 },
        { name: "Rose", feat: "Prickle Defense", trait: "Anthocyanin Pigment", comp: "Rosa-P", ph: 5.4, tox: 15 }
      ],
      Aquatic: [
        { name: "Shark", feat: "Electro-Receptors", trait: "Cartilage Growth", comp: "Sel-8", ph: 8.2, tox: 14 },
        { name: "Axolotl", feat: "Blastema Regen", trait: "Neotenic State", comp: "Amb-Q", ph: 7.9, tox: 5 },
        { name: "Eel", feat: "Electric Organ", trait: "Mucus Defense", comp: "Ang-E", ph: 8.0, tox: 28 },
        { name: "Octopus", feat: "Chromatophore Skin", trait: "Multi-Brain Node", comp: "Octo-P", ph: 7.8, tox: 35 },
        { name: "Whale", feat: "Baleen Filter", trait: "Pressure Resistance", comp: "Bala-E", ph: 7.6, tox: 8 },
        { name: "Jellyfish", feat: "Nematocyst barb", trait: "Mesoglea Body", comp: "Cnid-J", ph: 8.4, tox: 90 },
        { name: "Salmon", feat: "Olfactory Mapping", trait: "Upstream Stamina", comp: "Onco-R", ph: 7.7, tox: 4 },
        { name: "Crab", feat: "Chitinous Carapace", trait: "Autotomy Limb", comp: "Deca-C", ph: 8.1, tox: 20 },
        { name: "Puffer", feat: "Tetrodotoxin Gland", trait: "Elastic Dermal", comp: "Tetro-X", ph: 7.9, tox: 120 },
        { name: "Seahorse", feat: "Prehensile Tail", trait: "Camouflage Plate", comp: "Hipp-O", ph: 8.0, tox: 2 }
      ],
      Arachnid: [
        { name: "BlackWidow", feat: "Neurotoxin Gland", trait: "Silk Reservoir", comp: "Lat-W", ph: 6.5, tox: 75 },
        { name: "Scorpion", feat: "Segmented Stinger", trait: "UV Exoskeleton", comp: "Sco-V", ph: 6.2, tox: 68 },
        { name: "OrbWeaver", feat: "Web Architecture", trait: "Tensile Strength", comp: "Aran-O", ph: 6.8, tox: 40 },
        { name: "Tarantula", feat: "Urticating Hairs", trait: "Vibratory Sense", comp: "Thera-P", ph: 6.6, tox: 30 },
        { name: "Mite", feat: "Micro-Parasitism", trait: "Rapid Reproduction", comp: "Acar-I", ph: 6.4, tox: 15 },
        { name: "Harvester", feat: "Odoriferous Gland", trait: "Autotomic Legs", comp: "Opil-I", ph: 6.7, tox: 5 },
        { name: "FunnelWeb", feat: "Atracotoxin Node", trait: "Aggression Drive", comp: "Atrax-F", ph: 6.1, tox: 95 },
        { name: "JumpingSpider", feat: "Hydraulic Limbs", trait: "360° Visual", comp: "Salt-I", ph: 6.9, tox: 25 },
        { name: "WaterSpider", feat: "Diving Bell Silk", trait: "Hydrostatic Breath", comp: "Argy-R", ph: 7.1, tox: 10 },
        { name: "Ticks", feat: "Anticoagulant Spit", trait: "Sensory Haller's", comp: "Ixod-E", ph: 6.5, tox: 40 }
      ],
      Human: [
        { name: "Cybernetic", feat: "Titanium Graft", trait: "HUD Overlay", comp: "Cyb-1", ph: 7.0, tox: 40 },
        { name: "Oracle", feat: "Temporal Synapse", trait: "Theta Waves", comp: "Psi-9", ph: 7.6, tox: 55 },
        { name: "Sapiens", feat: "Logic Engine", trait: "Tool Use", comp: "Hom-S", ph: 7.4, tox: 25 },
        { name: "Nomad", feat: "Thermal Regulation", trait: "Stamina Buffer", comp: "Vaga-M", ph: 7.3, tox: 30 },
        { name: "Elite", feat: "Hyper-Reflex Node", trait: "Tactical Logic", comp: "Ares-E", ph: 7.5, tox: 45 },
        { name: "Medic", feat: "Hemostat Synthesis", trait: "Cellular Repair", comp: "Vit-A", ph: 7.2, tox: 10 },
        { name: "Engineer", feat: "Spatial Intuition", trait: "Fine Motor", comp: "Fab-R", ph: 7.4, tox: 15 },
        { name: "Pilot", feat: "Vestibular Balance", trait: "G-Force Tolerance", comp: "Aero-N", ph: 7.3, tox: 20 },
        { name: "Scholar", feat: "Eidetic Storage", trait: "Neural Plasticity", comp: "Logos-P", ph: 7.5, tox: 5 },
        { name: "Rebel", feat: "Pain Suppression", trait: "Adrenaline Spike", comp: "Riot-X", ph: 7.1, tox: 65 }
      ]
    };

    const kingdoms = Object.keys(speciesData);
    const tempInventory = [];

    for (let i = 0; i < 600; i++) {
      const kingdomType = kingdoms[i % 6];
      const speciesList = speciesData[kingdomType];
      const species = speciesList[Math.floor((i / 6) % speciesList.length)];
      const prefix = prefixes[i % prefixes.length];

      tempInventory.push({
        id: `GEN-${i}`,
        name: `${prefix} ${species.name}`,
        type: kingdomType,
        feature: species.feat,
        trait: species.trait,
        compound: species.comp,
        basePh: species.ph,
        baseTox: species.tox,
        color: { Mammalian: "#FFD699", Avian: "#99EBFF", Botanical: "#A3FFD6", Aquatic: "#99B2FF", Human: "#FFFFFF", Arachnid: "#E066FF" }[kingdomType],
        icon: { Mammalian: "🐺", Avian: "🦅", Botanical: "🌿", Aquatic: "🦈", Human: "👤", Arachnid: "🕷️" }[kingdomType]
      });
    }
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

    return {
      isLethal, stability, toxicity: `${toxVal}%`, ph: phVal,
      color: isLethal ? "#FF6666" : (view === 'splicer' ? "#99EBFF" : "#EBBBFF"),
      report: {
        physical: `Primary Bio-Structure: ${g1.feature} (Source: ${g1.name})`,
        secondary: `Secondary Ability: ${g2.trait} (Source: ${g2.name})`,
        reasoning: isLethal ? `FAILURE: Strands from ${g1.type} rejected ${g2.type} sequences.` : `SUCCESS: ${stability}% genomic match.`
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
    const newEntry = { ...slotA, id: Date.now(), name: hybridName.toUpperCase(), isHybrid: true, color: res.color, reportData: res, mode: view, sourceA: slotA.name, sourceB: slotB.name };
    setInventory([newEntry, ...inventory]);
    setSlotA(null); setSlotB(null); setHybridName("");
  };

  const downloadReport = (g) => {
    let content = `LAB DATA: ${g.name}\nTYPE: ${g.mode === 'splicer' ? 'ORGANISM' : 'SERUM'}\nORIGIN: ${g.sourceA} + ${g.sourceB}\n----------------\n`;
    if (g.mode === 'splicer') {
      content += `MORPHOLOGY:\n- ${g.reportData.report.physical}\n- ${g.reportData.report.secondary}\nSTABILITY: ${g.reportData.stability}%`;
    } else {
      content += `PROPERTIES:\npH: ${g.reportData.ph}\nTOX: ${g.reportData.toxicity}\n\nSYNTHESIS:\n${g.reportData.serumSteps.join('\n')}`;
    }
    const element = document.createElement("a");
    element.href = URL.createObjectURL(new Blob([content], {type: 'text/plain'}));
    element.download = `${g.name}_DATA.txt`;
    element.click();
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
          <input type="text" placeholder="FILTER 600+ SAMPLES..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
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
                <input placeholder="NAME CREATION..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} 
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
