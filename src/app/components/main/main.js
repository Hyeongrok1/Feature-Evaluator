import React, { useState } from 'react';
import Header from '../header/Header';
import ViewA from '../raincloud/view_a';
import ViewB from '../triaxis/view_b.js';
import ViewC from '../explain/view_c.js';
import ViewD from '../tagging/view_d.js';

export default function Main() {
    const [selectedFeatureId, setSelectedFeatureId] = useState(null);
    const [selectedTag, setSelectedTag] = useState(null);
    const [X, setX] = useState({ label: "Embedding", range: [0, 1] });
    const [Y, setY] = useState({ label: "Fuzz", range: [0, 1] });
    const [Z, setZ] = useState({ label: "Detection", range: [0, 1] });

    return (
        <div className="container-fluid p-0 bg-light min-vh-100 d-flex flex-column">
            
            <div className="d-flex flex-grow-2 overflow-hidden">
                {/* View A */}
                <div className="p-2" style={{ height: '400px' }}>
                    <Header />
                    <ViewA />
                </div>

                {/* View B */}
                <div className="flex-grow-1 d-flex col-md-6 flex-column overflow-hidden">    
                    <ViewB X={X} Y={Y} Z={Z} setX={setX} setY={setY} setZ={setZ} selectedFeatureId={selectedFeatureId} setSelectedFeatureId={setSelectedFeatureId} />
                </div>

                {/* View C */}
                <div className="flex-grow-1 d-flex col-md-6 flex-column overflow-hidden">    
                    <ViewC selectedFeatureId={selectedFeatureId} />
                </div>
            </div>

            <div className="flex-grow-1 d-flex overflow-hidden">
                <ViewD selectedFeatureId={selectedFeatureId} X={ X } Y={ Y } Z={ Z } setX={ setX } setY={ setY } setZ={ setZ } />
            </div>
        </div>
    );
}