import * as d3 from "d3";
import ObjectFactoryClass from "./ObjectFactory/dataObjects";
import DisconnectedGraph from "./Graph/disconnectedGraph";
import addToolbar from "./utils/Toolbar";

let NETWORK_OBJECTS = null;
const NETWORK = {};
let myCola;
let inputEvent;
const zoom = d3.zoom();

function drawGraph(event) {
  myCola = {};
  preProcessNetworkUI();
  inputEvent = event;

  const ObjectFactory = new ObjectFactoryClass(event);

  NETWORK_OBJECTS = ObjectFactory.getNetworkDataObjects();
  /*Logging NETWORK_OBJECTS for reference purpose.*/
  // console.log("NETWORK OBJECTS", NETWORK_OBJECTS);
  // console.log('NETWORK', NETWORK);

  // Add toolbar
  addToolbar();

  DisconnectedGraph();
}

function preProcessNetworkUI() {
  if (d3.select("#parentSvgNode")._groups[0][0]) {
    d3.select("#parentSvgNode").remove();
  }
}

function updateGraph(network) {
  const resources = Object.entries(network).flatMap(
    ([resourceType, resourceGroup]) =>
      resourceGroup.flatMap((resource) => ({
        ...resource,
        resourceType: resourceType,
      }))
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
}

export {
  NETWORK_OBJECTS,
  myCola,
  drawGraph,
  updateGraph,
  NETWORK,
  inputEvent,
  zoom,
};

export default drawGraph;
