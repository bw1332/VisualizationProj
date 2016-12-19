var heatmapMargin = {top: 120, right: 120, bottom: 0, left: 120};
var heatmapOuterWidth = 800;
var heatmapOuterHeight = 800;
//var heatmapWeight = heatmapOuterWidth - heatmapMargin.right - heatmapMargin.left;
//var heatmapHeight = heatmapOuterHeight - heatmapMargin.top - heatmapMargin.bottom;
var monthSelected = 1;
var heatmapItemSize = 13;
var heatmapCellSize = heatmapItemSize - 1;
//var legendElementSize = 60;
//var lengendElementY = heatmapHeight;
var colors = colorbrewer.Blues[9];
var heatmapColorScale = d3.scale.quantile().range(colors).domain([0, 3, 40, 117]);

var originData = [];
var datasets = ["https://rawgit.com/bw1332/VisualizationProj/master/source/fii.json"];
var datasetPickerFrom = d3.select("#dataset-picker-from").selectAll(".dataset-button-from").data(datasets);
var datasetPickerTotal = d3.select("#dataset-picker-total").selectAll(".dataset-button-total").data(datasets);
var pickerSelector = 0;

var x_from ="sara.shackleton@enron.com";
var x_to = "susan.bailey@enron.com";

var heatmapSvg = d3.select(".heatmap").append("svg")
    .attr("width", heatmapOuterWidth)
    .attr("height", heatmapOuterHeight)
    .append("g")
    .attr("transform", "translate(" + heatmapMargin.left + "," + heatmapMargin.top + ")");

/*var tip = d3.tip().attr("class", "d3-tip").html(function (d) {
    return d.Name1 + "<br/>" +  d.Name2 + "<br/>" + d.Volume ;
});*/
//heatmapSvg.call(tip);

generateHeatmapChart(datasets[0]);

datasetPickerFrom.enter()
    .append("input")
    .attr("value", function(d, i){ return "From/To"})
    .attr("type", "button")
    .style("width","80px")
    .style("background","white")
    .attr("class", "dataset-button-from")
    .on("click", function(d) {
        generateHeatmapChart(d);
        pickerSelector = 0;
        datasetPickerFrom.style("background", "lightblue");
        datasetPickerTotal.style("background", "white");
    });

datasetPickerTotal.enter()
    .append("input")
    .attr("value", function(d, i){ return "Total"})
    .attr("type", "button")
    .style("width","80px")
    .style("background","white")
    .attr("class", "dataset-button-total")
    .on("click", function(d) {
        generateHeatmapChart(d);
        pickerSelector = 1;
        datasetPickerFrom.style("background", "white");
        datasetPickerTotal.style("background", "lightblue");
    });

function generateHeatmapChart(jsonFile) {
    d3.json(jsonFile, function (error, result) {
        originData = result;
        render(getMonthSource(result, monthSelected));
    });
}

function setMonth(newMonth) {
    monthSelected = newMonth;
    render(getMonthSource(originData, monthSelected));
    //pickerSelector == 0 ? render(getMonthSource(originData, monthSelected)) :  renderTotal(getMonthSource(originData, monthSelected));
}

function render(result) {
    if (result === undefined) {
        return;
    }
    var resultSelected = pickerSelector == 0 ? getHeatMapDataFromTo1(result, findEmailList(originData)) : getHeatMapDataTotal1(result,findEmailList(originData));
    if (resultSelected === undefined) {
        return;
    }
    var data = resultSelected.map(function (d) {
        var dataset = [];
        dataset.Name1 = d.from;
        dataset.Name2 = d.to;
        dataset.Volume = d.num;
        return dataset;
    });
    createHeatmap(data, originData);
}

function createHeatmap(data, allData) {
    /*var xElementsArray = d3.set(data.map(function (d) {
        return cutEmail(d.Name1);
    })).values();*/
    var xElementsArray = findEmailList(allData);
    var yElementsArray = xElementsArray;
   /*var yElementsArray = d3.set(data.map(function (d) {
        return cutEmail(d.Name2);
    })).values();*/

    var xScale = d3.scale.ordinal().domain(xElementsArray).rangeBands([0, xElementsArray.length * heatmapItemSize]);
    var yScale = d3.scale.ordinal().domain(yElementsArray).rangeBands([0, yElementsArray.length * heatmapItemSize]);

    var xAxis = d3.svg.axis().scale(xScale)
        .tickFormat(function (d) {
            return nameTrans(d);
        })
        .orient("top");
    var yAxis = d3.svg.axis().scale(yScale)
        .tickFormat(function (d) {
            return nameTrans(d);
        })
        .orient("left");

  //  heatmapSvg.selectAll("rect").remove();    
    
    var cells = heatmapSvg.selectAll("rect").data(data);
    cells.enter().append("g").append("rect")
        .attr("class", "cell")
        .attr("width", heatmapCellSize)
        .attr("height", heatmapCellSize)
        .attr("x", function (d) {
            //return xElementsArray.indexOf(d.Name1) * heatmapCellSize;
            return yScale(d.Name1);
        })
        .attr("y", function (d) {
            //return yElementsArray.indexOf(d.Name2) * heatmapCellSize;
            return yScale(d.Name2);
        })
        .attr("class", function(d){return "cell cell-border x" + xElementsArray.indexOf(d.Name1) + " y" + yElementsArray.indexOf(d.Name2)})
        .on("click", function (d) {
            //console.log(d.Name1);
            //console.log(d.Name2);
            x_from = d.Name1;
            x_to = d.Name2;
            setAll (month, x_from, x_to);
            document.getElementById("subtitle").innerHTML = cutEmail(x_from) + " & " + cutEmail(x_to);
            document.getElementById("subtitle").style.visibility = "visible";
            document.getElementById("bartitle").innerHTML = "Topics";
            d3.select("#tooltip").style({
                visibility: "visible",
                top: d3.event.clientY + 2 + "px",
                left: d3.event.clientX + 2 + "px",
                opacity: 1
            });
            if (pickerSelector == 0){
                d3.select("#tooltip").html("From: " + d.Name1 + "<br/>" +  "To: " + d.Name2 + "<br/>" + "Volume: " + d.Volume);
            }else {
                d3.select("#tooltip").html("Email: " + d.Name1 + "<br/>" +  "Email: " + d.Name2 + "<br/>" + "Volume: " + d.Volume);
            }
            /*d3.select(this).classed("cell-hover",true);
            d3.selectAll(".xLabel").classed("text-highlight",function(r){ return r == d.Name1;});
            d3.selectAll(".yLabel").classed("text-highlight",function(c){ return c == d.Name2;});*/
        })
        .on("mouseenter", function (d) {
            d3.select(this).classed("cell-hover",true);
            d3.selectAll(".xLabel").classed("text-highlight",function(r){ return r == d.Name1;});
            d3.selectAll(".yLabel").classed("text-highlight",function(c){ return c == d.Name2;});
            //tip.show(d);
            /*d3.select("#tooltip").style({
                visibility: "visible",
                top: d3.event.clientY + "px",
                left: d3.event.clientX + "px",
                opacity: 1
            });
            d3.select("#tooltip").html("From: " + d.Name1 + "<br/>" +  "To: " + d.Name2 + "<br/>" + "Volume: " + d.Volume );*/
        })
        .on("mouseout", function (d) {
            d3.select(this).classed("cell-hover",false);
            d3.selectAll(".xLabel").classed("text-highlight",false);
            d3.selectAll(".yLabel").classed("text-highlight",false);
            //tip.hide(d);
            d3.select("#tooltip").style({
                visibility: "hidden",
                opacity: 0
            });
        });
    cells.exit().remove();
    cells.transition().duration(500)
        .attr("x", function (d) {
        //return xElementsArray.indexOf(d.Name1) * heatmapCellSize;
        return yScale(d.Name1);
        })
        .attr("y", function (d) {
            //return yElementsArray.indexOf(d.Name2) * heatmapCellSize;
            return yScale(d.Name2);
        })
        .attr("fill", function (d) {
            return heatmapColorScale(d.Volume);
        });

    heatmapSvg.selectAll("g.heatmapAxis").remove();
    var xLabels = heatmapSvg.append("g")
        .attr("class", "x heatmapAxis")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .attr("dx", ".8em")
        .attr("dy", ".2em")
        .attr("class", function (d,i) { return "xLabel mono x"+ i;} )
        .style("text-anchor", "start")
        .on("mouseover", function(d) {
            d3.select(this).classed("text-hover",true);
        })
        .on("mouseout" , function(d) {
            d3.select(this).classed("text-hover",false);
        });
    /*var xLabels = heatmapSvg.append("g")
            .selectAll(".xLabelg")
            .data(xElementsArray)
            .enter()
            .append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * heatmapCellSize; })
            .attr("font-weight", "normal")
            .style("text-anchor", "start")
            .attr("transform", "translate("+heatmapCellSize/2 + ",-6) rotate (-90)")
            .attr("dx", ".4em")
            .attr("dy", ".3em")
            .attr("class", function (d,i) { return "xLabel mono r"+i;} )
            .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
            .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);});*/

    var yLabels = heatmapSvg.append("g")
        .attr("class", "y heatmapAxis")
        .call(yAxis)
        .selectAll("text")
        .attr("class", function (d,i) {
            return "yLabel mono y"+ i;
        })
        .on("mouseover", function(d) {
            d3.select(this).classed("text-hover",true);
        })
        .on("mouseout" , function(d) {
            d3.select(this).classed("text-hover",false);
        });
   /* var yLabels = heatmapSvg.append("g")
        .selectAll(".yLabelg")
        .data(yElementsArray)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return i * heatmapCellSize; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + heatmapCellSize / 2 + ")")
        .attr("dy", ".3em")
        .attr("class", function (d,i) { return "yLabel mono r"+i;} )
        .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
        .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);});*/

    //legendBar(heatmapColorScale);
}

/*function legendBar(heatmapColorScale) {
    var legend = heatmapSvg.selectAll(".legend").data([0].concat(heatmapColorScale.quantiles()), function (d) {
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
}*/

function nameTrans(email) {
    var nameString = email.substring(0,email.indexOf("@")).replace("."," ");
    var space = nameString.indexOf(" ");
    var nameStringFirst = nameString.substring(0, space);
    var nameStringLast = nameString.substring(space + 1);
    return nameStringFirst.charAt(0).toUpperCase() + nameStringFirst.substring(1) + " " + nameStringLast.charAt(0).toUpperCase() + nameStringLast.substring(1);
}


