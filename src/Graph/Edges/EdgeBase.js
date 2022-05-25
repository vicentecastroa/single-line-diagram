import * as d3 from "d3";
import SharedFunctionality from "../../Views/baseView";
import Decorators from "./Decorators/Decorators";

const getPath = (source, target, slots) => {
  const x1 =
    source.x >= target.x
      ? source.x - source.busWidth / 2
      : source.x + source.busWidth / 2;
  const y1 = source.y;
  const x2 =
    target.x >= source.x
      ? target.x - target.busWidth / 2
      : target.x + target.busWidth / 2;
  const y2 = target.y;
  const w = x2 - x1;
  const h = y2 - y1;

  const startOffsetIndex =
    (source.x >= target.x ? slots[source.id].left : slots[source.id].right) - 1;
  const endOffsetIndex =
    (target.x >= source.x ? slots[target.id].left : slots[target.id].right) - 1;

  const startOffsetY = (-1) ** startOffsetIndex * 4 * startOffsetIndex;
  const endOffsetY = (-1) ** endOffsetIndex * 4 * endOffsetIndex;

  const path = `M ${x1} ${y1} v ${startOffsetY} h ${w / 2} v ${
    h + endOffsetY
  } h ${w / 2} v ${-(startOffsetY + endOffsetY)}`;
  return path;
};

function Edges(data, svg) {
  this.data = data;
  this.svg = svg;
  this.edgesGroupTag = svg
    .selectAll(".edgeGroupIcon")
    .data(this.data)
    .enter()
    .append("g")
    .attr("fill", "transparent")
    .on("mousedown", function () {
      SharedFunctionality.nodeMouseDown = true;
    })
    // recording the mousedown state allows us to differentiate dragging from panning
    .on("mouseup", function () {
      SharedFunctionality.nodeMouseDown = false;
    });

  this.centerUI = this.edgesGroupTag
    .append("line")
    .attr("class", "edge")
    .attr("id", (d) => {
      d.edgeData["DOMID"] = "edge" + d.index;
      return d.edgeData.DOMID;
    });

  this.pathUIBackground = this.edgesGroupTag
    .append("path")
    .attr("class", "edge-aux-background")
    .attr("id", (d) => {
      return `${d.edgeData.DOMID}PathBackground`;
    });
  this.pathUI = this.edgesGroupTag
    .append("path")
    .attr("class", "edge-aux")
    .attr("id", (d) => {
      return `${d.edgeData.DOMID}Path`;
    });

  // Decorators
  this.decorators = new Decorators(this.edgesGroupTag);
  this.decorators.decorate();
}

Edges.prototype.tick = function () {
  this.moveEdges();

  this.decorators.tick();
};

Edges.prototype.moveEdges = function () {
  const busSlots = {};
  this.edgesGroupTag.each((d) => {
    d3.select(`#${d.edgeData.DOMID}`)
      .attr("x1", (d) => {
        if (d.source.x >= d.target.x) {
          // source left
          if (!busSlots[d.source.id]) {
            busSlots[d.source.id] = { left: 1 };
          } else if (!busSlots[d.source.id].left) {
            busSlots[d.source.id].left = 1;
          } else {
            busSlots[d.source.id].left += 1;
          }

          return d.source.x - d.source.busWidth / 2;
        }
        // source right
        if (!busSlots[d.source.id]) {
          busSlots[d.source.id] = { right: 1 };
        } else if (!busSlots[d.source.id].right) {
          busSlots[d.source.id].right = 1;
        } else {
          busSlots[d.source.id].right += 1;
        }

        return d.source.x + d.source.busWidth / 2;
      })
      .attr("y1", d.source.y)
      .attr("x2", (d) => {
        if (d.target.x >= d.source.x) {
          // target left
          if (!busSlots[d.target.id]) {
            busSlots[d.target.id] = { left: 1 };
          } else if (!busSlots[d.target.id].left) {
            busSlots[d.target.id].left = 1;
          } else {
            busSlots[d.target.id].left += 1;
          }

          return d.target.x - d.target.busWidth / 2;
        }
        // target right
        if (!busSlots[d.target.id]) {
          busSlots[d.target.id] = { right: 1 };
        } else if (!busSlots[d.target.id].right) {
          busSlots[d.target.id].right = 1;
        } else {
          busSlots[d.target.id].right += 1;
        }

        return d.target.x + d.target.busWidth / 2;
      })
      .attr("y2", d.target.y);

    d3.select(`#${d.edgeData.DOMID}PathBackground`).attr(
      "d",
      getPath(d.source, d.target, busSlots)
    );

    d3.select(`#${d.edgeData.DOMID}Path`).attr(
      "d",
      getPath(d.source, d.target, busSlots)
    );
  });

  this.edgesGroupTag.each((d) => {
    d3.select(`#${d.edgeData.DOMID}`)
      .attr("zoomPointX", (d.source.x + d.target.x) / 2)
      .attr("zoomPointY", (d.source.y + d.target.y) / 2);
  });
};

export default Edges;
