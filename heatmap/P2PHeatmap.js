var margin = {top: 120, right: 120, bottom: 20, left: 120};
var outerWidth = 860;
var outerHeight = 800;
var width = outerWidth - margin.right - margin.left;
var height = outerHeight - margin.top - margin.bottom;
var monthSelected = 1;

var originData = [];
var datasets = ["P2PJan.json", "JanPPV.json"];
var datasetPicker = d3.select("#dataset-picker").selectAll(".dataset-button").data(datasets);

var itemSize = 13;
var cellSize = itemSize - 1;
var legendElementSize = 40;
var lengendElementY = height;
var colors = colorbrewer.Greys[9];

var svg = d3.select(".heatmap").append("svg")
    .attr("width", outerHeight)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tip = d3.tip().attr("class", "d3-tip").html(function (d) {
    //return "<div><span style='color:red'>Volume:</span><span> " + d.Volume + "</span></div>";
    return "<div><span style='color:red'>NameX:</span><span> " + d.Name1 + "</span></div>" +
        "<div><span style='color:red'>NameY:</span><span> " + d.Name2 + "</span></div>" +
        "<div><span style='color:red'>Volume:</span><span> " + d.Volume + "</span></div>";
});
svg.call(tip);

heatmapChart(datasets[0]);

datasetPicker.enter()
    .append("input")
    .attr("value", function(d){ return "Dataset " + d })
    .attr("type", "button")
    .attr("class", "dataset-button")
    .on("click", function(d) {
        heatmapChart(d);
    });

function heatmapChart(jsonFile) {
    d3.json(jsonFile, function (error, result) {
        originData = result;
        render(result);
    });
}

function setMonth(newMonth) {
    monthSelected = newMonth;
    render(originData);
}

function render(result) {
    /*var result1 = changeName(result).filter(function (d) {
        return d.month == monthSelected;
    });*/

    var result1 = result.filter(function (d) {
        return d.month == monthSelected;
    });
    result1.forEach(function (d) {
        d.name1 = nameTrans(d.name1);
        d.name2 = nameTrans(d.name2);
    });

    var data = result1.map(function (d) {
        var dataset = [];
        dataset.Name1 = d.name1;
        dataset.Name2 = d.name2;
        dataset.Volume = d.vol;
        dataset.Month = d.month;
        return dataset;
    });
    /*var resultNameChanged = result.filter(function (d) {
        return d.month == monthSelected;
    });
    resultNameChanged.forEach(function (d) {
        d.name1 = nameTrans(d.name1);
        d.name2 = nameTrans(d.name2);
    });*/
    createHeatmap(data);
}

function createHeatmap(data) {
    var xElementsArray = d3.set(data.map(function (d) {
        return d.Name1;
    })).values();

    //var yElementsArray = xElementsArray;
   var yElementsArray = d3.set(data.map(function (d) {
        return d.Name2;
    })).values();

    /*var xScale = d3.scale.ordinal().domain(xElementsArray).rangeBands([0, xElementsArray.length * itemSize]);
    var yScale = d3.scale.ordinal().domain(yElementsArray).rangeBands([0, yElementsArray.length * itemSize]);

    var xAxis = d3.svg.axis().scale(xScale)
        .tickFormat(function (d) {
            return d;
        })
        .orient("top");
    var yAxis = d3.svg.axis().scale(yScale)
        .tickFormat(function (d) {
            return d;
        })
        .orient("left");*/

    var colorScale = d3.scale.quantile()
        .range(colors).domain([0, 9, 167]);

    var cells = svg.selectAll("rect").data(data);
    cells.enter().append("g").append("rect")
        .attr("class", "cell")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function (d) {
            return xElementsArray.indexOf(d.Name1) * cellSize;
            //return xScale(d.Name1);
        })
        .attr("y", function (d) {
            return yElementsArray.indexOf(d.Name2) * cellSize;
            //return yScale(d.Name2);
        })
        .attr("class", function(d){return "cell cell-border x" + xElementsArray.indexOf(d.Name1) + " y" + yElementsArray.indexOf(d.Name2)})
        .on("mouseover", function (d) {
            d3.select(this).classed("cell-hover",true);
            d3.selectAll(".xLabel").classed("text-highlight",function(r){ return r==d.Name1;});
            d3.selectAll(".yLabel").classed("text-highlight",function(c){ return c==d.Name2;});
            tip.show(d)
        })
        .on("mouseout", function (d) {
            d3.select(this).classed("cell-hover",false);
            d3.selectAll(".xLabel").classed("text-highlight",false);
            d3.selectAll(".yLabel").classed("text-highlight",false);
            tip.hide(d);
        });
    cells.exit().remove();
    cells.transition()
        .attr("fill", function (d) {
            return colorScale(d.Volume);
        });

    /*svg.append("g")
        .attr("class", "x axis")
        .call(xAxis)
        .selectAll("text")
        .attr("font-weight", "normal")
        .attr("transform", "rotate(-90)")
        .attr("dx", ".8em")
        .attr("dy", "1.2em")
        .style("text-anchor", "start");*/
    var xLabels = svg.append("g")
            .selectAll(".xLabelg")
            .data(xElementsArray)
            .enter()
            .append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * cellSize; })
            .attr("font-weight", "normal")
            .style("text-anchor", "start")
            .attr("transform", "translate("+cellSize/2 + ",-6) rotate (-90)")
            .attr("dx", ".4em")
            .attr("dy", ".3em")
            .attr("class", function (d,i) { return "xLabel mono r"+i;} )
            .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
            .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);});

    /*svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll("text")
        .attr("font-weight", "normal");*/
    var yLabels = svg.append("g")
        .selectAll(".yLabelg")
        .data(yElementsArray)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return i * cellSize; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + cellSize / 2 + ")")
        .attr("dy", ".3em")
        .attr("class", function (d,i) { return "yLabel mono r"+i;} )
        .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
        .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);});

    legendBar(colorScale);
}

function legendBar(colorScale) {
    var legend = svg.selectAll(".legend").data([0].concat(colorScale.quantiles()), function (d) {
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

function changeName(data) {
    data.forEach(function (d) {
        d.name1 = nameTrans(d.name1);
        d.name2 = nameTrans(d.name2);
    });
    return data;
}

function nameTrans(name) {
    var name1 = name.substr(0, name.indexOf('@'));
    var name1First = name1.substr(0, name1.indexOf('.'));
    name1First = name1First.charAt(0).toUpperCase() + name1First.slice(1);
    var name1Last = name1.substr(name1.indexOf('.') + 1);
    name1Last = name1Last.charAt(0).toUpperCase() + name1Last.slice(1);
    return name1First + " " + name1Last;
}




