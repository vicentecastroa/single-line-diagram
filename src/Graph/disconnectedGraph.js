import * as d3 from "d3";
import * as cola from "webcola";
import SharedFunctionality from "../Views/baseView";

import { NETWORK_OBJECTS } from "../main";

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

  function redrawWithDrag(transition) {
    if (SharedFunctionality.nodeMouseDown) return;
    (transition ? vis.transition() : vis).attr(
      "transform",
      "translate(" + zoom.translate() + ") scale(" + zoom.scale() + ")"
    );
  }

  const myCola = cola
    .d3adaptor()
    .linkDistance(SharedFunctionality.R * 6)
    .avoidOverlaps(true)
    .size([width, height]);

  const svg = d3
    .select("#diagram-div")
    .append("svg")
    .attr("id", "parentSvgNode")
    .attr("pointer-events", "all")
    .on("dblclick.zoom", null);

  svg
    .append("rect")
    .attr("class", "background")
    .attr("witdh", "100%")
    .attr("height", "100%")
    .style("stroke-width", 4)
    .style("stroke", "grey")
    .call(zoom.on("zoom", redrawWithDrag));

  const vis = svg.append("g").attr("id", "svgGraph");

  svg.on("mousedown.zoom", null);
  svg.on("mousemove.zoom", null);
  svg.on("dblclick.zoom", null);
  svg.on("touchstart.zoom", null);
  svg.on("wheel.zoom", null);
  svg.on("mousewheel.zoom", null);
  svg.on("MozMousePixelScroll.zoom", null);

  const nodesData = NETWORK_OBJECTS.busDataObj.dataObjList;
  console.log(nodesData)
}
