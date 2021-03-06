import "./view1.scss"
import Store from "../../store"
import * as d3 from "d3";
import d3Tip from "d3-tip";
import { highlight, unhighlight } from "./view1";


var tool_tip;

export default class ReachabilityPlot {

    constructor(element) {
        // load in arguments from config object
        this.store = new Store();
        this.data = this.store.data;
        this.element = element;
        // create the chart
        this.draw();
    }

    draw() {
        // define width, height and margin
        this.width = window.innerWidth *0.9;
        this.height = this.element.offsetHeight;
        this.margin = {
            top: 20,
            right: 75,
            bottom: 45,
            left: 50
        };

        // set up parent element and SVG
        // this.element.innerHTML = ''; TODO: this removes the eps-Slider!
        const svg = d3.select(this.element).append('svg');
        svg.attr('width',  this.width);
        svg.attr('height', this.height);

        tool_tip = d3Tip()
            .attr("class", "d3-tip")
            .offset([-8, 0])
            .html(function(d) { return "Datapoint: " + d.name +"<br> Distance: " + d.reachabilityDistance.toFixed(2); });

        svg.call(tool_tip);

        // we'll actually be appending to a <g> element
        this.plot = svg.append('g')
            .attr('transform',`translate(${this.margin.left},${this.margin.top})`);

        // create the other stuff
        this.createScales();
        this.addAxes();
        this.addBars();
        this.addEpsLine(this.store.epsilon);

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "translate("+ (this.width/2) +","+(this.height-(this.margin.bottom/3))+")")  // centre below axis
            .text("cluster-order of the data points");

        svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (this.margin.left/3) +","+(this.height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("Reachability Distance");

    }

    createScales() {
        // calculate max and min for data
        const xExtent = d3.range(this.data.length);
        const yExtent = [0, this.store.epsilon];

        this.xScale = d3.scaleBand()
            .range([0, this.width-this.margin.right])
            .domain(xExtent);

        this.yScale = d3.scaleLinear()
            .range([this.height-(this.margin.top+this.margin.bottom), 0])
            .domain(yExtent);
    }

    addAxes() {
        // create and append axis elements
        // this is all pretty straightforward D3 stuff
        const xAxis = d3.axisBottom()
            .scale(this.xScale)
            .tickValues([]);

        const yAxis = d3.axisLeft()
            .scale(this.yScale);

        this.plot.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${this.height-(this.margin.top+this.margin.bottom)})`)
            .call(xAxis);

        this.plot.append("g")
            .attr("class", "y axis")
            .call(yAxis)
    }

    addBars() {
        let _this = this;

        this.plot.append('g')
            .selectAll('rect')
            .data(this.data)
            .enter()
            .append('rect')
            .style('fill', function(d){return d.color})
            .attr('x', function(d, idx){return _this.xScale(idx);})
            .attr('width', this.xScale.bandwidth())
            .attr('height', function(d){
                return _this.height-(_this.margin.top + _this.margin.bottom) - _this.yScale(d.reachabilityDistance)
            })
            .attr('y', function(d){return _this.yScale(d.reachabilityDistance);})
            .on('mouseover', function(point){
                highlight(point);
                tool_tip.show(point);
            })
            .on('mouseout', function(point){
                unhighlight(point);
                tool_tip.hide(point);
            });

    }

    addEpsLine(yPos) {

        let linegroup = this.plot.append("g")
                .attr("transform", "translate(-30, "+this.yScale(yPos)+")");

        linegroup.append("text")
            .attr("id", "epsLineText")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(-10,5)")
            .text("ε'");

        linegroup.append("line")
                .attr("id", "epsLine")
                .attr("x2", this.width - this.margin.right + 30)
                .style("stroke", "#5755d9")
                .style("stroke-width", "2px")

    }

    updateEpsLine(yPos) {
        this.plot.select("#epsLineText")
            .attr("transform", "translate(-10, "+(this.yScale(yPos)+5)+")");

        this.plot.select("#epsLine")
            .attr("transform", "translate(0, "+this.yScale(yPos)+")");
    }

}