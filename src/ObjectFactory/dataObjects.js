function ObjectFactory(inputJSON) {
  const dataObjects = this.dataObjects(inputJSON);
  this.addTopDecoratorDataToBus(dataObjects);

  this.getNetworkDataObjects = () => dataObjects;
}

ObjectFactory.prototype.dataObjects = (JSON) => {
  const networkConfig = [];
  networkConfig["busDataObj"] = { dataObjList: [] };
  networkConfig["branchDataObj"] = { dataObjList: [] };
  networkConfig["storagesDataObj"] = { dataObjList: [] };
  networkConfig["generatorsDataObj"] = { dataObjList: [] };
  networkConfig["busLocation"] = { dataObjList: [] };

  Object.entries(JSON).forEach(([key, value]) => {
    switch (key) {
      case "bus":
        const busDataObj = { dataObjList: value };
        networkConfig["busDataObj"] = busDataObj;
        break;

      case "branch":
        const branchDataObj = { dataObjList: [] };
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

      case "busLocation":
        const busLocationDataObj = { dataObjList: [] };
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
      { type: "storage", objList: networkObjects.storagesDataObj.dataObjList },
      {
        type: "generator",
        objList: networkObjects.generatorsDataObj.dataObjList,
      },
    ].forEach(({ type, objList }) => {
      for (let j = 0; j < objList.length; j++) {
        const obj = objList[j];
        if (obj.busId === busObj.id) {
          const actualDataObj = {};
          const id = j + 1;
          actualDataObj["id"] = id + generalId;
          obj["id"] = id;
          topDecoratorsId = `${topDecoratorsId}${id},`; // Might be unused

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
                default:
                  dataObjResourceType = "generatorSolar";
                  break;
              }
              break;

            default:
              break;
          }

          actualDataObj["resourceType"] = dataObjResourceType;
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

export default ObjectFactory;
