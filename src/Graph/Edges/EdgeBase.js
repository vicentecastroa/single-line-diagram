import * as d3 from "d3";
import SharedFunctionality from "../../Views/baseView";
import Decorators from "./Decorators/Decorators";

const getPath = (source, target, slots) => {
  const sourceEnd = source.x + source.busWidth / 2;
  const sourceStart = source.x - source.busWidth / 2;
  const targetStart = target.x - target.busWidth / 2;
  const targetEnd = target.x + target.busWidth / 2;
  let x1 = 0;
  let x2 = 0;
  if (target.x >= source.x) {
    if (sourceEnd >= targetStart) {
      x1 = targetStart + (sourceEnd - targetStart) / 2;
      x2 = x1;
    } else {
      x1 = sourceEnd;
      x2 = targetStart;
    }
  } else {
    if (targetEnd >= sourceStart) {
      x1 = sourceStart + (targetEnd - sourceStart) / 2;
      x2 = x1;
    } else {
      x2 = targetEnd;
      x1 = sourceStart;
    }
  }
  const y1 = source.y;
  const y2 = target.y;
  const w = x2 - x1;
  const h = y2 - y1;

  const startOffsetIndex =
    (source.x >= target.x ? slots[source.id].left : slots[source.id].right) - 1;
  const endOffsetIndex =
    (target.x >= source.x ? slots[target.id].left : slots[target.id].right) - 1;

  const startOffsetY = Math.pow(-1, startOffsetIndex) * 4 * startOffsetIndex;
  const endOffsetY = Math.pow(-1, endOffsetIndex) * 4 * endOffsetIndex;

  if (x1 === x2) {
    const path = `M ${x1} ${y1} v ${h}`;
    return path;
  }
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
    busSlots[d.source.id] = { left: 0, right: 0, top: 0, bottom: 0 };
    busSlots[d.target.id] = { left: 0, right: 0, top: 0, bottom: 0 };
  });
  this.edgesGroupTag.each((d) => {
    d3.select(`#${d.edgeData.DOMID}`)
      .attr("x1", (d) => {
        const sourceEnd = d.source.x + d.source.busWidth / 2;
        const sourceStart = d.source.x - d.source.busWidth / 2;
        const targetStart = d.target.x - d.target.busWidth / 2;
        const targetEnd = d.target.x + d.target.busWidth / 2;
        if (d.source.x >= d.target.x) {
          if (sourceStart <= targetEnd) {
            busSlots[d.source.id].bottom += 1;
            busSlots[d.source.id].top += 1;
          } else {
            // source left
            busSlots[d.source.id].left += 1;
          }
          return d.source.x - d.source.busWidth / 2;
        }
        // source right
        if (sourceEnd >= targetStart) {
          busSlots[d.source.id].bottom += 1;
          busSlots[d.source.id].top += 1;
        } else {
          busSlots[d.source.id].right += 1;
        }
        return d.source.x + d.source.busWidth / 2;
      })
      .attr("y1", d.source.y)
      .attr("x2", (d) => {
        const sourceEnd = d.source.x + d.source.busWidth / 2;
        const sourceStart = d.source.x - d.source.busWidth / 2;
        const targetStart = d.target.x - d.target.busWidth / 2;
        const targetEnd = d.target.x + d.target.busWidth / 2;
        if (d.target.x >= d.source.x) {
          if (sourceEnd >= targetStart) {
            busSlots[d.target.id].bottom += 1;
            busSlots[d.target.id].top += 1;
          } else {
            // target left
            busSlots[d.target.id].left += 1;
          }
          return d.target.x - d.target.busWidth / 2;
        }
        // target right
        if (targetEnd >= sourceStart) {
          busSlots[d.target.id].bottom += 1;
          busSlots[d.target.id].top += 1;
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
