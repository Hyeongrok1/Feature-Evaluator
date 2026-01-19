import React from 'react';
import FuzzCloud from './fuzzcloud.js'
import EmbeddingCloud from './embeddingcloud.js';
import DetectionCloud from './detectioncloud.js';

export default function ViewA() {

    return (
        <>
            {/* Raincloud plot */}
            <div style={{ marginTop: '65px', minHeight: '600px', background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
                <FuzzCloud />
                <DetectionCloud />
                <EmbeddingCloud />
            </div>
        </>
    );
}