import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { get_scores } from '../raincloud/data';
import "./dropdown.css";

export default function ParallelChart({ X, Y, Z, setX, setY, setZ, selectedFeatureId, setSelectedFeatureId }) {
    const chartRef = useRef(null);
    const [scoreData, setScoreData] = useState([]);
    const filtersRef = useRef(new Map());
    const isInternalUpdate = useRef(false);

    useEffect(() => {
        get_scores().then(data => { if (data && data.length > 0) setScoreData(data); });
    }, []);

    const checkIsMatch = (d, filters) => {
        const filterArray = Array.from(filters);
        if (filterArray.length === 0) return true;
        const models = ['first', 'second', 'third'];
        return filterArray.every(([dim, range]) => {
            return models.some(model => {
                const val = d[`${model}_${dim}`];
                return val >= d3.min(range) && val <= d3.max(range);
            });
        });
    };

    useEffect(() => {
        if (!chartRef.current || scoreData.length === 0) return;

        // 모델 내부 데이터 키와 매칭되는 표시용 이름 배열
        const models = ['first', 'second', 'third'];
        const modelNames = ['hugging-quants', 'Qwen', 'openai']; // 요청하신 이름들
        
        const margin = { top: 70, right: 20, bottom: 40, left: 20 };
        const height = 695 - margin.top - margin.bottom;
        const chartSpacing = 400;
        const innerChartWidth = 350;
        const totalWidth = (chartSpacing * 2) + innerChartWidth + margin.left + margin.right;

        const svg = d3.select(chartRef.current)
            .selectAll("svg").data([null]).join("svg")
            .attr("width", totalWidth)
            .attr("height", height + margin.top + margin.bottom);

        if (svg.select(".main-g").empty()) {
            svg.append("g").attr("class", "main-g").attr("transform", `translate(${margin.left}, ${margin.top})`);
        }
        const mainG = svg.select(".main-g");
        
        const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);
        const colorMap = { first: "#69b3a2", second: "#404080", third: "#f8b195" };

        filtersRef.current.clear();
        if (X?.range && (X.range[0] > 0 || X.range[1] < 1)) 
            filtersRef.current.set(X.label.toLowerCase(), [d3.max(X.range), d3.min(X.range)]);
        if (Y?.range && (Y.range[0] > 0 || Y.range[1] < 1)) 
            filtersRef.current.set(Y.label.toLowerCase(), [d3.max(Y.range), d3.min(Y.range)]);
        if (Z?.range && (Z.range[0] > 0 || Z.range[1] < 1)) 
            filtersRef.current.set(Z.label.toLowerCase(), [d3.max(Z.range), d3.min(Z.range)]);

        const updateStyles = () => {
            const activeFilters = filtersRef.current;
            const selectedData = scoreData.find(d => d.feature_id === selectedFeatureId);

            svg.selectAll(".feature-line").each(function(d) {
                const element = d3.select(this);
                const model = element.attr("data-model");
                const isMatch = Array.from(activeFilters).every(([dim, range]) => {
                    const val = d[`${model}_${dim}`];
                    return val >= d3.min(range) && val <= d3.max(range);
                });
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
                filtersRef.current.set(commonDim, [newRange[1], newRange[0]]);
            } else {
                filtersRef.current.delete(commonDim);
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

        // 모델별 그룹 생성
        mainG.selectAll(".model-group").data(models).join("g")
            .attr("class", "model-group")
            .attr("transform", (d, i) => `translate(${i * chartSpacing}, 0)`)
            .each(function(model, i) { // i를 인자로 추가
                const g = d3.select(this);
                const dimensions = [`${model}_embedding`, `${model}_fuzz`, `${model}_detection` ];
                const xScale = d3.scalePoint().range([0, innerChartWidth]).domain(dimensions).padding(0.1);

                // --- 모델 타이틀 삽입 (hugging-quants, Qwen, openai) ---
                g.selectAll(".model-title").data([modelNames[i]]).join("text")
                    .attr("class", "model-title")
                    .attr("x", innerChartWidth / 2)
                    .attr("y", -40)
                    .attr("text-anchor", "middle")
                    .style("font-weight", "bold")
                    .style("font-size", "22px")
                    .style("fill", colorMap[model])
                    .text(d => d);

                const lineGenerator = d3.line();
                g.selectAll(".feature-line").data(scoreData, d => d.feature_id).join("path")
                    .attr("class", "feature-line")
                    .attr("data-model", model)
                    .attr("d", d => lineGenerator(dimensions.map(dim => [xScale(dim), yScale(d[dim])])))
                    .style("fill", "none")
                    .on("click", (e, d) => {
                        const activeFilters = filtersRef.current;
                        const isMatch = Array.from(activeFilters).every(([dim, range]) => {
                            const val = d[`${model}_${dim}`];
                            return val >= d3.min(range) && val <= d3.max(range);
                        });
                        if (!isMatch) return; 
                        setSelectedFeatureId(d.feature_id === selectedFeatureId ? null : d.feature_id);
                    })
                    .on("mouseover", (e, d) => {
                        const activeFilters = filtersRef.current;
                        const isMatch = Array.from(activeFilters).every(([dim, range]) => {
                            const val = d[`${model}_${dim}`];
                            return val >= d3.min(range) && val <= d3.max(range);
                        });
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
                        axisG.selectAll(".axis-label").data([null]).join("text").attr("class", "axis-label").attr("y", -10).style("text-anchor", "middle").style("font-size", "11px").text(commonDim.toUpperCase());
                        axisG.selectAll(".value-label").data([fullDim]).join("text").attr("class", "value-label").attr("y", height + 25).style("text-anchor", "middle").style("font-size", "12px");

                        const brush = d3.brushY().extent([[-15, 0], [15, height]]).on("brush end", (e) => onBrush(e, commonDim));
                        const brushG = axisG.selectAll(".brush").data([null]).join("g").attr("class", "brush").call(brush);
                        if (!isInternalUpdate.current) {
                            const range = filtersRef.current.get(commonDim);
                            if (range) brushG.call(brush.move, [yScale(d3.max(range)), yScale(d3.min(range))]);
                            else brushG.call(brush.move, null);
                        }
                    });
            });

        updateStyles();
    }, [scoreData, selectedFeatureId, X, Y, Z]);

    return (
        <div className="w-100 p-4">
            <div className="card shadow-sm p-4" style={{ borderRadius: '15px', overflowX: 'auto' }}>
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                    <div className="d-flex align-items-center gap-4">
                        <h5 className="fw-bold m-0 text-dark">Multi-Model Analysis</h5>
                        <div className="dropdown" style={{ position: 'relative' }}>
                            <button className="btn btn-outline-dark btn-sm dropdown-toggle fw-bold" type="button" style={{ minWidth: '160px' }}>
                                {selectedFeatureId ? `ID: ${selectedFeatureId}` : "Filtered Features"}
                            </button>
                            <div className="dropdown-content shadow" style={{ maxHeight: '300px', overflowY: 'auto', zIndex: 1000, minWidth: '160px' }}>
                                {scoreData.filter(d => checkIsMatch(d, filtersRef.current)).sort((a, b) => a.feature_id - b.feature_id).map(d => (
                                    <a key={d.feature_id} href="#" className={selectedFeatureId === d.feature_id ? "bg-light fw-bold text-danger" : ""} onClick={(e) => { e.preventDefault(); setSelectedFeatureId(d.feature_id); }}>
                                        Feature {d.feature_id}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => {
                        filtersRef.current.clear();
                        d3.selectAll(".brush").call(d3.brushY().move, null);
                        setSelectedFeatureId(null);
                        setX({ label: X.label, range: [0, 1] });
                        setY({ label: Y.label, range: [0, 1] });
                        setZ({ label: Z.label, range: [0, 1] });
                    }}>Reset All</button>
                </div>
                <div ref={chartRef} className="d-flex justify-content-center"></div>
            </div>
        </div>
    );
}