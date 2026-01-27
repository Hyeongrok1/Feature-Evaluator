import React, { useState } from 'react';
import Taglist from './taglist';
import Ranging from './range.js';

export default function ViewD({ setSelectedFeatureId, X, Y, Z, setX, setY, setZ }) {
    const [TagNum, setSelectedTag] = useState(null);

    return (
        /* h-100으로 Main에서 할당한 높이(35%)를 가득 채웁니다 */
        <div className="h-100 w-100 d-flex flex-row p-2 gap-2">
            
            {/* Taglist 영역 (예: 가로 30% 차지) */}
            <div className="card shadow-sm h-100" style={{ flex: '0 0 30%', borderRadius: '12px', border: 'none', overflow: 'hidden' }}>
                <div className="card-body p-3 overflow-y-auto">
                    <Taglist />
                </div>
            </div>

            {/* Ranging 영역 (예: 가로 70% 차지) */}
            <div className="card shadow-sm h-100" style={{ flex: '0 0 70%', borderRadius: '12px', border: 'none', overflow: 'hidden' }}>
                <div className="card-body p-3">
                    <Ranging X={X} Y={Y} Z={Z} setX={setX} setY={setY} setZ={setZ} />
                </div>
            </div>
        </div>
    );
}