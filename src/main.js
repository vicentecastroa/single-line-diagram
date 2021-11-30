import { NETWORK_OBJECTS } from "./Network";
import ObjectFactoryClass from "./ObjectFactory/dataObjects";

function drawGraph(event) {
  console.log(event);
  NETWORK_OBJECTS = null;

  const ObjectFactory = new ObjectFactoryClass();

  NETWORK_OBJECTS = ObjectFactory.getNetworkDataObjects();
  /*Logging NETWORK_OBJECTS for reference purpose.*/
  console.log("NETWORK OBJECTS", NETWORK_OBJECTS);
}

export default drawGraph;
