import * as d3 from "d3";

function getResourceDefaultTitle(d) {
  const prefix = {
    storage: "Storage",
    generator: "Generator",
    market: "Market",
    load: "Load",
  };
  return `${prefix[d.resourceType]} (id: ${d.id})`;
}

function getTooltipHtml(d, rules) {
  let tooltipHtml = "";
  let title = getResourceDefaultTitle(d);
  if (d.topDecoData) {
    title = d.topDecoData.name;
  } else if (d.bottomDecoData) {
    title = d.bottomDecoData.name;
  }
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
