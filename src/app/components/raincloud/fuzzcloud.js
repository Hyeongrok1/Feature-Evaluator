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

        const margin = {top: 35, right: 180, bottom: 40, left: 45},
            totalWidth = 470,
            totalHeight = 230,
            width = totalWidth - margin.left - margin.right,
            height = totalHeight - margin.top - margin.bottom; 

        const svg = d3.select(chartRef.current)
            .append("svg")
            .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`) 
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("width", "100%") 
            .style("height", "auto") 
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        svg.append("text")
            .attr("x", 0)             
            .attr("y", -margin.top / 2 - 4) 
            .style("font-size", "16px") 
            .style("font-weight", "bold")
            .style("fill", "#333")
            .style("font-family", "monospace")
            .text("Fuzz score");

        get_scores().then(function(rawData) {
            if (!rawData || rawData.length === 0) return;

            const categories = [
                { key: 'first_fuzz', label: 'openai', color: '#4263EB' },
                { key: 'second_fuzz', label: 'google', color: '#845EF7' },
                { key: 'third_fuzz', label: 'hugging-quants', color: '#0B7285' }
            ];

            const x = d3.scaleLinear().domain([0, 1]).range([0, width]);
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).ticks(5))
                .style("font-size", "10px") 
                .style("font-family", "monospace"); 

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
                svg.selectAll("path").style("opacity", 0.05); 
                svg.selectAll(`.cloud-${key}`).style("opacity", 0.7).style("stroke-width", 2);
            };

            const resetHighlight = () => {
                svg.selectAll("path").style("opacity", "0.3").style("stroke-width", 1.2);
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
                    .on("mouseover", () => highlightModel(cat.key))
                    .on("mouseleave", resetHighlight);

                svg.selectAll(`.dot-${cat.key}`)
                    .data(rawData.filter((_, idx) => idx % 20 === 0)) 
                    .enter()
                    .append("circle")
                    .attr("cx", d => x(d[cat.key]))
                    .attr("cy", height + 8 + (i * 8)) 
                    .attr("r", 1)
                    .style("fill", cat.color)
                    .attr("opacity", 0.4);
            });

            const legend = svg.selectAll(".legend")
                .data(allDensities)
                .enter().append("g")
                .attr("transform", (d, i) => `translate(${width + 10}, ${i * 45 - 5})`) 
                .style("cursor", "pointer")
                .on("mouseover", (event, d) => highlightModel(d.key))
                .on("mouseleave", resetHighlight);

            legend.append("rect").attr("width", 10).attr("height", 10).style("fill", d => d.color);
            legend.append("text").attr("x", 15).attr("y", 9).text(d => d.label).style("font-size", "15px").style("font-weight", "bold").style("font-family", "monospace");
            legend.append("text").attr("x", 15).attr("y", 22).text(d => `avg:${d.mean.toFixed(2)} md:${d.median.toFixed(2)}`).style("font-size", "11px").style("font-family", "monospace");
            legend.append("text").attr("x", 15).attr("y", 33).text(d => `var:${d.variance.toFixed(4)}`).style("font-size", "10px").style("font-family", "monospace").style("fill", "#dc3545");
        });
        
    }, []);

    return (
        <div className="w-100" style={{ display: 'flex', justifyContent: 'center', minWidth: 0 }}>
            <div 
                ref={chartRef} 
                className="w-100"
                style={{ 
                    background: '#fff', 
                    overflow: 'visible'
                }}
            ></div>
        </div>
    );
}