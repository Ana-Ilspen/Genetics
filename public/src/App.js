import React, { useState, useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// --- DATA ENGINE ---
const generateGenes = () => {
  const categories = ["Xeno-Classified", "Synthetic Lab", "Apex Predator", "Extremophile"];
  const prefixes = ["Neo", "Void", "Cryo", "Aether", "Bio", "Cyber", "Proto", "Xeno"];
  const types = ["Helix", "Strand", "Node", "Link", "Core", "Catalyst"];
  
  const lib = {};
  categories.forEach(cat => lib[cat] = []);

  for (let i = 1; i <= 500; i++) {
    const cat = categories[i % categories.length];
    lib[cat].push({
      id: `gene_${i}`,
      name: `${prefixes[i % prefixes.length]} ${types[i % types.length]} #${1000 + i}`,
      color: i % 2 === 0 ? '#00ff00' : '#00ccff'
    });
  }
  return lib;
};

const DATABASE = generateGenes();

// --- DRAGGABLE ITEM ---
function GeneItem({ gene }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'GENE',
    item: { gene },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() })
  }), [gene]);

  return (
    <div ref={drag} style={{
      padding: '8px', margin: '4px 0', border: '1px solid #004400',
      background: isDragging ? '#111' : '#050505', color: '#00ff00',
      cursor: 'grab', fontSize: '11px', opacity: isDragging ? 0.5 : 1,
      transition: 'border 0.2s'
    }} onMouseEnter={e => e.target.style.borderColor = '#00ff00'} onMouseLeave={e => e.target.style.borderColor = '#004400'}>
      🧬 {gene.name}
    </div>
  );
}

// --- INTERNAL LAB UI ---
function LabUI() {
  const [tank, setTank] = useState([]);
  const [search, setSearch] = useState("");

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'GENE',
    drop: (item) => setTank(prev => prev.find(g => g.id === item.gene.id) ? prev : [...prev, item.gene]),
    collect: (monitor) => ({ isOver: !!monitor.isOver() })
  }));

  const filtered = useMemo(() => {
    const result = {};
    Object.keys(DATABASE).forEach(cat => {
      const match = DATABASE[cat].filter(g => g.name.toLowerCase().includes(search.toLowerCase()));
      if (match.length) result[cat] = match;
    });
    return result;
  }, [search]);

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h3 style={styles.header}>GENE REGISTRY</h3>
        <input 
          style={styles.input} 
          placeholder="Filter 500+ sequences..." 
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {Object.keys(filtered).map(cat => (
            <details key={cat} open={search.length > 0} style={{ marginBottom: '10px' }}>
              <summary style={styles.summary}>{cat}</summary>
              {filtered[cat].map(g => <GeneItem key={g.id} gene={g} />)}
            </details>
          ))}
        </div>
      </div>

      {/* Main Tank */}
      <div ref={drop} style={{ ...styles.tankArea, backgroundColor: isOver ? '#051105' : '#000' }}>
        <h2 style={{ letterSpacing: '4px' }}>GENETIC TANK</h2>
        <div style={styles.canvas}>
          {tank.length === 0 && <p style={{ opacity: 0.2 }}>[DRAG GENETIC MATERIAL HERE]</p>}
          {tank.map((g, i) => (
            <div key={i} style={styles.orbContainer}>
              <div style={{ ...styles.orb, background: `radial-gradient(circle, ${g.color} 0%, #000 100%)`, boxShadow: `0 0 15px ${g.color}` }}></div>
              <p style={{ fontSize: '9px', marginTop: '5px' }}>{g.name}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setTank([])} style={styles.btn}>PURGE TANK</button>
      </div>
    </div>
  );
}

// --- MAIN EXPORT ---
export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <LabUI />
    </DndProvider>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', background: '#000', color: '#00ff00', fontFamily: 'monospace', overflow: 'hidden' },
  sidebar: { width: '300px', borderRight: '1px solid #004400', padding: '20px', display: 'flex', flexDirection: 'column', background: '#050505' },
  header: { borderBottom: '1px solid #00ff00', paddingBottom: '10px', fontSize: '14px' },
  input: { width: '100%', background: '#111', border: '1px solid #004400', color: '#00ff00', padding: '8px', marginBottom: '15px', fontFamily: 'monospace' },
  summary: { cursor: 'pointer', color: '#fff', padding: '5px 0', fontSize: '13px' },
  tankArea: { flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  canvas: { width: '100%', flex: 1, border: '2px dashed #002200', borderRadius: '30px', display: 'flex', flexWrap: 'wrap', content: 'center', padding: '30px', gap: '20px', overflowY: 'auto', justifyContent: 'center', alignItems: 'center' },
  orbContainer: { textAlign: 'center', width: '70px' },
  orb: { width: '40px', height: '40px', borderRadius: '50%', margin: '0 auto' },
  btn: { marginTop: '20px', background: 'none', border: '1px solid #ff0000', color: '#ff0000', padding: '10px 20px', cursor: 'pointer', fontFamily: 'monospace' }
};
