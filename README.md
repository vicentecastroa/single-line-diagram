
# Acelerex Single Line Diagram (beta)

A powerful library to generate interactive electrical single line diagrams and network diagrams.

Largely based on the source code of [stac](https://github.com/aayushGaur/stac)

Visit [www.acelerex.com](www.acelerex.com)

## Resources

- [Wiki](https://www.notion.so/acelerex/Acelerex-Single-Line-Diagram-Wiki-2a8d2940f5fb4bdca356fbb7747eb09d)

## Installation

Add package with repository url to your `package.json` file:

```json
"dependencies": {
  "acelerex-sld": "git+https://github.com/vicentecastroa/single-line-diagram.git"
}
```

Then, run `npm i acelerex-sld`

## Basic Usage

### Vue.js

In a vue component, insert a `<div id="diagram-div"></div>` into template. Then import `drawGraph` from Acelerex SLD. To generate the diagram, call the function `drawGraph` passing a network json like the example:

```html
<template>
  <div id="diagram-div"></div>
</template>
```

```javascript
import drawGraph from "acelerex-sld";
export default {
  name: "DiagramExample",
  mounted() {
    drawGraph({
        bus: [
          { id: 1, name: "Bus1" },
          { id: 2, name: "Bus2" },
          { id: 3, name: "Bus3" },
        ],
        branch: [
          { id: 1, fromBus: 1, toBus: 2 },
          { id: 2, fromBus: 1, toBus: 3 },
        ],
        storages: [{ id: 1, busId: 1, name: "Storage 1", breaker: "close" }],
        generators: [
          { id: 1, busId: 3, name: "Generator 1", type: "SOLAR" },
          { id: 2, busId: 1, name: "Generator 2", type: "WIND", breaker: "open" },
          {
            id: 3,
            busId: 2,
            name: "Generator 3",
            type: "HYDRO",
            breaker: "close",
          },
        ],
        loads: [{ id: 1, busId: 1, name: "Demand 1", breaker: "close" }],
        markets: [{ id: 1, busId: 1, name: "Market 1", breaker: "close" }],
      });
  },
};
```
Finally, take [src/css/baseStyle.css](https://github.com/vicentecastroa/single-line-diagram/blob/master/src/css/baseStyle.css) and paste it in your styles folder.

This example will generate the following diagram:
![image](https://user-images.githubusercontent.com/13738469/164274411-ab2684d5-1a05-46ea-ab12-46e4021c84f4.png)





## Change Log
###  Version 1.0.0-beta.2
- Multiple buses support
- Node circle icon to a bus bar
- Toolbar with 'reset view' button
### Version 1.0.0-beta
- Single project support
- Connect resources (Storages, Loads, Generators, Markets) to Bus.
- Breakers for each connection

## License
