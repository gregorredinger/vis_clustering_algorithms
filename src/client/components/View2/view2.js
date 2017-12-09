import "./view2.scss";
import "./hot.scss"; // css for handsontable module
import Handsontable from "handsontable";
import Store from "../../store";
import * as d3 from "d3";

    /**
 * @module View2
 * This module contains the diagrams for View 2
 * */
export default class {

    constructor() {
        // calculate the size of the parent node where the Spreadsheet and the treemap gets inserted
        this.widthOfContainer = document.getElementById('view2_spreadsheet').parentNode.getBoundingClientRect().width;
        this.heightOfContainer = document.getElementById('view2_spreadsheet').parentNode.getBoundingClientRect().height;
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
            width: this.widthOfContainer, // gets pre-calculated in the constructor, takes a integer value
            autoWrapRow: true,
            height: this.heightOfContainer, // gets pre-calculated in the constructor, takes a integer value
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

    drawTree() {

        let treeData =
            {
                "name": "Top Level",
                "children": [
                    {
                        "name": "Level 2: A",
                        "children": [
                            { "name": "Son of A" },
                            { "name": "Daughter of A" }
                        ]
                    },
                    {
                        "name": "Level 2: B",
                        "children": [
                            { "name": "Son of A" },
                            { "name": "Daughter of A" },
                            { "name": "Son of A" },
                            { "name": "Daughter of A" }
                        ]
                    }

                ]
            };

        // set the dimensions and margins of the diagram
        let margin = {top: 40, right: 90, bottom: 50, left: 90},
            width = this.widthOfContainer - margin.left - margin.right,
            height = this.heightOfContainer - margin.top - margin.bottom;

        // declares a tree layout and assigns the size
        let treemap = d3.tree()
            .size([width, height]);

        //  assigns the data to a hierarchy using parent-child relationships
        let nodes = d3.hierarchy(treeData);

        // maps the node data to the tree layout
        nodes = treemap(nodes);

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        let svg = d3.select("#view2_tree").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom),
            g = svg.append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

        // adds the links between the nodes
        let link = g.selectAll(".link")
            .data( nodes.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", function(d) {
                return "M" + d.x + "," + d.y
                    + "C" + d.x + "," + (d.y + d.parent.y) / 2
                    + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
                    + " " + d.parent.x + "," + d.parent.y;
            });

        // adds each node as a group
        let node = g.selectAll(".node")
            .data(nodes.descendants())
            .enter().append("g")
            .attr("class", function(d) {
                return "node" +
                    (d.children ? " node--internal" : " node--leaf"); })
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"; });

        // adds the circle to the node
        node.append("circle")
            .attr("r", 10);

        // adds the text to the node
        node.append("text")
            .attr("dy", ".35em")
            .attr("y", function(d) { return d.children ? -20 : 20; })
            .style("text-anchor", "middle")
            .text(function(d) { return d.data.name; });

        this.createTreeData();
    }

    createTreeData() {

        let clusterContainer = {};
        let levelContainer = {};
        let level = 1;
        let currentClusterToFill = 0;
        let epsilonMin = 0;
        let epsilonMax = 0.2;

        while(epsilonMax < this.store.epsilon) {

            let data = this.store.data.filter( (d) => {
                return d.reachabilityDistance > epsilonMin;
            });

            for (let i=1, len=data.length; i<len; i++) {
                // Create a new Cluster when
                // current node is smaller min and greater or equal max AND the node before is greater max
                if((data[i].reachabilityDistance <= epsilonMax) &&
                    (data[i-1].reachabilityDistance > epsilonMax)) {

                    clusterContainer[i] = [];
                    clusterContainer[i].push(data[i-1]);
                    clusterContainer[i].push(data[i]);
                    currentClusterToFill = i;
                }

                // add node to cluster when
                // value is greater min and smaller or equal to max AND node before is smaller or equal max
                if((data[i].reachabilityDistance <= epsilonMax) &&
                    (data[i-1].reachabilityDistance <= epsilonMax)) {

                    try {
                        clusterContainer[currentClusterToFill].push(data[i]);
                    } catch(e) {
                        console.log(e);
                        console.log(data[i]);
                        console.log(data[i-1]);
                    }

                }
            }

            levelContainer[level] = clusterContainer;
            epsilonMin += 0.2;
            epsilonMax += 0.2;
            level++;
        }

        console.log(levelContainer);




    }



}