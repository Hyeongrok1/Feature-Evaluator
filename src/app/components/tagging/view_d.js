import React from 'react';
import Tagging from './tagging';
import Ranging from './range.js'
import { useState } from 'react';
import Taglist from './taglist';

export default function ViewD({ setSelectedFeatureId, X, Y, Z, setX, setY, setZ }) {
    const [TagNum, setSelectedTag] = useState(null);

    return (
        <>
            <Taglist />
            {/* <Tagging X={ X } Y={ Y } /> */}
            <Ranging X={ X } Y={ Y } Z={ Z } setX={ setX } setY={ setY } setZ={ setZ } />
            {/* <Taglist /> */}

        </>
    );
}