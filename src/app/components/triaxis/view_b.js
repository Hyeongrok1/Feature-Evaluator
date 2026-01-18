import React from 'react';
import ParallelChart from './parallelChart';

export default function ViewB({ X, Y, Z, setX, setY, setZ, selectedFeatureId, setSelectedFeatureId }) {

    return (
        <>
            <ParallelChart X={X} Y={Y} Z={Z} setX={setX} setY={setY} setZ={setZ} selectedFeatureId={selectedFeatureId} setSelectedFeatureId={setSelectedFeatureId}/>
        </>
    );
}