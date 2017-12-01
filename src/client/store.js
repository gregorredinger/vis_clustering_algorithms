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

            this.data = {};
            this.epsilon = 1;
            this.minPts = 1;
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
        console.log("DATA: " + this.data);

    }
}