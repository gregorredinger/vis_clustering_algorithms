import "./view1.scss"
import Store from "../../store"
import * as d3 from "d3";
import ReachabilityPlot from "./reachabilityPlot";

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


    /**
     * renders scatterplot to dom
     * if create or update should be triggered is decided by the value store.newDataLoaded {boolean}
     * */
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

        function create() {

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
        }


        // draw the dots in the scatterplot (its not necessary to put it in create or update because enter and merge, exit handle update?? But iam not sure ??? at least it seems to work so far...)
        let circle = scatterplot.selectAll("circle")
            .data(this.store.data);

        circle.enter().append("circle")
            .attr("r", 2.5)
            .merge(circle)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", d => d.color);

        circle.exit().remove();


        function update(){
            //xScale.domain([0, Math.floor((Math.random() * 10000) + 10)]);

            scatterplot.select(".x")
                .transition()
                .call(xAxis);
        }

        // first start trigger create, else trigger update
        this.store.newDataLoaded ? create() : update();

    }

    updateScatterplot() {
    }


    drawReachabilityPlot() {
        colorCluster(this.store.epsilon);
        const reachabilityPlot = new ReachabilityPlot(
            document.querySelector('#view1_histogram')
        );
        setupEpsSlider();
    }

    drawNetworkGraph() {

    }

}

export function highlight(datum){

    d3.selectAll("circle")
        .data(new Store().data)
        .filter(function(d){
            return d === datum;
        })
        .style('fill', '#ff7f0e')
    ;

    d3.selectAll("rect")
        .data(new Store().data)
        .filter(function(d){
            return d === datum;
        })
        .style('fill', '#ff7f0e')
    ;
}

export function unhighlight(datum){
    d3.selectAll("circle")
        .data(new Store().data)
        .filter(function(d){
            return d === datum;
        })
        .style('fill', function (d) {
            return d.color;
        })
    ;

    d3.selectAll("rect")
        .data(new Store().data)
        .filter(function(d){
            return d === datum;
        })
        .style('fill', function (d) {
            return d.color;
        })
    ;
}

function setupEpsSlider() {
    let range = document.getElementById("eps-slider"),
        value = document.getElementById("eps-value");
    let yaxis = document.getElementById("view1_histogram")
        .getElementsByClassName("y axis").item(0),
        xaxis = document.getElementById("view1_histogram")
            .getElementsByClassName("x axis").item(0);


    range.setAttribute("max", new Store().epsilon);
    range.setAttribute("value", new Store().epsilon);
    range.style.height = yaxis.getBoundingClientRect().height + "px";
    range.style.marginBottom = xaxis.getBoundingClientRect().height + 10 + "px";

    range.addEventListener('input', function(){
        value.innerHTML = this.value;
    });
}

function colorCluster(newEps) {
    let data = new Store().data;

    let colors = d3.scaleOrdinal().range(d3.schemeCategory20),
        currentColorNumber = -1,
        noiseColor = "#444444",
        inValley = false;

    data.forEach( function (currentPoint, idx) {
        let nextPoint = data[idx+1];
        // in case we reached the last point there is nothing to compare to we can just finish the loop.
        if(!nextPoint) {
            if(currentPoint.reachabilityDistance >= newEps)  currentPoint.color = noiseColor;
            else currentPoint.color = colors(currentColorNumber);
            return;
        }

        let currentReachabilityDist = (currentPoint.reachabilityDistance < newEps) ? currentPoint.reachabilityDistance : newEps,
            nextPointReachabilityDist = (nextPoint.reachabilityDistance < newEps) ? nextPoint.reachabilityDistance : newEps;

        if(currentReachabilityDist === newEps) inValley = false;

        if(inValley) {
            // if we are in a valley, just go through all the points and color them with the current clusterColor
            currentPoint.color = colors(currentColorNumber);
        } else {

            // we are not in valley. we have to check if we are iterating through noise or reached the start of a valley
            if (currentReachabilityDist === newEps && nextPointReachabilityDist < currentReachabilityDist ) {
                // we found a new valley - get a new color
                currentColorNumber++;
                currentPoint.color = colors(currentColorNumber);
                inValley = true;
            } else if (currentReachabilityDist === newEps && nextPointReachabilityDist === newEps) {
                // we found a noise point
                currentPoint.color = noiseColor;

            } else {
                console.log("!!! No color assigend to point: ");
                console.log(currentPoint);
            }

        }


    })

}