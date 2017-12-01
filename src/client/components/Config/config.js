import "./config.scss"

/**
 * @module Config
 *
 * Handles the IO of the config values
 * */
export default class {

    constructor() {
        this.epsilon = 1;
        this.minPts = 1;
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
                arithmeticOperation === "plus" ? this.epsilon++ : this.epsilon--;
                if(this.epsilon < 0 ) { this.epsilon = 0; } // prevent epsilon from being smaller than 0
                document.getElementById("epsilon").value = this.epsilon; // display new epsilon value in dom
            } else {
                arithmeticOperation === "plus" ? this.minPts++ : this.minPts--;
                if(this.minPts < 0 ) { this.minPts = 0; } // prevent min Pts from being smaller than 0
                document.getElementById("min-pts").value = this.minPts; // display new minPts value in dom
            }
        } catch(e) {
            alert("Error in 'changeConfigValues': " + e);
        }
    }
    /**
     * Load the file from the config upload function, create a text representation via file Reader and parse that text via d3
     * @param event - event obj that contains a list of files which where added via file api
     * */
    loadSelectedFile(event) {
        let fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            let file = fileReader.result;
            console.log(file);
        });
        fileReader.readAsText(event.target.files[0]);
    }


}

