import React, { useState, useEffect } from 'react';

const App = () => {
  const [view, setView] = useState('splicer'); 
  const [slotA, setSlotA] = useState(null);
  const [slotB, setSlotB] = useState(null);
  const [ageA, setAgeA] = useState(25);
  const [ageB, setAgeB] = useState(25);
  const [inventory, setInventory] = useState([]);
  const [hybridName, setHybridName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredGene, setHoveredGene] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const animalRegions = ["Arctic", "Tundra", "Desert", "Amazon", "Mountain", "Coastal", "Volcanic", "Subterranean", "Savanna", "Highland", "Siberian", "Bengal", "Mojave", "Himalayan", "Andean", "Pacific", "Atlantic", "Congo", "Boreal", "Gully", "Summit", "Plateau", "Delta", "Marsh"];
    
    const speciesData = {
      Mammalian: {
        icons: ["🐺", "🐅", "🐻", "🦍"],
        features: ["Insulated Fur", "Thermal Claws", "Muscle Density", "Jaw Pressure", "Enhanced Olfactory Bulb", "Subcutaneous Fat Layer"],
        traits: ["Night-Vision", "Stamina", "Pack Mentality", "Apex Power", "Silent Stalk", "Territorial Aggression"]
      },
      Avian: {
        icons: ["🦅", "🦉", "🐦"],
        features: ["Aero-Keel", "Hollow Bones", "Nictitating Membrane", "Talon Grip", "Pneumatic Sacs", "Lightweight Beak"],
        traits: ["Dive-Speed", "Wind Mastery", "Telescopic Sight", "Aerobatics", "Kinetic Precision", "High-Altitude Breathing"]
      },
      Aquatic: {
        icons: ["🦈", "🐙", "🐋"],
        features: ["Electro-Sense", "Gills", "Ink Camo", "Flexible Body", "Dermal Denticles", "Bioluminescent Patches"],
        traits: ["Blood-Scent", "Cartilage Drive", "Mimicry", "Suction-Grip", "Pressure Resistance", "Hydro-Dynamic Speed"]
      },
      Arachnid: {
        icons: ["🕷️", "🦂"],
        features: ["Silk Spinnerets", "Exoskeleton", "Tail Stinger", "UV Sensitivity", "Multi-Eyes", "Chellicerae Fangs"],
        traits: ["Web-Building", "Wall-Climbing", "Paralytic Strike", "Burrowing", "Vibration Sense", "External Digestion"]
      },
      Human: {
        icons: ["👤"],
        features: ["Frontal Lobe", "Opposable Thumbs", "Bipedal Frame", "Complex Vocal Cords", "Sweat Gland Efficiency"],
        traits: ["Logic", "Adaptability", "Tool Use", "Endurance", "Pattern Recognition"]
      }
    };

    const tempInventory = [];
    let count = 0;
    const types = Object.keys(speciesData);

    for (let i = 0; i < 80; i++) {
      types.forEach((type) => {
        if (count < 600) {
          const data = speciesData[type];
          const isHuman = type === "Human";
          
          // Selection logic ensures diversity across samples
          const featIdx = (count + i) % data.features.length;
          const traitIdx = (count * 2 + i) % data.traits.length;
          const iconIdx = count % data.icons.length;

          tempInventory.push({
            id: `DB-${count}`,
            name: isHuman ? `${i % 2 === 0 ? "Male" : "Female"} Human` : `${animalRegions[i % animalRegions.length]} ${type === 'Mammalian' ? (i%2===0?'Wolf':'Tiger') : type}`,
            type: type,
            feature: data.features[featIdx],
            trait: data.traits[traitIdx],
            compound: `${type.substring(0,3).toUpperCase()}-${count}`,
            basePh: (7.0 + (Math.random() * 1.5 - 0.75)).toFixed(1),
            baseTox: Math.floor(Math.random() * 40) + 5,
            color: { Mammalian: "#FFD699", Avian: "#99EBFF", Aquatic: "#99B2FF", Human: "#FFFFFF", Arachnid: "#E066FF" }[type],
            icon: data.icons[iconIdx]
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
    const phDiff = Math.abs(parseFloat(g1.basePh) - parseFloat(g2.basePh));
    const stability = Math.max(5, (isBothHuman ? 100 : (g1.type === g2.type ? 90 : 65) - (phDiff * 12))).toFixed(0);
    const isLethal = stability < 40;

    if (isLethal) return { isLethal: true, color: "#FF6666", reason: "GENETIC COLLAPSE: Incompatible pH balance causing cellular apoptosis." };

    return {
      isLethal: false, stability, color: view === 'splicer' ? "#99EBFF" : "#EBBBFF",
      ph: ((parseFloat(g1.basePh) + parseFloat(g2.basePh))/2).toFixed(1),
      tox: parseInt(g1.baseTox) + parseInt(g2.baseTox),
      report: {
        physical: `Primary Graft: ${g1.feature}. Secondary Integration: ${g2.feature}.`,
        neural: `Subject will manifest ${g1.trait} instincts and ${g2.trait} cognitive patterns.`,
        protocol: [
          `1. Isolate ${g1.compound} & ${g2.compound} via high-speed centrifugation (14k RPM).`,
          `2. Synthesize mRNA carrier using a viral chassis; stabilize at 4°C.`,
          `3. Adjust pH to ${((parseFloat(g1.basePh) + parseFloat(g2.basePh))/2).toFixed(1)} to prevent immediate host rejection.`,
          `4. Intravenous delivery over 180 minutes under heavy sedation.`
        ]
      }
    };
  };

  const res = getAnalysis(slotA, slotB);

  const handleDownload = () => {
    if (!res || res.isLethal) return;
    const content = `
============================================================
           OFFICIAL GENETIC RECOMBINATION REPORT
============================================================
SPECIMEN ID: ${hybridName.toUpperCase() || "UNIDENTIFIED"}
DATE: ${new Date().toLocaleDateString()}
STABILITY RATING: ${res.stability}% 
TOXICITY LEVEL: ${res.tox}%

LINEAGE DATA:
- PRIMARY DONOR: ${slotA.name} [Type: ${slotA.type}]
- SECONDARY DONOR: ${slotB.name} [Type: ${slotB.type}]
- HOST AGES: ${slotA.type === 'Human' ? ageA : 'N/A'} | ${slotB.type === 'Human' ? ageB : 'N/A'}

I. MORPHOLOGICAL DEVIATIONS
The subject will undergo rapid tissue restructuring. The integration of ${slotA.feature} 
will result in visible skeletal and dermal shifts. ${slotB.feature} will manifest 
as secondary physical augmentations, significantly increasing metabolic demand.

II. NEURO-PSYCHOLOGICAL PROFILE
- DOMINANT INSTINCTS: ${slotA.trait}
- SECONDARY COGNITION: ${slotB.trait}
WARNING: High risk of personality dissolution. Subject may exhibit 
extreme predatory behaviors or chronic sensory overload.

III. SYNTHESIS PROTOCOL
${res.report.protocol.join('\n')}

IV. PROGNOSIS
Rejection risk is ${100 - res.stability}%. If stability holds for 48 hours, 
augmentation is considered permanent. Post-injection monitoring for 
neurological collapse is mandatory.
============================================================`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([content], {type: 'text/plain'}));
    link.download = `REPORT_${hybridName || 'SUBJECT'}.txt`;
    link.click();
  };

  return (
    <div onMouseMove={(e) => setMousePos({ x: e.clientX + 20, y: e.clientY + 20 })} 
         style={{ display: 'flex', height: '100vh', backgroundColor: '#000', color: '#EEE', fontFamily: 'monospace', overflow: 'hidden' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '400px', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', background: '#080808' }}>
        <div style={{ padding: '25px' }}>
          <button onClick={() => setView(view === 'splicer' ? 'serum' : 'splicer')} 
                  style={{ width: '100%', padding: '16px', background: view === 'serum' ? '#EBBBFF' : '#99EBFF', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}>
            {view === 'splicer' ? '🧪 GO TO SERUM LAB' : '🧬 GO TO SPLICER'}
          </button>
          <input type="text" placeholder="SEARCH SAMPLES..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
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

      {/* MAIN */}
      <div style={{ flex: 1, padding: '60px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ letterSpacing: '6px', borderBottom: '2px solid #333', paddingBottom: '15px', fontSize: '32px' }}>{view === 'splicer' ? 'GENOME RECOMBINATOR' : 'SERUM DISTILLERY'}</h1>
        
        <div style={{ display: 'flex', gap: '50px', margin: '40px 0' }}>
          {[ {slot: slotA, age: ageA, setAge: setAgeA, setSlot: setSlotA}, {slot: slotB, age: ageB, setAge: setAgeB, setSlot: setSlotB} ].map((item, i) => (
            <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const d = JSON.parse(e.dataTransfer.getData("gene")); item.setSlot(d); }}
              style={{ width: '240px', height: '320px', border: '1px solid #333', background: '#050505', textAlign: 'center', padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {item.slot ? (
                <>
                  <div style={{ fontSize: '70px' }}>{item.slot.icon}</div>
                  <b style={{color: item.slot.color, fontSize: '18px'}}>{item.slot.name}</b>
                  {item.slot.type === "Human" && (
                    <div style={{marginTop: '20px'}}>
                      <label style={{fontSize: '11px', color: '#888'}}>SUBJECT AGE</label>
                      <input type="number" value={item.age} onChange={(e) => item.setAge(e.target.value)} 
                             style={{width: '60px', background: '#000', border: '1px solid #444', color: '#0F0', textAlign: 'center', fontSize: '16px'}} />
                    </div>
                  )}
                </>
              ) : <p style={{color: '#444'}}>DRAG_GENE</p>}
            </div>
          ))}
        </div>

        {res && (
          <div style={{ width: '100%', maxWidth: '950px', padding: '40px', border: `1px solid ${res.color}`, background: '#080808' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
              <h2 style={{ color: res.color, margin: 0 }}>{res.isLethal ? 'NON-VIABLE' : `STABILITY: ${res.stability}%`}</h2>
              <button onClick={() => {setSlotA(null); setSlotB(null);}} style={{ background: '#222', color: '#FFF', border: 'none', padding: '10px 25px', cursor: 'pointer' }}>RESET</button>
            </div>

            {res.isLethal ? <p style={{color: '#FF6666'}}>{res.reason}</p> : (
              <div>
                {view === 'splicer' ? (
                  <div style={{fontSize: '18px', lineHeight: '1.6'}}>
                    <p><b>MORPHOLOGY:</b> {res.report.physical}</p>
                    <p><b>NEURAL PATH:</b> {res.report.neural}</p>
                  </div>
                ) : (
                  <div>
                    <h4 style={{color: '#EBBBFF', fontSize: '20px', margin: '0 0 15px 0'}}>SYNTHESIS PROTOCOL</h4>
                    <div style={{padding: '20px', background: '#000', border: '1px solid #333'}}>
                       {res.report.protocol.map((s, i) => <p key={i} style={{fontSize: '14px', margin: '10px 0'}}>{s}</p>)}
                    </div>
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
                  <input placeholder="HYBRID_NAME..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} 
                         style={{ background: '#000', color: '#FFF', border: '1px solid #333', padding: '15px', flex: 1 }} />
                  <button onClick={() => {
                    const newEntry = { 
                      ...slotA, id: Date.now(), name: hybridName.toUpperCase(), isHybrid: true, 
                      parents: [`${slotA.name} (${slotA.type==='Human'?ageA:'N/A'})`, `${slotB.name} (${slotB.type==='Human'?ageB:'N/A'})`],
                      color: res.color, feature: slotA.feature, trait: slotB.trait
                    };
                    setInventory([newEntry, ...inventory]);
                    setSlotA(null); setSlotB(null); setHybridName("");
                  }} style={{ background: res.color, color: '#000', border: 'none', padding: '0 35px', fontWeight: 'bold', cursor: 'pointer' }}>SAVE</button>
                  {view === 'serum' && (
                    <button onClick={handleDownload} style={{ background: '#333', color: '#FFF', border: 'none', padding: '0 25px', cursor: 'pointer' }}>DOC</button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {hoveredGene && (
        <div style={{ position: 'fixed', left: mousePos.x, top: mousePos.y, zIndex: 100, background: '#111', border: `2px solid ${hoveredGene.color}`, padding: '15px', pointerEvents: 'none', maxWidth: '300px' }}>
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
