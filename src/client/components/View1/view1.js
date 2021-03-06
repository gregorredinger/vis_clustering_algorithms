import "./view1.scss"
import Store from "../../store"
import * as d3 from "d3";
import ReachabilityPlot from "./reachabilityPlot";
import Spreadsheet from "./spreadsheet";

var XepsInPx,
    YepsInPx;

/**
 * @module View1
 *
 * This module contains the diagrams for View 1
 *
 * */
export default class {

    constructor() {
        this.store = new Store();
        this.spreadsheet = new Spreadsheet();
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

        XepsInPx = xScale(d3.min(this.store.data, xValue)-1 + this.store.epsilon) - xScale(d3.min(this.store.data, xValue)-1);
        YepsInPx = yScale(d3.min(this.store.data, yValue)-1) - yScale(d3.min(this.store.data, yValue)-1 + this.store.epsilon);

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
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("y-Axis")
                .attr("fill", "black");

            // x-axis
            scatterplot.select("g:nth-child(1)")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", width + 10)
                .attr("y", -10)
                .style("text-anchor", "end")
                .text("x-Axis")
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
            .style("fill", d => d.color)
            .on('mouseover', function(point){
                highlight(point);
            })
            .on('mouseout', function(point){
                unhighlight(point);
            });



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

    drawSpreadsheet() {
        let data = this.store.data;
        this.spreadsheet.draw(data);
    }

    drawReachabilityPlot() {
        colorCluster(this.store.epsilon);
        this.reachabilityPlot = new ReachabilityPlot(
            document.querySelector('#view1_histogram')
        );
        this.setupEpsSlider();
    }


    setupEpsSlider() {
        let _this = this;
        _this.spreadsheet = this.spreadsheet; // make _this so spreadsheet is also available inside event listener

        let range = document.getElementById("eps-slider"),
            value = document.getElementById("eps-value");
        let yaxis = document.getElementById("view1_histogram")
                .getElementsByClassName("y axis").item(0),
            xaxis = document.getElementById("view1_histogram")
                .getElementsByClassName("x axis").item(0);

        let epsilon = new Store().epsilon;

        value.innerHTML = epsilon.toFixed(1);

        range.setAttribute("max", epsilon);
        range.setAttribute("value", epsilon);
        range.style.height = yaxis.getBoundingClientRect().height + "px";
        range.style.marginBottom = xaxis.getBoundingClientRect().height + 20 + "px";

        range.addEventListener('input', function(){
            let currentVal = parseFloat(this.value);
            value.innerHTML = currentVal.toFixed(1);
            _this.reachabilityPlot.updateEpsLine(currentVal);
            colorCluster(currentVal);
            updateColor();

            // update spreadsheet
            _this.spreadsheet.render();
        });
    }

}

export function highlight(datum){

    let darkerColor = d => d3.color(d.color).darker().toString();

    let circle = d3.selectAll("circle")
        .data(new Store().data)
        .filter(function(d){
            return d === datum;
        })
        .style('fill', darkerColor);

    let cx = circle.attr("cx"),
        cy = circle.attr("cy");

    circle.select(function() { return this.parentNode; })
        .append("ellipse")
        .attr("id", "rangeQuery")
        .attr("rx", XepsInPx )
        .attr("ry", YepsInPx )
        .attr("cx", cx )
        .attr("cy", cy )
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", "none");

    d3.selectAll("rect")
        .data(new Store().data)
        .filter(function(d){
            return d === datum;
        })
        .style('fill', darkerColor);
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

    d3.selectAll("#rangeQuery").remove();
}

function colorCluster(newEps) {
    let data = new Store().data;

    let colors = d3.scaleOrdinal().range(d3.schemeCategory20),
        currentColorNumber = -1,
        noiseColor = "#d9d9d9",
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

    });
}

function updateColor() {
    d3.selectAll("circle")
        .data(new Store().data)
        .style('fill', function(d){return d.color});

    d3.selectAll("rect")
        .data(new Store().data)
        .style('fill', function(d){return d.color});
}