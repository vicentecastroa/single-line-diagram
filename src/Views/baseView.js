import $ from "jquery";
import * as d3 from "d3";

// const zoom = d3.zoom();
// const zoomTransform = d3.zoomTransform();

const graphBounds = (withCola, myCola) => {
  let x = Number.POSITIVE_INFINITY;
  let X = Number.NEGATIVE_INFINITY;
  let y = Number.POSITIVE_INFINITY;
  let Y = Number.NEGATIVE_INFINITY;
  //Check the visibility of the graph and then Select the graph for which the layout is to be exported.
  let selCola;
  if ($("#parentSvgNode").is(":visible")) {
    selCola = myCola;
  } else {
    selCola = myColaHelp;
  }
  if (withCola) {
    selCola.nodes().forEach(function (v) {
      x = Math.min(x, v.x - SharedFunctionality.R * 2);
      X = Math.max(X, v.x);
      y = Math.min(y, v.y - SharedFunctionality.R * 4);
      Y = Math.max(Y, v.y + SharedFunctionality.R * 5);
    });
  } else {
    d3.selectAll(".node").each(function (v) {
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
  let vis, zoomer;
  //Selecting the g node for autofit based on the visibility of the graph.
  if ($("#parentSvgNode").is(":visible")) {
    vis = d3.select("#parentSvgNode").select("g");
    zoomer = zoom;
  } else {
    vis = d3.select("#helpSvgNode").select("g");
    zoomer = zoomHelp;
  }

  (transition ? vis.transition() : vis).attr(
    "transform",
    "translate(" + zoomer.translate() + ") scale(" + zoomer.scale() + ")"
  );
};

const SharedFunctionality = {
  R: 15,
  autoLayout: true,
  nodeMouseDown: false,
  hasNodeLocationData: false,
  goToInitialStateTriggered: false,

  zoomToFit: (withCola, myCola) => {
    const cw = window.innerWidth * 0.98 - 160 - SharedFunctionality.R * 2;
    const ch = window.innerHeight * 0.85 + SharedFunctionality.R * 1;
    const b = graphBounds(withCola, myCola);
    console.log('graphBounds', b)
    const w = b.X - b.x,
      h = b.Y - b.y;
    const s = Math.min(cw / w, ch / h);
    const tx = -b.x * s + ((cw / s - w) * s) / 2;
    const ty = -b.y * s + ((ch / s - h) * s) / 2;
    let selZoom;
    if ($("#parentSvgNode").is(":visible")) {
      selZoom = zoom;
    } else {
      selZoom = zoomHelp;
    }
    console.log("selZoom", selZoom);
    console.log("tx ty", tx, ty);
    // selZoom.translateBy([tx, ty]).scale(s);
    redraw(true);
  },
};

export default SharedFunctionality;
