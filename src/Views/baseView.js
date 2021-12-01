import $ from "jquery";
import { myCola } from "../main";

const graphBounds = (withCola) => {
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

const SharedFunctionality = {
  R: 15,
  autoLayout: true,
  nodeMouseDown: false,
  hasNodeLocationData: false,
  goToInitialStateTriggered: false,

  zoomToFit: (withCola) => {
    var cw = window.innerWidth * 0.98 - 160 - SharedFunctionality.R * 2;
    var ch = window.innerHeight * 0.85 + SharedFunctionality.R * 1;
    var b = graphBounds(withCola);
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
    selZoom.translate([tx, ty]).scale(s);
    redraw(true);
  },
};

export default SharedFunctionality;
