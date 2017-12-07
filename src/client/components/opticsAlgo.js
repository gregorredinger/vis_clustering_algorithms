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
        this.store.clusters = optics.run(this.store.input, 2, 2);
        this.store.plot = optics.getReachabilityPlot();

        // make sure the store.data is empty before adding the elements of the new calculation
        this.store.data = [];

        for(let plotEntry of this.store.plot) {
            this.store.data.push({
                // plotEntry[0] == returns the input entry, the current plot entry is referring to
                x: this.store.input[plotEntry[0]][0],
                y: this.store.input[plotEntry[0]][1],
                reachabilityDistance:  plotEntry[1] || this.store.epsilon,
                name: plotEntry[0], // TODO: give the Point a better name
                color: "" // TODO: implement color cluster assignment
            });
        }
    }

}

