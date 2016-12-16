var heatmapMargin = {top: 120, right: 120, bottom: 120, left: 120};
var heatmapOuterWidth = 860;
var heatmapOuterHeight = 760;
var heatmapWeight = heatmapOuterWidth - heatmapMargin.right - heatmapMargin.left;
var heatmapHeight = heatmapOuterHeight - heatmapMargin.top - heatmapMargin.bottom;
var monthSelected = 1;
var heatmapItemSize = 13;
var heatmapCellSize = heatmapItemSize - 1;
var legendElementSize = 60;
var lengendElementY = heatmapHeight;
var colors = colorbrewer.Blues[9];
var colorScale = d3.scale.quantile().range(colors).domain([0, 9, 167]);

var originData = [];
var datasets = ["P2PJan.json", "https://rawgit.com/bw1332/VisualizationProj/master/source/fii.json"];
var datasetPicker = d3.select("#dataset-picker").selectAll(".dataset-button").data(datasets);

var heatmapSvg = d3.select(".heatmap").append("svg")
    .attr("width", heatmapOuterWidth)
    .attr("height", heatmapOuterHeight)
    .append("g")
    .attr("transform", "translate(" + heatmapMargin.left + "," + heatmapMargin.top + ")");

var tip = d3.tip().attr("class", "d3-tip").html(function (d) {
    //return "<div><span style='color:red'>Volume:</span><span> " + d.Volume + "</span></div>";
    return "<div><span style='color:red'>NameX:</span><span> " + d.Name1 + "</span></div>" +
        "<div><span style='color:red'>NameY:</span><span> " + d.Name2 + "</span></div>" +
        "<div><span style='color:red'>Volume:</span><span> " + d.Volume + "</span></div>";
});
heatmapSvg.call(tip);

generateHeatmapChart(datasets[1]);

datasetPicker.enter()
    .append("input")
    .attr("value", function(d){ return "Dataset " + d })
    .attr("type", "button")
    .attr("class", "dataset-button")
    .on("click", function(d) {
        generateHeatmapChart(d);
    });

function generateHeatmapChart(jsonFile) {
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
    /*var result1 = result.filter(function (d) {
        return d.month == monthSelected;
    });*/
    /*result1.forEach(function (d) {
        d.name1 = nameTrans(d.name1);
        d.name2 = nameTrans(d.name2);
    });*/
    var result1 = getMonthSource(result, monthSelected);
    //console.log(result1[0]);
    var data = result1.map(function (d) {
        var dataset = [];
        dataset.Name1 = d.from;
        dataset.Name2 = d.to;
        dataset.Volume = d.num;
        //dataset.Month = d.month;
        return dataset;
    });
    createHeatmap(data, originData);
}

function createHeatmap(data, data1) {
    /*var xElementsArray = d3.set(data.map(function (d) {
        return cutEmail(d.Name1);
    })).values();*/
    var xElementsArray = findEmailList(data1);
    /*console.log(xElementsArray.indexOf(data[0].Name1));
    console.log(data[0].Name1);*/
    /*xElementsArray.forEach(function (d) {
        console.log(xElementsArray.indexOf(d));
    });*/
    var yElementsArray = xElementsArray;
   /*var yElementsArray = d3.set(data.map(function (d) {
        return cutEmail(d.Name2);
    })).values();*/

    var xScale = d3.scale.ordinal().domain(xElementsArray).rangeBands([0, xElementsArray.length * heatmapItemSize]);
    var yScale = d3.scale.ordinal().domain(yElementsArray).rangeBands([0, yElementsArray.length * heatmapItemSize]);

    var xAxis = d3.svg.axis().scale(xScale)
        /*.tickFormat(function (d) {
            return d;
        })*/
        .orient("top");
    var yAxis = d3.svg.axis().scale(yScale)
        /*.tickFormat(function (d) {
            return d;
        })*/
        .orient("left");
    //heatmapSvg.selectAll("rect").remove();
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
        .on("click", tip.show)
        .on("mouseover", function (d) {
            d3.select(this).classed("cell-hover",true);
            d3.selectAll(".xLabel").classed("text-highlight",function(r){ return r==d.Name1;});
            d3.selectAll(".yLabel").classed("text-highlight",function(c){ return c==d.Name2;});
            //tip.show(d)
        })
        .on("mouseout", function (d) {
            d3.select(this).classed("cell-hover",false);
            d3.selectAll(".xLabel").classed("text-highlight",false);
            d3.selectAll(".yLabel").classed("text-highlight",false);
            tip.hide(d);
        });
    cells.exit().remove();
    cells.transition()
        .attr("x", function (d) {
        //return xElementsArray.indexOf(d.Name1) * heatmapCellSize;
        return yScale(d.Name1);
    })
        .attr("y", function (d) {
            //return yElementsArray.indexOf(d.Name2) * heatmapCellSize;
            return yScale(d.Name2);
        })

        .attr("fill", function (d) {
            return colorScale(d.Volume);
        });

    var xLabels = heatmapSvg.append("g")
        .attr("class", "x heatmapAxis")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .attr("dx", ".8em")
        .attr("dy", ".2em")
        .attr("class", function (d,i) { return "xLabel mono x"+ i;} )
        .style("text-anchor", "start")
        .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
        .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);});
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
        .attr("class", function (d,i) { return "yLabel mono y"+ i;} )
        .attr("font-weight", "normal")
        .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
        .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);});
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

    //legendBar(colorScale);
}

function legendBar(colorScale) {
    var legend = heatmapSvg.selectAll(".legend").data([0].concat(colorScale.quantiles()), function (d) {
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

/*function changeName(data) {
    data.forEach(function (d) {
        d.name1 = nameTrans(d.name1);
        d.name2 = nameTrans(d.name2);
    });
    return data;
}*/

function nameTrans(name) {
    var name1 = name.substr(0, name.indexOf('@'));
    var name1First = name1.substr(0, name1.indexOf('.'));
    name1First = name1First.charAt(0).toUpperCase() + name1First.slice(1);
    var name1Last = name1.substr(name1.indexOf('.') + 1);
    name1Last = name1Last.charAt(0).toUpperCase() + name1Last.slice(1);
    return name1First + " " + name1Last;
}

function getMonthSource(jsonData, mon){
    var month = 0;
    if (typeof mon === 'string'){
        month = parseInt(mon);
    } else{
        month = mon;
    }
    if (month > 0 && month < 13) {
        return jsonData[month];
    }
}

// obj is array of json, attrs is array of selected attributes(string)
// return a new array of json
function getJsonArrWith(objs, attrs){
    return objs.map(function(obj){
        var one = {};
        attrs.map(function(attr){
            one[attr] = obj[attr];
        });
        return one;
    })
}

// data is json obj from _SOURCE
// return an arr of{"mon":"vol"}
function getMonthAndAmount(data){
    var res = new Array();
    for (var i = 1; i <= 12; i++) {
        var one = new Object();
        one.month = i;
        var sum = 0;
        data[i].map( function(e){
            sum = sum + parseInt(e["num"]);
        });
        one.vol = parseInt(sum);
        res.push(one);
    }
    return res;
}

// objs is an array of json objs for given month
// this function usually uses getMonthSource() as input
// return [{from,to, num}];
function getHeatMapDataFromTo(objs){
    return getJsonArrWith(objs, ["from","to","num"]);
}

// objs is an array of json objs for given month
// this function usually uses getMonthSource() as input
// return [{from,to,num}] but in from to have same meanning in this case, num is the total num of sending and reveiving
function getHeatMapDataTotal(objs){
    var fromToList = getHeatMapDataFromTo(objs);
    fromToList.map(function(one){
        fromToList.map(function(other){
            if (one.from == other.to && one.to == other.from) {
                one.num = one.num + other.num;
            }
        });
    });
    return fromToList;
}

// from _SOURCE
// return a array of email sorted by total nums
function findEmailList(data){
    var all = new Object();
    for (var i = 1; i <= 12; i++) {
        data[i].map(function(e){
            var to = e.to;
            var from = e.from;
            if (all.hasOwnProperty(to)){
                var num = all[to];
                num = parseInt(num) + 1;
                all[to] = num;
            } else {
                all[to] = 1;
            }
            if (all.hasOwnProperty(from)){
                var num = all[from];
                num = parseInt(num) + 1;
                all[from] = num;
            } else {
                all[from] = 1;
            }
        });
    }
    var list = [];
    for (var att in all) {
        list.push([att,all[att]]);
    }
    list.sort(function(a, b){
        return (b[1]) - (a[1]);
    });

    var res = [];
    list.map(function(x){
        res.push(x[0]);
    });
    return res;
}

// data is array from given month data, from email to email
//
function getBarData(data, from, to){
    var res = [];
    data.map(function(o){
        if (o.from == from && o.to == to){
            for (var i = 0; i < o.topics.length; i++) {
                var one = new Object();
                one.topic = o.topics[i];
                one.times = o.times[i];
                res.push(one);
            }
        }
    });
    return res;
}

// input email addr
// return the name
function cutEmail(email){
    var end = email.indexOf("@");
    if (end > 0) {
        return email.substring(0,end).replace("."," ");
    }
    return  email;
}

