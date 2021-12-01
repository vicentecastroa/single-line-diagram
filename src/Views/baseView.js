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
