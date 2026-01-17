import React from 'react';
import Tagging from './tagging';
import Ranging from './range.js'
import { useState } from 'react';

export default function Taglist({ selectedFeatureId, setSelectedFeatureId }) {


    return (
        <>
            <div className="p-3" style={{ width: '700px' }}>
                <div className="h-100  p-3">
                    <h6 className="fw-bold text-secondary border-bottom pb-2">View E: Tags & Metadata</h6>
                    <div className="d-flex flex-column gap-2 mt-3">
                        <span className="badge bg-primary p-2 fs-6 text-start">Feature A</span>
                        <span className="badge bg-success p-2 fs-6 text-start">Status: OK</span>
                        <span className="badge bg-info text-dark p-2 fs-6 text-start">Category 1</span>
                    </div>
                </div>
            </div>
        </>
    );
}