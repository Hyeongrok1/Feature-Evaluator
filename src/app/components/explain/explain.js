import React, { useEffect, useRef } from 'react';
import { get_explains } from './static.js';
import * as d3 from 'd3';

export default function ExplainView({ selectedFeatureId }) {
    const chartRef = useRef(null);
    const fontFamily = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

    useEffect(() => {
        const margin = { top: 15, right: 15, bottom: 15, left: 15 },
            baseWidth = 580,
            baseHeight = 200;

        const ids = ["first", "second", "third"];
        const titles = ["hugging-quants", "Qwen", "openai"];

        let svgContainer = d3.select(chartRef.current);
        
        if (svgContainer.select("svg").empty()) {
            ids.forEach((id, i) => {
                const wrapper = svgContainer.append("div").attr("class", "mb-3 w-100");
                
                wrapper.append("h6")
                    .attr("class", "fw-bold mb-1")
                    .style("font-family", fontFamily)
                    .style("font-size", "0.9rem")
                    .style("color", "#3b82f6") 
                    .text(titles[i]);

                const svg = wrapper.append("svg")
                    .attr("id", id)
                    .attr("viewBox", `0 0 ${baseWidth} ${baseHeight}`)
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .style("width", "100%")
                    .style("height", "auto")
                    .style("background", "#f9fafb")
                    .style("border", "1px solid #edf2f7")
                    .style("border-radius", "8px");

                svg.append("g")
                    .attr("class", "text-container")
                    .attr("transform", `translate(${margin.left},${margin.top})`);
            });
        }
    }, []);

    useEffect(() => {
        if (!selectedFeatureId) return;

        get_explains(selectedFeatureId).then(data => {
            if (!data) return;

            const ids = ["first", "second", "third"];
            
            ids.forEach((id, index) => {
                const container = d3.select(`#${id}`).select(".text-container");
                container.selectAll("*").remove(); 

                container.append("foreignObject")
                    .attr("width", 550) 
                    .attr("height", 170)
                    .append("xhtml:div")
                    .style("font-family", fontFamily)
                    .style("font-size", "14px") 
                    .style("line-height", "1.5")
                    .style("color", "#4a5568")
                    .style("overflow-wrap", "break-word")
                    .html(data[index].Text || "Explanation doesn't exist");
            });
        });
    }, [selectedFeatureId]);

    return (
        <div 
            className="card w-100 h-100 d-flex flex-column"
            style={{ 
                background: '#fff', 
                borderRadius: '12px', 
                border: 'none',
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                overflow: 'hidden'
            }}
        >
            <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="m-0 fw-bold text-dark" style={{ fontFamily: fontFamily, fontSize: '1rem' }}>
                    Selected Explanation Analysis
                </h5>
            </div>
                
            <div 
                ref={chartRef} 
                className="card-body p-4 overflow-y-auto"
                style={{ flexGrow: 1 }}
            >
            </div>
        </div>
    );
}