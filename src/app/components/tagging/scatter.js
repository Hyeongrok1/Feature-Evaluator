import * as d3 from 'd3'

export default class Scatterplot {
    margin = {
        top: 10,
        right: 100,
        bottom: 40,
        left: 70
    }

    constructor(svg, data, width = 500, height = 500) {
        this.svg = svg;
        this.data = data;
        this.width = width;
        this.height = height;
        this.handlers = {};
    }

    initialize() {
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.xScale = d3.scaleLinear();
        this.yScale = d3.scaleLinear();
        this.zScale = d3.scaleOrdinal().range(d3.schemeCategory10)
        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);
        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    }

    update(xVar, yVar, colorVar, useColor) {
        const RADIUS = 4;
        this.xVar = xVar;
        this.yVar = yVar;

        this.svg.append("text")
          .attr("class", "x_label")
          .attr("text-anchor", "middle")
          .attr("x",this.width / 2 + 10)
          .attr("y", this.height + this.margin.top + 35)
          .text(this.xVar["label"])
          .attr("fill", "black")
          .style("font-size", "16px")

        this.svg.append("text")
            .attr("text-anchor", "y_label")
            .attr("transform", "rotate(-90)")
            .attr("y", this.margin.left - 32)
            .attr("x", -this.margin.top - this.height/2 + 10)
            .text(this.yVar["label"])
            .attr("fill", "black")
            .style("font-size", "16px")

        this.xScale.domain(d3.extent(this.data, d => d.xy["x"])).range([0, this.width]);
        this.yScale.domain(d3.extent(this.data, d => d.xy["y"])).range([this.height, 0]);
        this.circles = this.container.selectAll("circle")
            .data(this.data)
            .join(
                (enter) => enter.append("circle"),
                (update) => update.attr("class", "updated"),
                (exit) => exit.transition().duration(500).attr("opacity", 0).remove()
            )
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr("r", RADIUS + 5)
                    .attr("stroke-width", 5);
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200) 
                    .attr("r", RADIUS) 
                    .attr("stroke-width", 2); 
            })
            .on("click", function() {
                d3.selectAll("circle")
                    .attr("stroke", "white")
                    .attr("strok-width", 2);

                let circle = d3.select(this)
                    .attr("stroke", "red")
                    .attr("stroke-width", 5);
                this.feature_id = circle.data()[0].feature_id;
                this.cosine_sim = circle.data()[0].cosine_average;
            })
        this.circles
            .transition()
            .attr("cx", d => this.xScale(d.xy["x"]))
            .attr("cy", d => this.yScale(d.xy["y"]))
            .attr("fill", "navy")
            .attr("r", RADIUS)
        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .transition()
            .call(d3.axisBottom(this.xScale));
        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition()
            .call(d3.axisLeft(this.yScale));
        
    }

}