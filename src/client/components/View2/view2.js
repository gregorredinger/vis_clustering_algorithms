import "./view2.scss";
import "./hot.scss"; // css for handsontable module
import Handsontable from "handsontable";
import Store from "../../store";

    /**
 * @module View2
 * This module contains the diagrams for View 2
 * */
export default class {

    constructor() {
        // calculate the size of the parent node where the Spreadsheet gets inserted
        this.widthOfSpreadsheetContainer = document.getElementById('view2_spreadsheet').parentNode.getBoundingClientRect().width;
        this.heightOfSpreadsheetContainer = document.getElementById('view2_spreadsheet').parentNode.getBoundingClientRect().height;
        this.store = new Store();

    }

    /**
     * draws the Spreadsheet
     *
     * @requires Handsontable - {@link https://handsontable.com/examples?headers#|Handsontable Spreadsheet Example}
     *
     * @see {@link https://handsontable.com/blog/articles/a-complete-guide-to-changing-size-of-handsontable|Change Size of Handsontable}
     * */
    drawSpreadsheet() {

        let hotElement = document.querySelector('#view2_spreadsheet'); // node where the spreadsheet gets inserted
        let hotElementContainer = hotElement.parentNode; // necessary for drawing the spreadsheet (if this value is not there, the spreadsheet is not visible)
        let hotSettings = {
            data: this.store.data,
            // define which properties of the passed data object should be inserted
            // 'data' means the key of the propertie in the obj, 'type' means the datatype e.g. numeric, text,...
            columns: [
                {
                    data: 'x',
                    type: 'numeric',
                },
                {
                    data: 'y',
                    type: 'numeric',
                },
                {
                    data: 'reachabilityDistance',
                    type: 'text',
                },
                {
                    data: 'name',
                    type: 'text',
                },
                {
                    data: 'color',
                    type: 'text'
                }
            ],
            stretchH: 'all',
            width: this.widthOfSpreadsheetContainer, // gets pre-calculated in the constructor, takes a integer value
            autoWrapRow: true,
            height: this.heightOfSpreadsheetContainer, // gets pre-calculated in the constructor, takes a integer value
            maxRows: 22,
            rowHeaders: true,
            // define the names of the column headers
            colHeaders: [
                'x',
                'y',
                'Reachability Distance',
                'name',
                'color'
            ]
        };

        let hot = new Handsontable(hotElement, hotSettings);

    }
}