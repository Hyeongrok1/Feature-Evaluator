import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { get_scores } from '../raincloud/data';

export default function ParallelChart({ X, Y, selectedFeatureId, setSelectedFeatureId }) {
    const chartRef = useRef(null);
    const [scoreData, setScoreData] = useState([]);
    // 공통 필터 상태: Map<"embedding" | "fuzz" | "detection", [max, min]>
    const filtersRef = useRef(new Map());

    useEffect(() => {
        get_scores().then(data => { if (data && data.length > 0) setScoreData(data); });
    }, []);

    useEffect(() => {
        if (!chartRef.current || scoreData.length === 0) return;

        // 1. 레이아웃 설정
        const models = ['first', 'second', 'third'];
        const margin = { top: 70, right: 20, bottom: 50, left: 20 };
        const height = 710 - margin.top - margin.bottom;
        
        // 그래프 간격을 좁히기 위한 핵심 변수
        const chartSpacing = 400;  // 모델 시작점 사이의 거리 (줄일수록 그래프가 붙음)
        const innerChartWidth = 350; // 각 그래프 내부 축 사이의 너비
        const totalWidth = (chartSpacing * 2) + innerChartWidth + margin.left + margin.right;

        const svg = d3.select(chartRef.current)
            .selectAll("svg").data([null]).join("svg")
            .attr("width", totalWidth)
            .attr("height", height + margin.top + margin.bottom);

        svg.selectAll("*").remove();
        const mainG = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
        
        const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);
        const colorMap = { first: "#69b3a2", second: "#404080", third: "#f8b195" };

        // 2. 스타일 업데이트 함수 (필터 및 클릭 상태 동기화)
        const updateStyles = () => {
            const activeFilters = filtersRef.current;
            const selectedData = scoreData.find(d => d.feature_id === selectedFeatureId);
            svg.selectAll(".feature-line").each(function(d) {
                const element = d3.select(this);
                const model = element.attr("data-model");
                
                // 공통 필터 적용 여부 확인
                const isMatch = Array.from(activeFilters).every(([commonDim, [max, min]]) => {
                    const val = d[`${model}_${commonDim}`];
                    return val >= min && val <= max;
                });
                
                // 클릭 상태 확인 (ID 기준 동기화)
                const isSelected = d.feature_id === selectedFeatureId;

                if (!isMatch) {
                    element.style("stroke", "#eee").style("stroke-width", "1px").style("opacity", 0.05);
                } else {
                    if (isSelected) {
                        element.style("stroke", "red").style("stroke-width", "4px").style("opacity", 1).raise();
                    } else {
                        element.style("stroke", colorMap[model]).style("stroke-width", "1.2px").style("opacity", 0.35);
                    }
                }
            });
// 축 하단 수치 텍스트 업데이트
            svg.selectAll(".value-label").each(function(d) {
                const [model, commonDim] = d.split('_');
                const textElement = d3.select(this);
                
                if (selectedData) {
                    const value = selectedData[`${model}_${commonDim}`];
                    textElement
                        .text(value.toFixed(3)) // 소수점 3자리까지 표시
                        .style("opacity", 1)
                        .attr("fill", "red")
                        .style("font-weight", "bold");
                } else {
                    textElement.style("opacity", 0); // 선택된 데이터가 없으면 숨김
                }
            });
        };

        // 3. 브러시 이벤트
        const onBrush = (event, commonDim) => {
            if (event.selection) {
                const [y1, y0] = event.selection.map(yScale.invert);
                filtersRef.current.set(commonDim, [y1, y0]); 
            } else {
                filtersRef.current.delete(commonDim);
            }
            updateStyles();
        };

        // 4. 모델별 그래프 생성
        models.forEach((model, i) => {
            const groupX = i * chartSpacing;
            const modelG = mainG.append("g").attr("transform", `translate(${groupX}, 0)`);
            const dimensions = [`${model}_embedding`, `${model}_fuzz`, `${model}_detection` ];
            
            const xScale = d3.scalePoint()
                .range([0, innerChartWidth])
                .domain(dimensions)
                .padding(0.1);

            // 모델 타이틀
            modelG.append("text")
                .attr("x", innerChartWidth / 2).attr("y", -40)
                .attr("text-anchor", "middle").style("font-weight", "bold").style("fill", colorMap[model])
                .text(`LLM ${i + 1}`);

            // 선 그리기
            const lineGenerator = d3.line();
            modelG.selectAll(".feature-line")
                .data(scoreData).enter().append("path")
                .attr("class", "feature-line").attr("data-model", model)
                .attr("d", d => lineGenerator(dimensions.map(dim => [xScale(dim), yScale(d[dim])])))
                .style("fill", "none").style("cursor", "pointer")
                .on("click", (event, d) => {
                    setSelectedFeatureId(prev => prev === d.feature_id ? null : d.feature_id);
                })
                .on("mouseover", function(event, d) {
                    const targetId = d.feature_id;
                    // 마우스 올린 ID와 동일한 모든 모델의 선 강조
                    svg.selectAll(".feature-line")
                       .filter(node => node.feature_id === targetId)
                       .raise()
                       .style("stroke-width", "6px")
                       .style("opacity", 1);
                })
                .on("mouseout", updateStyles);

            // 축 및 브러시 설정
            const axisGroups = modelG.selectAll(".axis-group")
                .data(dimensions).enter().append("g").attr("transform", d => `translate(${xScale(d)}, 0)`);

            axisGroups.each(function(fullDim) {
                const commonDim = fullDim.split('_')[1];
                const axisG = d3.select(this);
                
                axisG.call(d3.axisLeft(yScale).ticks(5));
                axisG.append("text").attr("y", -10).style("text-anchor", "middle").style("fill", "#666").style("font-size", "11px")
                    .text(commonDim.toUpperCase());

                // 하단 수치 표시용 텍스트 요소 추가
                axisG.append("text")
                    .attr("class", "value-label")
                    .attr("data-dim", fullDim)
                    .attr("y", height + 25) // 축 하단에 배치
                    .style("text-anchor", "middle")
                    .style("font-size", "12px")
                    .style("opacity", 0); // 초기에는 숨김

                const brush = d3.brushY()
                    .extent([[-15, 0], [15, height]])
                    .on("brush end", (event) => onBrush(event, commonDim));

                axisG.append("g").attr("class", "brush").call(brush);
            });
        });

        updateStyles();
    }, [scoreData, selectedFeatureId, X, Y]);

    return (
        <div className="w-100 p-4">
            <div className="card shadow-sm p-4" style={{ borderRadius: '15px', overflowX: 'auto' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h5 className="fw-bold m-0 text-dark">Multi-Model Analysis</h5>
                        {/* <small className="text-muted">Filtering and selection are synchronized across all models.</small> */}
                    </div>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => {
                        filtersRef.current.clear();
                        d3.selectAll(".brush").call(d3.brushY().move, null);
                        setSelectedFeatureId(null);
                    }}>Reset All</button>
                </div>
                <div ref={chartRef} className="d-flex justify-content-center"></div>
            </div>
        </div>
    );
}