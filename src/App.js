import React, { useState } from 'react';
const App = () => {
  const [slotA, setSlotA] = useState(null);
  const [slotB, setSlotB] = useState(null);
  const allGenes = Array.from({ length: 500 }, (_, i) => {
    const prefixes = ["Glacial", "Volcanic", "Apex", "Shadow", "Neon", "Primal", "Cyber", "Ethereal", "Storm", "Deep-Sea"];
    const mammals = ["Lion", "Wolf", "Bear", "Rhino", "Stallion"];
    const avians = ["Falcon", "Owl", "Raven", "Eagle", "Vulture"];
    const botany = ["Oak", "Fern", "Lotus", "Ivy", "Willow"];
    const aquatic = ["Shark", "Kraken", "Manta", "Eel", "Orca"];
 const id = `GENE-${String(i + 1).padStart(3, '0')}`;
    let type, name, trait, icon;
 const pre = prefixes[i % prefixes.length];
 if (i < 125) {
      type = "Mammalian";
      name = `${pre} ${mammals[i % mammals.length]}`;
      trait = "Advanced Limb Musculature";
      icon = "🦁";
    } else if (i < 250) {
      type = "Avian";
      name = `${pre} ${avians[i % avians.length]}`;
      trait = "Hollow Bone Aerodynamics";
      icon = "🦅";
    } else if (i < 375) {
      type = "Botanical";
      name = `${pre} ${botany[i % botany.length]}`;
      trait = "Chloroplast Energy Synthesis";
      icon = "🌿";
    } else {
      type = "Aquatic";
      name = `${pre} ${aquatic[i % aquatic.length]}`;
      trait = "Hydrostatic Gilled Respiration";
      icon = "🦈";
    }
 return { id, name, type, trait, icon };
  });
 const getAnalysis = (g1, g2) => {
    if (!g1 || !g2) return null;
 const isMatch = g1.type === g2.type;
    const comboKey = [g1.type, g2.type].sort().join('+');
let result = {
      status: "STABLE HYBRID",
      color: "#00d4ff",
      reason: "Molecular structures aligned.",
      inheritance: []
    };
    if (isMatch) {
      result.status = "OPTIMAL SYNERGY";
      result.color = "#00ff88";
      result.reason = `Both sequences share ${g1.type} DNA architecture. High success rate with 0% risk of cellular degradation.`;
      result.inheritance = [
        `Dominant: ${g1.trait} (Extracted from ${g1.name})`,
        `Recessive: ${g2.trait} (Extracted from ${g2.name})`
      ];
    } else if (comboKey === "Avian+Mammalian") {
      result.status = "COMPLEX CHIMERA";
      result.color = "#ffcc00";
      result.reason = "Endothermic heat signatures match, but skeletal density conflicts. Hybrid will require artificial calcium support.";
      result.inheritance = [
        `Structural: ${g2.trait} (From ${g2.name})`,
        `Neural: ${g1.trait} (From ${g1.name})`
      ];
    } else if (comboKey.includes("Botanical")) {
      result.status = "INCOMPATIBLE";
      result.color = "#ff4b2b";
      result.reason = `Biological Failure: ${g1.type === "Botanical" ? g1.name : g2.name} utilizes Cellulose cell walls which cannot fuse with the soft tissue membranes of the partner.`;
      result.inheritance = ["FAILURE: Apoptosis (Cell death) detected within 4.2 milliseconds."];
    } else {
      result.status = "EXPERIMENTAL";
      result.color = "#bb00ff";
      result.reason = "Unprecedented taxonomic cross. Genetic drifting likely.";
      result.inheritance = [
        `Primary: ${g1.trait} (Derived from ${g1.name})`,
        `Secondary: ${g2.trait} (Derived from ${g2.name})`
      ];
    }
    return result;
  };
  const analysis = getAnalysis(slotA, slotB);
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#050505', color: '#ccc', fontFamily: 'monospace' }}>
            {/* SIDEBAR */}
      <div style={{ width: '320px', borderRight: '1px solid #222', overflowY: 'auto', padding: '15px', background: '#0a0a0a' }}>
        <h3 style={{ color: '#00d4ff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>GENETIC INVENTORY</h3>
        {allGenes.map(gene => (
          <div 
            key={gene.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(gene))}
            style={{ 
              padding: '10px', margin: '5px 0', background: '#111', 
              border: '1px solid #222', cursor: 'grab', fontSize: '12px' 
            }}
          >
            <span style={{ color: '#00d4ff' }}>{gene.id}</span> | <strong>{gene.name}</strong>
          </div>
        ))}
      </div>
{/* WORKSPACE */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ letterSpacing: '5px', color: '#fff' }}>GENE PLAYGROUND</h1>
        
        <div style={{ display: 'flex', gap: '40px', margin: '40px 0' }}>
          {[slotA, slotB].map((slot, i) => (
            <div 
              key={i}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const data = JSON.parse(e.dataTransfer.getData("gene"));
                i === 0 ? setSlotA(data) : setSlotB(data);
              }}
              style={{ 
                width: '200px', height: '220px', border: `2px solid ${slot ? '#00d4ff' : '#333'}`,
                background: '#0e0e0e', textAlign: 'center', padding: '10px'
              }}
            >
              {slot ? (
                <>
                  <div style={{ fontSize: '50px' }}>{slot.icon}</div>
                  <h4 style={{ color: '#fff' }}>{slot.name}</h4>
                  <p style={{ fontSize: '10px' }}>{slot.trait}</p>
                </>
              ) : `DRAG GENE ${i === 0 ? 'A' : 'B'}`}
            </div>
          ))}
        </div>
        {/* DETAILED RESULTS */}
        {analysis && (
          <div style={{ width: '100%', maxWidth: '800px', padding: '30px', background: '#111', border: `1px solid ${analysis.color}`, position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-15px', left: '20px', background: analysis.color, color: '#000', padding: '2px 10px', fontWeight: 'bold' }}>
              LAB REPORT: {analysis.status}
            </div>
            <p style={{ fontSize: '16px', lineHeight: '1.5' }}><strong>DIAGNOSTIC SUMMARY:</strong> {analysis.reason}</p>
            <hr style={{ borderColor: '#222' }} />
            <h4 style={{ color: analysis.color }}>GENETIC INHERITANCE MAP:</h4>
            <ul>
              {analysis.inheritance.map((item, idx) => (
                <li key={idx} style={{ margin: '10px 0', color: '#fff' }}>{item}</li>
              ))}
            </ul>
            <button onClick={() => {setSlotA(null); setSlotB(null);}} style={{ background: '#222', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer', marginTop: '10px' }}>RESET SEQUENCE</button>
          </div>
        )}
      </div>
    </div>
  );
};
export default App;
