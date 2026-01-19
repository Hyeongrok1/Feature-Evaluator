import React, { useEffect, useRef } from 'react';
import { get_scores } from './data';
import * as d3 from 'd3';

export default function FuzzCloud() {
    const chartRef = useRef(null);

    const kernelDensityEstimator = (kernel, X) => {
        return (V) => X.map(x => [x, d3.mean(V, v => kernel(x - v))]);
    };
    const kernelEpanechnikov = (k) => {
        return (v) => Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };

    useEffect(() => {
        if (!chartRef.current) return;
        
        d3.select(chartRef.current).selectAll("*").remove();

        const margin = {top: 35, right: 200, bottom: 40, left: 45},
            width = 500 - margin.left - margin.right,
            height = 190 - margin.top - margin.bottom; // 간격 증가를 고려해 높이 약간 수정

        const svg = d3.select(chartRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        svg.append("text")
            .attr("x", 0)             
            .attr("y", -margin.top / 2 - 2) 
            .style("font-size", "15px")
            .style("font-weight", "bold")
            .style("fill", "#333")
            .style("font-family", "monospace")
            .text("Fuzz Distribution & Variance");

        get_scores().then(function(rawData) {
            if (!rawData || rawData.length === 0) return;

            const categories = [
                { key: 'first_fuzz', label: 'hugging-quants', color: '#69b3a2' },
                { key: 'second_fuzz', label: 'Qwen', color: '#404080' },
                { key: 'third_fuzz', label: 'openai', color: '#f8b195' }
            ];

            const x = d3.scaleLinear().domain([0, 1]).range([0, width]);
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).ticks(5))
                .style("font-size", "11px"); 

            const kde = kernelDensityEstimator(kernelEpanechnikov(0.05), x.ticks(40));
            
            const allDensities = categories.map(cat => {
                const values = rawData.map(d => d[cat.key]);
                return {
                    ...cat,
                    density: kde(values),
                    mean: d3.mean(values),
                    median: d3.median(values),
                    variance: d3.variance(values)
                };
            });

            const maxY = d3.max(allDensities, c => d3.max(c.density, d => d[1]));
            const y = d3.scaleLinear().range([height, 0]).domain([0, maxY * 1.1]);

            const highlightModel = (key) => {
                d3.selectAll("path").style("opacity", 0.05); 
                d3.selectAll(`.cloud-${key}`).style("opacity", 0.7).style("stroke-width", 2);
                d3.selectAll(`.stat-${key}`).style("fill", "#000").style("font-weight", "bold");
            };

            const resetHighlight = () => {
                d3.selectAll("path").style("opacity", "0.3").style("stroke-width", 1.2);
                d3.selectAll(`[class^="stat-"]`).style("fill", "#555").style("font-weight", "normal");
            };

            allDensities.forEach((cat, i) => {
                svg.append("path")
                    .datum(cat.density)
                    .attr("fill", cat.color)
                    .attr("opacity", "0.3") 
                    .attr("stroke", cat.color)
                    .attr("stroke-width", 1.2)
                    .attr("class", `cloud-${cat.key}`) 
                    .attr("d", d3.area()
                        .curve(d3.curveBasis)
                        .x(d => x(d[0]))
                        .y0(height) 
                        .y1(d => y(d[1])) 
                    )
                    // Cloud 자체 마우스 오버
                    .on("mouseover", () => highlightModel(cat.key))
                    .on("mouseleave", resetHighlight);

                svg.selectAll(`.dot-${cat.key}`)
                    .data(rawData.filter((_, idx) => idx % 15 === 0)) 
                    .enter()
                    .append("circle")
                    .attr("cx", d => x(d[cat.key]))
                    .attr("cy", height + 8 + (i * 10)) 
                    .attr("r", 1.5)
                    .style("fill", cat.color)
                    .attr("opacity", 0.4);
            });

            const legend = svg.selectAll(".legend")
                .data(allDensities)
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", (d, i) => `translate(${width + 20}, ${i * 50 - 5})`) 
                .style("cursor", "pointer")
                .on("mouseover", (event, d) => highlightModel(d.key))
                .on("mouseleave", resetHighlight);

            legend.append("rect")
                .attr("width", 12)
                .attr("height", 12)
                .style("fill", d => d.color);

            legend.append("text")
                .attr("class", d => `stat-${d.key}`) 
                .attr("x", 18)
                .attr("y", 10)
                .text(d => d.label)
                .style("font-size", "12px")
                .style("font-weight", "bold")
                .style("font-family", "monospace")
                .style("fill", "#555");

            legend.append("text")
                .attr("class", d => `stat-${d.key}`)
                .attr("x", 18)
                .attr("y", 26) 
                .text(d => `avg:${d.mean.toFixed(2)} md:${d.median.toFixed(2)}`)
                .style("font-size", "11px")
                .style("font-family", "monospace")
                .style("fill", "#555");

            legend.append("text")
                .attr("class", d => `stat-${d.key}`)
                .attr("x", 18)
                .attr("y", 40) 
                .text(d => `var:${d.variance.toFixed(4)}`)
                .style("font-size", "11px")
                .style("font-family", "monospace")
                .style("fill", "#dc3545");
        });
        
    }, []);

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '10px' }}>
            <div 
                ref={chartRef} 
                style={{ 
                    background: '#fff', 
                    borderRadius: '8px', 
                    padding: '20px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    overflow: 'visible'
                }}
            ></div>
        </div>
    );
}