import "./dropdown.css";
import React, { useState } from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css'; 

export default function Ranging({ X, Y, setX, setY }) {
    const [XText, setXText] = useState('Select X');
    const [YText, setYText] = useState('Select Y');
    const [rangeXValue, setRangeXValue] = useState([0.3, 0.7]);
    const [rangeYValue, setRangeYValue] = useState([0.3, 0.7]);

    const handleApply = () => {
        setX({ label: XText, range: rangeXValue });
        setY({ label: YText, range: rangeYValue });
        alert("Applied!");
    };

    const handleInputXChange = (index, val) => {
        const newValue = parseFloat(val);
        if (isNaN(newValue)) return;
        const updatedRange = [...rangeXValue];
        updatedRange[index] = newValue;
        setRangeXValue(updatedRange);
    };

    const handleInputYChange = (index, val) => {
        const newValue = parseFloat(val);
        if (isNaN(newValue)) return;
        const updatedRange = [...rangeYValue];
        updatedRange[index] = newValue;
        setRangeYValue(updatedRange);
    };

    return (
        <div className=" p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100%' }}>
            <div className="card shadow-sm p-4 text-center mx-auto" style={{ maxWidth: '600px' }}>
                <h6 className="fw-bold text-secondary border-bottom pb-3 mb-4 text-uppercase tracking-wider">
                    View D: Detail Info
                </h6>
                
                <div className="d-flex flex-column gap-5">
                    {/* --- Section X --- */}
                    <div className="section-container">
                        <div className="dropdown mb-4">
                            <button className="btn btn-outline-dark dropdown-toggle px-4 fw-bold" style={{ width: '200px' }}>
                                {XText}
                            </button>
                            <div className="dropdown-content shadow-sm">
                                <a href="#" onClick={(e) => { e.preventDefault(); setXText('Fuzz'); }}>Fuzz</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setXText('Detection'); }}>Detection</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setXText('Embedding'); }}>Embedding</a>
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-3 justify-content-center">
                            <input 
                                type="number" className="form-control form-control-sm text-center fw-bold border-secondary-subtle"
                                style={{ width: '80px', height: '38px' }} min="0" max="1" step="0.01"
                                value={rangeXValue[0]} onChange={(e) => handleInputXChange(0, e.target.value)}
                            />
                            <div className="flex-grow-1 mx-2" style={{ minWidth: '300px' }}>
                                <RangeSlider className="range-slider" value={rangeXValue} onInput={setRangeXValue} min={0} max={1} step="any" />
                            </div>
                            <input 
                                type="number" className="form-control form-control-sm text-center fw-bold border-secondary-subtle"
                                style={{ width: '80px', height: '38px' }} min="0" max="1" step="0.01"
                                value={rangeXValue[1]} onChange={(e) => handleInputXChange(1, e.target.value)}
                            />
                        </div>
                    </div>

                    {/* --- Section Y --- */}
                    <div className="section-container">
                        <div className="dropdown mb-4">
                            <button className="btn btn-outline-dark dropdown-toggle px-4 fw-bold" style={{ width: '200px' }}>
                                {YText}
                            </button>
                            <div className="dropdown-content shadow-sm">
                                <a href="#" onClick={(e) => { e.preventDefault(); setYText('Fuzz'); }}>Fuzz</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setYText('Detection'); }}>Detection</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setYText('Embedding'); }}>Embedding</a>
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-3 justify-content-center">
                            <input 
                                type="number" className="form-control form-control-sm text-center fw-bold border-secondary-subtle"
                                style={{ width: '80px', height: '38px' }} min="0" max="1" step="0.01"
                                value={rangeYValue[0]} onChange={(e) => handleInputYChange(0, e.target.value)}
                            />
                            <div className="flex-grow-1 mx-2" style={{ minWidth: '300px' }}>
                                <RangeSlider className="range-slider" value={rangeYValue} onInput={setRangeYValue} min={0} max={1} step="any" />
                            </div>
                            <input 
                                type="number" className="form-control form-control-sm text-center fw-bold border-secondary-subtle"
                                style={{ width: '80px', height: '38px' }} min="0" max="1" step="0.01"
                                value={rangeYValue[1]} onChange={(e) => handleInputYChange(1, e.target.value)}
                            />
                        </div>
                    </div>

                    {/* --- Apply Button --- */}
                    <button className="btn btn-primary py-3 fw-bold shadow-sm mt-3" onClick={handleApply}>
                        APPLY CHANGES
                    </button>
                </div>
            </div>
        </div>
    );
}