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
        <div className="p-3" style={{ width: '626px' }}>
            <div className="h-100 p-3 shadow-sm border" style={{ borderRadius: '12px', background: '#fff' }}>
                <h6 className="fw-bold text-secondary border-bottom pb-2">Tags & Metadata</h6>
                
                <div className="d-flex flex-column gap-2 mt-3 pe-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {tags.map(tag => (
                        <div key={tag.id} className="d-flex gap-1 w-100">
                            <button 
                                className={`btn ${tag.color} p-2 fs-6 text-start border-0 shadow-sm text-white flex-grow-1 d-flex justify-content-between align-items-center`}
                                onClick={() => applyTagFilter(tag)}
                            >
                                <span>
                                    {tag.name} 
                                    <small className="ms-2 opacity-75" style={{fontSize: '10px'}}>
                                        (X: {tag.rangeX[0].toFixed(1)}-{tag.rangeX[1].toFixed(1)})
                                    </small>
                                </span>
                                <span 
                                    className="badge bg-white text-dark ms-2" 
                                    style={{ cursor: 'pointer', opacity: 0.8 }}
                                    onClick={(e) => handleDeleteTag(e, tag.id)}
                                >
                                    ✕
                                </span>
                            </button>
                        </div>
                    ))}

                    {isCreating ? (
                        <div className="p-3 border rounded bg-light mt-2 shadow-sm">
                            <input 
                                type="text" 
                                className="form-control form-control-sm mb-2" 
                                placeholder="Tag Name"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                            />
                            <div className="d-flex gap-2 mb-3">
                                {['btn-primary', 'btn-success', 'btn-info', 'btn-warning', 'btn-danger', 'btn-dark'].map(c => (
                                    <div 
                                        key={c}
                                        onClick={() => setNewTagColor(c)}
                                        className={`${c} rounded-circle border ${newTagColor === c ? 'border-dark border-3' : 'border-white'}`}
                                        style={{ width: '24px', height: '24px', cursor: 'pointer', transition: '0.2s' }}
                                    ></div>
                                ))}
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-primary flex-grow-1" onClick={handleAddTag}>Save</button>
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => setIsCreating(false)}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <button 
                            className="btn btn-outline-dark p-2 fs-6 text-start border-1 border-dashed shadow-sm"
                            onClick={() => setIsCreating(true)}
                        >
                            + New Tag (Save Current Filters)
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}