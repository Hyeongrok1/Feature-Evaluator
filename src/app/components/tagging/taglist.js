import React, { useState } from 'react';

export default function Taglist({ selectedFeatureId, X, Y, Z, setX, setY, setZ }) {
    const [tags, setTags] = useState([
        { id: 1, name: 'High Embedding', color: 'btn-primary', rangeX: [0.7, 1.0], rangeY: [0, 1], rangeZ: [0, 1] },
        { id: 2, name: 'Low Fuzz', color: 'btn-success', rangeX: [0, 1], rangeY: [0, 0.3], rangeZ: [0, 1] },
    ]);

    const [isCreating, setIsCreating] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('btn-info');

    const handleDeleteTag = (e, id) => {
        e.stopPropagation(); 
        setTags(tags.filter(tag => tag.id !== id));
    };

    const handleAddTag = () => {
        if (!X || !Y || !Z) {
            alert("부모 컴포넌트에서 필터 데이터(X, Y, Z)가 전달되지 않았습니다.");
            return;
        }
        if (!newTagName.trim()) return;

        const newTag = {
            id: Date.now(),
            name: newTagName,
            color: newTagColor,
            rangeX: X.range ? [...X.range] : [0, 1],
            rangeY: Y.range ? [...Y.range] : [0, 1],
            rangeZ: Z.range ? [...Z.range] : [0, 1]
        };

        setTags([...tags, newTag]);
        setNewTagName('');
        setIsCreating(false);
    };

    const applyTagFilter = (tag) => {
        if (setX) setX({ ...X, range: tag.rangeX });
        if (setY) setY({ ...Y, range: tag.rangeY });
        if (setZ) setZ({ ...Z, range: tag.rangeZ });
    };

    return (
        <div className="h-100 w-100 d-flex flex-column" style={{ fontFamily: 'monospace' }}>
            <div className="h-100 d-flex flex-column p-0">
                <h6 className="fw-bold text-secondary border-bottom pb-2 mb-0" style={{ fontSize: '0.9rem' }}>
                    Tags & Metadata
                </h6>
                
                <div className="flex-grow-1 overflow-y-auto mt-2 pe-1" style={{ minHeight: 0 }}>
                    <div className="d-flex flex-column gap-2">
                        {tags.map(tag => (
                            <div key={tag.id} className="d-flex gap-1 w-100">
                                <button 
                                    className={`btn ${tag.color} p-2 fs-6 text-start border-0 shadow-sm text-white flex-grow-1 d-flex justify-content-between align-items-center`}
                                    onClick={() => applyTagFilter(tag)}
                                    style={{ borderRadius: '8px', transition: '0.2s' }}
                                >
                                    <span style={{ fontSize: '13px' }}>
                                        {tag.name} 
                                        <small className="ms-2 opacity-75" style={{ fontSize: '10px' }}>
                                            ({tag.rangeX[0].toFixed(1)}-{tag.rangeX[1].toFixed(1)})
                                        </small>
                                    </span>
                                    <span 
                                        className="badge bg-white text-dark ms-2" 
                                        style={{ cursor: 'pointer', opacity: 0.6, fontSize: '10px' }}
                                        onClick={(e) => handleDeleteTag(e, tag.id)}
                                    >
                                        ✕
                                    </span>
                                </button>
                            </div>
                        ))}

                        {isCreating ? (
                            <div className="p-2 border rounded bg-light shadow-sm">
                                <input 
                                    type="text" 
                                    className="form-control form-control-sm mb-2" 
                                    placeholder="Tag Name"
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    style={{ fontSize: '12px' }}
                                />
                                <div className="d-flex gap-1 mb-2 flex-wrap">
                                    {['btn-primary', 'btn-success', 'btn-info', 'btn-warning', 'btn-danger', 'btn-dark'].map(c => (
                                        <div 
                                            key={c}
                                            onClick={() => setNewTagColor(c)}
                                            className={`${c} rounded-circle border ${newTagColor === c ? 'border-dark border-2' : 'border-white'}`}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        ></div>
                                    ))}
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-primary flex-grow-1 py-0" style={{fontSize: '11px'}} onClick={handleAddTag}>Save</button>
                                    <button className="btn btn-sm btn-outline-secondary py-0" style={{fontSize: '11px'}} onClick={() => setIsCreating(false)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <button 
                                className="btn btn-outline-dark p-2 text-start border-1 border-dashed shadow-sm"
                                style={{ borderRadius: '8px', fontSize: '12px', borderStyle: 'dashed' }}
                                onClick={() => setIsCreating(true)}
                            >
                                + New Tag (Current)
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}