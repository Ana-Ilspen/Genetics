import React, { useState } from 'react';

// --- DATA: Gene Definitions ---
const geneLibrary = {
  "GENE-001": { name: "Lion", type: "Mammal", traits: ["Strength", "Claws"], icon: "🦁" },
  "GENE-002": { name: "Eagle", type: "Avian", traits: ["Flight", "Vision"], icon: "🦅" },
  "GENE-003": { name: "Oak", type: "Plant", traits: ["Durability", "Photosynthesis"], icon: "🌳" },
  "GENE-004": { name: "Shark", type: "Aquatic", traits: ["Gills", "Electrolocation"], icon: "🦈" },
  "GENE-005": { name: "Spider", type: "Insect", traits: ["Webbing", "Wall-climbing"], icon: "🕷️" },
};

const App = () => {
  const [slotA, setSlotA] = useState(null);
  const [slotB, setSlotB] = useState(null);

  // Generate 500 Genes
  const allGenes = Array.from({ length: 500 }, (_, i) => {
    const id = `GENE-${String(i + 1).padStart(3, '0')}`;
    return geneLibrary[id] || { 
      id, 
      name: `Specimen ${i + 1}`, 
      type: "Unknown", 
      traits: ["Stable sequence"], 
      icon: "🧪" 
    };
  });

  const getCompatibility = (g1, g2) => {
    if (!g1 || !g2) return null;
    
    const isPlant = g1.type === "Plant" || g2.type === "Plant";
    const isMammal = g1.type === "Mammal" || g2.type === "Mammal";
    
    if (isPlant && isMammal) {
      return {
        status: "⚠️ UNSTABLE",
        color: "#ff4b2b",
        reason: "Cross-kingdom fusion (Plant/Animal) causes cellular collapse.",
        transfer: "None (Lethal mutation)"
      };
    }

    return {
      status: "✅ COMPATIBLE",
      color: "#00d4ff",
      reason: "Taxonomic alignment successful. Neural pathways compatible.",
      transfer: `${g1.traits[0]} + ${g2.traits[0]}`
    };
  };

  const analysis = getCompatibility(slotA, slotB);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0f0f0f', color: '#e0e0e0', fontFamily: 'monospace' }}>
      
      {/* 1. Sidebar (Bank) */}
      <div style={{ width: '300px', borderRight: '2px solid #333', overflowY: 'scroll', padding: '15px' }}>
        <h2 style={{ color: '#00d4ff' }}>GENE BANK</h2>
        {allGenes.map(gene => (
          <div 
            key={gene.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(gene))}
            style={{ padding: '10px', margin: '5px 0', background: '#1a1a1a', border: '1px solid #444', cursor: 'grab' }}
          >
            {gene.icon} {gene.id} <br/> <small>{gene.name}</small>
          </div>
        ))}
      </div>

      {/* 2. Main Lab Area */}
      <div style={{ flex: 1, padding: '40px', textAlign: 'center' }}>
        <h1>GENETIC COMBINER</h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', margin: '40px 0' }}>
          {/* Slot A */}
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => setSlotA(JSON.parse(e.dataTransfer.getData("gene")))}
            style={{ width: '150px', height: '150px', border: '2px dashed #00d4ff', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {slotA ? <div>{slotA.icon}<br/>{slotA.name}</div> : "Drop Gene A"}
          </div>

          <div style={{ fontSize: '40px', alignSelf: 'center' }}>+</div>

          {/* Slot B */}
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => setSlotB(JSON.parse(e.dataTransfer.getData("gene")))}
            style={{ width: '150px', height: '150px', border: '2px dashed #00d4ff', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {slotB ? <div>{slotB.icon}<br/>{slotB.name}</div> : "Drop Gene B"}
          </div>
        </div>

        {/* 3. Results Panel */}
        {analysis && (
          <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: `2px solid ${analysis.color}`, borderRadius: '10px', background: '#161616' }}>
            <h2 style={{ color: analysis.color }}>{analysis.status}</h2>
            <p><strong>ANALYSIS:</strong> {analysis.reason}</p>
            <hr style={{ borderColor: '#333' }} />
            <p><strong>TRANSFERRED TRAITS:</strong> {analysis.transfer}</p>
          </div>
        )}
        
        {!analysis && <p style={{ color: '#666' }}>Drag two genes from the left into the slots to begin analysis.</p>}
        <button onClick={() => {setSlotA(null); setSlotB(null);}} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>Reset Lab</button>
      </div>
    </div>
  );
};

export default App;
