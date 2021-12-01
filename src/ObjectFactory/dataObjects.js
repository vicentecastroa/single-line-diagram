//No separate namespace has been  created for the Object Factory class as the NETWORK OBJECT should itself have an Object Factory that generates and/or updates the DataObjects.
/* export default (function () {
  NETWORK.ObjectFactory = function () {
    var dataObjects = ["data Objects"];
    this.getNetworkDataObjects = function () {
      return dataObjects;
    };
  };
})(NETWORK || (NETWORK = {}));
 */
export default class ObjectFactory {
  constructor(inputJSON) {
    this.dataObjects = dataObjects(inputJSON);
  }

  getNetworkDataObjects() {
    return this.dataObjects;
  }
}

function dataObjects(JSON) {
  const networkConfig = [];

  Object.entries(JSON).forEach(([key, value]) => {
    switch (key) {
      case "bus":
        var busDataObj = { dataObjList: value };
        networkConfig["busDataObj"] = busDataObj;
        break;

      case "branch":
        var branchDataObj = { dataObjList: [] };
        networkConfig["branchDataObj"] = branchDataObj;
        break;

      case "busLocation":
        var busLocationDataObj = { dataObjList: [] };
        networkConfig["busLocation"] = busLocationDataObj;
        break;

      default:
        break;
    }
  });

  return networkConfig;
}
