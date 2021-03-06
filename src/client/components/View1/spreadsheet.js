import "./view1.scss"
import "./hot.scss"; // css for handsontable module
import Store from "../../store"
import * as d3 from "d3";
import Handsontable from "handsontable";


/**
 * @module Spreadsheet
 * draws the Spreadsheet
 *
 * @requires Handsontable - {@link https://handsontable.com/examples?headers#|Handsontable Spreadsheet Example}
 *
 * @see {@link https://handsontable.com/blog/articles/a-complete-guide-to-changing-size-of-handsontable|Change Size of Handsontable}
 * */
export default class Spreadsheet {

    constructor() {
        this.store = new Store();
        // calculate the size of the parent node where the Spreadsheet gets inserted
        //this.widthOfContainer = document.getElementById('view1_spreadsheet').getBoundingClientRect().width; auto calculation dont work correctly, because of some issue with handsontable module
        this.heightOfContainer = document.getElementById('view1_spreadsheet').getBoundingClientRect().height;
        if (this.widthOfContainer === 0) { this.widthOfContainer = 1000; } // fallback if calc doesnt work

    }

    /*
    * progressBar.max wäre bei uns das Epsilon. progressBar.value wäre die reachabilityDistance*/
    draw() {

        // colors the table rows
        function rowColorRenderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);

            let node = td.parentNode; // get the node of the row where the respective color entrie lives
            if(node !== null) { // some nodes are null, so we avoid iterateing over them
                for(let childNode of node.childNodes) { // iterate over all cells of a row and make them the color of the color cell in this row
                    // childNode.style.background = value; // td.parentNode dont work for some reason
                }
            }
        }

        function epsilonToReachabilityDistanceRenderer(instance, td, row, col, prop, value, cellProperties) {
            var progressDiv = document.createElement('div');
            progressDiv.className += " bar";
            var progressBar = document.createElement('div');
            progressBar.className += " bar-item";
            progressBar.style["width"] = value+"%";

            let color = instance.getDataAtRow(row)[1];
            let reachbilityValue = instance.getDataAtRow(row)[0];

            progressBar.style["background"] = color;
            progressBar.style["text-align"] = "left";
            progressBar.innerText = reachbilityValue;

            progressDiv.appendChild(progressBar);
            td.textContent = '';
            td.appendChild(progressDiv);
        }


        let spreadsheetInfo = "The spreadsheet shows the entire dataset and the clusters as colored rows. You can sort the spreadsheet by clicking" +
            " on the column headers. First click = ascending, second click = descending, third click = default";

        let hotElement = document.querySelector('#view1_spreadsheet'); // node where the spreadsheet gets inserted
        let hotElementContainer = hotElement.parentNode; // necessary for drawing the spreadsheet (if this value is not there, the spreadsheet is not visible)
        let hotSettings = {
            data: this.store.data,
            // define which properties of the passed data object should be inserted
            // 'data' means the key of the propertie in the obj, 'type' means the datatype e.g. numeric, text,...
            columns: [
                {
                    data: 'reachabilityDistanceShort',
                    type: 'text',
                },
                {
                    data: 'color',
                    type: 'text',
                },
                {
                    data: 'progress',
                    renderer: epsilonToReachabilityDistanceRenderer
                },
                {
                    data: this.store.testDataset ? 'iris' : 'name', // append correct name (if iris data 'iris' else number)
                    type: 'text',
                }

            ],
            stretchH: 'last',
            columnSorting: true,
            sortIndicator: true,
            comments: true,
            cell: [{ row: 0, col: 0, comment: {value: spreadsheetInfo}},
                { row: 0, col: 1, comment: {value: spreadsheetInfo}},
                { row: 0, col: 2, comment: {value: spreadsheetInfo}},
                { row: 0, col: 3, comment: {value: spreadsheetInfo}},
                { row: 0, col: 4, comment: {value: spreadsheetInfo}}
            ],
            width: 600, // hardcoded, not pre-calculated in the constructor because some issue with handsontable
            autoWrapRow: true,
            height: this.heightOfContainer, // gets pre-calculated in the constructor, takes a integer value
            rowHeaders: true,
            // define the names of the column headers
            colHeaders: [
                '',
                'reachability-dist debug',
                'Reachability Distance',
                this.store.testDataset ? 'species' : 'name'
            ],
             colWidths: [0.1,0.1,400,100],
            // iterate over all cells
            cells: function (row, col, prop, td) {
                let cellProperties = {};
                // if the cell is a color cell, call the rowColorRenderer which makes the whole row the same color
                if(prop === "color") {
                    cellProperties.renderer = rowColorRenderer;
                }
                return cellProperties;
            },
        };

        this.hot = new Handsontable(hotElement, hotSettings);

    }

    /** when data changes programmatically call this func to update spreadsheet */
    render(data) {
        this.hot.render();
    }
}