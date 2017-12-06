import "./view2.scss";
import Handsontable from "handsontable";


export default class {

    constructor() {

    }

    drawSpreadsheet() {
        var data = [
            ["", "Tesla", "Volvo", "Toyota", "Honda"],
            ["2017", 10, 11, 12, 13],
            ["2018", 20, 11, 14, 13],
            ["2019", 30, 15, 12, 13]
        ];

        var container = document.getElementById('view2_spreadsheet');
        var hot = new Handsontable(container, {
            data: data,
            rowHeaders: true,
            colHeaders: true
        });

    }
}