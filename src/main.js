/* eslint-disable */
import * as d3 from "d3";
import ObjectFactoryClass from "./ObjectFactory/dataObjects";
import DisconnectedGraph from "./Graph/disconnectedGraph";
import addToolbar from "./utils/Toolbar";
import htmlInfoTable from "./utils/InfoTable";

let NETWORK_OBJECTS = null;
const NETWORK = {};
let myCola;
let inputEvent;
const zoom = d3.zoom();
let config = {
  allowDrag: true,
  showLabels: true,
};

function drawGraph(event, { allowDrag = true, showLabels = true } = {}) {
  // console.log("drawGaph");
  myCola = {};
  preProcessNetworkUI();
  inputEvent = event;

  const ObjectFactory = new ObjectFactoryClass(event);
  config = {
    allowDrag,
    showLabels,
  };

  NETWORK_OBJECTS = ObjectFactory.getNetworkDataObjects();
  /*Logging NETWORK_OBJECTS for reference purpose.*/
  /*  console.log("NETWORK OBJECTS", NETWORK_OBJECTS);
  console.log("NETWORK", NETWORK); */

  // Add toolbar
  addToolbar();

  DisconnectedGraph();
}

function preProcessNetworkUI() {
  if (d3.select("#parentSvgNode")._groups[0][0]) {
    d3.select("#parentSvgNode").remove();
  }
}

function updateGraph(network, options) {
  const resources = Object.entries(network).flatMap(
    ([resourceType, resourceGroup]) =>
      resourceGroup.flatMap((resource) => {
        resource.resourceType = resourceType;
        return resource;
      })
  );

  d3.selectAll(".node").each((d) => {
    const nodeResources = resources.filter((r) => r.busId === d.id);
    // Update bus info
    const busResource = resources.find((r) => r.id === d.id);
    d.info = busResource.info;
    // Update bottom decorators
    const bottom = nodeResources.filter(
      (resource) =>
        !["markets", "bus", "busLocation"].includes(resource.resourceType)
    );
    bottom.forEach((r) => {
      const decorator = d.bottomDecorators.find(
        (dec) => dec.bottomDecoData.id === r.id
      );
      const decoratorIndex = d.bottomDecorators.findIndex(
        (dec) => dec.bottomDecoData.id === r.id
      );
      // Update info
      decorator.bottomDecoData.info = r.info;
      decorator.info = r.info;
      d3.select(`#bus${d.id}bottomDeco${decoratorIndex}Info`).html(() =>
        htmlInfoTable(decorator)
      );

      // Update breaker
      const breakerFillColor = r.breaker === "open" ? "white" : "black";
      d3.select(`#bus${d.id}bottomDeco${decoratorIndex}Breaker`).attr(
        "style",
        `fill:${breakerFillColor}`
      );
    });
    // Update top decorators
    const top = nodeResources.filter(
      (resource) => resource.resourceType === "markets"
    );
    top.forEach((r) => {
      const decorator = d.topDecorators.find(
        (dec) => dec.topDecoData.id === r.id
      );
      const decoratorIndex = d.topDecorators.findIndex(
        (dec) => dec.topDecoData.id === r.id
      );
      // Update info
      decorator.topDecoData.info = r.info;
      // Update breaker
      const breakerFillColor = r.breaker === "open" ? "white" : "black";
      d3.select(`#bus${d.id}topDeco${decoratorIndex}Breaker`).attr(
        "style",
        `fill:${breakerFillColor}`
      );
    });
  });

  // Update switches status
  d3.selectAll(".edge").each((d) => {
    const switches = resources.filter(
      (r) => r.resourceType === "switches" && r.branchId === d.edgeData.id
    );
    switches.forEach((switchObj) => {
      // Modify switch connector line
      if (switchObj.state === "open") {
        d3.select(`#branch${d.index}Deco0 > .connector`).attr(
          "transform",
          `rotate(-30, 8, 15)`
        );
        d3.select(`#branch${d.index}Deco0`).on("click", () => {
          d3.select("#diagram-div").dispatch(`click-switch`, {
            detail: {
              id: switchObj.id,
              state: "close",
            },
          });
        });
      } else {
        d3.select(`#branch${d.index}Deco0 > .connector`).attr(
          "transform",
          `rotate(-10, 8, 15)`
        );
        d3.select(`#branch${d.index}Deco0`).on("click", () => {
          d3.select("#diagram-div").dispatch(`click-switch`, {
            detail: {
              id: switchObj.id,
              state: "open",
            },
          });
        });
      }
    });
  });

  // Toggle labels visibility
  if (options && options.showLabels != undefined) {
    const labels = d3.selectAll(".label");
    labels.classed("hidden", !options.showLabels);
  }
}

export {
  NETWORK_OBJECTS,
  config,
  myCola,
  drawGraph,
  updateGraph,
  NETWORK,
  inputEvent,
  zoom,
};

export default drawGraph;
