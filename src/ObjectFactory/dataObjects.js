import { NETWORK } from "../main";

function ObjectFactory(inputJSON) {
  const dataObjects = this.dataObjects(inputJSON);
  this.addTopDecoratorDataToBus(dataObjects);
  this.addBottomDecoratorDataToBus(dataObjects);
  this.updateEdgesData(dataObjects);
  this.addDecoratorToBranch(dataObjects);

  this.getNetworkDataObjects = () => dataObjects;
}

ObjectFactory.prototype.dataObjects = (JSON) => {
  const networkConfig = [];
  networkConfig["busDataObj"] = { dataObjList: [] };
  networkConfig["branchDataObj"] = { dataObjList: [] };
  networkConfig["storagesDataObj"] = { dataObjList: [] };
  networkConfig["generatorsDataObj"] = { dataObjList: [] };
  networkConfig["loadsDataObj"] = { dataObjList: [] };
  networkConfig["marketsDataObj"] = { dataObjList: [] };
  networkConfig["evDataObj"] = { dataObjList: [] };
  networkConfig["busLocation"] = { dataObjList: [] };
  networkConfig["switchesDataObj"] = { dataObjList: [] };
  networkConfig["transformersDataObj"] = { dataObjList: [] };

  Object.entries(JSON).forEach(([key, value]) => {
    switch (key) {
      case "bus":
        const busDataObj = { dataObjList: value };
        networkConfig["busDataObj"] = busDataObj;
        break;

      case "branch":
        const branchDataObj = { dataObjList: value };
        networkConfig["branchDataObj"] = branchDataObj;
        break;

      case "storages":
        const storagesDataObj = { dataObjList: value };
        networkConfig["storagesDataObj"] = storagesDataObj;
        break;

      case "generators":
        const generatorsDataObj = { dataObjList: value };
        networkConfig["generatorsDataObj"] = generatorsDataObj;
        break;

      case "loads":
        const loadsDataObj = { dataObjList: value };
        networkConfig["loadsDataObj"] = loadsDataObj;
        break;

      case "markets":
        const marketsDataObj = { dataObjList: value };
        networkConfig["marketsDataObj"] = marketsDataObj;
        break;

      case "ev":
        const evDataObj = { dataObjList: value };
        networkConfig["evDataObj"] = evDataObj;
        break;

      case "switches":
        const switchesDataObj = { dataObjList: value };
        networkConfig["switchesDataObj"] = switchesDataObj;
        break;

      case "transformers":
        const transformersDataObj = { dataObjList: value };
        networkConfig["transformersDataObj"] = transformersDataObj;
        break;

      case "busLocation":
        const busLocationDataObj = { dataObjList: value };
        networkConfig["busLocation"] = busLocationDataObj;
        break;

      default:
        break;
    }
  });
  return networkConfig;
};

// This function looks for every resource in network that is assigned to each bus
ObjectFactory.prototype.addTopDecoratorDataToBus = (networkObjects) => {
  for (let i = 0; i < networkObjects.busDataObj.dataObjList.length; i++) {
    const busObj = networkObjects.busDataObj.dataObjList[i];
    const topDecorators = [];
    let topDecoratorsId = "";
    let generalId = 0; // Might be unnecesary

    [
      { type: "market", objList: networkObjects.marketsDataObj.dataObjList },
    ].forEach(({ type, objList }) => {
      for (let j = 0; j < objList.length; j++) {
        const obj = objList[j];
        if (obj.busId === busObj.id) {
          const actualDataObj = {};
          const id = j + 1;
          actualDataObj["id"] = id + generalId;
          // obj["id"] = id;
          topDecoratorsId = `${topDecoratorsId}${id},`; // Might be unused
          actualDataObj["resourceType"] = type;
          actualDataObj["info"] = obj.info;

          // Adding the DOMID to the top decorators. - This is the id of the top decorator group.
          obj["DOMID"] = `bus${busObj.id}topDecorator`;
          // Also the same DOMID is added to the decorator group element so as to avoid any error.
          topDecorators["DOMID"] = `bus${busObj.id}topDecorator`;
          actualDataObj["topDecoData"] = obj;
          topDecorators.push(actualDataObj);
        }
        generalId += 1;
      }
    });
    // Set top decorators in Bus Object
    busObj["topDecorators"] = topDecorators;
    busObj["IdList"] = topDecoratorsId.slice(0, -1);
  }
};

// This function looks for every resource in network that is assigned to each bus
ObjectFactory.prototype.addBottomDecoratorDataToBus = (networkObjects) => {
  for (let i = 0; i < networkObjects.busDataObj.dataObjList.length; i++) {
    const busObj = networkObjects.busDataObj.dataObjList[i];
    const bottomDecorators = [];
    let bottomDecoratorsId = "";
    let generalId = 0; // Might be unnecesary

    [
      { type: "storage", objList: networkObjects.storagesDataObj.dataObjList },
      {
        type: "generator",
        objList: networkObjects.generatorsDataObj.dataObjList,
      },
      {
        type: "load",
        objList: networkObjects.loadsDataObj.dataObjList,
      },
      {
        type: "ev",
        objList: networkObjects.evDataObj.dataObjList,
      },
    ].forEach(({ type, objList }) => {
      for (let j = 0; j < objList.length; j++) {
        const actualDataObj = {};
        const obj = objList[j];
        const id = j + 1;
        actualDataObj["id"] = id + generalId;
        // obj["id"] = id;
        bottomDecoratorsId = `${bottomDecoratorsId}${id},`; // Might be unused

        // Set resource type
        let dataObjResourceType = "storage";
        switch (type) {
          case "storage":
            dataObjResourceType = "storage";
            break;
          case "generator":
            switch (obj.type) {
              case "SOLAR":
                dataObjResourceType = "generatorSolar";
                break;
              case "THERMAL":
                dataObjResourceType = "generatorThermal";
                break;
              case "HYDRO":
                dataObjResourceType = "generatorHydro";
                break;
              case "WIND":
                dataObjResourceType = "generatorWind";
                break;
              case "GEOTHERMAL":
                dataObjResourceType = "generatorGeothermal";
                break;
              default:
                dataObjResourceType = "generatorSolar";
                break;
            }
            break;
          case "load":
            dataObjResourceType = "load";
            break;
          case "ev":
            dataObjResourceType = "ev";
            break;

          default:
            break;
        }

        actualDataObj["resourceType"] = dataObjResourceType;
        actualDataObj["info"] = obj.info;
        // Adding the DOMID to the top decorators. - This is the id of the top decorator group.
        obj["DOMID"] = `bus${busObj.id}bottomDecorator`;
        // Also the same DOMID is added to the decorator group element so as to avoid any error.
        bottomDecorators["DOMID"] = `bus${busObj.id}bottomDecorator`;
        actualDataObj["bottomDecoData"] = obj;
        if (obj.busId === busObj.id) {
          bottomDecorators.push(actualDataObj);
        }
      }
      generalId += 1;
    });

    // Set bottom decorators in Bus Object
    busObj["bottomDecorators"] = bottomDecorators;
    busObj["IdList"] = bottomDecoratorsId.slice(0, -1);
  }
};

ObjectFactory.prototype.updateEdgesData = (networkObjects) => {
  const edges = {};
  const nodeIndexMap = {};

  for (
    let nodeIndexer = 0;
    nodeIndexer < networkObjects.busDataObj.dataObjList.length;
    nodeIndexer++
  ) {
    nodeIndexMap[networkObjects.busDataObj.dataObjList[nodeIndexer].id] =
      nodeIndexer;
  }

  /* Adding Node Branch Map to the NETWORK -
   * This has been added to NETWORK because once created it is independent of the Data Object
   */
  NETWORK["nodeEdgeMap"] = nodeIndexMap;
  // Add Lines to branchData
  for (
    let lineIndex = 0;
    lineIndex < networkObjects.branchDataObj.dataObjList.length;
    lineIndex += 1
  ) {
    const edgeDataObj = networkObjects.branchDataObj.dataObjList[lineIndex];
    const edgeType = "Line";
    const edgeName = `${edgeDataObj.fromBus}-${edgeDataObj.toBus}-${edgeDataObj.toBus}-${edgeDataObj.fromBus}`;

    const edge = {
      index: lineIndex + 1,
      edgeId: `From Bus '${edgeDataObj.fromBus}' to Bus '${edgeDataObj.toBus}'`,
      source: nodeIndexMap[edgeDataObj.fromBus],
      target: nodeIndexMap[edgeDataObj.toBus],
      edgeData: edgeDataObj,
      edgeType: edgeType,
      edgeName: edgeName,
      isMultiLine: false,
    };
    edges[edgeName] = edge;
  }
  var edgeData = [];
  Object.keys(edges).forEach(function (key, _index) {
    edgeData.push(this[key]);
  }, edges);
  networkObjects.branchDataObj.dataObjList = edgeData;
};

// This function looks for every resource in network that is assigned to each branch
ObjectFactory.prototype.addDecoratorToBranch = (networkObjects) => {
  for (let i = 0; i < networkObjects.branchDataObj.dataObjList.length; i++) {
    const branchObj = networkObjects.branchDataObj.dataObjList[i];
    const decorators = [];
    let decoratorsId = "";
    let generalId = 0;
    [
      { type: "switch", objList: networkObjects.switchesDataObj.dataObjList },
      {
        type: "transformer",
        objList: networkObjects.transformersDataObj.dataObjList,
      },
    ].forEach(({ type, objList }) => {
      for (let j = 0; j < objList.length; j++) {
        const obj = objList[j];
        if (obj.branchId === branchObj.index) {
          const actualDataObj = {};
          const id = j + 1;
          actualDataObj["id"] = id + generalId;
          // obj["id"] = id;
          decoratorsId = `${decoratorsId}${id},`; // Might be unused
          actualDataObj["resourceType"] = type;
          actualDataObj["info"] = obj.info;
          if (type === "switch") {
            actualDataObj["state"] = obj.state;
          }

          // Adding the DOMID to the top decorators. - This is the id of the top decorator group.
          obj["DOMID"] = `branch${branchObj.index}Decorator`;
          // Also the same DOMID is added to the decorator group element so as to avoid any error.
          decorators["DOMID"] = `branch${branchObj.index}Decorator`;
          actualDataObj["decoData"] = obj;
          decorators.push(actualDataObj);
        }
        generalId += 1;
      }
    });
    // Set decorators in branch Object
    branchObj["decorators"] = decorators;
    branchObj["IdList"] = decoratorsId.slice(0, -1);
  }
};

export default ObjectFactory;
