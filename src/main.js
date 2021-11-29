import dataObjects from "./ObjectFactory/dataObjects";
import { NETWORK_OBJECTS } from "./Network";

function drawGraph(event) {
  console.log(event);
  NETWORK_OBJECTS = null;

  NETWORK_OBJECTS = ObjectFactory.getNetworkDataObjects();
  /*Logging NETWORK_OBJECTS for reference purpose.*/
  console.log("NETWORK OBJECTS", NETWORK_OBJECTS);
}

export default drawGraph;
