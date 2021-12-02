import * as d3 from "d3";
import SharedFunctionality from "../../../Views/baseView";

function TopDecorators(nodesGroupTag) {
  this.nodesGroupTag = nodesGroupTag;
}

TopDecorators.prototype.decorate = function () {
  this.nodesGroupTag._groups.forEach(async (d) => {
    const nodeGroup = d[0].__data__;
    const topDecorators = nodeGroup.topDecorators;
    const topDecoCount = topDecorators.length;
    const R = SharedFunctionality.R;
    const LL = R / 2;

    if (topDecoCount !== 0) {
      const topDecoratorGroup = d3
        .select(d[0])
        .append("g")
        .attr("class", "topDecoratorGroup")
        .attr("id", () => topDecorators.DOMID);

      for (let index = 0; index < topDecoCount; index++) {
        const decorator = topDecorators[index];
        if (decorator.resourceType === "storage") {
          const storageIcon = await d3.xml(
            "./storage.svg"
          );
          console.log("storageIcon", storageIcon.documentElement);
          topDecoratorGroup.append(storageIcon.documentElement);
          /* topDecoratorGroup
            .append("circle")
            .attr("fill", "red")
            .attr("id", () => `bus${nodeGroup.id}topDeco${index}`)
            .attr("r", R / 2)
            .attr("cy", -(3 * R + 2 * LL))
            .attr("cx", () => {
              if (topDecoCount % 2 === 0) {
                //Factor to be added to the topDecoCount to adjust the position of the top decorators.
                var x = (topDecoCount - 4) / 2 + 0.5;
                return (-(topDecoCount + x) + 3 * index) * (R / 2);
              } else
                return (-(3 * (topDecoCount - 1)) / 2 + 3 * index) * (R / 2);
            }); */
        }
      }
    }
  });
};

TopDecorators.prototype.tick = function () {
  d3.selectAll(".topDecoratorGroup")
    .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
    .attr("zoomPointX", (d) => d.x)
    .attr("zoomPointY", (d) => d.y);
};

export default TopDecorators;
