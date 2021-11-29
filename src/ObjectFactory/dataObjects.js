import { NETWORK } from "../Network";
//No separate namespace has been  created for the Object Factory class as the NETWORK OBJECT should itself have an Object Factory that generates and/or updates the DataObjects.
export default (function () {
  console.log("NETWORK", NETWORK);
  NETWORK.ObjectFactory = function () {
    var dataObjects = ["data Objects"];
    this.getNetworkDataObjects = function () {
      return dataObjects;
    };
  };
})(NETWORK || (NETWORK = {}));
