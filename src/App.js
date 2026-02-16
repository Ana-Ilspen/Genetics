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
      "Siberian", "Bengal", "Mojave", "Himalayan", "Andean", "Pacific", "Atlantic", "Congo", "Basin", "Island"
    ];
    
    const baseSpecies = [
      { name: "Wolf", type: "Mammalian", icon: "🐺", comp: "LUP", ph: 7.2, features: ["Neural Pack-Link", "Insulated Fur"], traits: ["Night-Vision", "Stamina"] },
      { name: "Tiger", type: "Mammalian", icon: "🐅", comp: "PAN", ph: 7.1, features: ["Thermal Claws", "Muscle Density"], traits: ["Ambush Reflex", "Apex Power"] },
      { name: "Falcon", type: "Avian", icon: "🦅", comp: "FAL", ph: 7.5, features: ["Aero-Keel", "Hollow Bones"], traits: ["Dive-Speed", "Wind Mastery"] },
      { name: "Shark", type: "Aquatic", icon: "🦈", comp: "SEL", ph: 8.2, features: ["Electro-Sense", "Gills"], traits: ["Blood-Scent", "Cartilage Drive"] },
      { name: "Human", type: "Human", icon: "👤", comp: "HOM", ph: 7.4, features: ["Frontal Lobe", "Opposable Thumbs"], traits: ["Logic", "Adaptability"] },
      { name: "Spider", type: "Arachnid", icon: "🕷️", comp: "ARA", ph: 6.5, features: ["Silk Spinnerets", "Exoskeleton"], traits: ["Web-Building", "Wall-Climbing"] },
      { name: "Octopus", type: "Aquatic", icon: "🐙", comp: "OCT", ph: 7.8, features: ["Ink Camo", "Flexible Body"], traits: ["Suction-Grip", "Mimicry"] },
      { name: "Scorpion", type: "Arachnid", icon: "🦂", comp: "SCO", ph: 6.2, features: ["Tail Stinger", "UV Exoskeleton"], traits: ["Paralytic Strike", "Burrowing"] }
    ];

    const tempInventory = [];
    let count = 0;
    for (let i = 0; i < 40; i++) {
      baseSpecies.forEach((species) => {
        if (count < 320) {
          const isHuman = species.type === "Human";
          tempInventory.push({
            id: `DB-${count}`,
            name: isHuman ? `${i % 2 === 0 ? "Male" : "Female"} Human` : `${animalRegions[i % animalRegions.length]} ${species.name}`,
            type: species.type,
            feature: species.features[count % species.features.length],
            trait: species.traits[count % species.traits.length],
            compound: `${species.comp}-${count}`,
            basePh: species.ph,
            baseTox: Math.floor(Math.random() * 30) + 10,
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
    const isBothHuman = g1.type === "Human" && g2.type === "Human";
    const phDiff = Math.abs(g1.basePh - g2.basePh);
    const stability = Math.max(5, (isBothHuman ? 100 : (g1.type === g2.type ? 90 : 65) - (phDiff * 10))).toFixed(0);
    const isLethal = stability < 40;

    if (isLethal) return { isLethal: true, color: "#FF6666", reason: "GENETIC COLLAPSE: pH variance exceeds viable bonding threshold." };

    let serum = null;
    if (!isBothHuman) {
      serum = {
        title: (g1.type === "Human" || g2.type === "Human") ? "SPECIFIC ENHANCEMENT SERUM" : "CHIMERIC HYBRID SERUM",
        physical: `Manifests [${g1.feature}] and [${g2.feature}] in host tissue.`,
        neural: `Subject gains instinctual [${g1.trait}] and [${g2.trait}] pathways.`,
        steps: [
          `1. Centrifuge ${g1.compound} and ${g2.compound} at 12,000 RPM for 15 minutes to isolate key sequences.`,
          `2. Incubate isolated strands in a viral vector for 4 hours at 37.5°C.`,
          `3. Introduce pH buffer to reach target ${((g1.basePh + g2.basePh)/2).toFixed(1)} and filter through a 0.2-micron mesh.`,
          `4. Stabilize via cryo-flash before intravenous or spinal administration.`
        ]
      };
    }

    return {
      isLethal: false, stability, color: view === 'splicer' ? "#99EBFF" : "#EBBBFF",
      serum,
      report: {
        type: isBothHuman ? "Sync" : "Augmentation",
        impact: `Integrating ${g1.name} features with ${g2.name} behavioral traits.`
      }
    };
  };

  const res = getAnalysis(slotA, slotB);

  return (
    <div onMouseMove={(e) => setMousePos({ x: e.clientX + 20, y: e.clientY + 20 })} 
         style={{ display: 'flex', height: '100vh', backgroundColor: '#000', color: '#EEE', fontFamily: 'monospace', overflow: 'hidden' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '400px', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', background: '#080808' }}>
        <div style={{ padding: '25px' }}>
          <button onClick={() => setView(view === 'splicer' ? 'serum' : 'splicer')} 
                  style={{ width: '100%', padding: '16px', background: view === 'serum' ? '#EBBBFF' : '#99EBFF', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}>
            {view === 'splicer' ? '🧪 LAB VIEW' : '🧬 SPLICER VIEW'}
          </button>
          <input type="text" placeholder="FILTER SAMPLES..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                 style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#FFF' }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 25px' }}>
          {inventory.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())).map(g => (
            <div key={g.id} onMouseEnter={() => setHoveredGene(g)} onMouseLeave={() => setHoveredGene(null)} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} 
                 style={{ padding: '14px', margin: '8px 0', background: '#111', borderLeft: `5px solid ${g.color}`, cursor: 'grab', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{g.icon} {g.name}</span>
              {g.isHybrid && <button onClick={() => setInventory(inventory.filter(i => i.id !== g.id))} style={{ color: '#FF6666', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>X</button>}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN VIEW */}
      <div style={{ flex: 1, padding: '60px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ letterSpacing: '6px', borderBottom: '2px solid #333', paddingBottom: '15px', fontSize: '32px' }}>{view === 'splicer' ? 'GENETIC SPLICER' : 'SERUM DISTILLERY'}</h1>
        
        <div style={{ display: 'flex', gap: '50px', margin: '60px 0' }}>
          {[slotA, slotB].map((slot, i) => (
            <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const d = JSON.parse(e.dataTransfer.getData("gene")); i === 0 ? setSlotA(d) : setSlotB(d); }}
              style={{ width: '240px', height: '300px', border: '1px solid #333', background: '#050505', textAlign: 'center', padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {slot ? (
                <>
                  <div style={{ fontSize: '70px' }}>{slot.icon}</div>
                  <b style={{color: slot.color, fontSize: '18px'}}>{slot.name}</b>
                  {slot.type === "Human" && (
                    <div style={{marginTop: '20px'}}>
                      <label style={{fontSize: '11px', color: '#888'}}>AGE</label>
                      <input type="number" value={manualAge} onChange={(e) => setManualAge(e.target.value)} 
                             style={{width: '60px', background: '#000', border: '1px solid #444', color: '#0F0', textAlign: 'center'}} />
                    </div>
                  )}
                </>
              ) : <p style={{color: '#444'}}>EMPTY_SLOT</p>}
            </div>
          ))}
        </div>

        {res && (
          <div style={{ width: '100%', maxWidth: '950px', padding: '40px', border: `1px solid ${res.color}`, background: '#080808' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
              <h2 style={{ color: res.color, margin: 0 }}>{res.isLethal ? 'FAILED' : `STABILITY: ${res.stability}%`}</h2>
              <button onClick={() => {setSlotA(null); setSlotB(null);}} style={{ background: '#222', color: '#FFF', border: 'none', padding: '10px 25px', cursor: 'pointer' }}>RESET</button>
            </div>

            {res.isLethal ? <p style={{color: '#FF6666'}}>{res.reason}</p> : (
              <div>
                {view === 'splicer' ? (
                  <div style={{fontSize: '18px', lineHeight: '1.6'}}>
                    <p><b>ANALYSIS:</b> {res.report.impact}</p>
                    <p><b>LINEAGE:</b> {slotA.name} [X] {slotB.name} (Subject: {manualAge}y/o)</p>
                  </div>
                ) : (
                  <div>
                    {res.serum ? (
                      <>
                        <h4 style={{color: '#EBBBFF', fontSize: '20px', margin: '0 0 15px 0'}}>{res.serum.title}</h4>
                        <p><b>PHYSICAL:</b> {res.serum.physical}</p>
                        <p><b>NEURAL:</b> {res.serum.neural}</p>
                        <div style={{marginTop: '20px', padding: '20px', background: '#000', border: '1px solid #333'}}>
                           <b style={{color: '#0F0'}}>SYNTHESIS STEPS:</b>
                           {res.serum.steps.map((s, i) => <p key={i} style={{fontSize: '13px', margin: '10px 0'}}>{s}</p>)}
                        </div>
                      </>
                    ) : <p>Neutral intra-species match. No serum required.</p>}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
                  <input placeholder="SPECIMEN_ID..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} 
                         style={{ background: '#000', color: '#FFF', border: '1px solid #333', padding: '15px', flex: 1 }} />
                  <button onClick={() => {
                    const newEntry = { 
                      ...slotA, 
                      id: Date.now(), 
                      name: hybridName.toUpperCase(), 
                      isHybrid: true, 
                      parents: [slotA.name, slotB.name],
                      color: res.color,
                      feature: `Hybrid [${slotA.feature} / ${slotB.feature}]`,
                      trait: `Hybrid [${slotA.trait} / ${slotB.trait}]`
                    };
                    setInventory([newEntry, ...inventory]);
                    setSlotA(null); setSlotB(null); setHybridName("");
                  }} style={{ background: res.color, color: '#000', border: 'none', padding: '0 35px', fontWeight: 'bold', cursor: 'pointer' }}>SAVE</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* TOOLTIP: Shows Characterstics + Lineage */}
      {hoveredGene && (
        <div style={{ position: 'fixed', left: mousePos.x, top: mousePos.y, zIndex: 100, background: '#111', border: `2px solid ${hoveredGene.color}`, padding: '15px', pointerEvents: 'none', maxWidth: '280px' }}>
          <b style={{ color: hoveredGene.color, fontSize: '15px' }}>{hoveredGene.name}</b>
          <p style={{margin: '10px 0 5px 0'}}><b>ANATOMY:</b> {hoveredGene.feature}</p>
          <p style={{margin: '0', color: '#AAA'}}><b>INSTINCT:</b> {hoveredGene.trait}</p>
          {hoveredGene.parents && (
            <div style={{marginTop: '15px', borderTop: '1px solid #333', paddingTop: '10px', fontSize: '11px', color: '#99EBFF'}}>
              <b>LINEAGE:</b> {hoveredGene.parents[0]} + {hoveredGene.parents[1]}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
