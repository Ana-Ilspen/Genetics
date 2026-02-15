import React, { useState } from 'react';

// --- DATA: Hand-named "Master" Genes ---
const masterGenes = {
  "GENE-001": { name: "Lion", type: "Mammal", traits: ["Apex Predation", "Muscle Density"], icon: "🦁" },
  "GENE-002": { name: "Eagle", type: "Avian", traits: ["Atmospheric Lift", "Telescopic Vision"], icon: "🦅" },
  "GENE-003": { name: "Oak", type: "Botanical", traits: ["Lignin Reinforcement", "Photosynthesis"], icon: "🌳" },
  "GENE-004": { name: "Shark", type: "Aquatic", traits: ["Electrolocation", "Cartilage Skeleton"], icon: "🦈" },
  "GENE-005": { name: "Spider", type: "Arachnid", traits: ["Protein Fiber Secretion", "Wall-Clinging"], icon: "🕷️" },
};

const App = () => {
  const [slotA, setSlotA] = useState(null);
  const [slotB, setSlotB] = useState(null);

  // --- GENERATOR: Automatically names and classifies all 500 genes ---
  const allGenes = Array.from({ length: 500 }, (_, i) => {
    const id = `GENE-${String(i + 1).padStart(3, '0')}`;
    
    // If it's in our hand-named list, use that.
    if (masterGenes[id]) return { id, ...masterGenes[id] };

    // Otherwise, generate data based on ID "Families"
    let type, traits, icon;
    if (i < 100) { 
      type = "Mammal"; traits = ["Endothermic Regulation", "Bone Density"]; icon = "🦴"; 
    } else if (i < 200) { 
      type = "Avian"; traits = ["Hollow Bone Structure", "Rapid Metabolism"]; icon = "🪶"; 
    } else if (i < 300) { 
      type = "Botanical"; traits = ["Cellulose Wall", "Carbon Sequestration"]; icon = "🌿"; 
    } else if (i < 400) { 
      type = "Aquatic"; traits = ["Hydrodynamic Scaling", "Oxygen Filtration"]; icon = "💧"; 
    } else { 
      type = "Inorganic"; traits = ["Silicon Lattice", "Conductive Surface"]; icon = "💎"; 
    }

    return {
      id,
      name: `${type} Variant ${id.split('-')[1]}`,
      type,
      traits,
      icon
    };
  });

  const getCompatibility = (g1, g2) => {
    if (!g1 || !g2) return null;
    
    // Logic for cross-type compatibility
    const sameType = g1.type === g2.type;
    const isInorganic = g1.type === "Inorganic" || g2.type === "Inorganic";
    
    if (isInorganic && !sameType) {
      return {
        status: "❌ SYSTEM CRITICAL",
        color: "#ff0055",
        reason: "Biological and Inorganic matter cannot fuse without a Cybernetic Bridge.",
        transfer: "Severe cellular rejection."
      };
    }

    if (sameType) {
      return {
        status: "✅ HIGH COMPATIBILITY",
        color: "#00ff88",
        reason: `Both sequences are ${g1.type}. Minimal risk of mutation rejection.`,
        transfer: `${g1.traits[0]} + ${g2.traits[1]}`
      };
    }

    return {
      status: "⚠️ HYBRID STABLE",
      color: "#ffcc00",
      reason: `Cross-species fusion between ${g1.type} and ${g2.type} detected. Resulting chimera will be sterile.`,
      transfer: `${g1.traits[1]} (Primary) | ${g2.traits[0]} (Secondary)`
    };
  };

  const analysis = getCompatibility(slotA, slotB);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0a0a0b', color: '#afafaf', fontFamily: '"Courier New", Courier, monospace' }}>
      
      {/* SIDEBAR: Scrollable Bank */}
      <div style={{ width: '320px', borderRight: '1px solid #222', overflowY: 'auto', padding: '15px', background: '#0e0e10' }}>
        <h3 style={{ color: '#00d4ff', letterSpacing: '2px' }}>// GENOMIC_DATABASE</h3>
        {allGenes.map(gene => (
          <div 
            key={gene.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(gene))}
            style={{ 
              padding: '12px', 
              margin: '8px 0', 
              background: '#16161a', 
              border: '1px solid #222', 
              cursor: 'grab',
              fontSize: '13px'
            }}
            onMouseEnter={(e) => e.target.style.borderColor = '#444'}
            onMouseLeave={(e) => e.target.style.borderColor = '#222'}
          >
            <span style={{ color: '#00d4ff' }}>{gene.id}</span> | {gene.name} {gene.icon}
          </div>
        ))}
      </div>

      {/* MAIN LAB */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: 'white', textShadow: '0 0 10px #00d4ff' }}>FUSION ANALYSIS LAB</h1>
        
        <div style={{ display: 'flex', gap: '30px', margin: '50px 0' }}>
          {[slotA, slotB].map((slot, index) => (
            <div 
              key={index}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const data = JSON.parse(e.dataTransfer.getData("gene"));
                index === 0 ? setSlotA(data) : setSlotB(data);
              }}
              style={{ 
                width: '180px', height: '180px', 
                border: `2px ${slot ? 'solid' : 'dashed'} #333`, 
                borderRadius: '5px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: slot ? '#111' : 'transparent',
                boxShadow: slot ? '0 0 15px rgba(0,212,255,0.1)' : 'none'
              }}
            >
              {slot ? (
                <>
                  <div style={{ fontSize: '40px' }}>{slot.icon}</div>
                  <div style={{ color: '#00d4ff', fontSize: '12px', marginTop: '10px' }}>{slot.id}</div>
                  <div style={{ fontSize: '14px' }}>{slot.name}</div>
                </>
              ) : `DROP SEQUENCE ${index === 0 ? 'ALPHA' : 'BETA'}`}
            </div>
          ))}
        </div>

        {analysis && (
          <div style={{ maxWidth: '700px', width: '100%', padding: '25px', borderLeft: `5px solid ${analysis.color}`, background: '#111', borderRadius: '4px' }}>
            <h2 style={{ color: analysis.color, marginTop: 0 }}>{analysis.status}</h2>
            <p><strong>DIAGNOSTIC:</strong> {analysis.reason}</p>
            <div style={{ marginTop: '20px', padding: '15px', background: '#000', border: '1px solid #222' }}>
              <strong style={{ color: '#00d4ff' }}>EXPECTED PHENOTYPE TRANSFER:</strong>
              <ul style={{ marginTop: '10px' }}>
                <li>Primary Trait: {analysis.transfer.split('|')[0]}</li>
                {analysis.transfer.includes('|') && <li>Secondary Trait: {analysis.transfer.split('|')[1]}</li>}
              </ul>
            </div>
            <button 
              onClick={() => {setSlotA(null); setSlotB(null);}}
              style={{ marginTop: '20px', background: 'none', border: '1px solid #444', color: '#888', padding: '8px 15px', cursor: 'pointer' }}
            >
              CLEAR TERMINAL
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
