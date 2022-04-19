import * as d3 from "d3";

function Edges(data, svg) {
  this.data = data;
  this.svg = svg;
  this.edges = svg
    .selectAll(".edges")
    .data(this.data)
    .enter()
    .append("line")
    .attr("class", "edge")
    .attr("id", function (d) {
      d.edgeData["DOMID"] = "edge" + d.index;
      return d.edgeData.DOMID;
    });
}

Edges.prototype.tick = function () {
  this.moveEdges();
};

Edges.prototype.moveEdges = function () {
  this.edges.each(function (d) {
    d3.select(`#${d.edgeData.DOMID}`)
      .attr("x1", (d) => {
        if (d.source.x >= d.target.x) {
          return d.source.x - d.source.busWidth / 2;
        }
        return d.source.x + d.source.busWidth / 2;
      })
      .attr("y1", d.source.y)
      .attr("x2", (d) => {
        if (d.target.x >= d.source.x) {
          return d.target.x - d.target.busWidth / 2;
        }
        return d.target.x + d.target.busWidth / 2;
      })
      .attr("y2", d.target.y);
  });

  this.edges.each(function (d) {
    d3.select(`#${d.edgeData.DOMID}`)
      .attr("zoomPointX", (d.source.x + d.target.x) / 2)
      .attr("zoomPointY", (d.source.y + d.target.y) / 2);
  });
};

export default Edges;
