import "./dropdown.css";
import React, { useCallback, useState } from 'react'; 
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css'; 

export default function Ranging({ X, Y, Z, setX, setY, setZ, onApply }) {
    const [isApplied, setIsApplied] = useState(false);
    
    const handleSliderChange = useCallback((key, val) => {
        if (key === 'X') setX(prev => ({ ...prev, range: val }));
        if (key === 'Y') setY(prev => ({ ...prev, range: val }));
        if (key === 'Z') setZ(prev => ({ ...prev, range: val }));
    }, [setX, setY, setZ]);

    const handleInputChange = (state, setState, index, val) => {
        const newValue = parseFloat(val);
        if (isNaN(newValue)) return;
        const updatedRange = [...state.range];
        updatedRange[index] = newValue;
        setState(prev => ({ ...prev, range: updatedRange }));
    };

    const handleApplyClick = () => {
        onApply(); 
        setIsApplied(true); 
        
        setTimeout(() => {
            setIsApplied(false);
        }, 1500);
    };

    return (
        <div className="d-flex flex-column h-100 w-100" style={{ fontFamily: 'monospace', overflow: 'hidden' }}>
            <h6 className="fw-bold text-secondary border-bottom pb-1 mb-2 px-1" style={{ fontSize: '0.9rem', flexShrink: 0 }}>
                Detail Slider
            </h6>
            <div className="card border-0 h-100 flex-column" style={{ background: 'transparent' }}>
                
                <div className="d-flex flex-column justify-content-between flex-grow-1" style={{ minHeight: 0 }}>
                    {[ 
                        { label: 'X', data: X, setter: setX },
                        { label: 'Y', data: Y, setter: setY },
                        { label: 'Z', data: Z, setter: setZ }
                    ].map((item) => (
                        <div key={item.label} className="section-container d-flex align-items-center gap-3 w-100">
                            <button className="btn btn-outline-dark btn-sm fw-bold text-truncate" style={{ width: '100px', fontSize: '11px' }}>
                                {item.data.label}
                            </button>

                            <div className="d-flex align-items-center gap-2 flex-grow-1">
                                <input 
                                    type="number" className="form-control form-control-sm text-center p-0"
                                    style={{ width: '50px', fontSize: '11px' }} min="0" max="1" step="0.01"
                                    value={item.data.range[0]} 
                                    onChange={(e) => handleInputChange(item.data, item.setter, 0, e.target.value)}
                                />
                                <div className="flex-grow-1">
                                    <RangeSlider 
                                        className="range-slider" 
                                        value={item.data.range} 
                                        onInput={(val) => handleSliderChange(item.label, val)} 
                                        min={0} max={1} step="any" 
                                    />
                                </div>
                                <input 
                                    type="number" className="form-control form-control-sm text-center p-0"
                                    style={{ width: '50px', fontSize: '11px' }} min="0" max="1" step="0.01"
                                    value={item.data.range[1]} 
                                    onChange={(e) => handleInputChange(item.data, item.setter, 1, e.target.value)}
                                />
                            </div>
                        </div>
                    ))}

                    <button 
                        className={`btn btn-sm fw-bold shadow-sm mt-2 w-100 transition-all ${isApplied ? 'btn-success' : 'btn-primary'}`} 
                        style={{ fontSize: '12px', transition: 'all 0.3s ease' }}
                        onClick={handleApplyClick}
                        disabled={isApplied}
                    >
                        {isApplied ? (
                            <span><i className="bi bi-check-lg me-1"></i> APPLIED!</span>
                        ) : (
                            "APPLY CHANGES"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}