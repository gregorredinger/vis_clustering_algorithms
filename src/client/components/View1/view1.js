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

    drawAxes() {

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
        let scatterplot = d3.select("#view1_scatterplot").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // x-axis
        scatterplot.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width + 10)
            .attr("y", -10)
            .style("text-anchor", "end")
            .text("x")
            .attr("fill", "black");

        // y-axis
        scatterplot.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("y")
            .attr("fill", "black");



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
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // x-axis
        scatterplot.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width + 10)
            .attr("y", -10)
            .style("text-anchor", "end")
            .text("x")
            .attr("fill", "black");

        // y-axis
        scatterplot.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("y")
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

    }

    updateScatterplot() {}



    drawHistogram() {

    }

    drawNetworkGraph() {

    }
}