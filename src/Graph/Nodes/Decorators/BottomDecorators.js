import * as d3 from "d3";
import $ from "jquery";
import SharedFunctionality from "../../../Views/baseView";

// Icons
import gridIcon from "../../../Icons/grid";

const parser = new DOMParser();

function BottomDecorators(nodesGroupTag) {
  this.nodesGroupTag = nodesGroupTag;

  // Icons
  this.icons = {
    grid: gridIcon,
  };
}

BottomDecorators.prototype.decorate = function () {
  this.nodesGroupTag._groups.forEach((d) => {
    const nodeGroup = d[0].__data__;
    const bottomDecorators = nodeGroup.bottomDecorators;
    const bottomDecoCount = bottomDecorators.length;
    const R = SharedFunctionality.R;
    const LL = R / 2;
    const decoratorY = -5 * R;
    const decoratorWidth = 2 * R;

    const bottomDecoratorGroup = d3
      .select(d[0])
      .append("g")
      .attr("class", "bottomDecoratorGroup")
      .attr("id", () => bottomDecorators.DOMID);

    if (bottomDecoCount !== 0) {
      for (let index = 0; index < bottomDecoCount; index++) {
        const decorator = bottomDecorators[index];
        const icon = parser.parseFromString(
          this.icons[decorator.resourceType],
          "image/svg+xml"
        );
        const decoratorHTML = bottomDecoratorGroup
          .node()
          .appendChild(icon.documentElement);

        d3.select(decoratorHTML)
          .attr("width", decoratorWidth)
          .attr("height", decoratorWidth)
          .attr("id", () => `bus${nodeGroup.id}bottomDeco${index}`)
          .attr("y", decoratorY)
          .attr("x", () => {
            if (bottomDecoCount % 2 === 0) {
              //Factor to be added to the bottomDecoCount to adjust the position of the bottom decorators.
              const x = (bottomDecoCount - 4) / 2 + 0.5;
              return (-(bottomDecoCount + x) + 3 * index) * R - R;
            } else return (-(3 * (bottomDecoCount - 1)) / 2 + 3 * index) * R - R;
          });
      }
    }
  });
};

BottomDecorators.prototype.tick = function () {
  d3.selectAll(".bottomDecoratorGroup")
    .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
    .attr("zoomPointX", (d) => d.x)
    .attr("zoomPointY", (d) => d.y);
};

export default BottomDecorators;
