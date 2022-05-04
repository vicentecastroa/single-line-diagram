import * as d3 from "d3";
import * as cola from "webcola";
import SharedFunctionality from "../Views/baseView";
import Nodes from "./Nodes/NodeBase";
import LineEdges from "./Edges/EdgeBase";

import { NETWORK_OBJECTS, myCola, zoom } from "../main";

let lineEdges;
let nodes;

function drawDisconnectedGraph(myCola) {
  let width = 1400;
  let height = 1500;
  width = window.innerWidth * 0.98 - SharedFunctionality.R * 2;
  height = window.innerHeight * 0.7 + SharedFunctionality.R * 1;

  function redrawWithDrag(transition) {
    if (SharedFunctionality.nodeMouseDown) return;
    (transition ? vis.transition() : vis).attr(
      "transform",
      `translate(${transition.transform.x}, ${transition.transform.y}) scale(${transition.transform.k})`
    );
  }

  myCola = cola
    .d3adaptor(d3)
    .linkDistance(SharedFunctionality.R * 6)
    .avoidOverlaps(true)
    .size([width, height]);

  // Create div for tooltip
  d3.select("body").append("div").attr("id", "tooltip").attr("class", "hidden");

  const svg = d3
    .select("#diagram-div")
    .append("svg")
    .attr("id", "parentSvgNode")
    .attr("pointer-events", "all")
    .on("dblclick.zoom", null);

  svg
    .append("rect")
    .attr("class", "background")
    .attr("width", "100%")
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
  const edgesData = NETWORK_OBJECTS.branchDataObj.dataObjList;

  const lineEdgesData = [];

  for (let edgeIndex = 0; edgeIndex < edgesData.length; edgeIndex++) {
    const crtEdge = edgesData[edgeIndex];
    if (crtEdge.edgeType === "Line" && !crtEdge.isMultiLine) {
      lineEdgesData.push(crtEdge);
    }
  }
  lineEdges = new LineEdges(lineEdgesData, vis);

  nodes = new Nodes(nodesData, vis, myCola);

  //This variable has been added to check if the graph file being loaded has fixed locations or not.
  //If the graph being loaded has fixed locations then the zoomToFit is called again.
  const fixedLocationGraphLoad = false;

  // If no previous node location data
  SharedFunctionality.hasNodeLocationData = false;
  SharedFunctionality.autoLayout = true;

  //Added the last parameters to solve the initial auto fit issue.
  myCola.nodes(nodesData).links(edgesData).start(10, 10, 10);
  console.log(myCola);

  //Interchange the x and y for the nodes in the graph based on the height and width of the graph.
  // Here the Cola object is used instead of the SVG object.
  if (myCola.size()[0] > myCola.size()[1]) {
    myCola.nodes().forEach((node) => {
      const a = node.x;
      node.x = node.y;
      node.y = a;
    });
  }

  // Called the Start for the COLA to allow the updates to be done after changing the orientation of the graph.
  myCola.nodes(nodesData).links(edgesData).start();
  SharedFunctionality.zoomToFit(true, myCola);

  myCola.on("tick", () => {
    if (
      SharedFunctionality.goToInitialStateTriggered &&
      $("#parentSvgNode").is(":visible")
    ) {
      if (SharedFunctionality.autoLayout) {
        d3.selectAll(".node").each((d) => {
          const nodePositions = NETWORK_OBJECTS.busLocation.dataObjList;
          for (let index = 0; index < nodePositions.length; index++) {
            if (d.bus_i === nodePositions[index].bus_i) {
              d.px = parseFloat(nodePositions[index].x);
              d.py = parseFloat(nodePositions[index].y);
              d.x = parseFloat(nodePositions[index].x);
              d.y = parseFloat(nodePositions[index].y);
              d.fixed |= 8;
            }
          }
        });
      } else {
        d3.selectAll(".node").each((d) => {
          const nodePositions = NETWORK_OBJECTS.busLocation.dataObjList;
          for (let index = 0; index < nodePositions.length; index++) {
            if (d.bus_i === nodePositions[index].bus_i) {
              d.px = parseFloat(nodePositions[index].x);
              d.py = parseFloat(nodePositions[index].y);
              d.x = parseFloat(nodePositions[index].x);
              d.y = parseFloat(nodePositions[index].y);
            }
          }
        });
      }

      // Setting the value of the trigger to false as the required action for one trigger has been done
      SharedFunctionality.goToInitialStateTriggered = false;
    } else {
      if (SharedFunctionality.autoLayout) {
        d3.selectAll(".node").each((d) => {
          d.fixed &= ~8;
        });
      } else if (fixedLocationGraphLoad) {
        if (SharedFunctionality.hasNodeLocationData) {
          d3.selectAll(".node").each((d) => {
            const nodePositions = NETWORK_OBJECTS.busLocation.dataObjList;
            for (let index = 0; index < nodePositions.length; index++) {
              if (d.bus_i === nodePositions[index].bus_i) {
                d.px = parseFloat(nodePositions[index].x);
                d.py = parseFloat(nodePositions[index].y);
                d.x = parseFloat(nodePositions[index].x);
                d.y = parseFloat(nodePositions[index].y);
                d.fixed |= 8;
              }
            }
          });
          // SharedFunctionality.zoomToFit(true, myCola);
          //Setting the variable as false the the zoomToFit is to be called only once.
          fixedLocationGraphLoad = false;
        }
      }
    }
    nodes.tick();
    //Added a check on the count of the edges as in some test cases there are no transformer or lineCharge edges.
    lineEdges.tick();
  });
}

export { lineEdges, nodes };
//METHOD TO DRAW THE DISCONNECTED GRAPH
export default function DisconnectedGraph() {
  SharedFunctionality.nodeMouseDown = false;
  //Calling the graph object.
  drawDisconnectedGraph(myCola);
}
