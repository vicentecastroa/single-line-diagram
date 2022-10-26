import * as d3 from "d3";
import SharedFunctionality from "../../Views/baseView";
import TopDecorators from "./Decorators/TopDecorators";
import BottomDecorators from "./Decorators/BottomDecorators";
import { showTooltip, hideTooltip } from "../../utils/Tooltip";
import { lineEdges, nodes } from "../disconnectedGraph";
import { NETWORK_OBJECTS } from "../../main";

const eventStart = {};

function getEventPos(event) {
  let ev = event;
  let e =
    typeof TouchEvent !== "undefined" && ev.sourceEvent instanceof TouchEvent
      ? ev.sourceEvent.changedTouches[0]
      : ev.sourceEvent;
  return { x: e.clientX, y: e.clientY };
}

function dragStart(event, d) {
  eventStart[d.DOMID] = getEventPos(event);
}

function getDragPos(event, d) {
  let p = getEventPos(event),
    startPos = eventStart[d.DOMID];
  return {
    x: d.x + p.x - startPos.x,
    y: d.y + p.y - startPos.y,
  };
}
function drag(event, d) {
  var p = getDragPos(event, d);
}
function dragEnd(event, d) {
  let dropPos = getDragPos(event, d);
  delete eventStart[d.DOMID];
  d.x = dropPos.x;
  d.y = dropPos.y;

  nodes.tick();
  lineEdges.tick();
}

const dragListener = d3
  .drag()
  .on("start", dragStart)
  .on("drag", drag)
  .on("end", dragEnd);

function Nodes(data, svg, cola) {
  this.data = data;
  this.svg = svg;
  this.nodesGroupTag = this.svg
    .selectAll(".busGroupIcon")
    .data(data)
    .enter()
    .append("g")
    .attr("fill", "white")
    .on("mousedown", function () {
      SharedFunctionality.nodeMouseDown = true;
    })
    // recording the mousedown state allows us to differentiate dragging from panning
    .on("mouseup", function () {
      SharedFunctionality.nodeMouseDown = false;
    })
    .call(dragListener);

  this.labels = this.getNodeLabels(cola);
  this.centerUI = this.getNodeCenterUI(this.nodesGroupTag);

  // Add tooltip
  d3.selectAll(".busIcon").each((d) => {
    d3.select(`#${d.DOMID}`).on("mouseover", ($event) => {
      showTooltip(d, $event, "");
    });
  });

  // Decorators or bus resources
  this.topDecorators = new TopDecorators(this.nodesGroupTag);
  this.topDecorators.decorate();

  this.bottomDecorators = new BottomDecorators(this.nodesGroupTag);
  this.bottomDecorators.decorate();
}

Nodes.prototype.getNodeLabels = function (cola) {
  return null;
};

Nodes.prototype.getNodeCenterUI = function (nodesGroupTag) {
  nodesGroupTag
    .append("circle")
    .attr("class", "node busIcon")
    .attr("r", 0)
    .on("mouseout", () => hideTooltip());

  nodesGroupTag
    .append("line")
    .attr("class", "node busLine")
    .attr("id", (d) => {
      d["DOMID"] = `bus${d.id}`;
      return d.DOMID;
    })
    .on("mouseout", () => hideTooltip());
};

Nodes.prototype.tick = function () {
  const nodesPositions = [];
  const nodesTotalBranches = {};

  // Compute node total connected branches
  NETWORK_OBJECTS.branchDataObj.dataObjList.forEach((element) => {
    const { fromBus, toBus } = element.edgeData;
    if (!nodesTotalBranches[fromBus]) {
      nodesTotalBranches[fromBus] = 1;
    } else {
      nodesTotalBranches[fromBus] += 1;
    }
    if (!nodesTotalBranches[toBus]) {
      nodesTotalBranches[toBus] = 1;
    } else {
      nodesTotalBranches[toBus] += 1;
    }
  });

  this.nodesGroupTag.selectAll(".node").each((d) => {
    let busWidth = SharedFunctionality.R * 2.5;
    const bottomDecoratorsLength =
      d.bottomDecorators.length +
      d.bottomDecorators
        .flatMap((v) => (v.bottomDecorators ? v.bottomDecorators.length : 0))
        .reduce((acc, v) => acc + v * 0.5, 0);
    let nDecorators = Math.max(bottomDecoratorsLength, d.topDecorators.length);
    if (nDecorators > 1) {
      busWidth = busWidth * nDecorators;
    }

    if (nodesTotalBranches[d.id]) {
      busWidth += nodesTotalBranches[d.id] * SharedFunctionality.R;
    }

    d.busWidth = busWidth;

    d3.select(`#${d.DOMID}`)
      .attr("x1", d.x - busWidth / 2)
      .attr("y1", d.y)
      .attr("x2", d.x + busWidth / 2)
      .attr("y2", d.y)
      .attr("zoomPointX", d.x)
      .attr("zoomPointY", d.y);

    nodesPositions.push({ busId: d.id, x: d.x, y: d.y });
  });

  /* this.labels
    .attr("x", function (d) {
      return d.x;
    })
    .attr("y", function (d) {
      var h = this.getBBox().height;
      return d.y + h / 4 + 1;
    }); */

  this.topDecorators.tick();
  this.bottomDecorators.tick();

  d3.select("#diagram-div").dispatch("update-layout", {
    detail: { nodesPositions },
  });
};

export default Nodes;
