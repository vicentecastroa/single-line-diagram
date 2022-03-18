import * as d3 from "d3";
import $ from "jquery";
import SharedFunctionality from "../../../Views/baseView";
import { showTooltip, hideTooltip } from "../../../utils/Tooltip";

// Icons
import storageIcon from "../../../Icons/storageIcon";
import generatorSolarIcon from "../../../Icons/generatorSolar";
import generatorThermalIcon from "../../../Icons/generatorThermal";
import generatorHydroIcon from "../../../Icons/generatorHydro";
import generatorWindIcon from "../../../Icons/generatorWind";
import evIcon from '../../../Icons/ev';

const parser = new DOMParser();

function BottomDecorators(nodesGroupTag) {
  this.nodesGroupTag = nodesGroupTag;

  // Icons
  this.icons = {
    storage: storageIcon,
    generatorSolar: generatorSolarIcon,
    generatorThermal: generatorThermalIcon,
    generatorHydro: generatorHydroIcon,
    generatorWind: generatorWindIcon,
    ev: evIcon
  };
}

BottomDecorators.prototype.decorate = function () {
  this.nodesGroupTag._groups.forEach((d) => {
    const nodeGroup = d[0].__data__;
    const bottomDecorators = nodeGroup.bottomDecorators;
    const bottomDecoCount = bottomDecorators.length;
    const R = SharedFunctionality.R;
    const LL = R / 2;
    const decoratorY = 3 * R;
    const decoratorWidth = 2 * R;
    const loadWidth = decoratorWidth * 0.6;

    const bottomDecoratorGroup = d3
      .select(d[0])
      .append("g")
      .attr("class", "bottomDecoratorGroup")
      .attr("id", () => bottomDecorators.DOMID);

    if (bottomDecoCount !== 0) {
      // Adding vertical central connector.
      bottomDecoratorGroup
        .append("line")
        .attr("class", "connectors")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", LL)
        .attr("y2", () => (bottomDecoCount > 1 ? R + LL : decoratorY));

      for (let index = 0; index < bottomDecoCount; index++) {
        const decorator = bottomDecorators[index];
        if (decorator.resourceType !== "load") {
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
              } else
                return (-(3 * (bottomDecoCount - 1)) / 2 + 3 * index) * R - R;
            })
            .on("mouseover", ($event) => {
              showTooltip(decorator, $event, "");
            })
            .on("mouseout", () => hideTooltip());
        } else {
          bottomDecoratorGroup
            .append("svg:defs")
            .append("svg:marker")
            .attr("id", () => `Arrowhead${nodeGroup.id}`)
            .attr("refx", 0)
            .attr("refY", 5)
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("markerUnits", "strokeWidth")
            .attr("orient", "auto")
            .attr("class", "loadMarker")
            .append("svg:polygon")
            .attr("points", "0 1, 9 5, 0 9")
            .attr("class", "loadPolygon");

          bottomDecoratorGroup
            .append("line")
            .attr("id", () => `bus${nodeGroup.id}bottomDeco${index}`)
            .attr("class", "connectors")
            .attr("x1", () => {
              if (bottomDecoCount % 2 === 0) {
                //Factor to be added to the bottomDecoCount to adjust the position of the bottom decorators.
                const x = (bottomDecoCount - 4) / 2 + 0.5;
                return (-(bottomDecoCount + x) + 3 * index) * R - R;
              } else
                return (-(3 * (bottomDecoCount - 1)) / 2 + 3 * index) * R - R;
            })
            .attr("x2", () => {
              if (bottomDecoCount % 2 === 0) {
                //Factor to be added to the bottomDecoCount to adjust the position of the bottom decorators.
                const x = (bottomDecoCount - 4) / 2 + 0.5;
                return (-(bottomDecoCount + x) + 3 * index) * R - R;
              } else
                return (-(3 * (bottomDecoCount - 1)) / 2 + 3 * index) * R - R;
            })
            .attr("y1", decoratorY)
            .attr("y2", decoratorY + R / 2)
            .attr("marker-end", `url(#Arrowhead${nodeGroup.id})`);

          // Transparent rectangle to handle hover tooltip
          bottomDecoratorGroup
            .append("rect")
            .attr("width", loadWidth)
            .attr("height", loadWidth * 1.2)
            .attr("y", decoratorY)
            .attr("x", () => {
              if (bottomDecoCount % 2 === 0) {
                //Factor to be added to the bottomDecoCount to adjust the position of the bottom decorators.
                const x = (bottomDecoCount - 4) / 2 + 0.5;
                return (
                  (-(bottomDecoCount + x) + 3 * index) * R - R - loadWidth / 2
                );
              } else
                return (
                  (-(3 * (bottomDecoCount - 1)) / 2 + 3 * index) * R -
                  R -
                  loadWidth / 2
                );
            })
            .attr("style", `fill:transparent`)
            .on("mouseover", ($event) => {
              showTooltip(decorator, $event, "");
            })
            .on("mouseout", () => hideTooltip());
        }

        // Adding connecting lines (vertical lines) for multiple top decorators.
        const y1 = decoratorY; // 1.4 is factor for margin
        const y2 = R + LL;
        if (bottomDecoCount > 1) {
          bottomDecoratorGroup
            .append("line")
            .attr("class", "connectors")
            .attr("x1", () =>
              decorator.resourceType === "load"
                ? $(`#bus${nodeGroup.id}bottomDeco${index}`).attr("x1")
                : Number($(`#bus${nodeGroup.id}bottomDeco${index}`).attr("x")) +
                  decoratorWidth / 2
            )
            .attr("x2", () =>
              decorator.resourceType === "load"
                ? $(`#bus${nodeGroup.id}bottomDeco${index}`).attr("x1")
                : Number($(`#bus${nodeGroup.id}bottomDeco${index}`).attr("x")) +
                  decoratorWidth / 2
            )
            .attr("y1", y1)
            .attr("y2", y2 - 0.5)
            .attr(
              "dx",
              () => $(`#bus${nodeGroup.id}bottomDeco${index}`).attr("x") - 4
            );
        }

        // Adding breaker to vertical lines
        const breakerWidth = 8;
        const breakerHeight = breakerWidth;
        const breakerFillColor =
          bottomDecorators[index].bottomDecoData.breaker === "open"
            ? "white"
            : "black";
        bottomDecoratorGroup
          .append("rect")
          .attr("class", "connectors")
          .attr('id', `bus${nodeGroup.id}bottomDeco${index}Breaker`)
          .attr(
            "x",
            () =>
              (decorator.resourceType === "load"
                ? $(`#bus${nodeGroup.id}bottomDeco${index}`).attr("x1")
                : Number($(`#bus${nodeGroup.id}bottomDeco${index}`).attr("x")) +
                  decoratorWidth / 2) -
              breakerWidth / 2
          )
          .attr("y", y1 - breakerHeight * 1.8)
          .attr("width", breakerWidth)
          .attr("height", breakerHeight)
          .attr("style", `fill:${breakerFillColor}`);
      }

      // Adding horizontal central connector for multiple top decorators.
      if (bottomDecoCount > 1) {
        bottomDecoratorGroup
          .append("line")
          .attr("class", "connectors")
          .attr(
            "x1",
            () =>
              Number($(`#bus${nodeGroup.id}bottomDeco0`).attr("x")) +
              decoratorWidth / 2
          )
          .attr("x2", () =>
            bottomDecorators[bottomDecoCount - 1].resourceType === "load"
              ? $(`#bus${nodeGroup.id}bottomDeco${bottomDecoCount - 1}`).attr(
                  "x1"
                )
              : Number(
                  $(`#bus${nodeGroup.id}bottomDeco${bottomDecoCount - 1}`).attr(
                    "x"
                  )
                ) +
                decoratorWidth / 2
          )
          .attr("y1", R + LL)
          .attr("y2", R + LL);
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
