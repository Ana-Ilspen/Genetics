import React, { useState, useEffect } from 'react';

const App = () => {
  const [view, setView] = useState('splicer'); 
  const [slotA, setSlotA] = useState(null);
  const [slotB, setSlotB] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [hybridName, setHybridName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [manualAge, setManualAge] = useState(15); 
  const [hoveredGene, setHoveredGene] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const animalRegions = [
      "Arctic", "Tundra", "Desert", "Amazon", "Mountain", "Coastal", "Volcanic", "Subterranean", "Savanna", "Highland",
      "Glacial", "Tropical", "Steppe", "Canyon", "Abyssal", "Boreal", "Plateau", "Delta", "Marsh", "Crag",
      "Siberian", "Bengal", "Mojave", "Himalayan", "Andean", "Pacific", "Atlantic", "Congo", "Basin", "Island",
      "Redwood", "Everglade", "Badlands", "Tidal", "Coral", "Frost", "Dune", "Taiga", "Gully", "Summit",
      "Magma", "Cavern", "Prairie", "Oasis", "Misty", "Wild", "Great", "Deep", "North", "South"
    ];
    
    const baseSpecies = [
      { name: "Wolf", type: "Mammalian", icon: "🐺", comp: "LUP", ph: 7.2, features: ["Neural Pack-Link", "Insulated Fur", "Scent Tracking", "Jaw Pressure"], traits: ["Night-Vision", "Stamina", "Howl Frequency"] },
      { name: "Tiger", type: "Mammalian", icon: "🐅", comp: "PAN", ph: 7.1, features: ["Thermal Claws", "Retractable Hooks", "Striped Camo", "Muscle Density"], traits: ["Ambush Reflex", "Apex Power", "Silent Stalk"] },
      { name: "Falcon", type: "Avian", icon: "🦅", comp: "FAL", ph: 7.5, features: ["Aero-Keel", "Nictitating Membrane", "Hollow Bones"], traits: ["Dive-Speed", "Telescopic Sight", "Wind Mastery"] },
      { name: "Shark", type: "Aquatic", icon: "🦈", comp: "SEL", ph: 8.2, features: ["Electro-Sense", "Dermal Denticles", "Gills"], traits: ["Blood-Scent", "Cartilage Drive", "Rampage Mode"] },
      { name: "Human", type: "Human", icon: "👤", comp: "HOM", ph: 7.4, features: ["Frontal Lobe", "Opposable Thumbs", "Bipedal Frame"], traits: ["Tool Use", "Logic", "Adaptability", "Endurance"] },
      { name: "Spider", type: "Arachnid", icon: "🕷️", comp: "ARA", ph: 6.5, features: ["Silk Spinnerets", "Multi-Eyes", "Exoskeleton"], traits: ["Web-Building", "Wall-Climbing", "Vibration-Sense"] },
      { name: "Eagle", type: "Avian", icon: "🦅", comp: "AQU", ph: 7.6, features: ["Talon Grip", "Retinal Zoom", "Feather-Lock"], traits: ["Aerobatics", "Kinetic Dive", "Cloud-Sight"] },
      { name: "Octopus", type: "Aquatic", icon: "🐙", comp: "OCT", ph: 7.8, features: ["Ink Camo", "Flexible Body", "Distributed Brain"], traits: ["Suction-Grip", "Mimicry", "Regeneration"] },
      { name: "Raven", type: "Avian", icon: "🐦", comp: "COR", ph: 7.2, features: ["Logic Center", "Mimicry Engine", "Shadow-Wing"], traits: ["Problem Solving", "Cunning", "Deception"] },
      { name: "Scorpion", type: "Arachnid", icon: "🦂", comp: "SCO", ph: 6.2, features: ["Tail Stinger", "UV Exoskeleton", "Pincers"], traits: ["Paralytic Strike", "Burrowing", "Armor-Plate"] }
    ];

    const tempInventory = [];
    let count = 0;

    for (let i = 0; i < 50; i++) {
      baseSpecies.forEach((species) => {
        if (count < 500) {
          let finalName = "";
          if (species.type === "Human") {
            finalName = `${i % 2 === 0 ? "Male" : "Female"} Human`;
          } else {
            finalName = `${animalRegions[i % animalRegions.length]} ${species.name}`;
          }
          
          tempInventory.push({
            id: `DB-${count}`,
            name: finalName,
            type: species.type,
            feature: species.features[count % species.features.length],
            trait: species.traits[count % species.traits.length],
            compound: `${species.comp}-${count}`,
            basePh: (species.ph + (Math.random() * 0.4 - 0.2)).toFixed(1),
            baseTox: Math.floor(Math.random() * 40) + 10,
            color: { Mammalian: "#FFD699", Avian: "#99EBFF", Aquatic: "#99B2FF", Human: "#FFFFFF", Arachnid: "#E066FF" }[species.type],
            icon: species.icon
          });
          count++;
        }
      });
    }
    setInventory(tempInventory);
  }, []);

  const getAnalysis = (g1, g2) => {
    if (!g1 || !g2) return null;
    const isHumanA = g1.type === "Human";
    const isHumanB = g2.type === "Human";
    const isBothHuman = isHumanA && isHumanB;

    const phDiff = Math.abs(parseFloat(g1.basePh) - parseFloat(g2.basePh));
    const toxSum = parseInt(g1.baseTox) + parseInt(g2.baseTox);
    const baseStability = isBothHuman ? 100 : (g1.type === g2.type ? 90 : 60);
    const stability = Math.max(5, (baseStability - (phDiff * 15) - (toxSum * 0.1))).toFixed(0);
    const isLethal = stability < 35 || toxSum > 160;

    if (isLethal) return { isLethal: true, color: "#FF6666", reason: `pH variance (${phDiff}) or toxicity (${toxSum}) exceeds viable cellular limits.` };

    let serum = null;
    if (!isBothHuman) {
      const animalSource = !isHumanA ? g1 : g2;
      const secondSource = !isHumanB ? g2 : g1;
      
      serum = {
        title: isHumanA || isHumanB ? "ANIMAL ENHANCEMENT SERUM" : "HYBRID CHIMERA SERUM",
        physical: `Manifests [${g1.feature}] and [${g2.feature}] in host tissue.`,
        neural: `Subject gains instinctual [${g1.trait}] and [${g2.trait}] pathways.`,
        steps: [`Distill ${g1.compound}`, `Fuse with ${g2.compound}`, `Buffer to pH ${((parseFloat(g1.basePh)+parseFloat(g2.basePh))/2).toFixed(1)}`]
      };
    }

    return {
      isLethal: false, stability, ph: ((parseFloat(g1.basePh) + parseFloat(g2.basePh)) / 2).toFixed(1),
      toxicity: `${toxSum}%`, color: view === 'splicer' ? "#99EBFF" : "#EBBBFF",
      serum,
      report: {
        type: isBothHuman ? "Intra-species Sync" : (isHumanA || isHumanB ? "Human Augmentation" : "Cross-Species Hybrid"),
        impact: isBothHuman ? "Neutral: Baseline human strands reinforced." : `Integrating ${g1.name}'s [${g1.feature}] with ${g2.name}'s [${g2.trait}].`
      }
    };
  };

  const res = getAnalysis(slotA, slotB);

  const handleDownload = () => {
    if (!res || res.isLethal) return;
    const content = `
LAB REPORT: ${hybridName || "UNNAMED"}
--------------------------------------
TYPE: ${res.report.type}
STABILITY: ${res.stability}% | pH: ${res.ph}
LINEAGE: ${slotA.name} [X] ${slotB.name}
TARGET AGE: ${manualAge}

PHYSICAL ANALYSIS:
${res.report.impact}

${res.serum ? `SERUM CONSTITUENTS:
- Compound A: ${slotA.compound}
- Compound B: ${slotB.compound}
- Neurological Effect: ${res.serum.neural}
- Physical Change: ${res.serum.physical}
- Synthesis: ${res.serum.steps.join(' -> ')}` : "No serum required for intra-species synchronization."}
    `;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([content]));
    link.download = `Report_${hybridName || 'Subject'}.txt`;
    link.click();
  };

  return (
    <div onMouseMove={(e) => setMousePos({ x: e.clientX + 20, y: e.clientY + 20 })} 
         style={{ display: 'flex', height: '100vh', backgroundColor: '#000', color: '#EEE', fontFamily: 'monospace', overflow: 'hidden' }}>
      
      <div style={{ width: '350px', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', background: '#080808' }}>
        <div style={{ padding: '20px' }}>
          <button onClick={() => setView(view === 'splicer' ? 'serum' : 'splicer')} 
                  style={{ width: '100%', padding: '12px', background: view === 'serum' ? '#EBBBFF' : '#99EBFF', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
            {view === 'splicer' ? '🧪 LAB VIEW' : '🧬 SPLICER VIEW'}
          </button>
          <input type="text" placeholder="FILTER GENOMES..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                 style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#FFF' }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {inventory.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())).map(g => (
            <div key={g.id} onMouseEnter={() => setHoveredGene(g)} onMouseLeave={() => setHoveredGene(null)} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} 
                 style={{ padding: '10px', margin: '5px 0', background: '#111', borderLeft: `4px solid ${g.color}`, cursor: 'grab', fontSize: '12px' }}>
              {g.icon} {g.name}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ letterSpacing: '4px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>{view === 'splicer' ? 'GENETIC SPLICER' : 'SERUM DISTILLERY'}</h1>
        
        <div style={{ display: 'flex', gap: '30px', margin: '40px 0' }}>
          {[slotA, slotB].map((slot, i) => (
            <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const d = JSON.parse(e.dataTransfer.getData("gene")); i === 0 ? setSlotA(d) : setSlotB(d); }}
              style={{ width: '180px', height: '220px', border: '1px solid #333', background: '#050505', textAlign: 'center', padding: '15px', borderRadius: '4px' }}>
              {slot ? (
                <>
                  <div style={{ fontSize: '50px' }}>{slot.icon}</div>
                  <b style={{color: slot.color}}>{slot.name}</b>
                  {slot.type === "Human" && (
                    <div style={{marginTop: '15px'}}>
                      <label style={{fontSize: '10px', display: 'block'}}>SUBJECT AGE</label>
                      <input type="number" value={manualAge} onChange={(e) => setManualAge(e.target.value)} 
                             style={{width: '60px', background: '#000', border: '1px solid #444', color: '#0F0', textAlign: 'center'}} />
                    </div>
                  )}
                </>
              ) : <p style={{color: '#444', marginTop: '80px'}}>EMPTY_SLOT</p>}
            </div>
          ))}
        </div>

        {res && (
          <div style={{ width: '100%', maxWidth: '800px', padding: '25px', border: `1px solid ${res.color}`, background: '#080808' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={{ color: res.color }}>{res.isLethal ? 'NON-VIABLE COMBINATION' : `STABILITY: ${res.stability}%`}</h2>
              <button onClick={() => {setSlotA(null); setSlotB(null);}} style={{ background: '#222', color: '#FFF', border: 'none', padding: '5px 15px', cursor: 'pointer' }}>RESET</button>
            </div>

            {res.isLethal ? <p style={{color: '#FF6666'}}>{res.reason}</p> : (
              <div>
                {view === 'splicer' ? (
                  <div style={{fontSize: '14px'}}>
                    <p><b>TRANSFORMATION:</b> {res.report.impact}</p>
                    <p><b>LINEAGE:</b> {slotA.name} / {slotB.name} (Age: {manualAge})</p>
                    <p><b>pH BALANCE:</b> {res.ph} | <b>TOXICITY:</b> {res.toxicity}</p>
                  </div>
                ) : (
                  <div style={{background: '#000', padding: '15px', border: '1px solid #222'}}>
                    {res.serum ? (
                      <>
                        <h4 style={{margin: '0 0 10px 0', color: '#EBBBFF'}}>{res.serum.title}</h4>
                        <p style={{fontSize: '13px'}}><b>PHYSICAL:</b> {res.serum.physical}</p>
                        <p style={{fontSize: '13px'}}><b>NEURAL:</b> {res.serum.neural}</p>
                        <p style={{fontSize: '11px', color: '#888'}}><b>SYNTHESIS:</b> {res.serum.steps.join(' -> ')}</p>
                      </>
                    ) : <p>Neutral match. No serum required for enhancement.</p>}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                  <input placeholder="SPECIMEN_ID..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} 
                         style={{ background: '#000', color: '#FFF', border: '1px solid #333', padding: '10px', flex: 1 }} />
                  <button onClick={() => {
                    const newEntry = { ...slotA, id: Date.now(), name: hybridName.toUpperCase(), isHybrid: true, color: res.color };
                    setInventory([newEntry, ...inventory]);
                    setSlotA(null); setSlotB(null); setHybridName("");
                  }} style={{ background: res.color, color: '#000', border: 'none', padding: '0 20px', fontWeight: 'bold', cursor: 'pointer' }}>SAVE</button>
                  <button onClick={handleDownload} style={{ background: '#333', color: '#FFF', border: 'none', padding: '0 15px', cursor: 'pointer' }}>DOC</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {hoveredGene && (
        <div style={{ position: 'fixed', left: mousePos.x, top: mousePos.y, zIndex: 100, background: '#111', border: `1px solid ${hoveredGene.color}`, padding: '10px', fontSize: '11px', pointerEvents: 'none' }}>
          <b style={{ color: hoveredGene.color }}>{hoveredGene.name}</b>
          <div>PH: {hoveredGene.basePh} | TOX: {hoveredGene.baseTox}</div>
          <div style={{color: '#888'}}>F: {hoveredGene.feature}</div>
        </div>
      )}
    </div>
  );
};

export default App;
