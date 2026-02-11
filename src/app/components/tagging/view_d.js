import React, { useState } from 'react';
import Taglist from './taglist';
import Ranging from './range.js';
import preparedTagsData from './tag.json';
import FeatureAbstract from './abstract';

export default function ViewD({ setSelectedFeatureId, X, Y, Z, setX, setY, setZ }) {
    const [tags, setTags] = useState(() => {
        return Object.entries(preparedTagsData).map(([name, data]) => ({
            id: name + "-" + Math.random().toString(36).substr(2, 9),
            name: name,
            color: data.color || 'btn-primary',
            rangeX: data.embedding,
            rangeY: data.fuzzing,
            rangeZ: data.detection
        }));
    });

    const [selectedTagId, setSelectedTagId] = useState(null);

    const handleApplyToTag = () => {
        if (!selectedTagId) {
            alert("수정할 태그를 먼저 선택해주세요.");
            return;
        }
        setTags(prevTags => prevTags.map(tag => {
            if (tag.id === selectedTagId) {
                return {
                    ...tag,
                    rangeX: [...X.range],
                    rangeY: [...Y.range],
                    rangeZ: [...Z.range]
                };
            }
            return tag;
        }));
    };

    return (
        <div className="h-100 w-100 d-flex flex-row p-2 gap-2" style={{ position: 'relative', overflow: 'hidden' }}>
            
            <div className="card shadow-sm h-100" style={{ flex: '0 0 19.5%', borderRadius: '12px', border: 'none', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <div className="card-body p-2 d-flex flex-column h-100" style={{ overflow: 'hidden' }}>
                    <Taglist 
                        X={X} Y={Y} Z={Z} setX={setX} setY={setY} setZ={setZ} 
                        tags={tags} setTags={setTags} 
                        selectedTagId={selectedTagId} setSelectedTagId={setSelectedTagId} 
                    />
                </div>
            </div>

            <div className="card shadow-sm h-100" style={{ flex: '1 1 32%', borderRadius: '12px', border: 'none', display: 'flex', flexDirection: 'column' }}>
                <div className="card-body p-2 h-100" style={{ minHeight: 0 }}> 
                        <div style={{ flex: '0 0 100%', height: '100%' }}>
                            <Ranging X={X} Y={Y} Z={Z} setX={setX} setY={setY} setZ={setZ} onApply={handleApplyToTag} />
                        </div>
                </div>
            </div>
            <div className="card shadow-sm h-100" style={{ flex: '1 1 48.5%', borderRadius: '12px', border: 'none', display: 'flex', flexDirection: 'column' }}>
                <div className="card-body p-2 h-100" style={{ minHeight: 0 }}> 
                        <div className="ps-3" 
                            style={{ 
                                flex: '0 0 100%', 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                minHeight: 0, 
                                overflow: 'hidden' 
                            }}>
                            <FeatureAbstract X={X} Y={Y} Z={Z} />
                        </div>
                </div>
            </div>
        </div>
    );
}