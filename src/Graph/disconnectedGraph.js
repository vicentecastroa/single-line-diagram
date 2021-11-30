import SharedFunctionality from "../Views/baseView";
import * as cola from "webcola";
import * as d3 from "d3";

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

  console.log("width", width);
  console.log("height", height);
  console.log('cola', cola)

  const myCola = cola
    .d3adaptor()
    .linkDistance(SharedFunctionality.R * 6)
    .avoidOverlaps(true)
    .size([width, height]);

  const svg = d3
    .select("body")
    .append("svg")
    .attr({ id: "parentSvgNode", "pointer-events": "all" })
    .on("dblclick.zoom", null);

  console.log("myCola", myCola);
  console.log("svg", svg);
}
