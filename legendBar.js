/**
 * Created by mache on 12/16/2016.
 */
var legendMargin = {top: 0, right: 20, bottom: 20, left: 220};
var legendOuterWidth = 660;
var legendOuterHeight = 38;

var legendHeight = legendOuterHeight - legendMargin.top - legendMargin.bottom;

var legendElementSize = 40;
var lengendElementY = legendHeight;
var colors = colorbrewer.Blues[9];
var legendColorScale = d3.scale.quantile().range(colors).domain([0, 9, 40, 167]);

var legendSvg = d3.select(".legendBars").append("svg")
    .attr("width", legendOuterWidth)
    .attr("height", legendOuterHeight)
    .append("g")
    .attr("transform", "translate(" + legendMargin.left + "," + legendMargin.top + ")");
legendBar(heatmapColorScale);

function legendBar(colorScale) {
    var legend = legendSvg.selectAll(".legend").data([0].concat(colorScale.quantiles()), function (d) {
        return d;
    });
    legend.enter().append("g").attr("class", "legend");
    legend.append("rect")
        .attr("x", function (d, i) {
            return legendElementSize * i;
        })
        .attr("y", lengendElementY)
        .attr("width", legendElementSize)
        .attr("height", legendElementSize / 2)
        .style("fill", function (d ,i) {
            return colors[i];
        });
    legend.append("text")
        .attr("class", "mono")
        .text(function (d) {
            return ">=" + Math.round(d);
        })
        .attr("x", function (d, i) {
            return legendElementSize * i;
        })
        .attr("y", lengendElementY);
    legend.exit().remove();
}
