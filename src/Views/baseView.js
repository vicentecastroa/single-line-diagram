import $ from "jquery";
import * as d3 from "d3";

function handleZoom(e) {
  d3.select("#parentSvgNode").select("g").attr("transform", e.transform);
}

const zoom = d3.zoom().on("zoom", handleZoom);
const zoomIdentity = d3.zoomIdentity;

const graphBounds = (withCola, myCola) => {
  let x = Number.POSITIVE_INFINITY;
  let X = Number.NEGATIVE_INFINITY;
  let y = Number.POSITIVE_INFINITY;
  let Y = Number.NEGATIVE_INFINITY;
  //Check the visibility of the graph and then Select the graph for which the layout is to be exported.
  let selCola;
  if ($("#parentSvgNode").is(":visible")) {
    selCola = myCola;
  }
  if (withCola) {
    selCola.nodes().forEach((v) => {
      x = Math.min(x, v.x - SharedFunctionality.R * 2);
      X = Math.max(X, v.x);
      y = Math.min(y, v.y - SharedFunctionality.R * 4);
      Y = Math.max(Y, v.y + SharedFunctionality.R * 5);
    });
  } else {
    d3.selectAll(".node").each((v) => {
      x = Math.min(x, v.x - SharedFunctionality.R * 2);
      X = Math.max(X, v.x);
      y = Math.min(y, v.y - SharedFunctionality.R * 4);
      Y = Math.max(Y, v.y + SharedFunctionality.R * 5);
    });
  }
  return { x: x, X: X, y: y, Y: Y };
};

const redraw = (transition) => {
  if (SharedFunctionality.nodeMouseDown) return;
  const vis = d3.select("#parentSvgNode").select("g");
  const zoomer = zoom;
  //Selecting the g node for autofit based on the visibility of the graph.

  (transition ? vis.transition() : vis).attr(
    "transform",
    `translate(${zoomIdentity.x}, ${zoomIdentity.y}) scale(${zoomIdentity.k})`
  );
};

const SharedFunctionality = {
  R: 15,
  autoLayout: true,
  nodeMouseDown: false,
  hasNodeLocationData: false,
  goToInitialStateTriggered: false,

  zoomToFit: (withCola, myCola) => {
    const cw =
      $("#parentSvgNode").innerWidth() * 0.98 - SharedFunctionality.R * 2;
    const ch =
      $("#parentSvgNode").innerHeight() * 0.85 + SharedFunctionality.R * 1;
    const b = graphBounds(withCola, myCola);
    const w = b.X - b.x;
    const h = b.Y - b.y;
    const s = Math.min(cw / w, ch / h);
    const tx = -b.x + ((cw / s - w) * s) / 2; /* + ((cw / s - w) * s) / 2 */
    const ty = -b.y + ((ch - h) * s) / 2;
    const selZoom = d3.select("#parentSvgNode");

    selZoom.transition().call(zoom.scaleBy, s);
    selZoom.transition().call(zoom.translateBy, tx, ty);
    // redraw(true);
  },
};

export default SharedFunctionality;
