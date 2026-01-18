import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { get_explains } from './static.js';

export default function ExplainView({ selectedFeatureId }) {
    const chartRef = useRef(null);

    useEffect(() => {
        const margin = { top: 20, right: 20, bottom: 20, left: 20 },
            width = 580 - margin.left - margin.right,
            height = 185 - margin.top - margin.bottom;

        const ids = ["first", "second", "third"];
        const titles = ["hugging-quants", "Qwen", "openai"];

        let svgContainer = d3.select(chartRef.current);
        
        if (svgContainer.select("svg").empty()) {
            ids.forEach((id, i) => {
                const wrapper = svgContainer.append("div").attr("class", "mb-4 w-100");
                
                wrapper.append("h6").attr("class", "fw-bold text-primary mb-2").text(titles[i]);

                const svg = wrapper.append("svg")
                    .attr("id", id)
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .style("background", "#f8f9fa")
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

                // remove prev text
                container.selectAll("*").remove(); 

                container.append("foreignObject")
                    .attr("width", 550)
                    .attr("height", 200)
                    .append("xhtml:div")
                    .style("font-size", "18px")
                    .style("line-height", "1.6")
                    .style("color", "#333")
                    .html(data[index].Text || "Explaination doesn't exist");
            });
        });
    }, [selectedFeatureId]);

    return (
        <div className="d-flex flex-column align-items-start w-100 p-2">
            <div className="d-flex justify-content-between align-items-center mb-3" style={{ width: '625px' }}>
                <h5 className="m-0 fw-bold text-secondary">Selected Explanation Analysis</h5>
            </div>
            <div 
                ref={chartRef} 
                className="d-flex flex-column align-items-end w-100 p-4"
                style={{ 
                    minHeight: '100px', 
                    background: '#fff', 
                    borderRadius: '12px', 
                    padding: '20px', 
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    maxWidth: '625px'
                }}
            >
            </div>
        </div>
    );
}