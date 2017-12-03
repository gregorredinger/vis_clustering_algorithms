import "./config.scss"
import Store from "../../store"


/**
 * @module Config
 *
 * Handles the IO of the config values
 * */
export default class {

    constructor() {
        this.store = new Store();
    }

    /**
     * Change epsilon or minPts Value
     *
     * @param typeOfValue {string} - epsilon or minPts
     * @param arithmeticOperation {string} - minus or plus
     * @example changeConfigValues('epsilon', 'minus')
     * @throws validation errors after passing wrong params
     * */
    changeConfigValues(typeOfValue, arithmeticOperation) {
        try {
            // validate input
            if(typeOfValue !== "epsilon" && typeOfValue !== "minPts") { throw "'typeOfValue' Param is wrong"; }
            if(arithmeticOperation !== "minus" && arithmeticOperation !== "plus") { throw "'arithmeticOperation' Param is wrong"; }

            if(typeOfValue === "epsilon") {
                arithmeticOperation === "plus" ? this.store.epsilon++ : this.store.epsilon--;
                if(this.store.epsilon < 0 ) { this.store.epsilon = 0; } // prevent epsilon from being smaller than 0
                document.getElementById("epsilon").value = this.store.epsilon; // display new epsilon value in dom
            } else {
                arithmeticOperation === "plus" ? this.store.minPts++ : this.store.minPts--;
                if(this.store.minPts < 0 ) { this.store.minPts = 0; } // prevent min Pts from being smaller than 0
                document.getElementById("min-pts").value = this.store.minPts; // display new minPts value in dom
            }
        } catch(e) {
            alert("Error in 'changeConfigValues': " + e);
        }
    }
    /**
     * Load the file from the config upload function, create a text representation via file Reader and parse it to js object
     * @param event - event obj that contains a list of files which where added via file api
     * */
    loadSelectedFile(event) {
        try {
            let fileReader = new FileReader();
            fileReader.addEventListener("load", () => {
                let file = JSON.parse(fileReader.result);
                new Store().input = file; // create new Store, because there is some scope problem with func in func, but since store is a singleton this is no problem
            });
            if(event.target.files[0].type !== "application/json") { throw "Filetype not allowed, expected application/json get " + (event.target.files[0].type ? event.target.files[0].type : "unknown"); }
            fileReader.readAsText(event.target.files[0]);
        } catch(e) {
            alert(e);
        }
    }

}

