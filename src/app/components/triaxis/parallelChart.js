import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { get_scores } from '../raincloud/data';
import "./dropdown.css";

export default function ParallelChart({ X, Y, Z, setX, setY, setZ, selectedFeatureId, setSelectedFeatureId, onFilterChange }) {
    const chartRef = useRef(null);
    const [scoreData, setScoreData] = useState([]);
    const filtersRef = useRef(new Map());
    const isInternalUpdate = useRef(false);
    const fontFamily = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

    const models = ['first', 'second', 'third'];
    const modelNames = ["Gpt-4o-mini", "Gemini-flash", "Llama"]; 
    const colorMap = { first: "#4263EB", second: "#845EF7", third: "#0B7285" };

    useEffect(() => {
        get_scores().then(data => { if (data && data.length > 0) setScoreData(data); });
    }, []);

    const validateFilter = (val, range) => {
        const min = Math.min(range[0], range[1]);
        const max = Math.max(range[0], range[1]);
        const epsilon = 1e-10;
        return val >= min - epsilon && val <= max + epsilon;
    };

    const getActiveFilters = () => [
        { key: 'embedding', range: X?.range },
        { key: 'fuzz', range: Y?.range },
        { key: 'detection', range: Z?.range }
    ].filter(f => f.range && (f.range[0] > 0 || f.range[1] < 1));

    const getFilteredDataByModel = (modelKey) => {
        const activeFilters = getActiveFilters();
        if (activeFilters.length === 0) return scoreData;
        
        return scoreData.filter(d => 
            activeFilters.every(f => validateFilter(d[`${modelKey}_${f.key}`], f.range))
        );
    };

    const getAllFilteredData = () => {
        const activeFilters = getActiveFilters();
        if (activeFilters.length === 0) return scoreData;

        return scoreData.filter(d => {
            return models.some(modelKey => 
                activeFilters.every(f => validateFilter(d[`${modelKey}_${f.key}`], f.range))
            );
        });
    };

    useEffect(() => {
        if (!chartRef.current || scoreData.length === 0) return;
        
        const margin = { top: 70, right: 20, bottom: 40, left: 20 };
        const baseHeight = 600; 
        const height = baseHeight - margin.top - margin.bottom;
        const chartSpacing = 400;
        const innerChartWidth = 330;
        const totalWidth = (chartSpacing * 2) + innerChartWidth + margin.left + margin.right;
        const totalHeight = baseHeight;

        const svg = d3.select(chartRef.current)
            .selectAll("svg").data([null]).join("svg")
            .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`) 
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("width", "100%")  
            .style("height", "100%") 
            .style("display", "block");

        if (svg.select(".main-g").empty()) {
            svg.append("g").attr("class", "main-g").attr("transform", `translate(${margin.left}, ${margin.top})`);
        }
        const mainG = svg.select(".main-g");
        const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);

        const updateStyles = () => {
            const activeFilters = getActiveFilters();
            const selectedData = scoreData.find(d => d.feature_id === selectedFeatureId);

            svg.selectAll(".feature-line").each(function(d) {
                const element = d3.select(this);
                const model = element.attr("data-model");
                const isMatch = activeFilters.length === 0 || activeFilters.every(f => validateFilter(d[`${model}_${f.key}`], f.range));
                const isSelected = d.feature_id === selectedFeatureId;

                element.style("stroke", isMatch ? (isSelected ? "red" : colorMap[model]) : "#eee")
                       .style("stroke-width", isSelected ? "4px" : "1.2px")
                       .style("opacity", isMatch ? (isSelected ? 1 : 0.35) : 0.05)
                       .style("cursor", isMatch ? "pointer" : "default");
                if (isSelected && isMatch) element.raise();
            });

            svg.selectAll(".value-label").each(function(d) {
                const [model, dim] = d.split('_');
                const val = selectedData ? selectedData[`${model}_${dim}`] : null;
                d3.select(this).text(val !== null ? val.toFixed(3) : "").style("opacity", val !== null ? 1 : 0).attr("fill", "red");
            });
        };

        const onBrush = (event, commonDim) => {
            if (!event.sourceEvent) return; 
            let newRange = [0, 1];
            if (event.selection) {
                const inverted = event.selection.map(yScale.invert);
                newRange = [d3.min(inverted), d3.max(inverted)];
            }
            window.requestAnimationFrame(() => {
                isInternalUpdate.current = true;
                if (X?.label.toLowerCase() === commonDim) setX({ ...X, range: newRange });
                else if (Y?.label.toLowerCase() === commonDim) setY({ ...Y, range: newRange });
                else if (Z?.label.toLowerCase() === commonDim) setZ({ ...Z, range: newRange });
                isInternalUpdate.current = false;
            });
            updateStyles();
        };

        mainG.selectAll(".model-group").data(models).join("g")
            .attr("class", "model-group")
            .attr("transform", (d, i) => `translate(${i * chartSpacing}, 0)`)
            .each(function(model, i) { 
                const g = d3.select(this);
                const dimensions = [`${model}_embedding`, `${model}_fuzz`, `${model}_detection` ];
                const xScale = d3.scalePoint().range([0, innerChartWidth]).domain(dimensions).padding(0.1);

                g.selectAll(".model-title").data([modelNames[i]]).join("text")
                    .attr("class", "model-title")
                    .attr("x", innerChartWidth / 2)
                    .attr("y", -30)
                    .attr("text-anchor", "middle")
                    .style("font-weight", "bold").style("font-size", "20px").style("font-family", fontFamily).style("fill", colorMap[model])
                    .text(d => d);

                const lineGenerator = d3.line();
                g.selectAll(".feature-line").data(scoreData, d => d.feature_id).join("path")
                    .attr("class", "feature-line")
                    .attr("data-model", model)
                    .attr("d", d => lineGenerator(dimensions.map(dim => [xScale(dim), yScale(d[dim])])))
                    .style("fill", "none")
                    .on("click", (e, d) => {
                        const activeFilters = getActiveFilters();
                        const isMatch = activeFilters.length === 0 || activeFilters.every(f => validateFilter(d[`${model}_${f.key}`], f.range));
                        if (!isMatch) return; 
                        setSelectedFeatureId(d.feature_id === selectedFeatureId ? null : d.feature_id);
                    })
                    .on("mouseover", (e, d) => {
                        const activeFilters = getActiveFilters();
                        const isMatch = activeFilters.length === 0 || activeFilters.every(f => validateFilter(d[`${model}_${f.key}`], f.range));
                        if (!isMatch) return;
                        svg.selectAll(".feature-line").filter(n => n.feature_id === d.feature_id)
                           .raise().style("stroke-width", "6px").style("opacity", 1);
                    })
                    .on("mouseout", updateStyles);

                g.selectAll(".axis-group").data(dimensions).join("g")
                    .attr("class", "axis-group")
                    .attr("transform", d => `translate(${xScale(d)}, 0)`)
                    .each(function(fullDim) {
                        const commonDim = fullDim.split('_')[1];
                        const axisG = d3.select(this);
                        axisG.selectAll(".axis-draw").data([null]).join("g").attr("class", "axis-draw").call(d3.axisLeft(yScale).ticks(5));
                        axisG.selectAll(".axis-label").data([null]).join("text").attr("class", "axis-label").attr("y", -10).style("text-anchor", "middle").style("font-family", fontFamily).style("font-size", "11px").text(commonDim.toUpperCase());
                        axisG.selectAll(".value-label").data([fullDim]).join("text").attr("class", "value-label").attr("y", height + 25).style("text-anchor", "middle").style("font-family", fontFamily).style("font-size", "12px");

                        const brush = d3.brushY().extent([[-15, 0], [15, height]]).on("brush end", (e) => onBrush(e, commonDim));
                        const brushG = axisG.selectAll(".brush").data([null]).join("g").attr("class", "brush").call(brush);
                        if (!isInternalUpdate.current) {
                            const range = (commonDim === 'embedding' ? X : commonDim === 'fuzz' ? Y : Z)?.range;
                            if (range && (range[0] > 0 || range[1] < 1)) 
                                brushG.call(brush.move, [yScale(Math.max(...range)), yScale(Math.min(...range))]);
                            else brushG.call(brush.move, null);
                        }
                    });
            });

        updateStyles();
    }, [scoreData, selectedFeatureId, X, Y, Z]);

    const allFiltered = getAllFilteredData();

        useEffect(() => {
            if (onFilterChange) {
                onFilterChange({
                    all: getAllFilteredData(),
                    gpt: getFilteredDataByModel('first'),
                    gemini: getFilteredDataByModel('second'),
                    llama: getFilteredDataByModel('third')
                });
            }
        }, [X, Y, Z, scoreData]);

    return (
        <div className="card w-100 h-100 d-flex flex-column shadow-sm" style={{ 
            fontFamily: fontFamily, borderRadius: '12px', border: 'none', backgroundColor: '#fff'
        }}>
            <div className="card-header bg-white border-bottom px-3" 
                style={{ overflow: 'visible', zIndex: 1010, height: '40px', paddingTop: 0, paddingBottom: 0 }}>
                <div className="d-flex justify-content-between align-items-center h-100">
                    <div className="d-flex align-items-center gap-2">
                        <h6 className="m-0 fw-bold text-secondary" style={{ fontSize: '0.85rem' }}>Explanation Score Analysis</h6>
                        <div className="d-flex gap-1 ms-2">
                            <div className="dropdown" style={{ position: 'relative' }}>
                                <button className="btn btn-sm btn-outline-secondary dropdown-toggle fw-bold" 
                                        type="button" style={{ minWidth: '70px', fontSize: '0.68rem', height: '22px', padding: '0 6px', borderRadius: '4px' }}>
                                    All ({allFiltered.length})
                                </button>
                                <div className="dropdown-content shadow" style={dropdownStyle}>
                                    {allFiltered.length > 0 ? (
                                        allFiltered.sort((a,b)=>a.feature_id - b.feature_id).map(d => (
                                            <a key={d.feature_id} href="#" className={itemClass(d.feature_id, selectedFeatureId)} style={itemStyle}
                                               onClick={(e) => { e.preventDefault(); setSelectedFeatureId(d.feature_id); }}>
                                                Feature {d.feature_id}
                                            </a>
                                        ))
                                    ) : <div style={noMatchStyle}>Empty</div>}
                                </div>
                            </div>

                            {models.map((mKey, idx) => {
                                const filtered = getFilteredDataByModel(mKey);
                                return (
                                    <div key={mKey} className="dropdown" style={{ position: 'relative' }}>
                                        <button className="btn btn-sm dropdown-toggle fw-bold text-white" 
                                                type="button" 
                                                style={{ minWidth: '85px', fontSize: '0.68rem', height: '22px', padding: '0 6px', borderRadius: '4px', backgroundColor: colorMap[mKey], border: 'none' }}>
                                            {modelNames[idx].split('-')[0]} ({filtered.length})
                                        </button>
                                        <div className="dropdown-content shadow" style={dropdownStyle}>
                                            {filtered.length > 0 ? (
                                                filtered.sort((a,b)=>a.feature_id - b.feature_id).map(d => (
                                                    <a key={d.feature_id} href="#" className={itemClass(d.feature_id, selectedFeatureId)} style={itemStyle}
                                                       onClick={(e) => { e.preventDefault(); setSelectedFeatureId(d.feature_id); }}>
                                                        Feature {d.feature_id}
                                                    </a>
                                                ))
                                            ) : <div style={noMatchStyle}>Empty</div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <button className="btn btn-sm btn-outline-danger fw-bold" 
                            style={{ fontSize: '0.7rem', height: '22px', padding: '0 8px' }} 
                            onClick={() => {
                                d3.selectAll(".brush").call(d3.brushY().move, null);
                                setSelectedFeatureId(null);
                                setX({ label: X.label, range: [0, 1] });
                                setY({ label: Y.label, range: [0, 1] });
                                setZ({ label: Z.label, range: [0, 1] });
                            }}>Reset</button>
                </div>
            </div>
            <div className="card-body p-2 flex-grow-1 overflow-hidden d-flex justify-content-center align-items-center">
                <div ref={chartRef} className="w-100 h-100"></div>
            </div>
            <style>{`
                .dropdown-content::-webkit-scrollbar { width: 4px; }
                .dropdown-content::-webkit-scrollbar-thumb { background: #adb5bd; border-radius: 10px; }
                .dropdown:hover .dropdown-content { display: block; }
                .dropdown-content { display: none; }
            `}</style>
        </div>
    );
}

const dropdownStyle = { position: 'absolute', top: '100%', left: '0', maxHeight: '250px', width: '130px', overflowY: 'auto', zIndex: 9999, backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' };
const itemStyle = { fontSize: '0.72rem', borderBottom: '1px solid #eee' };
const noMatchStyle = { padding: '8px 12px', color: '#adb5bd', fontSize: '0.65rem', textAlign: 'center' };
const itemClass = (id, selectedId) => `px-3 py-1 d-block text-decoration-none ${selectedId === id ? "bg-light fw-bold text-danger" : "text-dark"}`;