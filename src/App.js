import React, { useState, useEffect } from 'react';

const App = () => {
  const [view, setView] = useState('splicer'); 
  const [slotA, setSlotA] = useState(null);
  const [slotB, setSlotB] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [hybridName, setHybridName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const baseGenes = Array.from({ length: 50 }, (_, i) => {
      const types = ["Mammalian", "Avian", "Botanical", "Aquatic", "Human"];
      const icons = ["🐺", "🦅", "🌿", "🦈", "👤"];
      const colors = ["#FFD699", "#99EBFF", "#A3FFD6", "#99B2FF", "#FFFFFF"];
      const type = types[i % 5];
      const traits = {
        Mammalian: { feature: "Dense Muscular Fibers", trait: "Adrenaline Response", comp: "Mammal-Beta" },
        Avian: { feature: "Hollow Bone Architecture", trait: "Enhanced Optics", comp: "Avian-C" },
        Botanical: { feature: "Chlorophyll Dermal Layer", trait: "Cellular Regen", comp: "Phyto-K" },
        Aquatic: { feature: "Gilled Filtration", trait: "Pressure Resistance", comp: "Aqua-Lipid" },
        Human: { feature: "Neural Cortex", trait: "Motor Control", comp: "Cerebro-V" }
      };

      return {
        id: `G-${String(i + 1).padStart(3, '0')}`,
        name: `Alpha ${type}`,
        type,
        trait: traits[type].trait,
        feature: traits[type].feature,
        icon: icons[i % 5],
        color: colors[i % 5],
        compound: traits[type].comp,
        isHybrid: false
      };
    });
    setInventory(baseGenes);
  }, []);

  const getAnalysis = (g1, g2) => {
    if (!g1 || !g2) return null;
    const combo = [g1.type, g2.type].sort().join('+');
    const isLethal = (combo.includes("Botanical") && !combo.includes("Botanical+Botanical")) || (combo.includes("Human") && combo.includes("Botanical"));
    
    let ph = 7.0; let toxicity = 5.0;
    if (combo.includes("Human")) toxicity += 45.0;
    if (combo.includes("Botanical")) ph -= 2.8;
    if (g1.type !== g2.type) toxicity += 12.0;

    return {
      isLethal, canSave: !isLethal,
      color: isLethal ? "#FF6666" : (view === 'splicer' ? "#99EBFF" : "#EBBBFF"),
      splicerReport: {
        physical: `Specimen exhibits ${g1.feature} reinforced by ${g2.trait}.`,
        alignment: isLethal ? "CRITICAL FAILURE: Cellular wall collapse." : "SUCCESS: Genomic strands stable."
      },
      serumData: { ph: ph.toFixed(1), tox: `${toxicity.toFixed(1)}%`, steps: [
        `1. Distill ${g1.compound} (40%)`,
        `2. Infuse ${g2.compound} (35%)`,
        `3. Apply Saline (20%)`,
        `4. Add Catalyst (5%)`
      ]}
    };
  };

  const res = getAnalysis(slotA, slotB);
  const clear = () => { setSlotA(null); setSlotB(null); setHybridName(""); };

  const archiveResult = () => {
    if (!hybridName) return alert("ENTER NAME");
    const newEntry = {
      ...slotA,
      id: `${view === 'splicer' ? 'HYB' : 'SRM'}-${Math.floor(Math.random() * 9000)}`,
      name: hybridName.toUpperCase(),
      isHybrid: true,
      color: res.color,
      reportData: res,
      mode: view
    };
    setInventory([newEntry, ...inventory]);
    clear();
  };

  const downloadReport = (item) => {
    let content = `LAB REPORT: ${item.name}\n--------------------------\n`;
    content += item.mode === 'splicer' ? `PHYSICAL: ${item.reportData.splicerReport.physical}` : `pH: ${item.reportData.serumData.ph}\nTOX: ${item.reportData.serumData.tox}`;
    const element = document.createElement("a");
    element.href = URL.createObjectURL(new Blob([content], {type: 'text/plain'}));
    element.download = `${item.name}_Report.txt`;
    element.click();
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#000', color: '#EEE', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '350px', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', background: '#080808' }}>
        <div style={{ padding: '15px' }}>
          <button onClick={() => {setView(view === 'splicer' ? 'serum' : 'splicer'); clear();}} 
                  style={{ width: '100%', padding: '12px', background: view === 'serum' ? '#EBBBFF' : '#99EBFF', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
            {view === 'splicer' ? '🧪 GO TO SERUM LAB' : '🧬 GO TO SPLICER'}
          </button>
          <input type="text" placeholder="FILTER..." onChange={(e) => setSearchTerm(e.target.value)} 
                 style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#FFF' }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 15px' }}>
          {inventory.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())).map(g => (
            <div key={g.id} draggable onDragStart={(e) => e.dataTransfer.setData("gene", JSON.stringify(g))} 
                 style={{ padding: '12px', margin: '6px 0', background: '#111', borderLeft: `4px solid ${g.color}`, cursor: 'grab', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{g.icon} {g.name}</span>
                {g.isHybrid && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => downloadReport(g)} style={{ color: '#99EBFF', background: 'none', border: 'none', cursor: 'pointer', fontSize: '10px' }}>DOC</button>
                    <button onClick={() => setInventory(inventory.filter(i => i.id !== g.id))} style={{ color: '#FF6666', background: 'none', border: 'none', cursor: 'pointer', fontSize: '10px' }}>X</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN LAB - SCROLLABLE */}
      <div style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>{view === 'splicer' ? 'GENOME RECOMBINATOR' : 'SERUM DISTILLERY'}</h1>
        
        <div style={{ display: 'flex', gap: '30px', marginBottom: '20px' }}>
          {[slotA, slotB].map((slot, i) => (
            <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const d = JSON.parse(e.dataTransfer.getData("gene")); i === 0 ? setSlotA(d) : setSlotB(d); }}
              style={{ width: '160px', height: '200px', border: '2px dashed #444', background: '#050505', textAlign: 'center', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: '10px' }}>
              {slot ? <> <div style={{ fontSize: '40px' }}>{slot.icon}</div> <b style={{fontSize: '14px', color: slot.color}}>{slot.name}</b> </> : <p style={{color: '#444', fontSize: '14px'}}>EMPTY SLOT</p>}
            </div>
          ))}
        </div>

        {res && (
          <div style={{ width: '100%', maxWidth: '750px', padding: '25px', border: `2px solid ${res.color}`, background: '#0A0A0A', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: res.color, margin: 0 }}>{res.isLethal ? 'ANALYSIS FAILED' : 'STABLE RESULT'}</h2>
              <button onClick={clear} style={{ background: '#333', color: '#EEE', border: 'none', padding: '5px 15px', cursor: 'pointer', borderRadius: '4px' }}>RESET LAB</button>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              {view === 'splicer' ? (
                <>
                  <p style={{ fontSize: '20px' }}>{res.splicerReport.physical}</p>
                  <p style={{ color: res.color, fontStyle: 'italic' }}>{res.splicerReport.alignment}</p>
                </>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                  <div>
                    <p style={{fontSize: '20px'}}>pH: <span style={{color: '#99EBFF'}}>{res.serumData.ph}</span></p>
                    <p style={{fontSize: '20px'}}>TOX: <span style={{color: '#FF6666'}}>{res.serumData.tox}</span></p>
                  </div>
                  <div style={{background: '#000', padding: '15px', border: '1px solid #222'}}>
                    {res.serumData.steps.map((s, i) => <p key={i} style={{fontSize: '14px', margin: '5px 0'}}>{s}</p>)}
                  </div>
                </div>
              )}
            </div>

            {res.canSave && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <input placeholder="NAME SPECIMEN..." value={hybridName} onChange={(e) => setHybridName(e.target.value)} 
                       style={{ background: '#000', color: '#FFF', border: '1px solid #444', padding: '12px', flex: 1, fontSize: '16px' }} />
                <button onClick={archiveResult} style={{ background: res.color, color: '#000', border: 'none', padding: '0 20px', fontWeight: 'bold', cursor: 'pointer' }}>SAVE TO ARCHIVE</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
