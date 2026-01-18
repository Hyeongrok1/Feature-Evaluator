import "./dropdown.css";
import React from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css'; 

export default function Ranging({ X, Y, Z, setX, setY, setZ}) {

    // 1. 슬라이더나 입력창 변경 시 부모 상태를 즉시 업데이트하는 공통 함수
    const updateX = (newLabel, newRange) => {
        setX({ label: newLabel || X.label, range: newRange || X.range });
    };

    const updateY = (newLabel, newRange) => {
        setY({ label: newLabel || Y.label, range: newRange || Y.range });
    };

    const updateZ = (newLabel, newRange) => {
        setZ({ label: newLabel || Z.label, range: newRange || Z.range });
    };

    // 2. 숫자 입력창 직접 수정 핸들러
    const handleInputXChange = (index, val) => {
        const newValue = parseFloat(val);
        if (isNaN(newValue)) return;
        const updatedRange = [...X.range];
        updatedRange[index] = newValue;
        updateX(null, updatedRange);
    };

    const handleInputYChange = (index, val) => {
        const newValue = parseFloat(val);
        if (isNaN(newValue)) return;
        const updatedRange = [...Y.range];
        updatedRange[index] = newValue;
        updateY(null, updatedRange);
    };

    const handleInputZChange = (index, val) => {
        const newValue = parseFloat(val);
        if (isNaN(newValue)) return;
        const updatedRange = [...Z.range];
        updatedRange[index] = newValue;
        updateZ(null, updatedRange);
    };

    // 3. APPLY 버튼 클릭 핸들러 (현재 상태를 다시 한번 확정)
    const handleApply = () => {
        // 이미 실시간으로 반영되고 있으므로, 여기서는 시각적 피드백이나 추가 로직만 수행
        console.log("Applied Filters:", { X, Y, Z });
        alert(`Filters applied: X(${X.label}), Y(${Y.label}), Z(${Z.label})`);
    };

    return (
        <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100%' }}>
            <div className="card shadow-sm p-4 text-center mx-auto" style={{ maxWidth: '600px' }}>
                <h6 className="fw-bold text-secondary border-bottom pb-3 mb-4 text-uppercase tracking-wider">
                    View D: Detail Slider
                </h6>
                
                <div className="d-flex flex-column gap-5">
                    {/* --- Section X --- */}
                    <div className="section-container">
                        <div className="dropdown mb-4">
                            <button className="btn btn-outline-dark dropdown-toggle px-4 fw-bold" style={{ width: '200px' }}>
                                {X.label || "Select X"}
                            </button>
                        </div>

                        <div className="d-flex align-items-center gap-3 justify-content-center">
                            <input 
                                type="number" className="form-control form-control-sm text-center fw-bold border-secondary-subtle"
                                style={{ width: '80px', height: '38px' }} min="0" max="1" step="0.01"
                                value={X.range[0]} onChange={(e) => handleInputXChange(0, e.target.value)}
                            />
                            <div className="flex-grow-1 mx-2" style={{ minWidth: '300px' }}>
                                <RangeSlider 
                                    className="range-slider" 
                                    value={X.range} 
                                    onInput={(val) => updateX(null, val)} // 실시간 업데이트
                                    min={0} max={1} step="any" 
                                />
                            </div>
                            <input 
                                type="number" className="form-control form-control-sm text-center fw-bold border-secondary-subtle"
                                style={{ width: '80px', height: '38px' }} min="0" max="1" step="0.01"
                                value={X.range[1]} onChange={(e) => handleInputXChange(1, e.target.value)}
                            />
                        </div>
                    </div>

                    {/* --- Section Y --- */}
                    <div className="section-container">
                        <div className="dropdown mb-4">
                            <button className="btn btn-outline-dark dropdown-toggle px-4 fw-bold" style={{ width: '200px' }}>
                                {Y.label || "Select Y"}
                            </button>
                        </div>

                        <div className="d-flex align-items-center gap-3 justify-content-center">
                            <input 
                                type="number" className="form-control form-control-sm text-center fw-bold border-secondary-subtle"
                                style={{ width: '80px', height: '38px' }} min="0" max="1" step="0.01"
                                value={Y.range[0]} onChange={(e) => handleInputYChange(0, e.target.value)}
                            />
                            <div className="flex-grow-1 mx-2" style={{ minWidth: '300px' }}>
                                <RangeSlider 
                                    className="range-slider" 
                                    value={Y.range} 
                                    onInput={(val) => updateY(null, val)} // 실시간 업데이트
                                    min={0} max={1} step="any" 
                                />
                            </div>
                            <input 
                                type="number" className="form-control form-control-sm text-center fw-bold border-secondary-subtle"
                                style={{ width: '80px', height: '38px' }} min="0" max="1" step="0.01"
                                value={Y.range[1]} onChange={(e) => handleInputYChange(1, e.target.value)}
                            />
                        </div>
                    </div>

                    {/* --- Section Z --- */}
                    <div className="section-container">
                        <div className="dropdown mb-4">
                            <button className="btn btn-outline-dark dropdown-toggle px-4 fw-bold" style={{ width: '200px' }}>
                                {Z.label || "Select Z"}
                            </button>
                        </div>

                        <div className="d-flex align-items-center gap-3 justify-content-center">
                            <input 
                                type="number" className="form-control form-control-sm text-center fw-bold border-secondary-subtle"
                                style={{ width: '80px', height: '38px' }} min="0" max="1" step="0.01"
                                value={Z.range[0]} onChange={(e) => handleInputZChange(0, e.target.value)}
                            />
                            <div className="flex-grow-1 mx-2" style={{ minWidth: '300px' }}>
                                <RangeSlider 
                                    className="range-slider" 
                                    value={Z.range} 
                                    onInput={(val) => updateZ(null, val)} // 실시간 업데이트
                                    min={0} max={1} step="any" 
                                />
                            </div>
                            <input 
                                type="number" className="form-control form-control-sm text-center fw-bold border-secondary-subtle"
                                style={{ width: '80px', height: '38px' }} min="0" max="1" step="0.01"
                                value={Z.range[1]} onChange={(e) => handleInputZChange(1, e.target.value)}
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