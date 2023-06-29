import $ from "jquery";
import * as d3 from "d3";
import { zoom } from "../main";

function handleZoom(e) {
  d3.select("#parentSvgNode").select("g").attr("transform", e.transform);
  d3.select("#parentSvgNode")
    .select("#centerCircle")
    .attr("transform", e.transform);
}

const zoomIdentity = d3.zoomIdentity;

const hasInverters = (nodeObj) => {
  if (
    nodeObj.bottomDecorators.length &&
    nodeObj.bottomDecorators.some((v) => v.resourceType === "inverter")
  ) {
    return true;
  }
  return false;
};

const graphBounds = (withCola, myCola) => {
  let x = Number.POSITIVE_INFINITY;
  let X = Number.NEGATIVE_INFINITY;
  let y = Number.POSITIVE_INFINITY;
  let Y = Number.NEGATIVE_INFINITY;
  // Check the visibility of the graph and then Select the graph for which the layout is to be exported.
  let selCola;
  if ($("#parentSvgNode").is(":visible")) {
    selCola = myCola;
  }
  if (withCola) {
    const { R } = SharedFunctionality;
    selCola.nodes().forEach((v) => {
      x = Math.min(x, v.x - (v.busWidth + 3 * R || R * 2) / 2);
      X = Math.max(X, v.x + (v.busWidth + 7 * R || R * 2) / 2);
      y = Math.min(y, v.y - R * 4);
      Y = Math.max(Y, v.y + R * (hasInverters(v) ? 10 : 8));
    });
  } else {
    d3.selectAll(".node").each((v) => {
      x = Math.min(x, v.x - (v.busWidth + 3 * R || R * 2) / 2);
      X = Math.max(X, v.x + (v.busWidth + 3 * R || R * 2) / 2);
      y = Math.min(y, v.y - R * 4);
      Y = Math.max(Y, v.y + R * 5);
    });
  }
  return { x: x, X: X, y: y, Y: Y };
};

const redraw = (transition) => {
  if (SharedFunctionality.nodeMouseDown) return;
  const vis = d3.select("#parentSvgNode").select("g");
  // const zoomer = zoom;
  //Selecting the g node for autofit based on the visibility of the graph.

  (transition ? vis.transition() : vis).attr(
    "transform",
    `translate(${zoomIdentity.x}, ${zoomIdentity.y}) scale(${zoomIdentity.k})`
  );
};

const SharedFunctionality = {
  R: 16,
  autoLayout: true,
  nodeMouseDown: false,
  hasNodeLocationData: false,
  goToInitialStateTriggered: false,

  zoomToFit: (withCola, myCola) => {
    const cw = $("#parentSvgNode").innerWidth() * 0.98;
    const ch = $("#parentSvgNode").innerHeight() * 0.9;
    const b = graphBounds(withCola, myCola);
    const w = b.X - b.x;
    const h = b.Y - b.y;
    let s = Math.min(cw / w, ch / h) * 0.8;
    s = 1;
    const tx = -(b.x + (w - cw) / 2);
    const ty = -(b.y + (h - ch) / 2);
    const selZoom = d3.select("#parentSvgNode");

    selZoom.transition().call(zoom.on("zoom", handleZoom).translateBy, tx, ty);
    // selZoom.transition().call(zoom.on("zoom", handleZoom).scaleBy, s);
  },
};

export default SharedFunctionality;
