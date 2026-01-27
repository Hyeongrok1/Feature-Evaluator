import React from 'react';
import FuzzCloud from './fuzzcloud.js'
import EmbeddingCloud from './embeddingcloud.js';
import DetectionCloud from './detectioncloud.js';

export default function ViewA() {
    return (
        <div className="card shadow-sm h-100" style={{ 
            background: '#fff', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            border: 'none'
        }}>
            <div className="card-body p-2 d-flex flex-column justify-content-between h-100">
                <div style={{ flex: 1, minHeight: 0 }}><FuzzCloud /></div>
                <div style={{ flex: 1, minHeight: 0 }}><DetectionCloud /></div>
                <div style={{ flex: 1, minHeight: 0 }}><EmbeddingCloud /></div>
            </div>
        </div>
    );
}