import React from 'react';
import Tagging from './tagging';
import Ranging from './range.js'
import { useState } from 'react';
import Taglist from './taglist';

export default function ViewD({ setSelectedFeatureId, X, Y, setX, setY }) {
    const [TagNum, setSelectedTag] = useState(null);

    return (
        <>
            <Taglist />
            <Tagging X={ X } Y={ Y } />
            <Ranging X={ X } Y={ Y } setX={ setX } setY={ setY } />
        </>
    );
}