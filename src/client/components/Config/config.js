import "./config.scss"
import Store from "../../store"
import IrisData from "datasets-iris";


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
                if(!Array.isArray(file)) { alert("The dataset must have the form: [ [], [],... ]. You can download a dataset in the correct form here: " + window.location.host + "/hierarchical_test_data.json"); }
                new Store().input = file; // create new Store, because there is some scope problem with func in func, but since store is a singleton this is no problem
            });
            if(event.target.files[0].type !== "application/json") { throw "Filetype not allowed, expected application/json get " + (event.target.files[0].type ? event.target.files[0].type : "unknown"); }
            fileReader.readAsText(event.target.files[0]);
        } catch(e) {
            alert(e);
        }
    }

    /**
     * load test dataset in store.input after button click
     *
     * appending of the correct name (setosa, virginca,...) happens in opticsAlgo.js
     *
     * */
    testDatasetLoader(dataset) {

        switch(dataset) {
            case "fisher_petal_dataset": {
                // set test data to true for appending correct iris name in opticsAlgo
                this.store.testDataset = true;
                // array for iterating over all three datasets
                let irisDatasetPetal = [IrisData.setosa.petal, IrisData.versicolor.petal, IrisData.virginica.petal];
                let irisName = ["setosa", "versicolor", "virginica"];
                this.store.input = [];
                let j = 2;
                while(j >= 0) {
                    for(let i=0; i < irisDatasetPetal[j].len.length; i++) {
                        this.store.input.push([
                            irisDatasetPetal[j].width[i]*10,    // *10 to convert cm to mm
                            irisDatasetPetal[j].len[i]*10
                        ]);
                    }
                    j--;
                }
                break;
            }
            case "fisher_sepal_dataset": {
                this.store.testDataset = true;
                let irisDatasetSepal = [IrisData.setosa.sepal, IrisData.versicolor.sepal, IrisData.virginica.sepal];
                this.store.input = [];
                let j = 2;
                while(j >= 0) {
                    for(let i=0; i < irisDatasetSepal[j].len.length; i++) {
                        this.store.input.push([
                            irisDatasetSepal[j].width[i]*10,    // *10 to convert cm to mm
                            irisDatasetSepal[j].len[i]*10
                        ]);
                    }
                    j--;
                }
                break;
            }
            case "hierarchical_dataset": {
                this.store.input = [
                    [26.75,22.15  ],
                    [29.8,22.15  ],
                    [31.55,21.1  ],
                    [27.7,20.85  ],
                    [29.9,19.95  ],
                    [26.8,19.05  ],
                    [28.35,18.25  ],
                    [30.4,17.85  ],
                    [27.25,16.7  ],
                    [29.05,16  ],
                    [27.15,14.85  ],
                    [28.2,13.95  ],
                    [30.35,13.85  ],
                    [27.25,11.95  ],
                    [29.45,12.05  ],
                    [31.55,12.2  ],
                    [33.05,10.65  ],
                    [29.95,9.85  ],
                    [28,9.75  ],
                    [27.15,7.85  ],
                    [29.15,8.1  ],
                    [31.95,8.6  ],
                    [34.7,8.55  ],
                    [34.8,12.25  ],
                    [36.3,15.25  ],
                    [36.6,13.2  ],
                    [38.7,14.25  ],
                    [40.3,15.5  ],
                    [42.25,14.25  ],
                    [40.7,12.8  ],
                    [38.6,12.1  ],
                    [36.1,10.5  ],
                    [38.35,10.4  ],
                    [37.65,8.4  ],
                    [40.15,8.55  ],
                    [40.8,10.65  ],
                    [42.9,11.25  ],
                    [41.95,8.5  ],
                    [42.45,17.45  ],
                    [40.25,18.45  ],
                    [42.55,19.45  ],
                    [40.95,20.65  ],
                    [42.25,22.15  ],
                    [38.85,22.4  ],
                    [38.4,20  ],
                    [35.25,20.2  ],
                    [33.25,21  ],
                    [34.15,22.35  ],
                    [35.55,22.5  ],
                    [36.55,21.4  ],
                    [33.35,19.6  ],
                    [32.85,19.55  ],
                    [32.4,19.15  ],
                    [32.45,18.7  ],
                    [32.8,18.9  ],
                    [33.2,19.2  ],
                    [33.7,19.05  ],
                    [33.4,18.75  ],
                    [33.05,18.5  ],
                    [32.8,18.2  ],
                    [34,18.7  ],
                    [33.85,18.25  ],
                    [33.35,18.15  ],
                    [32.8,17.7  ],
                    [33.15,17.55  ],
                    [33.75,17.75  ],
                    [34.15,17.85  ],
                    [34.35,18.35  ],
                    [34.95,18.5  ],
                    [34.75,18.05  ],
                    [35.15,18.05  ],
                    [35.65,18.15  ],
                    [35.45,18.7  ],
                    [36.05,18.75  ],
                    [36.25,18.2  ],
                    [36.6,18.7  ],
                    [37.1,18.5  ],
                    [36.75,18.1  ],
                    [37.65,18.3  ],
                    [37.15,17.85  ],
                    [37.65,17.75  ],
                    [38.05,18.1  ],
                    [38.45,17.7  ],
                    [38.8,17.3  ],
                    [38.2,17.25  ],
                    [38.6,16.8  ],
                    [38.25,16.35  ],
                    [37.9,16.85  ],
                    [37.5,17.3  ],
                    [37.65,16.4  ],
                    [37.15,16.7  ],
                    [37,17.15  ],
                    [36.6,17.4  ],
                    [36.15,17.55  ],
                    [35.75,17.65  ],
                    [36.6,16.9  ],
                    [36.05,16.95  ],
                    [35.45,17  ],
                    [35.3,17.55  ],
                    [34.9,17  ],
                    [34.75,17.45  ],
                    [34.3,17.35  ],
                    [34.3,16.8  ],
                    [33.9,17.2  ],
                    [33.35,17.05  ],
                    [32.85,16.95  ],
                    [33.55,16.6  ],
                    [34,16.4  ],
                    [32.45,17.2  ],
                    [32.1,16.85  ],
                    [31.7,16.65  ],
                    [31.2,16.35  ],
                    [30.95,15.75  ],
                    [31.15,15.35  ],
                    [31.45,15.1  ],
                    [31.75,14.7  ],
                    [32.15,14.35  ],
                    [32.65,14.15  ],
                    [33.15,14.05  ],
                    [33.8,13.9  ],
                    [34.35,14.2  ],
                    [34.3,14.85  ],
                    [34.05,15.35  ],
                    [33.9,15.95  ],
                    [33.35,16.05  ],
                    [33,16.5  ],
                    [32.45,16.6  ],
                    [31.95,16.25  ],
                    [31.5,15.85  ],
                    [31.75,15.4  ],
                    [32.15,15.8  ],
                    [32.55,16.1  ],
                    [32.9,15.7  ],
                    [32.55,15.4  ],
                    [32.05,15.2  ],
                    [32.5,14.8  ],
                    [33,15.25  ],
                    [33.5,15.6  ],
                    [33.6,15.05  ],
                    [32.9,14.7  ],
                    [33.3,14.5  ],
                    [33.8,14.5  ],
                    [9.2,22.35  ],
                    [10.9,22.35  ],
                    [12.45,22.3  ],
                    [13.95,22.05  ],
                    [14.65,20.3  ],
                    [13.15,20.8  ],
                    [11.6,20.95  ],
                    [10.25,21.25  ],
                    [9.2,20.8  ],
                    [8.05,21.55  ],
                    [7.15,19.9  ],
                    [8.55,20  ],
                    [8.5,19.2  ],
                    [7.35,18.3  ],
                    [8.25,16.65  ],
                    [8.95,18  ],
                    [9.6,18.85  ],
                    [9.65,19.75  ],
                    [10.2,20.25  ],
                    [10.9,20.3  ],
                    [12.15,20  ],
                    [11.25,19.75  ],
                    [10.8,19.6  ],
                    [10.4,19.55  ],
                    [10.65,19.35  ],
                    [10.3,19.15  ],
                    [10.95,19.1  ],
                    [10.6,18.85  ],
                    [10.05,18.1  ],
                    [10.35,16.9  ],
                    [10.05,15.9  ],
                    [11.15,18.1  ],
                    [12.1,18.75  ],
                    [13.2,19.2  ],
                    [11.5,17.1  ],
                    [12.65,17.65  ],
                    [14.45,18.35  ],
                    [13.9,16.7  ],
                    [12.6,15.8  ],
                    [15.95,20.75  ],
                    [16.95,21.6  ],
                    [17.9,21.95  ],
                    [19,22.7  ],
                    [20.45,22.75  ],
                    [19.1,21.7  ],
                    [20.4,21.4  ],
                    [21.95,21.9  ],
                    [18.65,20.7  ],
                    [17.75,20.55  ],
                    [17.05,19.85  ],
                    [15.75,19.45  ],
                    [15.75,18.25  ],
                    [16.35,16.9  ],
                    [17.2,15.9  ],
                    [17.9,17  ],
                    [17.3,17.75  ],
                    [17,18.9  ],
                    [17.8,18.65  ],
                    [17.85,19.5  ],
                    [18.5,19.9  ],
                    [19.1,19.95  ],
                    [19.55,20.55  ],
                    [20.1,19.9  ],
                    [19.55,19.3  ],
                    [18.95,19.3  ],
                    [18.55,19.2  ],
                    [18.45,18.85  ],
                    [18.85,18.9  ],
                    [19.2,18.8  ],
                    [18.75,18.55  ],
                    [18.3,18.1  ],
                    [19.1,17.8  ],
                    [19,16.75  ],
                    [18.75,15.5  ],
                    [19.65,18.2  ],
                    [20.1,18.95  ],
                    [21.25,20.4  ],
                    [21.45,19  ],
                    [20.9,17.9  ],
                    [20.25,17.2  ],
                    [20.1,15.4  ],
                    [21.4,15.95  ],
                    [22.2,17.15  ],
                    [11.4,12.55  ],
                    [12.05,12.75  ],
                    [12.7,13  ],
                    [13.35,13.05  ],
                    [14.2,12.95  ],
                    [15.05,12.95  ],
                    [15.6,12.95  ],
                    [16.1,13.1  ],
                    [15.95,12.6  ],
                    [15.4,12.45  ],
                    [14.65,12.4  ],
                    [13.85,12.4  ],
                    [13.15,12.2  ],
                    [12.65,12.4  ],
                    [11.9,12.1  ],
                    [12,11.5  ],
                    [12.65,11.65  ],
                    [13.4,11.65  ],
                    [14.1,11.7  ],
                    [14.6,11.8  ],
                    [15.2,11.95  ],
                    [15.05,11.55  ],
                    [14.45,11.2  ],
                    [13.95,10.9  ],
                    [13.05,11.1  ],
                    [13.55,10.65  ],
                    [12.45,10.9  ],
                    [13.2,10.25  ],
                    [11.25,11.1  ],
                    [11.25,11.85  ],
                    [10.7,12.25  ],
                    [10.05,11.85  ],
                    [10.6,11.6  ],
                    [9.75,11.35  ],
                    [10.4,10.9  ],
                    [9.75,10.6  ],
                    [9.75,9.8  ],
                    [10.35,10.2  ],
                    [10.9,10.4  ],
                    [11.7,10.55  ],
                    [12.4,10.1  ],
                    [12.9,9.7  ],
                    [12.35,9.65  ],
                    [11.85,10  ],
                    [11.15,9.8  ],
                    [10.65,9.55  ],
                    [10.1,9.25  ],
                    [10.75,9  ],
                    [11.1,9.3  ],
                    [11.7,9.4  ],
                    [12.15,9.1  ],
                    [12.85,9.05  ],
                    [12.45,8.7  ],
                    [11.95,8.25  ],
                    [11.7,8.85  ],
                    [11.3,8.5  ],
                    [11.55,7.95  ],
                    [12.9,8.5  ],
                    [13.25,8.05  ],
                    [12.65,7.95  ],
                    [12.1,7.6  ],
                    [11.65,7.35  ],
                    [12.2,7  ],
                    [11.8,6.65  ],
                    [12.65,7.3  ],
                    [13.2,7.55  ],
                    [13.65,7.75  ],
                    [14.35,7.55  ],
                    [13.8,7.3  ],
                    [13.35,6.85  ],
                    [12.7,6.7  ],
                    [12.45,6.25  ],
                    [13.2,5.85  ],
                    [13.65,6.25  ],
                    [14.1,6.75  ],
                    [14.7,6.9  ],
                    [15,7.5  ],
                    [15.85,7.3  ],
                    [15.35,7.05  ],
                    [15.1,6.35  ],
                    [14.45,6.3  ],
                    [14.75,5.75  ],
                    [13.95,5.8  ],
                    [15.5,5.9  ],
                    [15.8,6.4  ],
                    [16.05,6.85  ],
                    [16.55,7.1  ],
                    [16.7,6.5  ],
                    [16.25,6.1  ],
                    [17.05,6.25  ],
                    [15.85,11.55  ],
                    [15.9,12.1  ],
                    [16.3,11.65  ],
                    [16.55,12.05  ],
                    [16.5,12.6  ],
                    [16.75,13.1  ],
                    [17.5,13  ],
                    [17.15,12.65  ],
                    [17.1,12.1  ],
                    [16.9,11.7  ],
                    [17.4,11.65  ],
                    [17.55,12.1  ],
                    [17.75,12.65  ],
                    [18.3,12.75  ],
                    [18.25,12.25  ],
                    [18,11.95  ],
                    [17.85,11.5  ],
                    [18.3,11.65  ],
                    [18.6,12  ],
                    [18.85,12.45  ],
                    [19.1,11.8  ],
                    [18.85,11.45  ],
                    [18.5,11.15  ],
                    [18.95,10.8  ],
                    [19.3,11.15  ],
                    [19.4,10.7  ],
                    [19.25,10.35  ],
                    [19.9,10.6  ],
                    [19.65,10.15  ],
                    [19.45,9.75  ],
                    [19.9,9.45  ],
                    [20.3,10.05  ],
                    [20.65,10.35  ],
                    [21.25,10.1  ],
                    [20.9,9.9  ],
                    [21.65,9.65  ],
                    [21.15,9.35  ],
                    [20.5,9.4  ],
                    [19.5,9.2  ],
                    [19.95,8.85  ],
                    [20.65,8.8  ],
                    [21.2,8.7  ],
                    [21.9,8.85  ],
                    [21.75,8.25  ],
                    [21.65,7.8  ],
                    [21.05,8  ],
                    [20.3,8.2  ],
                    [19.4,8.7  ],
                    [19.6,8.05  ],
                    [18.95,8.1  ],
                    [20,7.6  ],
                    [20.55,7.55  ],
                    [21.25,7.25  ],
                    [20.85,6.85  ],
                    [20.25,7.05  ],
                    [19.55,7.05  ],
                    [19.05,7.45  ],
                    [18.35,7.6  ],
                    [17.85,7.3  ],
                    [18.3,7.1  ],
                    [18.95,6.85  ],
                    [19.6,6.25  ],
                    [20.15,6.45  ],
                    [18.8,6.25  ],
                    [18.35,6.55  ],
                    [17.65,6.55  ],
                    [17.25,6.9  ],
                    [17.95,6.2  ],
                    [17.45,9.85  ],
                    [17.2,9.25  ],
                    [17,9.6  ],
                    [17,10.05  ],
                    [16.45,10.1  ],
                    [16.5,9.8  ],
                    [16.6,9.45  ],
                    [16.6,9.05  ],
                    [15.9,9  ],
                    [16.05,9.35  ],
                    [16.05,9.65  ],
                    [15.85,9.95  ],
                    [15.35,9.9  ],
                    [15.6,9.45  ],
                    [15.3,9.15  ],
                    [15.1,9.55  ]
                ];
                break;
            }
        }

    }

    dataPreviewSidebar() {

    }





}
