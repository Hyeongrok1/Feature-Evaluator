import React, { useState } from 'react';

export default function Taglist({ X, Y, Z, setX, setY, setZ, tags, setTags, selectedTagId, setSelectedTagId }) {
    const [isCreating, setIsCreating] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('btn-primary');
    
    const [editingTagId, setEditingTagId] = useState(null);
    const [editName, setEditName] = useState('');

    const colorPalette = [
        { class: 'btn-primary', hex: '#0d6efd' },
        { class: 'btn-success', hex: '#198754' },
        { class: 'btn-info', hex: '#0dcaf0' },
        { class: 'btn-warning', hex: '#ffc107' },
        { class: 'btn-danger', hex: '#dc3545' },
        { class: 'btn-dark', hex: '#212529' }
    ];

    const handleDeleteTag = (e, id) => {
        e.stopPropagation(); 
        if (selectedTagId === id) setSelectedTagId(null);
        setTags(tags.filter(tag => tag.id !== id));
    };

    const applyTagFilter = (tag) => {
        setSelectedTagId(tag.id);
        if (setX) setX(prev => ({ ...prev, range: [...tag.rangeX] }));
        if (setY) setY(prev => ({ ...prev, range: [...tag.rangeY] }));
        if (setZ) setZ(prev => ({ ...prev, range: [...tag.rangeZ] }));
    };

    const startEditing = (e, tag) => {
        e.stopPropagation();
        setEditingTagId(tag.id);
        setEditName(tag.name);
    };

    const saveName = (id) => {
        setTags(tags.map(t => t.id === id ? { ...t, name: editName } : t));
        setEditingTagId(null);
    };

    const handleAddTag = () => {
        if (!newTagName.trim()) return;
        const newTag = {
            id: Date.now().toString(),
            name: newTagName,
            color: newTagColor,
            rangeX: [...X.range],
            rangeY: [...Y.range],
            rangeZ: [...Z.range],
            lastUpdated: null 
        };
        setTags([...tags, newTag]);
        setNewTagName('');
        setIsCreating(false);
    };

    return (
        <div className="d-flex flex-column h-100 w-100" style={{ fontFamily: 'monospace', overflow: 'hidden' }}>
            <h6 className="fw-bold text-secondary border-bottom pb-1 mb-2 px-1" style={{ fontSize: '0.9rem', flexShrink: 0 }}>
                Tags & Metadata
            </h6>
            <div 
                className="flex-grow-1 custom-tag-scrollbar" 
                style={{ 
                    overflowY: 'auto', 
                    overflowX: 'hidden', 
                    height: 0, 
                    minHeight: 0, 
                    paddingLeft: '6px',  
                    paddingRight: '6px'  
                }}
            >
                <div className="d-flex flex-column gap-2 py-2" style={{ width: '100%' }}>
                    {tags.map(tag => (
                        <div key={tag.id} className="d-flex w-100" style={{ padding: '1px' }}>
                            <button 
                                key={`${tag.id}-${tag.lastUpdated}`} 
                                className={`btn ${tag.color} p-2 px-2 text-start border-0 shadow-sm text-white flex-grow-1 d-flex justify-content-between align-items-center ${tag.lastUpdated ? 'apply-highlight' : ''}`}
                                onClick={() => applyTagFilter(tag)}
                                onDoubleClick={(e) => startEditing(e, tag)}
                                style={{ 
                                    borderRadius: '8px', 
                                    outline: selectedTagId === tag.id ? '2.5px solid #444' : 'none',
                                    outlineOffset: '0px',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <div style={{ lineHeight: '1.3', flexGrow: 1, minWidth: 0 }}>
                                    <div style={{ 
                                        fontSize: '10.5px', 
                                        fontWeight: '700', 
                                        whiteSpace: 'normal', 
                                        wordBreak: 'break-all', 
                                        marginBottom: '2px'
                                    }}>
                                        {tag.name}
                                    </div>
                                    <div style={{ 
                                        fontSize: '8px', 
                                        opacity: 0.9, 
                                        whiteSpace: 'normal', 
                                        wordBreak: 'break-all'
                                    }}>
                                        ({tag.rangeX[0].toFixed(1)}-{tag.rangeX[1].toFixed(1)}, {tag.rangeY[0].toFixed(1)}-{tag.rangeY[1].toFixed(1)}, {tag.rangeZ[0].toFixed(1)}-{tag.rangeZ[1].toFixed(1)})
                                    </div>
                                </div>
                                <span 
                                    className="badge bg-white text-dark ms-2 d-flex align-items-center justify-content-center" 
                                    style={{ 
                                        fontSize: '9px', width: '14px', height: '14px', 
                                        borderRadius: '50%', opacity: 0.6, cursor: 'pointer', flexShrink: 0 
                                    }} 
                                    onClick={(e) => handleDeleteTag(e, tag.id)}
                                >✕</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-2 border-top mt-1 bg-white" style={{ flexShrink: 0 }}>
                {!isCreating ? (
                    <button 
                        className="btn btn-outline-secondary btn-sm w-100 py-2"
                        style={{ borderStyle: 'dashed', fontSize: '10px', borderRadius: '8px', fontWeight: '600' }}
                        onClick={() => setIsCreating(true)}
                    >
                        + New Tag
                    </button>
                ) : (
                    <div className="p-2 border rounded bg-light shadow-sm">
                        <input 
                            type="text" className="form-control form-control-sm mb-2 py-1" 
                            style={{ fontSize: '10.5px' }} placeholder="Tag Name"
                            value={newTagName} onChange={(e) => setNewTagName(e.target.value)}
                        />
                        <div className="d-flex gap-1 mb-2 justify-content-center">
                            {colorPalette.map(color => (
                                <div 
                                    key={color.class} 
                                    onClick={() => setNewTagColor(color.class)}
                                    className="rounded-circle"
                                    style={{ 
                                        width: '15px', height: '15px', backgroundColor: color.hex, cursor: 'pointer',
                                        border: newTagColor === color.class ? '2px solid #333' : '1px solid #ccc'
                                    }}
                                />
                            ))}
                        </div>
                        <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-primary flex-grow-1 py-1 fw-bold" style={{ fontSize: '10px' }} onClick={handleAddTag}>ADD</button>
                            <button className="btn btn-sm btn-outline-secondary py-1" style={{ fontSize: '10px' }} onClick={() => setIsCreating(false)}>CANCEL</button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .custom-tag-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-tag-scrollbar::-webkit-scrollbar-track { background: #f8f9fa; border-radius: 10px; }
                .custom-tag-scrollbar::-webkit-scrollbar-thumb { background: #adb5bd; border-radius: 10px; }
                .custom-tag-scrollbar::-webkit-scrollbar-thumb:hover { background: #868e96; }

                @keyframes apply-highlight-fade {
                    0% { transform: scale(1); filter: brightness(1.3); }
                    50% { transform: scale(1.02); filter: brightness(1.5); }
                    100% { transform: scale(1); filter: brightness(1); }
                }
                .apply-highlight { animation: apply-highlight-fade 0.5s ease-out; }
            `}</style>
        </div>
    );
}