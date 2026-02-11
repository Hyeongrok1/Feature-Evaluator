import React, { useState, useEffect } from 'react';
import { get_explains } from './static.js';

export default function ExplainView({ selectedFeatureId }) {
    const [explains, setExplains] = useState([
        { Text: "Select a feature to see explanation..." },
        { Text: "Select a feature to see explanation..." },
        { Text: "Select a feature to see explanation..." }
    ]);
    
    const titles = ["Openai", "Google", "Hugging-quants"];
    const color = ["#4263EB", "#845EF7", "#0B7285"];
    const fontFamily = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

    useEffect(() => {
        if (!selectedFeatureId) return;

        get_explains(selectedFeatureId).then(data => {
            if (data) setExplains(data);
        });
    }, [selectedFeatureId]);

    return (
        <div 
            className="card w-100 h-100 d-flex flex-column shadow-sm"
            style={{ 
                borderRadius: '12px', 
                border: 'none',
                overflow: 'hidden',
                backgroundColor: '#fff'
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
                    Selected Explanation Analysis
                </h6>
            </div>
                
            <div className="card-body p-3 d-flex flex-column gap-3 overflow-hidden" style={{ flexGrow: 1 }}>
                {explains.map((item, i) => (
                    <div key={i} className="d-flex flex-column" style={{ flex: '1 1 0', minHeight: 0 }}>
                        <div className="fw-bold mb-1 px-1" style={{ 
                            fontFamily: fontFamily, 
                            fontSize: '0.8rem', 
                            color: color[i],
                            textTransform: 'uppercase'
                        }}>
                            {titles[i]}
                        </div>

                        <div 
                            className="custom-scrollbar"
                            style={{ 
                                flexGrow: 1,
                                backgroundColor: '#f9fafb',
                                border: '1px solid #edf2f7',
                                borderRadius: '8px',
                                padding: '12px',
                                fontSize: '0.7rem',
                                lineHeight: '1.6',
                                color: '#4a5568',
                                overflowY: 'auto', 
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                fontFamily: fontFamily
                            }}
                        >
                            {item.Text || "Explanation doesn't exist"}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: #adb5bd; 
                    border-radius: 10px; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #868e96; }
            `}</style>
        </div>
    );
}