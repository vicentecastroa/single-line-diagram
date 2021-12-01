import * as d3 from "d3";

function Nodes(data, svg, cola) {
  this.data = data;
  this.svg = svg;
  this.nodesGroupTag = this.svg
    .selectAll(".busGroupIcon")
    .data(data)
    .enter()
    .append("g")
    .attr("fill", "white")
    .call(cola.drag);

  this.getNodeLabels = this.getNodeLabels.bind(this);
  this.labels = this.getNodeLabels(cola);
}
/* class Nodes {
  constructor(data, svg, cola) {
    this.data = data;
    this.svg = svg;
    this.nodesGroupTag = this.svg
      .selectAll(".busGroupIcon")
      .data(data)
      .enter()
      .append("g")
      .attr("fill", "white")
      .call(cola.drag);

    this.getNodeLabels.bind(this);
    this.labels = this.getNodeLabels(cola);
  }
} */

Nodes.prototype.getNodeLabels = function (cola) {
  console.log(cola);
  console.log("nodelabel", this);
  return null;
};

Nodes.prototype.tick = function () {
  console.log("tick", this);
  this.nodesGroupTag.selectAll(".node").each((d) => {
    d3.select(this)
      .attr("cx", d.x)
      .attr("cy", d.y)
      .attr("zoomPointX", d.x)
      .attr("zoomPointY", d.y);
  });

  /* this.labels
    .attr("x", function (d) {
      return d.x;
    })
    .attr("y", function (d) {
      var h = this.getBBox().height;
      return d.y + h / 4 + 1;
    }); */

  /* this.topDecorators.tick();
  this.bottomDecorators.tick(); */
};

export default Nodes;
