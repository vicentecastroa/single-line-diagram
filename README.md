# Acelerex Single Line Diagram (beta)

A powerful library to generate interactive electrical single line diagrams and network diagrams.

Largely based on the source code of [stac](https://github.com/aayushGaur/stac)

Visit [www.acelerex.com](www.acelerex.com)

## Resources

- [Wiki](https://www.notion.so/acelerex/Acelerex-Single-Line-Diagram-Wiki-ebcbd82f4ade4d72b99db21902372da0)

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
      bus: [{ id: 1, name: "Bus1" }],
      branch: [],
      storages: [{ id: 1, busId: 1, name: "Storage 1", breaker: "close" }],
      generators: [
        { id: 1, busId: 1, name: "Generator 1", type: "SOLAR" },
        { id: 2, busId: 1, name: "Generator 2", type: "WIND", breaker: "open" },
        {
          id: 3,
          busId: 1,
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

This example will generate the following diagram:
![image](https://user-images.githubusercontent.com/13738469/144496683-2490a679-4a79-422f-993c-bf01ebe33186.png)

## Change Log

## License
