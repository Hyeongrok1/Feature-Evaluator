import React from 'react';
import ParallelChart from './parallelChart';

export default function ViewB({ X, Y, Z, setX, setY, setZ, selectedFeatureId, setSelectedFeatureId }) {

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
                <div className="card-body p-0 d-flex flex-column h-100">
                    <ParallelChart 
                        X={X} Y={Y} Z={Z} 
                        setX={setX} setY={setY} setZ={setZ} 
                        selectedFeatureId={selectedFeatureId} 
                        setSelectedFeatureId={setSelectedFeatureId}
                    />
                </div>
            </div>
    );
}