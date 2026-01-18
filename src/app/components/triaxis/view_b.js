import React from 'react';
import ParallelChart from './parallelChart';

export default function ViewB({ X, Y, selectedFeatureId, setSelectedFeatureId }) {

    return (
        <>
            <ParallelChart X={X} Y={Y} selectedFeatureId={selectedFeatureId} setSelectedFeatureId={setSelectedFeatureId}/>
        </>
    );
}