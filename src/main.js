import { NETWORK, NETWORK_OBJECTS } from "./Network";
import dataObjects from "./ObjectFactory/dataObjects";

function drawGraph(event) {
  console.log(event);
  NETWORK_OBJECTS = null;

  NETWORK_OBJECTS = ObjectFactory.getNetworkDataObjects();
  /*Logging NETWORK_OBJECTS for reference purpose.*/
  console.log("NETWORK OBJECTS", NETWORK_OBJECTS);
}

export default drawGraph;
