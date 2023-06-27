import * as d3 from "d3";
import SharedFunctionality from "../../Views/baseView";
import Decorators from "./Decorators/Decorators";

const getPath = (source, target, slots, hasDecorators) => {
  const sourceEnd = source.x + source.busWidth / 2;
  const sourceStart = source.x - source.busWidth / 2;
  const targetStart = target.x - target.busWidth / 2;
  const targetEnd = target.x + target.busWidth / 2;
  let x1 = 0;
  let x2 = 0;
  let sourceAnchor;
  let targetAnchor;
  if (target.x >= source.x) {
    if (sourceEnd >= targetStart) {
      x1 = targetStart + (sourceEnd - targetStart) / 2;
      x2 = x1;
      sourceAnchor = "top";
      targetAnchor = "top";
    } else {
      x1 = sourceEnd;
      sourceAnchor = "right";
      x2 = targetStart;
      targetAnchor = "left";
    }
  } else {
    if (targetEnd >= sourceStart) {
      x1 = sourceStart + (targetEnd - sourceStart) / 2;
      x2 = x1;
      sourceAnchor = "top";
      targetAnchor = "top";
    } else {
      x1 = sourceStart;
      sourceAnchor = "left";
      x2 = targetEnd;
      targetAnchor = "right";
    }
  }
  const y1 = source.y;
  const y2 = target.y;
  const w = x2 - x1;
  const h = y2 - y1;

  if (x1 === x2) {
    const path = `M ${x1} ${y1} v ${h}`;
    return path;
  }

  /* const startOffsetIndex =
    (source.x >= target.x ? slots[source.id].left : slots[source.id].right) - 1;
  const endOffsetIndex =
    (target.x >= source.x ? slots[target.id].left : slots[target.id].right) - 1; */

  /* const startOffsetY =
    Math.pow(-1, startOffsetIndex) * 4 * (startOffsetIndex + 1);
  const endOffsetY = Math.pow(-1, endOffsetIndex) * 4 * endOffsetIndex; */

  let startOffsetX = 0;
  if (sourceAnchor === "left")
    startOffsetX = 8 /* + (startOffsetIndex + 1) * 4 */;
  if (sourceAnchor === "right")
    startOffsetX = -8 /* + -1 * (startOffsetIndex + 1) * 4 */;

  let endOffsetX = 0;
  if (targetAnchor === "left")
    endOffsetX = 8 /* + -1 * (endOffsetIndex + 1) * 4 */;
  if (targetAnchor === "right")
    endOffsetX = -8 /* + (endOffsetIndex + 1) * 4 */;

  if (!hasDecorators) {
    const minV = 10;
    const level1 = y1 + minV * Math.sign(h);
    const level2 = y2 + minV * Math.sign(h);
    const hy = h > 0 ? Math.max(level1, level2) : Math.min(level1, level2);
    const v1 = hy - y1;
    const v2 = (hy - y2) * -1;
    const path = `M ${x1 + startOffsetX} ${y1} v ${v1} h ${
      w - startOffsetX + endOffsetX
    } v ${v2}`;

    return path;
  }

  // Has decorators
  const minVConnector = 15;
  const minMiddleVertical = 44;
  const minHeight = minMiddleVertical + 2 * minVConnector;

  let v1 = 0;
  let v3 = 0;
  let v2 = 0;
  if (Math.abs(h) + minVConnector <= minMiddleVertical + 20) {
    const level1 = y1 + (minVConnector + minMiddleVertical) * Math.sign(h);
    const level2 = y2 + minVConnector * Math.sign(h);
    const hy = h > 0 ? Math.max(level1, level2) : Math.min(level1, level2);
    v1 = minVConnector * Math.sign(h) * -1;
    v2 = (y1 + v1 - hy) * -1;
    v3 = (hy - y2) * -1;
  } else if (
    Math.abs(h) + minVConnector > minMiddleVertical + 20 &&
    Math.abs(h) <= minHeight
  ) {
    const level1 = y1 + (minVConnector + minMiddleVertical) * Math.sign(h);
    const level2 = y2 + minVConnector * Math.sign(h);
    const hy = h > 0 ? Math.max(level1, level2) : Math.min(level1, level2);
    v1 = minVConnector * Math.sign(h);
    v2 = (y1 + v1 - hy) * -1;
    v3 = (hy - y2) * -1;
  } else if (Math.abs(h) > minHeight) {
    v1 = minVConnector * Math.sign(h);
    v2 = (Math.abs(h) - 2 * minVConnector) * Math.sign(h);
    v3 = minVConnector * Math.sign(h);
  }
  const path = `M ${x1 + startOffsetX} ${y1} v ${v1} h ${
    w / 2 - startOffsetX
  } v ${v2} h ${w / 2 + endOffsetX} v ${v3}`;
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
      getPath(d.source, d.target, busSlots, d.decorators.length)
    );

    d3.select(`#${d.edgeData.DOMID}Path`).attr(
      "d",
      getPath(d.source, d.target, busSlots, d.decorators.length)
    );
  });

  this.edgesGroupTag.each((d) => {
    d3.select(`#${d.edgeData.DOMID}`)
      .attr("zoomPointX", (d.source.x + d.target.x) / 2)
      .attr("zoomPointY", (d.source.y + d.target.y) / 2);
  });
};

export default Edges;
