import * as d3 from "d3";
import SharedFunctionality from "../../../Views/baseView";

const parser = new DOMParser();

function TopDecorators(nodesGroupTag) {
  this.nodesGroupTag = nodesGroupTag;

  //Icons
  this.storageIcon = parser.parseFromString(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 199 199">
  <defs>
      <style>.cls-1{fill:#fff;}.cls-1,.cls-2,.cls-3{stroke:#000;stroke-linejoin:round;stroke-width:7px;}.cls-3{fill:none;stroke-linecap:round;}</style>
  </defs>
  <title>scada</title>
  <g id="Battery">
  <rect class="cls-1" x="23.23" y="57.5" width="155.04" height="92"/>
  <rect class="cls-2" x="42.5" y="43.5" width="31" height="14"/>
  <rect class="cls-2" x="127.5" y="43.5" width="31" height="14"/>
  <rect class="cls-1" x="15.5" y="149.5" width="170.5" height="6"/>
  <line class="cls-3" x1="154.5" y1="85.5" x2="130.5" y2="85.5"/>
  <line class="cls-3" x1="69.5" y1="85.5" x2="45.5" y2="85.5"/>
  <line class="cls-3" x1="142.5" y1="97.5" x2="142.5" y2="73.5"/>
  </g>
  </svg>`,
    "image/svg+xml"
  );
}

TopDecorators.prototype.decorate = function () {
  console.log("storage icon", this.storageIcon);
  this.nodesGroupTag._groups.forEach((d) => {
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
          topDecoratorGroup
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
            });
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
