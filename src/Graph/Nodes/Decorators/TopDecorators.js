import * as d3 from "d3";
import SharedFunctionality from "../../../Views/baseView";

function TopDecorators(nodesGroupTag) {
  this.nodesGroupTag = nodesGroupTag;
}

TopDecorators.prototype.decorate = function () {
  this.nodesGroupTag.each((d) => {
    console.log(d);

    const topDecoCount = d.topDecorators.length;
    const R = SharedFunctionality.R;
    const LL = R / 2;

    console.log(d);
    if (topDecoCount !== 0) {
      const topDecoratorGroup = d3
        .select(`#${d.DOMID}`)
        .append("g")
        .attr("class", "topDecoratorGroup")
        .attr("id", (d) => d.topDecorators.DOMID);

      for (let index = 0; index < topDecoCount; index++) {
        const decorator = d.topDecorators[index];
        console.log(decorator);
        if (decorator.resourceType === "storage") {
          topDecoratorGroup
            .append("circle")
            .attr("fill", "red")
            .attr("id", (d) => `bus${d.busId}topDeco${index}`)
            .attr("r", R / 2)
            .attr("cy", -(3 * R + 2 * LL))
            .attr("cx", () => {
              if (topDecoCount % 2 === 0) {
                //Factor to be added to the topDecoCount to adjust the position of the top decorators.
                var x = (topDecoCount - 4) / 2 + 0.5;
                return (-(topDecoCount + x) + 3 * index) * (R / 2);
              } else
                return (-(3 * (topDecoCount - 1)) / 2 + 3 * index) * (R / 2);
            });
        }
      }
    }
  });
};

TopDecorators.prototype.tick = function () {
  d3.selectAll(".topDecoratorGroup")
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .attr("zoomPointX", function (d) {
      return d.x;
    })
    .attr("zoomPointY", function (d) {
      return d.y;
    });
};

export default TopDecorators;
