// import custom components
import App from "./components/App/app.js";
import Config from "./components/Config/config";
import "./main"

// import npm packages
import * as d3 from "d3";
import "spectre.css"; // css lib
import tabby from "Tabby"; // tab manager
import "Tabby/dist/css/tabby.min.css";
// initialize tab manager
tabby.init();

/*
* Config Event Handlers
* **/
let config = new Config();
document.getElementById("sub-epsilon").addEventListener("click", () => { config.changeConfigValues("epsilon", "minus"); });
document.getElementById("add-epsilon").addEventListener("click", () => { config.changeConfigValues("epsilon", "plus"); });
document.getElementById("sub-min-pts").addEventListener("click", () => { config.changeConfigValues("minPts", "minus"); });
document.getElementById("add-min-pts").addEventListener("click", () => { config.changeConfigValues("minPts", "plus"); });