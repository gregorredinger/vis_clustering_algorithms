// import custom components
import App from "./components/App/app.js";
import Config from "./components/Config/config";
import "./main"
import Store from "./store"

// import npm packages
import * as d3 from "d3";
import * as clustering from "density-clustering";
import "spectre.css"; // css lib
import tabby from "Tabby"; // tab manager
import "Tabby/dist/css/tabby.min.css";
// initialize tab manager
tabby.init();

/*
* store
* **/
let store = new Store();

/*
* Config Event Handlers
* **/
let config = new Config();
document.getElementById("sub-epsilon").addEventListener("click", () => { config.changeConfigValues("epsilon", "minus"); });
document.getElementById("add-epsilon").addEventListener("click", () => { config.changeConfigValues("epsilon", "plus"); });
document.getElementById("sub-min-pts").addEventListener("click", () => { config.changeConfigValues("minPts", "minus"); });
document.getElementById("add-min-pts").addEventListener("click", () => { config.changeConfigValues("minPts", "plus"); });
document.getElementById("file").addEventListener("change", config.loadSelectedFile);

/*
* Start Algorithm Calculations
* **/
document.getElementById("calculate").addEventListener("click", (event) => {
    try {

        store.data = [
            [0,0],[6,0],[-1,0],[0,1],[0,-1],
            [45,45],[45.1,45.2],[45.1,45.3],[45.8,45.5],[45.2,45.3],
            [50,50],[56,50],[50,52],[50,55],[50,51]
        ];

        if(Object.keys(store.data).length === 0) { throw "Please add a Json File with Data to start Calculation."; }

        // call optics algorithm here...
        let optics = new clustering.OPTICS();
        // parameters: 2 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
        let clusters = optics.run(store.data, 2, 2);
        let plot = optics.getReachabilityPlot();
        console.log(clusters, plot);

    } catch(e) {
        alert(e);
    }
});