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
//let view2 = new View2();

/*
* Config Event Handlers
* **/
let config = new Config();
document.getElementById("sub-epsilon").addEventListener("click", () => { config.changeConfigValues("epsilon", "minus"); });
document.getElementById("add-epsilon").addEventListener("click", () => { config.changeConfigValues("epsilon", "plus"); });
document.getElementById("sub-min-pts").addEventListener("click", () => { config.changeConfigValues("minPts", "minus"); });
document.getElementById("add-min-pts").addEventListener("click", () => { config.changeConfigValues("minPts", "plus"); });
document.getElementById("file").addEventListener("change", config.loadSelectedFile);

document.getElementById("hierarchical_dataset").addEventListener("click", () => { config.testDatasetLoader("hierarchical_dataset"); });
document.getElementById("fisher_petal_dataset").addEventListener("click", () => { config.testDatasetLoader("fisher_petal_dataset"); });
document.getElementById("fisher_sepal_dataset").addEventListener("click", () => { config.testDatasetLoader("fisher_sepal_dataset"); });
/*
* Start Algorithm Calculations
* **/
document.getElementById("calculate").addEventListener("click", (event) => {
    try {

        if(Object.keys(store.input).length === 0) { alert("Please add a json file or select a test data set, by clicking on one of the buttons below, to start calculation. You can download a dataset in the correct form here:" + window.location.host + "/hierarchical_test_data.json"); }

        // calculate data with optics
        let optics = new Optics(); // wrapper for optics lib
        optics.init(); // calculate data and save them in store.js

        // print data from store
        store.print();

        view1.drawReachabilityPlot();
        view1.drawScatterplot();
        view1.drawSpreadsheet();

        // set to false after start of application
        store.newDataLoaded = false;


    } catch(e) {
        (console.error || console.log).call(console, e.stack || e);
    }
});
