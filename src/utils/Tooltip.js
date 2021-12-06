import * as d3 from "d3";

function getResourceDefaultTitle(d) {
  const prefix = {
    storage: "Storage",
    generator: "Generator",
    grid: "Grid",
  };
  return `${prefix} (id: ${d.id})`;
}

function getTooltipHtml(d, rules) {
  let tooltipHtml = "";
  const title = d.topDecoData.name || getResourceDefaultTitle(d);
  tooltipHtml = `<div style="text-align: center">${title}</div>
    `;
  /* const table = `<table border="1" style="margin: 0 auto; font-size: 0.74em; border-spacing: 0; width: 100%">
<tr>
  <td align="left">key</td>
  <td align="right">value</td>
</tr>
</table>`; */
  return tooltipHtml;
}

function showTooltip(d, $event, tooltipRule) {
  const tooltipHtml = getTooltipHtml(d, tooltipRule);
  d3.select("#tooltip")
    .style("left", $event.pageX + "px")
    .style("top", $event.pageY + "px")
    .html(tooltipHtml)
    .classed("hidden", false);
}

function hideTooltip() {
  d3.select("#tooltip").classed("hidden", true);
}

export { showTooltip, hideTooltip };
