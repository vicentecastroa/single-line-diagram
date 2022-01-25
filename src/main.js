import * as d3 from "d3";
import ObjectFactoryClass from "./ObjectFactory/dataObjects";
import DisconnectedGraph from "./Graph/disconnectedGraph";

let NETWORK_OBJECTS = null;
let myCola;

function drawGraph(event) {
  myCola = {};
  preProcessNetworkUI();

  const ObjectFactory = new ObjectFactoryClass(event);

  NETWORK_OBJECTS = ObjectFactory.getNetworkDataObjects();
  /*Logging NETWORK_OBJECTS for reference purpose.*/
  //console.log("NETWORK OBJECTS", NETWORK_OBJECTS);

  DisconnectedGraph();
}

function preProcessNetworkUI() {
  if (d3.select("#parentSvgNode")._groups[0][0]) {
    d3.select("#parentSvgNode").remove();
  }
}

function updateGraph(event){
  console.log(event)
}

export { NETWORK_OBJECTS, myCola, updateGraph };

export default drawGraph;
