import * as d3 from "d3";
import SharedFunctionality from "../../Views/baseView";
import TopDecorators from "./Decorators/TopDecorators";
import BottomDecorators from "./Decorators/BottomDecorators";
import { showTooltip, hideTooltip } from "../../utils/Tooltip";

function Nodes(data, svg, cola) {
  this.data = data;
  this.svg = svg;
  this.nodesGroupTag = this.svg
    .selectAll(".busGroupIcon")
    .data(data)
    .enter()
    .append("g")
    .attr("fill", "white")
    .call(cola.drag)
    .on("mousedown", function () {
      SharedFunctionality.nodeMouseDown = true;
    })
    // recording the mousedown state allows us to differentiate dragging from panning
    .on("mouseup", function () {
      SharedFunctionality.nodeMouseDown = false;
    });

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
    .attr("id", (d) => {
      d["DOMID"] = `bus${d.id}`;
      return d.DOMID;
    })
    .attr("r", SharedFunctionality.R * 0.5)
    .on("mouseout", () => hideTooltip());
};

Nodes.prototype.tick = function () {
  this.nodesGroupTag.selectAll(".node").each((d) => {
    d3.select(`#${d.DOMID}`)
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

  /*  this.bottomDecorators.tick(); */
  this.topDecorators.tick();
  this.bottomDecorators.tick();
};

export default Nodes;
