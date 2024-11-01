
# Acelerex Single Line Diagram (beta)

A powerful library to generate interactive electrical single line diagrams and network diagrams.

Largely based on the source code of [stac](https://github.com/aayushGaur/stac)

Visit [www.acelerex.com](www.acelerex.com)

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
        transformers: [{ id: 1, branchId: 1 }],
        switches: [{ id: 1, branchId: 2 }],
        busLocations: [{busId: 1, x: 200, y: 250}]
      });
  },
};
```
Finally, take [src/css/baseStyle.css](https://github.com/vicentecastroa/single-line-diagram/blob/master/src/css/baseStyle.css) and paste it in your styles folder.

This example will generate the following diagram:
![image](https://user-images.githubusercontent.com/13738469/170295920-5cbdc7bc-2af7-4a19-8d4f-22d1060e8e46.png)






## Change Log
### Version 1.0.0-beta.5
- Add `config` option for `drawGraph()`
### Version 1.0.0-beta.4
- Load from saved layout
- Switches states (closed-open)
- Emit click events for switches and breakers
- Orthogonal edges
### Version 1.0.0-beta.3
- Fix nodes drag
- Add transformers and switches
### Version 1.0.0-beta.2
- Multiple buses support
- Node circle icon to a bus bar
- Toolbar with 'reset view' button
### Version 1.0.0-beta
- Single project support
- Connect resources (Storages, Loads, Generators, Markets) to Bus.
- Breakers for each connection

## License
