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
    const animalRegions = [
      "Arctic", "Tundra", "Desert", "Amazon", "Mountain", "Coastal", "Volcanic", "Subterranean", "Savanna", "Highland",
      "Glacial", "Tropical", "Steppe", "Canyon", "Abyssal", "Boreal", "Plateau", "Delta", "Marsh", "Crag",
      "Siberian", "Bengal", "Mojave", "Himalayan", "Andean", "Pacific", "Atlantic", "Congo", "Basin", "Island",
      "Feral", "Ancient", "Primal", "Apex", "Alpha", "Omega", "Prime", "Void", "Neon", "Cyber",
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

    for (let i = 0; i < 60; i++) {
      baseSpecies.forEach((species) => {
        if (count < 600) {
          let finalName = "";
          if (species.type === "Human") {
            const gender = i % 2 === 0 ? "Male" : "Female";
            const age = 18 + (i % 50);
            finalName = `${gender} (${age}) Human`;
          } else {
            finalName = `${animalRegions[i]} ${species.name}`;
          }
          const feat = species.features[count % species.features.length];
          const trait = species.traits[(count + 1) % species.traits.length];
          tempInventory.push({
            id: `DB-${count}`,
            name: finalName,
            type: species.type,
            feature: feat,
            trait: trait,
            compound: `${species.comp}-${count}`,
            basePh: (species.ph + (Math.random() * 0.4 - 0.2)).toFixed(1),
            baseTox: Math.floor(Math.random() * 40) + 10,
            color: { Mammalian: "#FFD699", Avian: "#99EBFF", Botanical: "#A3FFD6", Aquatic: "#99B2FF", Human: "#FFFFFF", Arachnid: "#E066FF" }[species.type],
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
    const isBothHuman = g1.type === "Human" && g2.type === "Human";
    
    // NEW: Dynamic Stability Calculation
    const phDiff = Math.abs(parseFloat(g1.basePh) - parseFloat(g2.basePh));
    const toxSum = parseInt(g1.baseTox) + parseInt(g2.baseTox);
    const baseStability = isBothHuman ? 100 : (g1.type === g2.type ? 90 : 60);
    // Stability drops based on pH mismatch and high combined toxicity
    const stability = Math.max(5, (baseStability - (phDiff * 15) - (toxSum * 0.1))).toFixed(0);

    const toxVal = toxSum;
    const phVal = ((parseFloat(g1.basePh) + parseFloat(g2.basePh)) / 2).toFixed(1);
    const isLethal = stability < 35 || toxVal > 160;

    let neuralImpact = "";
    if (isLethal) {
        neuralImpact = "TOTAL BRAIN STEM LIQUEFACTION: Subject deceased.";
    } else if (isBothHuman) {
        neuralImpact = "OPTIMAL SYNC: Subject experiences peak cognitive clarity and rapid muscle-memory acquisition. No cross-species rejection.";
    } else {
        const comboSet = new Set([g1.type, g2.type]);
        if (comboSet.has("Arachnid")) neuralImpact = "SEVERE: Subject experiences phantom limb syndrome (8 limbs) and predatory hunger.";
        else if (comboSet.has("Aquatic") && comboSet.has("Mammalian")) neuralImpact = "SENSORY CONFLICT: Chronic 'drowning' sensation and echo-location vertigo.";
        else if (comboSet.has("Avian")) neuralImpact = "STABLE: Heightened spatial awareness, but acute claustrophobia.";
        else if (comboSet.has("Mammalian")) neuralImpact = "ADAPTIVE: Shift in hierarchy logic; subject displays aggressive alpha-behavior.";
        else neuralImpact = "NEUTRAL: Minor circadian disruption; subject requires 14h REM sleep.";
    }

    return {
      isLethal, stability, toxicity: `${toxVal}%`, ph: phVal,
      color: isLethal ? "#FF6666" : (view === 'splicer' ? "#99EBFF" : "#EBBBFF"),
      report: {
        physical: `Combining ${g1.name}'s [${g1.feature}] with ${g2.name}'s [${g2.feature}].`,
        secondary: `Resulting ${isBothHuman ? 'Enhanced Human' : 'Hybrid'} gains [${g2.trait}].`,
        reasoning: isBothHuman ? "INTRA-SPECIES HARMONY: Human strands reinforced." : (isLethal ? "STRAND COLLAPSE: Sequences too diverse." : "STABLE SYNERGY: Cellular bonding successful."),
        neural: neuralImpact
      },
      serumA: {
        title: isBothHuman ? "NEURAL OPTIMIZATION SERUM" : "TARGETED AUGMENTATION",
        desc: isBothHuman ? `Inject into ${g1.name} to maximize [${g2.trait}] potential.` : `Inject into ${g1.name} to force-evolve [${g2.trait}].`,
        steps: [`1. Distill ${g2.compound}`, `2. Purify via ${isBothHuman ? 'Bio-Filter' : 'Cross-Membrane'}`, `3. Balance to pH ${phVal}`]
      },
      serumB: {
        title: isBothHuman ? "ELITE HUMAN SYNC SERUM" : "HUMAN CHIMERA SERUM",
        desc: isBothHuman ? `Allows a baseline Human to sync [${g1.feature}] and [${g2.trait}] without DNA alteration.` : `Allows Human to manifest ${g1.feature} and ${g2.trait}.`,
        steps: [`1. Combine ${g1.compound} & ${g2.compound}`, `2. Stabilize ${isBothHuman ? 'Neuro-links' : 'Mutagenic agents'}`, `3. Spinal injection`]
      }
    };
  };

  const res = getAnalysis(slotA, slotB);

  const handleDownload = () => {
    if (!res) return;
    const isHumanEnhancer = slotA.type === "Human" && slotB.type === "Human";
    
    const docContent = `
============================================================
           OFFICIAL LAB REPORT: ${hybridName.toUpperCase()}
============================================================
GENETIC SOURCE A: ${slotA.name} (${slotA.type})
GENETIC SOURCE B: ${slotB.name} (${slotB.type})
OVERALL STABILITY: ${res.stability}%
TOXICITY RATING: ${res.toxicity}
TARGET pH: ${res.ph}
------------------------------------------------------------
SERUM CONSTITUENTS:
- Base: 500ml Isotonic Saline Solution
- Carriers: Adeno-Associated Viral (AAV) Vectors
- Splicing Agents: ${slotA.compound} & ${slotB.compound}
- Stabilizers: ${isHumanEnhancer ? "Neuro-Peptide Buffer" : "Synthetic Protein Scaffold"}

SYNTHESIS PROCESS:
1. Centrifuge Source A and B at 15,000 RPM to isolate specific strands.
2. Introduce ${slotA.compound} into the viral carrier for 24 hours.
3. Cold-fuse with ${slotB.compound} at ${res.ph} pH to prevent strand rejection.
4. Filter through a carbon-nanotube mesh to reduce toxicity to ${res.toxicity}.

EXPECTED PHYSICAL ALTERATIONS:
- Primary: Development of [${slotA.feature}].
- Secondary: Integration of [${slotB.trait}] pathways.
- ${isHumanEnhancer ? "REINFORCED: Accelerated cellular repair and increased muscle-fiber density." : "MUTATION: Structural skeletal shifts and skin pigment variance."}

EXPECTED NEUROLOGICAL IMPACT:
- Current Match: ${res.report.neural}
- ${isHumanEnhancer ? "COGNITIVE: Increased synaptic firing speed; 30% reduction in reaction time." : "INSTINCTUAL: Subject will manifest predatory/defensive animalistic behaviors."}

ADMINISTRATION:
${isHumanEnhancer ? "Intravenous drip (2 hours) followed by 12 hours of monitored sleep." : "Direct spinal injection. Subject must be sedated during the 6-hour mutation window."}
============================================================
    `;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([docContent], { type: 'text/plain' }));
    link.download = `${hybridName.replace(/\s+/g, '_')}_Lab_Report.txt`;
    link.click();
  };

  return (
    <div onMouseMove={(e) => setMousePos({ x: e.clientX + 20, y: e.clientY + 20 })} 
         style={{ display: 'flex', height: '100vh', backgroundColor: '#000', color: '#EEE', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      
      {hoveredGene && (
        <div style={{ position: 'fixed', left: mousePos.x, top: mousePos.y, zIndex: 100, background: '#111', border: `2px solid ${hoveredGene.color}`, padding: '15px', borderRadius: '8px', pointerEvents: 'none' }}>
          <b style={{ color: hoveredGene.color, fontSize: '18px' }}>{hoveredGene.name}</b>
          <p style={{ margin: '5px 0' }}>FEATURE: {hoveredGene.feature}</p>
          <p style={{ color: '#888', margin: '0' }}>TRAIT: {hoveredGene.trait}</p>
        </div>
      )}

      <div style={{ width: '380px', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', background: '#080808' }}>
        <div style={{ padding: '20px' }}>
          <button onClick={() => setView(view === 'splicer' ? 'serum' : 'splicer')} 
                  style={{ width: '100%', padding: '14px', background: view === 'serum' ? '#EBBBFF' : '#99EBFF', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
            {view === 'splicer' ? '🧪 GO TO SERUM LAB' : '🧬 GO TO SPLICER'}
          </button>
          <input type="text" placeholder="SEARCH 600 SAMPLES..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                 style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#FFF' }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {inventory.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())).map(g => (
            <div key={g.id} onMouseEnter={() => setHoveredGene(g)} onMouseLeave={() => setHoveredGene(null)} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} 
                 style={{ padding: '12px', margin: '8px 0', background: '#111', borderLeft: `5px solid ${g.color}`, cursor: 'grab', display: 'flex', justifyContent: 'space-between' }}>
              <span>{g.icon} {g.name}</span>
              {g.isHybrid && <button onClick={() => setInventory(inventory.filter(i => i.id !== g.id))} style={{ color: '#FF6666', background: 'none', border: 'none', cursor: 'pointer' }}>X</button>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '30px' }}>{view === 'splicer' ? 'GENOME RECOMBINATOR' : 'SERUM DISTILLERY'}</h1>
        
        <div style={{ display: 'flex', gap: '40px', marginBottom: '30px' }}>
          {[slotA, slotB].map((slot, i) => (
            <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const d = JSON.parse(e.dataTransfer.getData("gene")); i === 0 ? setSlotA(d) : setSlotB(d); }}
              style={{ width: '200px', height: '250px', border: '2px dashed #444', background: '#050505', textAlign: 'center', padding: '20px', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {slot ? <> <div style={{ fontSize: '60px' }}>{slot.icon}</div> <b style={{color: slot.color}}>{slot.name}</b> </> : <p style={{color: '#444'}}>DRAG GENE</p>}
            </div>
          ))}
        </div>

        {res && (
          <div style={{ width: '100%', maxWidth: '850px', padding: '30px', border: `2px solid ${res.color}`, background: '#0A0A0A', borderRadius: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ color: res.color, margin: 0 }}>{res.isLethal ? 'ANALYSIS: FAILED' : `STABILITY: ${res.stability}%`}</h2>
              <button onClick={() => {setSlotA(null); setSlotB(null);}} style={{ background: '#333', color: '#FFF', border: 'none', padding: '8px 20px', cursor: 'pointer' }}>RESET</button>
            </div>
            
            {view === 'splicer' ? (
              <div style={{ fontSize: '18px' }}>
                <p>🧬 {res.report.physical}</p>
                <p>🧬 {res.report.secondary}</p>
                <div style={{ padding: '15px', background: '#000', border: '1px solid #222', marginTop: '20px' }}>
                   <b>LAB NOTES:</b> {res.report.reasoning}
                   <div style={{marginTop: '10px', color: '#EBBBFF'}}><b>NEURAL MATCH:</b> {res.report.neural}</div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#000', padding: '15px', border: '1px solid #333' }}>
                  <h4 style={{ color: '#EBBBFF', marginTop: 0 }}>{res.serumA.title}</h4>
                  <p style={{ fontSize: '13px' }}>{res.serumA.desc}</p>
                  {res.serumA.steps.map((s, i) => <div key={i}>• {s}</div>)}
                </div>
                <div style={{ background: '#000', padding: '15px', border: '1px solid #333' }}>
                  <h4 style={{ color: '#99EBFF', marginTop: 0 }}>{res.serumB.title}</h4>
                  <p style={{ fontSize: '13px' }}>{res.serumB.desc}</p>
                  {res.serumB.steps.map((s, i) => <div key={i}>• {s}</div>)}
                </div>
              </div>
            )}

            {!res.isLethal && (
              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                <input placeholder="HYBRID NAME..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} 
                       style={{ background: '#000', color: '#FFF', border: '1px solid #444', padding: '15px', flex: 1 }} />
                <button onClick={() => {
                  const newEntry = { ...slotA, id: Date.now(), name: hybridName.toUpperCase(), isHybrid: true, color: res.color, reportData: res };
                  setInventory([newEntry, ...inventory]);
                  setSlotA(null); setSlotB(null); setHybridName("");
                }} style={{ background: res.color, color: '#000', border: 'none', padding: '0 25px', fontWeight: 'bold', cursor: 'pointer' }}>SAVE</button>
                <button onClick={handleDownload} style={{ background: '#333', color: '#FFF', border: 'none', padding: '0 15px', cursor: 'pointer' }}>DOC</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
