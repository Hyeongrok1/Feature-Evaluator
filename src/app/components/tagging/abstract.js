import React, { useState, useEffect, useRef } from 'react';
import { getFeatureSummary } from './gemini';

export default function FeatureAbstract({ X, Y, Z, targetFeatures }) {
    const [summary, setSummary] = useState("Enter your Gemini API key and adjust the ranges to generate a summary.");
    const [loading, setLoading] = useState(false);
    const [apiKey, setApiKey] = useState("");
    const scrollRef = useRef(null);
    const fontFamily = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

    useEffect(() => {
        const savedKey = localStorage.getItem("GEMINI_API_KEY");
        if (savedKey) setApiKey(savedKey);
    }, []);

    const handleSaveKey = (e) => {
        const key = e.target.value.replace(/\s/g, ''); 
        setApiKey(key);
        localStorage.setItem("GEMINI_API_KEY", key);
    };

    const handleGenerateSummary = async () => {
        if (!apiKey) { alert("Enter your Gemini API key."); return; }
        setLoading(true);
        try {
            const response = await fetch('https://raw.githubusercontent.com/Hyeongrok1/Feature-Evaluator/refs/heads/main/public/data.json');
            const jsonObject = await response.json();
            const result = await getFeatureSummary(jsonObject, targetFeatures, apiKey.trim());            setSummary(result || "No result");
            if (scrollRef.current) scrollRef.current.scrollTop = 0;
        } catch (error) { 
            setSummary(`Error: ${error.message}`); 
        } finally { setLoading(false); }
    };

    return (
        <div className="d-flex flex-column h-100 w-100" style={{ minHeight: 0, position: 'relative' }}>
            
            <div className="d-flex align-items-center justify-content-between border-bottom pb-1" 
                style={{ 
                    overflow: 'visible', 
                    zIndex: 1010, 
                    height: '22px',         
                    paddingTop: 0,         
                    paddingBottom: 0 
                }}> 
                
                <h6 className="fw-bold text-secondary mb-0 px-1" style={{ fontSize: '0.9rem', lineHeight: '1', fontFamily: fontFamily}}>
                    AI Insight
                </h6>
                
                <div className="d-flex align-items-center gap-2">
                    <input 
                        type="password" 
                        className="form-control form-control-sm border-0 bg-light" 
                        placeholder="Key..." 
                        value={apiKey}
                        onChange={handleSaveKey}
                        style={{ 
                            fontSize: '10px', 
                            height: '18px',
                            width: '130px',
                            borderRadius: '4px',
                            padding: '0 8px'
                        }}
                    />
                    <button 
                        className="btn btn-primary btn-sm fw-bold shadow-sm me-2" 
                        style={{ 
                            fontSize: '10px', 
                            height: '18px', 
                            borderRadius: '5px', 
                            padding: '0 10px',
                            lineHeight: '1'
                        }}
                        onClick={handleGenerateSummary}
                        disabled={loading}
                    >
                        {loading ? "..." : "REGENERATE"}
                    </button>
                </div>
            </div>
            
            <div 
                ref={scrollRef}
                className="flex-grow-1 custom-scrollbar" 
                style={{ 
                    overflowY: 'auto', 
                    overflowX: 'hidden',
                    height: 0,        
                    minHeight: 0,
                    backgroundColor: '#fff',
                    paddingRight: '5px'
                }}
            >
                {loading ? (
                    <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                        <div className="spinner-border spinner-border-sm mb-2 text-primary" style={{ width: '1rem', height: '1rem' }}></div>
                        <span style={{ fontSize: '11px', fontFamily: '"D2Coding"' }}>Analyzing...</span>
                    </div>
                ) : (
                    <div className="p-1" style={{ 
                        fontSize: '0.85rem', 
                        lineHeight: '1.7', 
                        whiteSpace: 'pre-wrap',
                        color: '#333',
                        fontFamily: 'inherit',
                        wordBreak: 'break-word'
                    }}>
                        {summary}
                    </div>
                )}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f3f5; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: #adb5bd; 
                    border-radius: 10px; 
                    border: 2px solid #f1f3f5; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #868e96; }
            `}</style>
        </div>
    );
}