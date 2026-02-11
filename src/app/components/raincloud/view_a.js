import React from 'react';
import FuzzCloud from './fuzzcloud.js'
import EmbeddingCloud from './embeddingcloud.js';
import DetectionCloud from './detectioncloud.js';

export default function ViewA() {
    const fontFamily = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";
    return (
        <div className="card shadow-sm h-100" style={{ 
            background: '#fff', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            border: 'none'
        }}>           
             <div className="card-header bg-white border-bottom px-3">
                <h6 className="m-0 fw-bold text-secondary"                 
                style={{ 
                    fontFamily: fontFamily,
                    overflow: 'visible', 
                    zIndex: 1010, 
                    height: '23px',      
                    paddingTop: 5,         
                    paddingBottom: 0,
                    fontSize: '0.9rem'
                }}>
                    Distribution & Variance
                </h6>
            </div>
            <div className="card-body p-2 d-flex flex-column justify-content-between h-100">
                <div style={{ flex: '0 0 33%', minHeight: 0 }}><FuzzCloud /></div>
                <div style={{ flex: '0 0 33%', minHeight: 0 }}><DetectionCloud /></div>
                <div style={{ flex: '0 0 33%', minHeight: 0 }}><EmbeddingCloud /></div>
            </div>
        </div>
    );
}