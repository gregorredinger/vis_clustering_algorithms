import "./view1.scss"
import Store from "../../store"
import * as d3 from "d3";
import { highlight, unhighlight } from "./view1";


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
        this.width = this.element.offsetWidth;
        this.height = this.width / 4;
        this.margin = {
            top: 20,
            right: 75,
            bottom: 45,
            left: 50
        };

        // set up parent element and SVG
        this.element.innerHTML = '';
        const svg = d3.select(this.element).append('svg');
        svg.attr('width',  this.width);
        svg.attr('height', this.height);

        // we'll actually be appending to a <g> element
        this.plot = svg.append('g')
            .attr('transform',`translate(${this.margin.left},${this.margin.top})`);

        // create the other stuff
        this.createScales();
        this.addAxes();
        this.addBars();
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
            .scale(this.xScale);

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
            .style('fill', '#6670e5')
            .attr('x', function(d, idx){return _this.xScale(idx);})
            .attr('width', this.xScale.bandwidth())
            .attr('height', function(d){
                return _this.height-(_this.margin.top + _this.margin.bottom) - _this.yScale(d.reachabilityDistance)
            })
            .attr('y', function(d){return _this.yScale(d.reachabilityDistance);})
            .on('mouseover', function(point){
                highlight(point);
            })
            .on('mouseout', function(point){
                unhighlight(point);
            });

    }

}