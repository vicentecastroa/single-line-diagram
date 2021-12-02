import * as d3 from "d3";
import $ from "jquery";
import SharedFunctionality from "../../../Views/baseView";

// Icons
import storageIcon from "../../../Icons/storageIcon";
import generatorSolarIcon from "../../../Icons/generatorSolar";
import generatorThermalIcon from "../../../Icons/generatorThermal";

const parser = new DOMParser();

function TopDecorators(nodesGroupTag) {
  this.nodesGroupTag = nodesGroupTag;

  // Icons
  this.icons = {
    storage: storageIcon,
    generatorSolar: generatorSolarIcon,
    generatorThermal: generatorThermalIcon,
  };
}

TopDecorators.prototype.decorate = function () {
  this.nodesGroupTag._groups.forEach((d) => {
    const nodeGroup = d[0].__data__;
    const topDecorators = nodeGroup.topDecorators;
    const topDecoCount = topDecorators.length;
    const R = SharedFunctionality.R;
    const LL = R / 2;
    const decoratorY = -5 * R;
    const decoratorWidth = 2 * R;

    const topDecoratorGroup = d3
      .select(d[0])
      .append("g")
      .attr("class", "topDecoratorGroup")
      .attr("id", () => topDecorators.DOMID);

    if (topDecoCount !== 0) {
      for (let index = 0; index < topDecoCount; index++) {
        const decorator = topDecorators[index];
        const icon = parser.parseFromString(
          this.icons[decorator.resourceType],
          "image/svg+xml"
        );
        const storageHTML = topDecoratorGroup
          .node()
          .appendChild(icon.documentElement);
        d3.select(storageHTML)
          .attr("width", decoratorWidth)
          .attr("height", decoratorWidth)
          .attr("id", () => `bus${nodeGroup.id}topDeco${index}`)
          .attr("y", decoratorY)
          .attr("x", () => {
            if (topDecoCount % 2 === 0) {
              //Factor to be added to the topDecoCount to adjust the position of the top decorators.
              const x = (topDecoCount - 4) / 2 + 0.5;
              return (-(topDecoCount + x) + 3 * index) * R - R;
            } else return (-(3 * (topDecoCount - 1)) / 2 + 3 * index) * R - R;
          });

        // Adding connecting lines (vertical lines) for multiple top decorators.
        var y1 = decoratorY + R + LL * 1.4; // 1.4 is factor for margin
        var y2 = -(R + LL);
        if (topDecoCount > 1) {
          topDecoratorGroup
            .append("line")
            .attr("class", "connectors")
            .attr(
              "x1",
              () =>
                Number($(`#bus${nodeGroup.id}topDeco${index}`).attr("x")) +
                decoratorWidth / 2
            )
            .attr(
              "x2",
              () =>
                Number($(`#bus${nodeGroup.id}topDeco${index}`).attr("x")) +
                decoratorWidth / 2
            )
            .attr("y1", y1)
            .attr("y2", y2)
            .attr(
              "dx",
              () => $(`#bus${nodeGroup.id}topDeco${index}`).attr("x") - 4
            );
        }

        // Adding breaker to vertical lines
        const breakerWidth = 8;
        const breakerHeight = breakerWidth;
        const breakerFillColor =
          topDecorators[index].topDecoData.breaker === "open"
            ? "white"
            : "black";
        topDecoratorGroup
          .append("rect")
          .attr("class", "connectors")
          .attr(
            "x",
            () =>
              Number($(`#bus${nodeGroup.id}topDeco${index}`).attr("x")) +
              decoratorWidth / 2 -
              breakerWidth / 2
          )
          .attr("y", y1 + breakerHeight * 0.8)
          .attr("width", breakerWidth)
          .attr("height", breakerHeight)
          .attr("style", `fill:${breakerFillColor}`);
      }
    }

    // Adding horizontal central connector for multiple top decorators.
    if (topDecoCount > 1) {
      topDecoratorGroup
        .append("line")
        .attr("class", "connectors")
        .attr(
          "x1",
          () =>
            Number($(`#bus${nodeGroup.id}topDeco0`).attr("x")) +
            decoratorWidth / 2
        )
        .attr(
          "x2",
          () =>
            Number(
              $(`#bus${nodeGroup.id}topDeco${topDecoCount - 1}`).attr("x")
            ) +
            decoratorWidth / 2
        )
        .attr("y1", -(R + LL))
        .attr("y2", -(R + LL));
    }

    // Adding vertical central connector and its OffStatus.
    topDecoratorGroup
      .append("line")
      .attr("class", "connectors")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", -LL)
      .attr("y2", () =>
        topDecoCount > 1 ? -(R + LL) : decoratorY + R + LL * 1.4
      );
  });
};

TopDecorators.prototype.tick = function () {
  d3.selectAll(".topDecoratorGroup")
    .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
    .attr("zoomPointX", (d) => d.x)
    .attr("zoomPointY", (d) => d.y);
};

export default TopDecorators;
