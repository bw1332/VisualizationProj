var HeatMap = {
    target : "#heatmap",
    data : undefined,
    width : 800,
    height : 800,
    elementList : undefined,
    itemSize : 12,
    cellSize : 11,
    
    init : function(elementList){
        this.elementList = elementList;
    },
    update : function(data) {
        if (data == undefined){
            return;
        }
        this.data = data;
        console.log(data);
        var svg = d3.select(this.target).append("svg")
        .attr("width", this.width)
        .attr("height", this.height);
        
        var xScale = d3.scale.ordinal().domain(this.elementList).rangePoints([0, this.itemSize * 46]);
        var yScale = d3.scale.ordinal().domain(this.elementList).rangeBands([this.itemSize * 46, 0]);
        var colorScale = d3.scale.quantile().domain([0,10, 40,200]).range(colorbrewer.Reds[9]);
        
        svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", this.cellSize)
        .attr("height", this.cellSize)
        .attr("x", function(d) {
            return xScale(d.from);
        })
        .attr("y", function(d) {
            return yScale(d.to);
        })
        .attr("fill", function(d){
            return colorScale(d.num);
        }).on("mouseenter", function(d,i){
            //拿出来到时候
            var f = d.from;
            var t = d.to;
            svg.selectAll("rect").style("stroke", function(data, index){
                return data.from == f || data.to == t ? "red" : undefined;
            }).style("stroke-width", function(data, index){
                return data.from == f&& data.to == t ? "2px" : "1px";
            }).style("stroke-opacity", 0.5);
            svg.selectAll("[xaxis] .tick").style("opacity", function(data, index){
                return data.from == f&& data.to == t ? 1 : 0.5;});
        });
        
        var idx = [];
        for (var i = 0; i < 46;i++){
            idx.push(i);
        }
        var xxx =d3.scale.linear().domain([0,45]).range([0, 46 * this.itemSize]);
        var xAxis = d3.svg.axis().scale(xxx)
        .orient("bottom").tickSize(-10).tickValues(idx.map(function(e){
            return HeatMap.elementList[e];
        }));
        svg.append("g").attr("xaxis","md").attr("transform", "translate("
                                               + 8
                                               + ","
                                               + 610
                                               + ")").call(xAxis);
      //  d3.selectAll(".tick text").style("text-anchor", "start").style("color","red").attr("transform", "rotate(40)");
      //  d3.selectAll(".tick line").style("stroke", "red").attr("stroke-opacity","0.5").style("transform", "rotate(40)");
 //       d3.selectAll("[xaxis] .tick").style("opacity",0.5).style("font-size",10);
;
        
    }
}

function newHeatMap(){
    return this.HeatMap;
}