function renderbar(data) {
     
	var chartwidth= 500;
    var chartheight = 500;
    d3.select("#bar_svg").remove();
    
    var svg = d3.select("#chart")
    .append("svg")
    .attr("id", "bar_svg")
    .attr("width", chartwidth)
    .attr("height", chartheight);
    
    var max_n = 0;
    for (var d in data) {
        max_n = Math.max(data[d].times, max_n);
    }
	
//    console.log(chartwidth);
//    console.log(max_n);
//    console.log(chartheight);
//    console.log(data.length);
    
    var dx = (chartwidth - 250) / max_n;
    
    var dy = 40;

    // bars
    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
//        .attr("class", function(d, i) {return "bar " + d.topic;})
        .attr("x", function(d, i) {return 0;})
        .attr("y", function(d, i) {return (dy+5)*i;})
        .attr("width", 0)
        .attr("height", dy)
        .transition().duration(1000)
        .attr("width", function(d, i) {return dx*d.times})
        .attr("fill", "lightblue");

    // labels
    var text = svg.selectAll(".text1")
        .data(data)
        .enter()
        .append("text")
        .attr("class", function(d, i) {return "label " + d.label;})
        .attr("x", 5)
        .attr("y", function(d, i) {return (dy+5)*i + 25;})
        .text( function(d) {return d.topic;})
        .style("font-size", "15px")
        .style("font-weight", "bold")
        .transition().duration(500);
//});
    var text1 = svg.selectAll(".text2")
        .data(data)
        .enter()
        .append("text")
//        .attr("class", function(d, i) {return "label " + d.label;})
        .attr("x", 350)
        .attr("y", function(d, i) {return (dy+5)*i + 25;})
        .text( function(d) {return d.times;})
        .style({"font-size": "15px", "fill":"#777"})
        .style("font-weight", "bold");
}

function setAll (month, x_from, x_to) {
//        console.log(x_from);
//        console.log(x_to);
        d3.json ("https://raw.githubusercontent.com/bw1332/VisualizationProj/master/source/fii.json", function(error, result) {
        //renderbar(getBarData(getMonthSource(result,1), "sara.shackleton@enron.com", "susan.bailey@enron.com"));});
        data = getMonthSource(result,month);
        data1 = getBarData(data, x_from, x_to );
        data1.sort(function(a,b){
                   if(a.times>b.times){return -1;}
                    if (a.times<b.times){return 1;}
                    return 0;
                   });
        renderbar(data1);
            d3.selectAll("circle").attr("r",5)
        d3.selectAll("circle").filter(function(d){return d3.select(this).attr("class")==+month}).attr("r",7);
        });    
    }

function setAllMonth(newMonth) {
    month = newMonth;
    setMonth(month);
//    console.log(x_from);
//    console.log(x_to);
    setAll(month, x_from, x_to);
}

//set default month
var month = 1;
setAll(month, x_from, x_to);
setMonth(1);
//setAllMonth(1);