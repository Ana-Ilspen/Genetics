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
    const animalRegions = ["Arctic", "Tundra", "Desert", "Amazon", "Mountain", "Coastal", "Volcanic", "Subterranean", "Savanna", "Highland", "Siberian", "Bengal", "Mojave", "Himalayan", "Andean", "Pacific", "Atlantic", "Congo"];
    const speciesData = {
      Mammalian: {
        icons: ["🐺", "🐅", "🐻", "🦍"],
        features: ["Insulated Fur", "Thermal Claws", "Muscle Density", "Jaw Pressure", "Enhanced Olfactory Bulb"],
        traits: ["Night-Vision", "Stamina", "Pack Mentality", "Apex Power"],
        manifest: ["growth of coarse, temperature-resistant fur", "retractable keratinized claws", "hyper-densification of skeletal muscle", "mandibular reinforcement and jaw alignment shift"]
      },
      Avian: {
        icons: ["🦅", "🦉", "🐦"],
        features: ["Aero-Keel", "Hollow Bones", "Nictitating Membrane", "Talon Grip"],
        traits: ["Dive-Speed", "Wind Mastery", "Telescopic Sight", "Aerobatics"],
        manifest: ["sternum extension into a sharp aero-keel", "pneumatization of long bones for weight reduction", "development of a secondary transparent eyelid", "digital transformation into high-pressure talons"]
      },
      Aquatic: {
        icons: ["🦈", "🐙", "🐋"],
        features: ["Electro-Sense", "Gills", "Ink Camo", "Flexible Body"],
        traits: ["Blood-Scent", "Cartilage Drive", "Mimicry", "Suction-Grip"],
        manifest: ["formation of Ampullae of Lorenzini (electro-receptors)", "cervical slit formation for aquatic respiration", "epidermal pigment shifting for active camouflage", "ossification reversal for total skeletal flexibility"]
      },
      Arachnid: {
        icons: ["🕷️", "🦂"],
        features: ["Silk Spinnerets", "Exoskeleton", "Tail Stinger", "Multi-Eyes"],
        traits: ["Web-Building", "Wall-Climbing", "Paralytic Strike", "Burrowing"],
        manifest: ["ventral development of spinneret glands", "calcification of skin into a rigid chitinous plate", "caudal extension into a venom-delivery stinger", "ocular multiplication and cephalic restructuring"]
      },
      Human: {
        icons: ["👤"],
        features: ["Frontal Lobe", "Opposable Thumbs", "Bipedal Frame"],
        traits: ["Logic", "Adaptability", "Tool Use"],
        manifest: ["neocortical expansion", "refined digital dexterity", "pelvic and spinal alignment stabilization"]
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
          const featIdx = (count + i) % data.features.length;
          tempInventory.push({
            id: `DB-${count}`,
            name: isHuman ? `${i % 2 === 0 ? "Male" : "Female"} Human` : `${animalRegions[i % animalRegions.length]} ${type}`,
            type: type,
            feature: data.features[featIdx],
            manifestation: data.manifest[featIdx],
            trait: data.traits[count % data.traits.length],
            compound: `${type.substring(0,3).toUpperCase()}-${count}`,
            basePh: (7.0 + (Math.random() * 1.4 - 0.7)).toFixed(1),
            baseTox: Math.floor(Math.random() * 40) + 5,
            color: { Mammalian: "#FFD699", Avian: "#99EBFF", Aquatic: "#99B2FF", Human: "#FFFFFF", Arachnid: "#E066FF" }[type],
            icon: data.icons[count % data.icons.length]
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
    
    return {
      isLethal: stability < 40,
      stability,
      color: view === 'splicer' ? "#99EBFF" : "#EBBBFF",
      physical: `Immediate ${g1.manifestation} and ${g2.manifestation}.`,
      neural: `Subject exhibits ${g1.trait} instincts and ${g2.trait} behavioral loops.`,
      protocol: [
        `1. Isolate ${g1.compound} & ${g2.compound} (15,000 RPM).`,
        `2. Encapsulate in lipid nanoparticles for BBB penetration.`,
        `3. Adjust serum pH to ${((parseFloat(g1.basePh) + parseFloat(g2.basePh))/2).toFixed(1)}.`,
        `4. Continuous IV administration under deep sedation.`
      ]
    };
  };

  const res = getAnalysis(slotA, slotB);

  const handleDownload = () => {
    if (!res || res.isLethal) return;
    const content = `
============================================================
              GENETIC RECOMBINATION DOSSIER
============================================================
SUBJECT DESIGNATION: ${hybridName.toUpperCase() || "CLASSIFIED"}
STABILITY INDEX: ${res.stability}%
GENETIC LINEAGE: ${slotA.name} [X] ${slotB.name}
------------------------------------------------------------

I. PHYSICAL TRANSFORMATION & MORPHOLOGY
The integration of ${slotA.compound} and ${slotB.compound} triggers a violent 
cellular restructuring. 
- Primary Manifestation: ${res.physical}
- Skeletal Deviation: Bone density will fluctuate during the first 6 hours 
  as ${slotA.feature} takes precedence. 
- Dermal Consequence: Subject may experience skin sloughing followed by 
  the rapid development of ${slotB.feature}.

II. NEURO-PSYCHOLOGICAL REWRITING
The human consciousness is estimated to survive for 14-18 minutes post-injection 
before ${res.neural} becomes dominant.
- Behavioral Shift: The subject will lose the ability for complex speech, 
  replaced by the vocalizations and social hierarchies of a ${slotA.type}.
- Instinctive Override: ${slotB.trait} will become the primary driver for 
  all motor functions. 

III. SERUM SYNTHESIS PROTOCOL
${res.protocol.join('\n')}

IV. CLINICAL CONSEQUENCES & PROGNOSIS
WARNING: Rejection risk is ${100 - res.stability}%. 
- Phase 1 (0-4hrs): Fever, seizure, and muscular spasms.
- Phase 2 (4-24hrs): Permanent anatomical locking. 
- Long-term: Complete personality dissolution. If stability is <50%, 
  the subject will likely suffer internal organ liquefaction within 72 hours.

BY ORDER OF THE LEAD GENETICIST.
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
          <input type="text" placeholder="FILTER SAMPLES..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                 style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#FFF' }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 25px' }}>
          {inventory.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())).map(g => (
            <div key={g.id} onMouseEnter={() => setHoveredGene(g)} onMouseLeave={() => setHoveredGene(null)} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} 
                 style={{ padding: '14px', margin: '8px 0', background: '#111', borderLeft: `5px solid ${g.color}`, cursor: 'grab', display: 'flex', justifyContent: 'space-between' }}>
              <span>{g.icon} {g.name}</span>
              {g.isHybrid && <button onClick={() => setInventory(inventory.filter(i => i.id !== g.id))} style={{ color: '#FF6666', background: 'none', border: 'none', cursor: 'pointer' }}>X</button>}
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
                      <input type="number" value={item.age} onClick={(e) => e.stopPropagation()} onChange={(e) => item.setAge(e.target.value)} 
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
            <h2 style={{ color: res.color, marginBottom: '20px' }}>{res.isLethal ? 'NON-VIABLE' : `STABILITY: ${res.stability}%`}</h2>
            
            {res.isLethal ? <p style={{color: '#FF6666'}}>{res.reason}</p> : (
              <div>
                <div style={{fontSize: '18px', lineHeight: '1.6', marginBottom: '20px'}}>
                  {view === 'splicer' ? (
                    <>
                      <p><b>GENETIC MANIFESTATION:</b> {res.physical}</p>
                      <p><b>NEURAL PATHWAY:</b> {res.neural}</p>
                    </>
                  ) : (
                    <div style={{marginTop: '20px', padding: '20px', background: '#000', border: '1px solid #333'}}>
                      <b style={{color: '#0F0'}}>SERUM SYNTHESIS PROTOCOL:</b>
                      {res.protocol.map((s, i) => <p key={i} style={{fontSize: '14px', margin: '10px 0'}}>{s}</p>)}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <input placeholder="SPECIMEN_ID..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} 
                         style={{ background: '#000', color: '#FFF', border: '1px solid #333', padding: '15px', flex: 1 }} />
                  <button onClick={() => {
                    const newEntry = { ...slotA, id: Date.now(), name: hybridName.toUpperCase(), isHybrid: true, parents: [slotA.name, slotB.name], color: res.color, feature: res.physical, trait: res.neural };
                    setInventory([newEntry, ...inventory]);
                    setSlotA(null); setSlotB(null); setHybridName("");
                  }} style={{ background: res.color, color: '#000', border: 'none', padding: '0 35px', fontWeight: 'bold', cursor: 'pointer' }}>SAVE</button>
                  {view === 'serum' && <button onClick={handleDownload} style={{ background: '#333', color: '#FFF', border: 'none', padding: '0 25px', cursor: 'pointer' }}>DOC</button>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {hoveredGene && (
        <div style={{ position: 'fixed', left: mousePos.x, top: mousePos.y, zIndex: 100, background: '#111', border: `2px solid ${hoveredGene.color}`, padding: '15px', pointerEvents: 'none', maxWidth: '300px' }}>
          <b style={{ color: hoveredGene.color }}>{hoveredGene.name}</b>
          <p><b>FEATURE:</b> {hoveredGene.feature}</p>
          <p><b>TRAIT:</b> {hoveredGene.trait}</p>
          {hoveredGene.parents && <p style={{fontSize: '11px', color: '#99EBFF'}}>LINEAGE: {hoveredGene.parents[0]} + {hoveredGene.parents[1]}</p>}
        </div>
      )}
    </div>
  );
};

export default App;
