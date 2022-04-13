import * as d3 from "d3";

function getResourceDefaultTitle(d) {
  const prefix = {
    storage: "Storage",
    generator: "Generator",
    market: "Market",
    load: "Load",
    ev: "EV",
  };
  return `${prefix[d.resourceType]} (id: ${d.id})`;
}

function getTooltipHtml(d, $event, rules) {
  let tooltipHtml = "";
  let title = "";
  let table = "";
  const tableRows = [];
  if (d) {
    title = getResourceDefaultTitle(d);
    if (d.topDecoData) {
      title = d.topDecoData.name;
      if (d.topDecoData.info && d.topDecoData.info.length) {
        d.topDecoData.info.forEach((row) => {
          tableRows.push(`
            <tr>
              <td>${row.name}</td>
              <td>${row.value} ${row.unit}</td>
            </tr>
          `);
        });
      }
    } else if (d.bottomDecoData) {
      title = d.bottomDecoData.name;
      if (d.bottomDecoData.info && d.bottomDecoData.info.length) {
        d.bottomDecoData.info.forEach((row) => {
          tableRows.push(`
            <tr>
              <td>${row.name}</td>
              <td>${row.value} ${row.unit}</td>
            </tr>
          `);
        });
      }
    } else {
      // Asume that if not d, is a node
      title = $event.srcElement.__data__.name || "Bus";
      if (d.info) {
        d.info.forEach((row) => {
          tableRows.push(`
          <tr>
            <td>${row.name}</td>
            <td>${row.value} ${row.unit}</td>
          </tr>
        `);
        });
      }
    }
    table = `<table border="0" class="sld-tooltip-table">
              ${tableRows.join("")}
            </table>`;
    tooltipHtml = `<div style="text-align: center">${title}</div>`;
  }
  return `${tooltipHtml}${table}`;
}

function showTooltip(d, $event, tooltipRule) {
  const tooltipHtml = getTooltipHtml(d, $event, tooltipRule);
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
