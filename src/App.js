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
    const speciesData = {
      Mammalian: [
        { name: "Tundra Wolf", feat: "Insulated Fur", trait: "Pack Coordination", comp: "Lup-T", ph: 7.2, tox: 10 },
        { name: "Red Fox", feat: "Bushy Rudder", trait: "Pounce Accuracy", comp: "Vul-R", ph: 7.1, tox: 12 },
        { name: "Fennec Fox", feat: "Radiator Ears", trait: "Sand Burrowing", comp: "Vul-F", ph: 6.9, tox: 8 },
        { name: "Siberian Tiger", feat: "Stealth Padding", trait: "Apex Power", comp: "Pan-S", ph: 7.3, tox: 18 },
        { name: "Grizzly Bear", feat: "Fat Storage", trait: "Raw Strength", comp: "Urs-G", ph: 7.4, tox: 15 },
        { name: "Snow Leopard", feat: "Long Tail Balance", trait: "Cliff Agility", comp: "Pan-U", ph: 7.2, tox: 14 },
        { name: "Fruit Bat", feat: "Patagium Web", trait: "Sonar Navigation", comp: "Pte-L", ph: 7.0, tox: 5 },
        { name: "Black Rhino", feat: "Dermal Armor", trait: "Impact Force", comp: "Dic-B", ph: 7.5, tox: 12 },
        { name: "Mountain Gorilla", feat: "Silverback Bulk", trait: "Social Intelligence", comp: "Gor-M", ph: 7.3, tox: 6 },
        { name: "African Elephant", feat: "Prehensile Trunk", trait: "Seismic Detection", comp: "Lox-A", ph: 7.4, tox: 9 }
      ],
      Avian: [
        { name: "Peregrine Falcon", feat: "Aero-Keel", trait: "Terminal Velocity", comp: "Fal-P", ph: 7.5, tox: 10 },
        { name: "Great Horned Owl", feat: "Serrated Wing", trait: "Silent Strike", comp: "Bub-V", ph: 7.4, tox: 15 },
        { name: "Golden Eagle", feat: "Talon Grip", trait: "Telescopic Vision", comp: "Aqu-C", ph: 7.6, tox: 12 },
        { name: "Common Raven", feat: "Problem Solving", trait: "Mimicry Engine", comp: "Cor-C", ph: 7.2, tox: 11 },
        { name: "Harpy Eagle", feat: "Crushing Feet", trait: "Canopy Hunting", comp: "Har-H", ph: 7.5, tox: 20 },
        { name: "Ruby Hummingbird", feat: "Rapid Metabolism", trait: "Air Hover", comp: "Arc-C", ph: 7.8, tox: 5 },
        { name: "Emperor Penguin", feat: "Blubber Layer", trait: "Deep Swimmer", comp: "Apt-F", ph: 7.7, tox: 4 },
        { name: "Bearded Vulture", feat: "Acidic Gut", trait: "Bone Digestion", comp: "Gyp-B", ph: 1.0, tox: 40 },
        { name: "Scarlet Macaw", feat: "Zygodactyl Grip", trait: "Seed Cracker", comp: "Ara-M", ph: 7.3, tox: 6 },
        { name: "Osprey", feat: "Reversible Toe", trait: "Fish Snatcher", comp: "Pan-H", ph: 7.4, tox: 8 }
      ],
      Botanical: [
        { name: "Venus Flytrap", feat: "Snap Trap", trait: "Enzyme Secretion", comp: "Dio-M", ph: 3.5, tox: 55 },
        { name: "Giant Redwood", feat: "Fireproof Bark", trait: "Hydraulic Lift", comp: "Seq-G", ph: 5.5, tox: 5 },
        { name: "Blue Lotus", feat: "Floating Pad", trait: "Silt Filtration", comp: "Nym-C", ph: 6.0, tox: 10 },
        { name: "Saguaro Cactus", feat: "Ribbed Trunk", trait: "Spine Defense", comp: "Car-G", ph: 5.0, tox: 25 },
        { name: "Ghost Orchid", feat: "Chlorophyll Root", trait: "Host Symbiosis", comp: "Den-L", ph: 5.2, tox: 15 },
        { name: "Corpse Flower", feat: "Heat Generation", trait: "Carrion Mimic", comp: "Amor-T", ph: 4.5, tox: 70 },
        { name: "Moso Bamboo", feat: "Hardened Culm", trait: "Rapid Expansion", comp: "Phy-E", ph: 6.2, tox: 4 },
        { name: "Silver Fern", feat: "Reflective Frond", trait: "Spore Burst", comp: "Cya-D", ph: 6.0, tox: 2 },
        { name: "Pitcher Plant", feat: "Slip Zone", trait: "Nutrient Pit", comp: "Nep-A", ph: 2.5, tox: 65 },
        { name: "Black Rose", feat: "Lignin Thorn", trait: "Petal Velour", comp: "Ros-B", ph: 5.8, tox: 20 }
      ],
      Aquatic: [
        { name: "Great White Shark", feat: "Ampullae Sense", trait: "Cartilage Drive", comp: "Car-C", ph: 8.0, tox: 15 },
        { name: "Giant Octopus", feat: "Distributed Brain", trait: "Camouflage Dye", comp: "Ent-D", ph: 7.8, tox: 30 },
        { name: "Electric Eel", feat: "Electrocyte Stack", trait: "Voltage Burst", comp: "Ele-E", ph: 7.9, tox: 45 },
        { name: "Blue Whale", feat: "Filter Baleen", trait: "Sonic Song", comp: "Bal-M", ph: 7.6, tox: 5 },
        { name: "Box Jellyfish", feat: "Nematocyst Harpoon", trait: "Venom Chain", comp: "Chi-F", ph: 8.2, tox: 110 },
        { name: "Axolotl", feat: "Blastema Regen", trait: "Larval Stasis", comp: "Amb-M", ph: 7.7, tox: 3 },
        { name: "Bull Shark", feat: "Salt Regulation", trait: "Freshwater Adapt", comp: "Car-L", ph: 8.1, tox: 25 },
        { name: "Mantis Shrimp", feat: "Impact Strike", trait: "Trifocal Vision", comp: "Odon-S", ph: 8.0, tox: 18 },
        { name: "Lionfish", feat: "Neurotoxin Spine", trait: "Fan Flare", comp: "Pte-V", ph: 7.9, tox: 80 },
        { name: "Anglerfish", feat: "Biolume Esca", trait: "Lure Mimic", comp: "Mel-J", ph: 7.5, tox: 35 }
      ],
      Arachnid: [
        { name: "Black Widow", feat: "Latrodectus Gland", trait: "Neurotoxic Silk", comp: "Lat-M", ph: 6.2, tox: 85 },
        { name: "Emperor Scorpion", feat: "Pincer Strength", trait: "Telson Stinger", comp: "Pan-I", ph: 6.4, tox: 70 },
        { name: "Goliath Spider", feat: "Urticating Hairs", trait: "Fang Force", comp: "The-B", ph: 6.6, tox: 40 },
        { name: "Sydney Funnelweb", feat: "Aggression Drive", trait: "Atracotoxin", comp: "Atra-R", ph: 6.1, tox: 100 },
        { name: "Brown Recluse", feat: "Necrotic Enzyme", trait: "Flat Profile", comp: "Lox-R", ph: 6.3, tox: 75 },
        { name: "Jumping Spider", feat: "Hydraulic Jump", trait: "Precision Sight", comp: "Phid-A", ph: 6.8, tox: 10 },
        { name: "Water Spider", feat: "Air Bubble Tank", trait: "Hydro Silk", comp: "Arg-A", ph: 7.0, tox: 15 },
        { name: "Camel Spider", feat: "Dual Chelicerae", trait: "Desert Speed", comp: "Sol-I", ph: 6.7, tox: 25 },
        { name: "Wolf Spider", feat: "Active Hunter", trait: "Ground Sense", comp: "Lyco-H", ph: 6.9, tox: 20 },
        { name: "Harvestman", feat: "Leg Autotomy", trait: "Odor Defense", comp: "Leio-P", ph: 7.1, tox: 5 }
      ],
      Human: [
        { name: "Human Sapiens", feat: "Cognitive Flex", trait: "Tool Building", comp: "Hom-S", ph: 7.4, tox: 20 },
        { name: "Human Nomad", feat: "Persistence Run", trait: "Heat Exhaustion", comp: "Hom-N", ph: 7.3, tox: 25 },
        { name: "Human Oracle", feat: "Neural Synapse", trait: "Insight Engine", comp: "Hom-O", ph: 7.6, tox: 50 },
        { name: "Human Elite", feat: "Reflex Trigger", trait: "Tactical Logic", comp: "Hom-E", ph: 7.5, tox: 40 },
        { name: "Human Rebel", feat: "Pain Tolerance", trait: "Adrenaline Spike", comp: "Hom-R", ph: 7.1, tox: 60 },
        { name: "Human Scholar", feat: "Memory Storage", trait: "Data Analysis", comp: "Hom-K", ph: 7.4, tox: 10 },
        { name: "Human Medic", feat: "Cell Repair", trait: "Biological Knowledge", comp: "Hom-M", ph: 7.2, tox: 15 },
        { name: "Human Pilot", feat: "Vestibular Sense", trait: "G-Tolerance", comp: "Hom-P", ph: 7.3, tox: 30 },
        { name: "Human Engineer", feat: "Spatial Geometry", trait: "Precision Craft", comp: "Hom-F", ph: 7.4, tox: 18 },
        { name: "Human Guard", feat: "Alertness State", trait: "Defensive Stance", comp: "Hom-G", ph: 7.5, tox: 35 }
      ]
    };

    const kingdoms = Object.keys(speciesData);
    const tempInventory = [];

    // Fills 600 unique slots by cycling through the 60 specific species
    for (let i = 0; i < 600; i++) {
      const kType = kingdoms[i % kingdoms.length];
      const sList = speciesData[kType];
      const species = sList[Math.floor((i / 6) % sList.length)];

      tempInventory.push({
        id: `SAMPLE-${i.toString().padStart(3, '0')}`,
        name: species.name,
        type: kType,
        feature: species.feat,
        trait: species.trait,
        compound: species.comp,
        basePh: species.ph,
        baseTox: species.tox,
        color: { Mammalian: "#FFD699", Avian: "#99EBFF", Botanical: "#A3FFD6", Aquatic: "#99B2FF", Human: "#FFFFFF", Arachnid: "#E066FF" }[kType],
        icon: { Mammalian: "🐺", Avian: "🦅", Botanical: "🌿", Aquatic: "🦈", Human: "👤", Arachnid: "🕷️" }[kType]
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
        physical: `Primary Structure: ${g1.feature} (from ${g1.name})`,
        secondary: `Secondary Trait: ${g2.trait} (from ${g2.name})`
      },
      serumSteps: [
        `1. Centrifuge ${g1.compound} from ${g1.name}.`,
        `2. Mix with ${g2.compound} from ${g2.name}.`,
        `3. Adjust to pH ${phVal}.`,
        `4. Heat to 37°C for bonding.`
      ]
    };
  };

  const res = getAnalysis(slotA, slotB);

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
          <input type="text" placeholder="SEARCH SAMPLES..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                 style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#FFF' }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {inventory.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())).map(g => (
            <div key={g.id} onMouseEnter={() => setHoveredGene(g)} onMouseLeave={() => setHoveredGene(null)} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} 
                 style={{ padding: '12px', margin: '8px 0', background: '#111', borderLeft: `5px solid ${g.color}`, cursor: 'grab', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{g.icon} {g.name}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {g.isHybrid && (
                  <>
                    <button onClick={() => {
                      const content = `DATA: ${g.name}\nSTRUCT: ${g.reportData.report.physical}\nSYNTHESIS:\n${g.reportData.serumSteps.join('\n')}`;
                      const blob = new Blob([content], {type: 'text/plain'});
                      const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${g.name}.txt`; link.click();
                    }} style={{ color: '#99EBFF', background: 'none', border: 'none', cursor: 'pointer' }}>DOC</button>
                    <button onClick={() => setInventory(inventory.filter(i => i.id !== g.id))} style={{ color: '#FF6666', background: 'none', border: 'none', cursor: 'pointer' }}>X</button>
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
                <input placeholder="HYBRID NAME..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} 
                       style={{ background: '#000', color: '#FFF', border: '1px solid #444', padding: '15px', flex: 1 }} />
                <button onClick={() => {
                  const newEntry = { ...slotA, id: Date.now(), name: hybridName.toUpperCase(), isHybrid: true, color: res.color, reportData: res, mode: view };
                  setInventory([newEntry, ...inventory]);
                  setSlotA(null); setSlotB(null); setHybridName("");
                }} style={{ background: res.color, color: '#000', border: 'none', padding: '0 25px', fontWeight: 'bold', cursor: 'pointer' }}>SAVE</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
