import Store from "../store"
import * as clustering from "density-clustering";


/**
 * @module OpticsAlgo
 *
 * Do the Calculations with Optics Lib
 * */
export default class {

    constructor() {
        this.store = new Store();
    }

    init() {

        // call optics algorithm here...
        let optics = new clustering.OPTICS();
        // parameters: 2 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
        // TODO: remove debugging msg
        console.log("Optics called with eps: " + this.store.epsilon + " and minPts: " + this.store.minPts);
        this.store.clusters = optics.run(this.store.input, this.store.epsilon, this.store.minPts);
        this.store.plot = optics.getReachabilityPlot();

        // make sure the store.data is empty before adding the elements of the new calculation
        this.store.data = [];

        let distance = dist => {
            if (typeof dist != 'undefined')
                return dist;
            else return new Store().epsilon;
        };

        for(let plotEntry of this.store.plot) {
            this.store.data.push({

                // plotEntry[0] == returns the input entry, the current plot entry is referring to
                x: this.store.input[plotEntry[0]][0],
                y: this.store.input[plotEntry[0]][1],
                reachabilityDistance:  distance(plotEntry[1]),
                name: plotEntry[0], // TODO: give the Point a better name
                color: "",
            });
        }

        // append the correct name according to index in "test dataset" mode
        if(this.store.testDataset) {
            for(let entry of this.store.data) {
                let irisName = "";
                if(entry.name >= 0 && entry.name <=49) { irisName = "virginica"; }
                if(entry.name >= 50 && entry.name <=99) { irisName = "versicolor"; }
                if(entry.name >= 100 && entry.name <=149) { irisName = "setosa"; }
                entry["iris"] = irisName;
            }
        }
        // set test dataset to false again
        this.testDataset = false;
    }

}

