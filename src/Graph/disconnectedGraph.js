import SharedFunctionality from "../Views/baseView";
import * as d3 from "d3";
import * as cola from "webcola";

//METHOD TO DRAW THE DISCONNECTED GRAPH
export default function DisconnectedGraph() {
  //Calling the graph object.
  drawDisconnectedGraph();
}

function drawDisconnectedGraph() {
  let width = 1400;
  let height = 1500;
  width = window.innerWidth * 0.98 - SharedFunctionality.R * 2;
  height = window.innerHeight * 0.7 + SharedFunctionality.R * 1;

  // Hack from https://github.com/tgdwyer/WebCola/issues/145
  window.d3 = require("d3");

  const myCola = cola
    .d3adaptor()
    .linkDistance(SharedFunctionality.R * 6)
    .avoidOverlaps(true)
    .size([width, height]);

  console.log(d3.select("#diagram-div"));
  const svg = d3
    .select("#diagram-div")
    .append("svg")
    .attr('id', 'parentSvgNode')
    .attr('pointer-events', 'all')
    .on("dblclick.zoom", null);

  console.log("myCola", myCola);
  console.log("svg", svg);
}
