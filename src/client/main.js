// import custom components
import Config from "./components/Config/config";
import Store from "./store"
import Optics from "./components/opticsAlgo"
import View1 from "./components/View1/view1.js"
import View2 from "./components/View2/view2.js"

// import npm packages
import * as d3 from "d3";
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
* Views
* */
let view1 = new View1();
let view2 = new View2();

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

        // test data, replace later with real data
        store.input = [
            [0,0],[6,0],[-1,0],[0,1],[0,-1],
            [45,45],[45.1,45.2],[45.1,45.3],[45.8,45.5],[45.2,45.3],
            [50,50],[56,50],[50,52],[50,55],[50,51]
        ];

        if(Object.keys(store.input).length === 0) { throw "Please add a Json File with Data to start Calculation."; }

        // calculate data with optics
        let optics = new Optics(); // wrapper for optics lib
        optics.init(); // calculate data and save them in store.js

        // print data from store
        store.print();

        view1.drawScatterplot();
        view1.drawReachabilityPlot();
        view2.drawSpreadsheet();

        // set to false after start of application
        store.newDataLoaded = false;


    } catch(e) {
        (console.error || console.log).call(console, e.stack || e);
    }
});
