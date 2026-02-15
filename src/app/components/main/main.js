import React, { useState } from 'react';
import ViewA from '../raincloud/view_a';
import ViewB from '../triaxis/view_b.js';
import ViewC from '../explain/view_c.js';
import ViewD from '../tagging/view_d.js';

export default function Main() {
    const [selectedFeatureId, setSelectedFeatureId] = useState(null);
    const [X, setX] = useState({ label: "Embedding", range: [0, 1] });
    const [Y, setY] = useState({ label: "Fuzz", range: [0, 1] });
    const [Z, setZ] = useState({ label: "Detection", range: [0, 1] });
    
    // 추가: 필터링된 피처 배열 상태
    const [filteredFeatures, setFilteredFeatures] = useState([]);

    return (
        <div className="container-fluid p-0 bg-light vh-100 d-flex flex-column overflow-hidden">
            <div className="d-flex flex-row" style={{ flex: '0 0 72%', minHeight: 0 }}>
                <div style={{ flex: '0 0 20%', minWidth: 0 }} className="p-1">
                    <ViewA />
                </div>

                <div style={{ flex: '0 0 60%', minWidth: 0 }} className="p-1">  
                    <ViewB 
                        X={X} Y={Y} Z={Z} setX={setX} setY={setY} setZ={setZ} 
                        selectedFeatureId={selectedFeatureId} 
                        setSelectedFeatureId={setSelectedFeatureId}
                        onFilterChange={setFilteredFeatures} // 추가: 콜백 전달
                    />
                </div>

                <div style={{ flex: '0 0 20%', minWidth: 0 }} className="p-1">
                    <ViewC selectedFeatureId={selectedFeatureId} />
                </div>
            </div>

            <div className="d-flex" style={{ flex: '0 0 28%', minWidth: 0 }}>
                {/* ViewD에 필터링된 데이터 전달 */}
                <ViewD 
                    X={ X } Y={ Y } Z={ Z } setX={ setX } setY={ setY } setZ={ setZ } 
                    filteredFeatures={filteredFeatures} 
                />
            </div>
        </div>
    );
}