/**
 * @module store
 * Manages the State of the Application
 *
 * @see {@link http://amanvirk.me/singleton-classes-in-es6/}
 * */


/* You cannot define properties directly inside Es6 class definition.
 In order to avoid re-instantiation of same class , we need to maintain it's state inside a variable which itself is not dependent upon the same class.
 So we set up block level variable to store class state and set it to null by default.
 */
let instance = null;

export default class {

    constructor() {
        if(!instance){
            instance = this;

            this.testDataset = false;
            this.newDataLoaded = true; // indicates if if create (true) or update (false) should be called in the view diagrams

            this.clusters = [];
            this.plot = [];
            this.input = {}; // original json from user
            this.data = [];
            this.epsilon = 2;
            this.minPts = 2;
        }
        return instance;
    }

    /**
     * Print content of store.
     * For debugging purposes only.
     *
     * */
    print() {
        console.log("EPSILON: " + this.epsilon);
        console.log("MINPTS: " + this.minPts);
        console.log("INPUT:");
        console.log(this.input);
        console.log("DATA:");
        console.log(this.data);
        console.log("PLOT:");
        console.log(this.plot);
        console.log("CLUSTERS:");
        console.log(this.clusters);
    }
}