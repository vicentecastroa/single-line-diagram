import ObjectFactoryClass from "./ObjectFactory/dataObjects";
import DisconnectedGraph from "./Graph/disconnectedGraph";

let NETWORK_OBJECTS = null;
let myCola;

function drawGraph(event) {
  myCola = {};
  console.log(event);

  const ObjectFactory = new ObjectFactoryClass(event);

  NETWORK_OBJECTS = ObjectFactory.getNetworkDataObjects();
  /*Logging NETWORK_OBJECTS for reference purpose.*/
  console.log("NETWORK OBJECTS", NETWORK_OBJECTS);

  DisconnectedGraph();
}

export { NETWORK_OBJECTS, myCola };

export default drawGraph;