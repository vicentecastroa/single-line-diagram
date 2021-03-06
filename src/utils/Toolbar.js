import * as d3 from "d3";
import { drawGraph, inputEvent } from "../main";

const toolbarHtml = `
<a class="toolbar-link" id="center-btn">
  <svg class="toolbar-icon" viewBox="0 0 24 24">
    <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
  </svg>
</a>
`;

const tooltipText = {
  "center-btn": "Reset view",
};

function showTooltip($event, btn) {
  const tooltipHtml = `<div style="text-align: center; font-size: 12px">${tooltipText[btn]}</div>`;

  d3.select("#tooltip")
    .style("left", $event.pageX + "px")
    .style("top", $event.pageY + "px")
    .html(tooltipHtml)
    .classed("hidden", false);
}

function hideTooltip() {
  d3.select("#tooltip").classed("hidden", true);
}

function addToolbar() {
  // Add toolbar html
  d3.select("#diagram-div")
    .append("div")
    .attr("id", "toolbar")
    .attr("class", "toolbar-container");
  d3.select("#toolbar").html(toolbarHtml);

  d3.select("#center-btn")
    .on("mouseover", ($event) => {
      showTooltip($event, "center-btn");
    })
    .on("mouseout", () => hideTooltip());

  // Events handler
  d3.select("#center-btn").on("click", () => {
    drawGraph(inputEvent);
  });
}

export default addToolbar;
