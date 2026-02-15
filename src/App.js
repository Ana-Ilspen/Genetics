import React, { useState } from 'react';

// A mapping of Gene IDs to Common Names and Descriptions
const geneInfo = {
  "GENE-001": { name: "Lion (Apex)", traits: "High strength, predatory instincts" },
  "GENE-002": { name: "Eagle (Flight)", traits: "Superior vision, aerial mobility" },
  "GENE-003": { name: "Oak (Resilience)", traits: "Slow growth, high durability" },
  "GENE-004": { name: "Shark (Aquatic)", traits: "Electro-reception, gill breathing" },
  "GENE-005": { name: "Spider (Silk)", traits: "Tension strength, sticky surfaces" },
  // ... the other 495 genes will default to "Unknown Specimen"
};

const App = () => {
  const [selectedGene, setSelectedGene] = useState(null);

  // Generate 500 genes for the list
  const genes = Array.from({ length: 500 }, (_, i) => {
    const id = `GENE-${String(i + 1).padStart(3, '0')}`;
    return {
      id,
      commonName: geneInfo[id]?.name || `Specimen ${id.split('-')[1]}`,
      traits: geneInfo[id]?.traits || "Genetic sequence awaiting analysis..."
    };
  });

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#121212', color: 'white' }}>
      
      {/* Left Sidebar: The Gene List */}
      <div style={{ width: '350px', borderRight: '1px solid #333', overflowY: 'auto', padding: '20px' }}>
        <h2 style={{ color: '#00d4ff' }}>🧬 Genomic Bank</h2>
        <p style={{ fontSize: '12px', color: '#888' }}>Select a sequence to analyze</p>
        <hr style={{ borderColor: '#333' }} />
        {genes.map((gene) => (
          <div 
            key={gene.id} 
            onClick={() => setSelectedGene(gene)}
            style={{
              padding: '10px',
              margin: '5px 0',
              backgroundColor: selectedGene?.id === gene.id ? '#00d4ff22' : '#1e1e1e',
              border: selectedGene?.id === gene.id ? '1px solid #00d4ff' : '1px solid #333',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <strong>{gene.id}</strong> - {gene.commonName}
          </div>
        ))}
      </div>

      {/* Right Side: The Info Panel */}
      <div style={{ flex: 1, padding: '40px', backgroundColor: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {selectedGene ? (
          <div style={{ maxWidth: '600px', width: '100%', padding: '30px', border: '1px solid #444', borderRadius: '15px', backgroundColor: '#161616' }}>
            <h1 style={{ color: '#00d4ff', marginTop: 0 }}>{selectedGene.commonName}</h1>
            <h4 style={{ color: '#888' }}>Sequence ID: {selectedGene.id}</h4>
            <hr style={{ borderColor: '#333', margin: '20px 0' }} />
            <h3>Genetic Traits:</h3>
            <p style={{ fontSize: '18px', lineHeight: '1.6' }}>{selectedGene.traits}</p>
            <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#00d4ff11', borderRadius: '8px', border: '1px dashed #00d4ff' }}>
              <span style={{ color: '#00d4ff' }}>✓ Status:</span> Sequence Stable. Compatible for observation.
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#666' }}>
            <h2>Select a gene from the bank to view details</h2>
            <p>Scanning 500 sequences...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
