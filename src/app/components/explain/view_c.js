import React from 'react';
import ExplainView from './explain.js';

export default function ViewC({ selectedFeatureId, setSelectedFeatureId }) {
    return (
            <div 
                className="card shadow-sm h-100" 
                style={{ 
                    background: '#fff', 
                    borderRadius: '12px', 
                    border: 'none',
                    overflow: 'hidden' 
                }}
            >
                <div className="card-body p-0 h-100 d-flex flex-column">
                    <ExplainView 
                        selectedFeatureId={selectedFeatureId} 
                        setSelectedFeatureId={setSelectedFeatureId} 
                    />
                </div>
            </div>
    );
}