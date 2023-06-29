import * as d3 from "d3";
import $ from "jquery";
import SharedFunctionality from "../../../Views/baseView";
// import { showTooltip, hideTooltip } from "../../../utils/Tooltip";
import htmlInfoTable from "../../../utils/InfoTable";

// Icons
import storageIcon from "../../../Icons/storageIcon";
import generatorSolarIcon from "../../../Icons/generatorSolar";
import generatorThermalIcon from "../../../Icons/generatorThermal";
import generatorHydroIcon from "../../../Icons/generatorHydro";
import generatorWindIcon from "../../../Icons/generatorWind";
import generatorGeothermalIcon from "../../../Icons/generatorGeothermal";
import evIcon from "../../../Icons/ev";
import inverterIcon from "../../../Icons/inverter";

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
    generatorGeothermal: generatorGeothermalIcon,
    ev: evIcon,
    inverter: inverterIcon,
  };
}

BottomDecorators.prototype.decorate = function () {
  this.nodesGroupTag._groups.forEach((g) => {
    g.forEach((d) => {
      const nodeGroup = d.__data__;
      const bottomDecorators = nodeGroup.bottomDecorators;
      const bottomDecoCount = bottomDecorators.length;
      const R = SharedFunctionality.R;
      const LL = R / 2;
      const decoratorY = 3 * R;
      const decoratorWidth = 2 * R;
      const loadWidth = decoratorWidth;

      const bottomDecoratorGroup = d3
        .select(d)
        .append("g")
        .attr("class", "bottomDecoratorGroup")
        .attr("id", () => bottomDecorators.DOMID);

      if (bottomDecoCount !== 0) {
        // Adding vertical central connector.
        if (bottomDecoCount === 1) {
          bottomDecoratorGroup
            .append("line")
            .attr("class", "connectors")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", 0)
            .attr("y2", decoratorY);
        }

        for (let index = 0; index < bottomDecoCount; index++) {
          const decorator = bottomDecorators[index];
          const decoratorId = `bus${nodeGroup.id}bottomDeco${index}`;

          const baseDecoratorX = (resourceType) => {
            const offset = resourceType === "load" ? 0 : decoratorWidth / 2;
            const totalLength = bottomDecoCount * 5 * R;
            const x0 = -totalLength / 2;
            const step = totalLength / (bottomDecoCount - 1);
            if (bottomDecoCount === 1) {
              return -offset;
            }
            return x0 + index * step - offset;
          };

          // Calculate an offset depending on number of subDecorators (e.g. batteries connected to inverter)
          /* const previousX =
            Number($(`#bus${nodeGroup.id}bottomDeco${index - 1}`).attr("x")) ||
            0; */
          const previousDecorator = bottomDecorators[index - 1];
          let offsetPreviousDecorator = 0;
          let offsetInverterDecorator = 0;
          if (
            previousDecorator &&
            previousDecorator.resourceType === "inverter"
          ) {
            offsetPreviousDecorator =
              (previousDecorator.bottomDecorators.length * decoratorWidth) / 2;
          }
          if (decorator.resourceType === "inverter") {
            offsetInverterDecorator =
              ((decorator.bottomDecorators.length % 2 !== 0
                ? decorator.bottomDecorators.length - 1 / 2
                : decorator.bottomDecorators.length / 2) *
                decoratorWidth) /
              2;
          }
          // const offset = offsetPreviousDecorator + offsetInverterDecorator;
          const decoratorX = baseDecoratorX(decorator.resourceType);
          /* index === 0
              ? baseDecoratorX(decorator.resourceType)
              : previousX + offset + decoratorWidth * 3; */

          if (decorator.resourceType !== "load") {
            const icon = parser.parseFromString(
              this.icons[decorator.resourceType],
              "image/svg+xml"
            );

            if (decorator.resourceType !== "inverter") {
              const decoratorHTML = bottomDecoratorGroup
                .node()
                .appendChild(icon.documentElement);

              d3.select(decoratorHTML)
                .attr("width", decoratorWidth)
                .attr("height", decoratorWidth)
                .attr("id", decoratorId)
                .attr("y", decoratorY)
                .attr("x", decoratorX);
              /* .on("mouseover", ($event) => {
                  showTooltip(decorator, $event, "");
                })
                .on("mouseout", () => hideTooltip()); */
            } else {
              // INVERTERS
              const inverterGroup = bottomDecoratorGroup
                .append("g")
                .attr("class", "inverterDecoratorGroup");

              const inverterHTML = inverterGroup
                .node()
                .appendChild(icon.documentElement);
              const inverterId = decoratorId;
              const inverterY = -decoratorY * 1.8;
              d3.select(inverterHTML)
                .attr("id", inverterId)
                .attr("width", decoratorWidth)
                .attr("y", inverterY)
                .attr("x", decoratorX);

              // Add elements connected to the inverter
              const inverterDecorators = decorator.bottomDecorators;
              const inverterDecoCount = inverterDecorators.length;
              for (let index = 0; index < inverterDecoCount; index++) {
                const decorator = inverterDecorators[index];
                const icon = parser.parseFromString(
                  this.icons[decorator.resourceType],
                  "image/svg+xml"
                );

                const subDecoratorHTML = inverterGroup
                  .node()
                  .appendChild(icon.documentElement);
                const inverterX = Number($(`#${inverterId}`).attr("x"));

                d3.select(subDecoratorHTML)
                  .attr("width", decoratorWidth)
                  .attr("y", inverterY + 5 * R)
                  .attr("x", () => {
                    if (inverterDecoCount % 2 === 0) {
                      //Factor to be added to the inverterDecoCount to adjust the position of the bottom decorators.
                      const x = (inverterDecoCount - 4) / 2 + 0.5;
                      return (
                        (-(inverterDecoCount + x) + 3 * index) * R + inverterX
                      );
                    } else
                      return (
                        (-(3 * (inverterDecoCount - 1)) / 2 + 3 * index) * R +
                        inverterX
                      );
                  });

                // Add connecting lines (vertical lines)

                // TODO: Factor in Y axis so horizontal lines don't overlap
                const horizontalY = decoratorY * 2 + R;

                // First line segment
                const x1 = () => {
                  if (inverterDecoCount % 2 === 0) {
                    //Factor to be added to the inverterDecoCount to adjust the position of the bottom decorators.
                    const x = (inverterDecoCount - 4) / 2 + 0.5;
                    return (
                      (-(inverterDecoCount + x) + 3 * index) * R + inverterX + R
                    );
                  } else
                    return (
                      (-(3 * (inverterDecoCount - 1)) / 2 + 3 * index) * R +
                      inverterX +
                      R
                    );
                };
                inverterGroup
                  .append("line")
                  .attr("class", "connectors")
                  .attr("y1", horizontalY)
                  .attr("y2", decoratorY * 2 + 2 * R)
                  .attr("x1", x1())
                  .attr("x2", x1());

                // Second line segment
                const x2 = () => {
                  if (inverterDecoCount === 1) {
                    return inverterX + R;
                  }
                  if (inverterDecoCount % 2 === 0) {
                    //Factor to be added to the inverterDecoCount to adjust the position of the bottom decorators.
                    const x = (inverterDecoCount - 4) / 2 + 0.5;
                    return (
                      (-(inverterDecoCount + x) + 0.2 * index) * R +
                      inverterX +
                      2.3 * R
                    );
                  } else
                    return (
                      (-(3 * (inverterDecoCount - 1)) / 2 + 0.2 * index) * R +
                      inverterX +
                      (inverterDecoCount / 2 + 2.3) * R
                    );
                };
                inverterGroup
                  .append("line")
                  .attr("class", "connectors")
                  .attr("y1", decoratorY * 1.45 + R)
                  .attr("y2", horizontalY)
                  .attr("x1", x2())
                  .attr("x2", x2());

                // Horizontal segment
                inverterGroup
                  .append("line")
                  .attr("class", "connectors")
                  .attr("y1", horizontalY)
                  .attr("y2", horizontalY)
                  .attr("x1", x1())
                  .attr("x2", x2());
              }
            }
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
              .attr("id", decoratorId)
              .attr("class", "connectors")
              .attr("x1", decoratorX)
              .attr("x2", decoratorX)
              .attr("y1", decoratorY)
              .attr("y2", decoratorY + R / 2)
              .attr("marker-end", `url(#Arrowhead${nodeGroup.id})`);

            // Transparent rectangle to handle hover tooltip
            /*  bottomDecoratorGroup
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
              .on("mouseout", () => hideTooltip()); */
          }

          // Adding connecting lines (vertical lines) for multiple top decorators.
          const y1 = decoratorY; // 1.4 is factor for margin
          const y2 = 0;
          if (bottomDecoCount > 1) {
            bottomDecoratorGroup
              .append("line")
              .attr("class", "connectors")
              .attr("x1", () =>
                decorator.resourceType === "load"
                  ? $(`#${decoratorId}`).attr("x1")
                  : Number($(`#${decoratorId}`).attr("x")) + decoratorWidth / 2
              )
              .attr("x2", () =>
                decorator.resourceType === "load"
                  ? $(`#${decoratorId}`).attr("x1")
                  : Number($(`#${decoratorId}`).attr("x")) + decoratorWidth / 2
              )
              .attr("y1", y1)
              .attr("y2", y2)
              .attr("dx", () => $(`#${decoratorId}`).attr("x") - 4);
          }

          // Add label and info table
          bottomDecoratorGroup
            .append("text")
            .text(() => decorator.bottomDecoData.name)
            .attr("class", "label")
            .attr("y", decoratorY + R / 2)
            .attr("x", () =>
              decorator.resourceType === "load"
                ? decoratorX + R / 2 + 4
                : decoratorX + (4 * R) / 2
            )
            .style("stroke-width", "0px")
            .style(
              "fill",
              () => decorator.bottomDecoData.color || "rgba(0, 0, 0, 0.87)"
            )
            .style("font-size", "0.7rem");
          if (decorator.info) {
            bottomDecoratorGroup
              .append("foreignObject")
              .attr("id", `${decoratorId}Info`)
              .attr("class", "label")
              .attr("y", decoratorY + R / 2)
              .attr("x", () =>
                decorator.resourceType === "load"
                  ? decoratorX + R / 2 + 4
                  : decoratorX + (4 * R) / 2
              )
              .attr("width", 2 * decoratorWidth)
              .attr("height", 4 * decoratorWidth)
              .html(() => htmlInfoTable(decorator));
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
            .attr("id", `${decoratorId}Breaker`)
            .attr(
              "x",
              () =>
                (decorator.resourceType === "load"
                  ? $(`#${decoratorId}`).attr("x1")
                  : Number($(`#${decoratorId}`).attr("x")) +
                    decoratorWidth / 2) -
                breakerWidth / 2
            )
            .attr("y", y1 - breakerHeight * 3)
            .attr("width", breakerWidth)
            .attr("height", breakerHeight)
            .attr("style", `fill:${breakerFillColor}`)
            .on("click", () => {
              d3.select("#diagram-div").dispatch("click-breaker", {
                detail: {
                  busId: nodeGroup.id,
                  resource: decorator.bottomDecoData,
                  resourceType: decorator.resourceType,
                  state:
                    decorator.bottomDecoData.breaker === "open"
                      ? "close"
                      : "open",
                },
              });
            });
        }
      }
    });
  });
};

BottomDecorators.prototype.tick = function () {
  d3.selectAll(".bottomDecoratorGroup")
    .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
    .attr("zoomPointX", (d) => d.x)
    .attr("zoomPointY", (d) => d.y);
};

export default BottomDecorators;
