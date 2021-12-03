import * as d3 from "d3";
import $ from "jquery";

function getTooltipHtml(d, rules) {
  let tooltipHtml = "";
  console.log(d)
  tooltipHtml = `<div style="text-align: center">${d.name}</div>
    <table border="1" style="margin: 0 auto; font-size: 0.74em; border-spacing: 0; width: 100%">
      <tr>
        <td align="left">key</td>
        <td align="right">value</td>
      </tr>
    </table>`;
  return toolTipHtml;
}

function showTooltip(d, $event, tooltipRule) {
  const tooltipHtml = getTooltipHtml(d, tooltipRule);
  d3.select("#tooltip")
    .style("left", $event.pageX + "px")
    .style("top", $event.pageY + "px")
    .html(tooltipHtml)
    .classed("hidden", false);
}

function hideTooltip(d) {
  d3.select("#tooltip").classed("hidden", true);
}

export { showTooltip, hideTooltip };
