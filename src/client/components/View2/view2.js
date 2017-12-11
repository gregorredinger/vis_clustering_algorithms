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
        if (this.widthOfContainer === 0) { this.widthOfContainer = 500; }

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

        /*let treeData = {
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
        };*/

        let levelContainer = this.createTreeDataLevelCluster();
        let treeData = [];
        let highestLevel = 0;

        for(let [levelKey, levelValue] of Object.entries(levelContainer)) {
            if(levelKey > highestLevel) { highestLevel = levelKey; }

            for(let [key, value] of Object.entries(levelValue)) {
                let max = Math.max(...levelValue[key].map(d => d.reachabilityDistance));
                treeData.push({
                    "parent": (levelValue[key].filter((d) => d.reachabilityDistance === max))[0],
                    "children": levelValue[key].filter((d) => d.reachabilityDistance !== max),
                    "level": levelKey
                });
            }
        }
        console.log(treeData);

        // eliminate double entries in higher levels
        for(let cluster of treeData) {
            let parentClusterOfCurrentCluster = treeData.filter((d) => d.parent.name === cluster.parent.name && d.level > cluster.level );
            if(parentClusterOfCurrentCluster.length === 1) {
                let parentClusterChildren = parentClusterOfCurrentCluster[0].children;
                let childEntriesToRemove = cluster.children;

                // delete the clusters from the lower level in the higher level
                // @see https://stackoverflow.com/questions/24304383/javascript-return-reference-to-array-item (Crowders Anser)
                // @see https://stackoverflow.com/questions/47105483/remove-multiple-object-from-array-of-objects-using-filter
                parentClusterOfCurrentCluster[0].children = parentClusterChildren.filter(function(obj) {
                    return !this.has(obj.name);
                }, new Set(childEntriesToRemove.map(obj => obj.name)));
            }
        }

        console.log(treeData);

        let treeDataFormatted = {
            "name": "root",
            "children": []
        };





        /*{
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
        };*/

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

    }

    createTreeDataLevelCluster() {

        let newEps = 1;
        let data = new Store().data;
        let inValley = false;

        let clusterContainer = {};
        let levelContainer = {};
        let level = 1;
        let currentClusterToFill = 0;

        while(newEps <= this.store.epsilon) {

            clusterContainer = {};

            data.forEach(function (currentPoint, idx) {
                let nextPoint = data[idx + 1];
                // in case we reached the last point there is nothing to compare to we can just finish the loop.
                if (!nextPoint) {
                    return;
                }

                let currentReachabilityDist = (currentPoint.reachabilityDistance < newEps) ? currentPoint.reachabilityDistance : newEps,
                    nextPointReachabilityDist = (nextPoint.reachabilityDistance < newEps) ? nextPoint.reachabilityDistance : newEps;

                if (currentReachabilityDist === newEps) inValley = false;

                if (inValley) {
                    // if we are in a valley, just go through all the points and add them to current cluster
                    clusterContainer[currentClusterToFill].push(data[idx]);
                } else {

                    // we are not in valley. we have to check if we are iterating through noise or reached the start of a valley
                    if (currentReachabilityDist === newEps && nextPointReachabilityDist < currentReachabilityDist) {
                        // we found a new valley
                        inValley = true;
                        // add current point to current cluster
                        currentClusterToFill = idx; // the property name of the new cluster
                        clusterContainer[idx] = [];
                        clusterContainer[idx].push(data[idx]);
                    } else if (currentReachabilityDist === newEps && nextPointReachabilityDist === newEps) {
                        // we found a noise point

                    } else {
                        console.log("!!! No color assigend to point: ");
                        console.log(currentPoint);
                    }
                }
            });

            levelContainer[level] = clusterContainer;
            newEps += 1;
            level++;

        }
        return levelContainer;

    }





}