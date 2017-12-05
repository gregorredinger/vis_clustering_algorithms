import "./view1.scss"
import Store from "../../store"
import * as d3 from "d3";

/**
 * @module View1
 *
 * This module contains the diagrams for View 1
 *
 * */
export default class {

    constructor() {
        this.store = new Store();
    }


    drawScatterplot() {

        let margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = window.innerWidth/2.8,
            height = window.innerHeight/2.4;

        //  x coordinates
        let xValue = d => d.x, // returns the value to encode for a given data object.
        xScale = d3.scaleLinear().range([0, width]), // maps value to a visual display encoding, such as a pixel position.
        xMap = d => xScale(xValue(d)), // maps from data value to display value
        xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")); //sets up axis

        // y coordinates
        let yValue = d => d.y, // data -> value
        yScale = d3.scaleLinear().range([height, 0]), // value -> display
        yMap = d => yScale(yValue(d)), // data -> display
        yAxis = d3.axisLeft(yScale).tickFormat(d3.format("d"));

        // prevent dots from overlapping axis, so add in buffer to data domain
        xScale.domain([d3.min(this.store.data, xValue)-1, d3.max(this.store.data, xValue)+1]);
        yScale.domain([d3.min(this.store.data, yValue)-1, d3.max(this.store.data, yValue)+1]);

        // add scatterplot svg
        let scatterplot = d3.select("#view1_scatterplot").select("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .select("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // y-axis
        scatterplot.select("g:nth-child(2)")
            .attr("class", "y axis")
            .call(yAxis)
            .enter().append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("y")
            .attr("fill", "black");

        // x-axis
        scatterplot.select("g:nth-child(1)")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .enter().append("text")
            .attr("class", "label")
            .attr("x", width + 10)
            .attr("y", -10)
            .style("text-anchor", "end")
            .text("x")
            .attr("fill", "black");



        let circle = scatterplot.selectAll("circle")
            .data(this.store.data);

        circle.enter().append("circle")
            .attr("r", 2.5)
            .merge(circle)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", "red");

        circle.exit().remove();


        d3.interval(TestUpdate, 1000);

        function TestUpdate(){
            xScale.domain([0, Math.floor((Math.random() * 10000) + 10)]);

            scatterplot.select(".x")
                .transition()
                .call(xAxis);

        }

    }


    drawHistogram() {
        // create x scale
        var x = d3.scaleLinear()
            .range([0, width])
            .domain([0, 100]);

// crate x_axis from scale x
        var x_axis = d3.axisBottom()
            .scale(x);

// draw the axis
        d3.select("#view1_histogram").append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + height / 2 + ")")
            .call(x_axis);


// what to do if I want to update the drawn axis x_axis ?
        function update(){
            // first manipulate the existing objects and update them
            // x_axis already uses the object x, just update the object x with the help of its functions
            x.domain([0, random(10, 10000)]);

            // redraw the update axis via callback. Calling x_axis forces x_axis to call it's domain and its other members
            d3.select(".x")
                .call(x_axis);
        }
    }


    drawNetworkGraph() {

    }
}