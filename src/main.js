import ObjectFactoryClass from "./ObjectFactory/dataObjects";
import DisconnectedGraph from "./Graph/disconnectedGraph";

let NETWORK_OBJECTS = null;

function drawGraph(event) {
  console.log(event);

  const ObjectFactory = new ObjectFactoryClass(event);

  NETWORK_OBJECTS = ObjectFactory.getNetworkDataObjects();
  /*Logging NETWORK_OBJECTS for reference purpose.*/
  console.log("NETWORK OBJECTS", NETWORK_OBJECTS);

  DisconnectedGraph();
}

export default drawGraph;
export { NETWORK_OBJECTS };
