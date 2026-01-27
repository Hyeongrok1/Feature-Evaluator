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
        <div className="container-fluid p-0 bg-light vh-100 d-flex flex-column overflow-hidden">
            
            <div className="d-flex flex-row" style={{ flex: '0 0 65%', minHeight: 0 }}>
                    {/* View A */}
                <div style={{ flex: '0 0 25%', minWidth: 0 }} className="p-1">
                    {/* <Header /> */}
                    <ViewA />
                </div>

                {/* View B */}
                <div style={{ flex: '0 0 50%', minWidth: 0 }} className="p-1">  
                    <ViewB X={X} Y={Y} Z={Z} setX={setX} setY={setY} setZ={setZ} selectedFeatureId={selectedFeatureId} setSelectedFeatureId={setSelectedFeatureId} />
                </div>

                {/* View C */}
                <div style={{ flex: '0 0 25%', minWidth: 0 }} className="p-1">
                    <ViewC selectedFeatureId={selectedFeatureId} />
                </div>
            </div>

            <div className="d-flex" style={{ flex: '0 0 35%', minWidth: 0 }}>
                <ViewD selectedFeatureId={selectedFeatureId} X={ X } Y={ Y } Z={ Z } setX={ setX } setY={ setY } setZ={ setZ } />
            </div>
        </div>
    );
}