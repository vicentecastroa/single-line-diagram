import SharedFunctionality from "../../../Views/baseView";

function TopDecorators(nodesGroupTag) {
  this.nodesGroupTag = nodesGroupTag;
}

TopDecorators.prototype.decorate = function () {
  this.nodesGroupTag.each((d) => {
    const topDecoCount = d.topDecorators.length;
    const R = SharedFunctionality.R;
    const LL = R / 2;

    console.log(d);
    if (topDecoCount !== 0) {
      console.log("this", this);
      console.log("d.id", `#${d.DOMID}`);
      console.log(d3.select(`#${d.DOMID}`));
      const topDecoratorGroup = d3
        .select(this)
        .append("g")
        .attr("class", "topDecoratorGroup")
        .attr("id", (d) => d.topDecorators.DOMID);

      for (let index = 0; index < topDecoCount; index++) {
        const decorator = d.topDecorators[index];
        console.log(decorator);
        if (decorator.type === "storage") {
          topDecoratorGroup
            .append("circle")
            .attr("fill", "red")
            .attr("index", index)
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
