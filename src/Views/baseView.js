import $ from "jquery";
import * as d3 from "d3";

var zoom = d3.zoom();
var zoomTransform = d3.zoomTransform();

const graphBounds = (withCola, myCola) => {
  var x = Number.POSITIVE_INFINITY,
    X = Number.NEGATIVE_INFINITY,
    y = Number.POSITIVE_INFINITY,
    Y = Number.NEGATIVE_INFINITY;
  //Check the visibility of the graph and then Select the graph for which the layout is to be exported.
  var selCola;
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
    var cw = window.innerWidth * 0.98 - 160 - SharedFunctionality.R * 2;
    var ch = window.innerHeight * 0.85 + SharedFunctionality.R * 1;
    var b = graphBounds(withCola, myCola);
    var w = b.X - b.x,
      h = b.Y - b.y;
    var s = Math.min(cw / w, ch / h);
    var tx = -b.x * s + ((cw / s - w) * s) / 2;
    var ty = -b.y * s + ((ch / s - h) * s) / 2;
    var selZoom;
    if ($("#parentSvgNode").is(":visible")) {
      selZoom = zoom;
    } else {
      selZoom = zoomHelp;
    }
    console.log("selZoom", selZoom);
    console.log("tx ty", tx, ty);
    console.log(selZoom.translateBy());
    // selZoom.translateBy([tx, ty]).scale(s);
    redraw(true);
  },
};

export default SharedFunctionality;
