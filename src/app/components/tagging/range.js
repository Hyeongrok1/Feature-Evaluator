import "./dropdown.css";
import React from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css'; 

export default function Ranging({ X, Y, Z, setX, setY, setZ }) {
    const updateX = (newLabel, newRange) => setX({ label: newLabel || X.label, range: newRange || X.range });
    const updateY = (newLabel, newRange) => setY({ label: newLabel || Y.label, range: newRange || Y.range });
    const updateZ = (newLabel, newRange) => setZ({ label: newLabel || Z.label, range: newRange || Z.range });

    const handleInputXChange = (index, val) => {
        const newValue = parseFloat(val);
        if (isNaN(newValue)) return;
        const updatedRange = [...X.range];
        updatedRange[index] = newValue;
        updateX(null, updatedRange);
    };


    return (
        <div className="h-100 w-100 d-flex flex-column" style={{ fontFamily: 'monospace' }}>
            <div className="card border-0 h-100 d-flex flex-column" style={{ background: 'transparent' }}>
                <h6 className="fw-bold text-secondary border-bottom pb-2 mb-3 text-uppercase tracking-wider" style={{ fontSize: '0.85rem' }}>
                    View D: Detail Slider
                </h6>
                
                <div className="d-flex flex-column justify-content-between flex-grow-1" style={{ minHeight: 0 }}>
                    
                    {[ {data: X, handler: handleInputXChange, update: updateX},
                       {data: Y, handler: (i, v) => { /* Y로직 */ }, update: updateY},
                       {data: Z, handler: (i, v) => { /* Z로직 */ }, update: updateZ}
                    ].map((item, idx) => (
                        <div key={idx} className="section-container d-flex align-items-center gap-3 w-100">
                            <button className="btn btn-outline-dark btn-sm fw-bold text-truncate" style={{ width: '15vw', maxWidth: '150px', fontSize: '11px' }}>
                                {item.data.label}
                            </button>

                            <div className="d-flex align-items-center gap-2 flex-grow-1">
                                <input 
                                    type="number" className="form-control form-control-sm text-center p-0"
                                    style={{ width: '50px', fontSize: '11px' }} min="0" max="1" step="0.01"
                                    value={item.data.range[0]} onChange={(e) => item.handler(0, e.target.value)}
                                />
                                <div className="flex-grow-1">
                                    <RangeSlider 
                                        className="range-slider" 
                                        value={item.data.range} 
                                        onInput={(val) => item.update(null, val)} 
                                        min={0} max={1} step="any" 
                                    />
                                </div>
                                <input 
                                    type="number" className="form-control form-control-sm text-center p-0"
                                    style={{ width: '50px', fontSize: '11px' }} min="0" max="1" step="0.01"
                                    value={item.data.range[1]} onChange={(e) => item.handler(1, e.target.value)}
                                />
                            </div>
                        </div>
                    ))}

                    <button className="btn btn-primary btn-sm fw-bold shadow-sm mt-2 w-100" style={{ fontSize: '12px' }}>
                        APPLY CHANGES
                    </button>
                </div>
            </div>
        </div>
    );
}