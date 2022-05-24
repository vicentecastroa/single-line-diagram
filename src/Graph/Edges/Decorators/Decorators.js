import * as d3 from "d3";
import $ from "jquery";
import SharedFunctionality from "../../../Views/baseView";

// Icons
import switchCloseIcon from "../../../Icons/switch";
import switchOpenIcon from "../../../Icons/switchOpen";
import transformerIcon from "../../../Icons/transformer";

const parser = new DOMParser();

function Decorators(edges) {
  this.edges = edges;

  // Icons
  this.icons = {
    "switch-close": switchCloseIcon,
    "switch-open": switchOpenIcon,
    transformer: transformerIcon,
  };
}

Decorators.prototype.decorate = function () {
  this.decoratorWidth = 2.5 * SharedFunctionality.R;
  this.edges._groups.forEach((g) => {
    g.forEach((d) => {
      const edge = d.__data__;
      const decorators = edge.decorators;
      const decoCount = decorators.length;

      const decoratorGroup = d3
        .select(d)
        .append("g")
        .attr("class", "decoratorGroup")
        .attr("id", () => decorators.DOMID);
      if (decoCount !== 0) {
        // Only take first decorator
        const decorator = decorators[0];
        const icon = parser.parseFromString(
          this.icons[
            decorator.resourceType === "switch"
              ? `${decorator.resourceType}-${decorator.state}`
              : decorator.resourceType
          ],
          "image/svg+xml"
        );

        const decoratorHTML = decoratorGroup
          .node()
          .appendChild(icon.documentElement);

        d3.select(decoratorHTML)
          .attr("width", this.decoratorWidth)
          .attr("height", this.decoratorWidth)
          .attr("id", () => `branch${edge.index}Deco${0}`)
          .attr("y", 0)
          .attr("x", 0)
          .on("click", () => {
            d3.select("#diagram-div").dispatch(
              `click-${decorator.resourceType}`,
              {
                detail: {
                  id: decorator.id,
                  resourceType: decorator.resourceType,
                  state: decorator.state === "close" ? "open" : "close",
                },
              }
            );
          });
      }
    });
  });
};

Decorators.prototype.tick = function () {
  d3.selectAll(".decoratorGroup")
    .attr("transform", (d) => {
      const x1 = Number($(`#${d.edgeData.DOMID}`).attr("x1"));
      const x2 = Number($(`#${d.edgeData.DOMID}`).attr("x2"));
      const y1 = Number($(`#${d.edgeData.DOMID}`).attr("y1"));
      const y2 = Number($(`#${d.edgeData.DOMID}`).attr("y2"));

      const rotationAngle = (Math.atan((y2 - y1) / (x2 - x1)) * 180) / Math.PI;

      return `translate(${x1 + (x2 - x1) / 2 - this.decoratorWidth / 2},${
        y1 + (y2 - y1) / 2 - this.decoratorWidth / 2
      }) rotate(${rotationAngle}, ${this.decoratorWidth / 2}, ${
        this.decoratorWidth / 2
      })`;
    })
    .attr("zoomPointX", (d) => (d.source.x + d.target.x) / 2)
    .attr("zoomPointY", (d) => (d.source.y + d.target.y) / 2);
};

export default Decorators;
