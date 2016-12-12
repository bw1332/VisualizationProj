d3.json("bars.json", function(json) {
	var chartwidth= 500;
    var chartheight = 500;
    
    var svg = d3.select("#chart")
    .append("svg")
    .attr("width", chartwidth)
    .attr("height", chartheight);
    
    var data = json.items;
	
    var max_n = 0;
    for (var d in data) {
        max_n = Math.max(data[d].volume, max_n);
    }
	
    console.log(chartwidth);
    console.log(max_n);
    console.log(chartheight);
    console.log(data.length);
    
    var dx = chartwidth / max_n;
    
    var dy = chartheight / data.length;

    // bars
    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", function(d, i) {return "bar " + d.name;})
        .attr("x", function(d, i) {return 0;})
        .attr("y", function(d, i) {return dy*i;})
        .attr("width", function(d, i) {return dx*d.volume})
        .attr("height", dy)
        .attr("fill", "lightgreen")
        .style("stroke", "black");

    // labels
    var text = svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", function(d, i) {return "label " + d.label;})
        .attr("x", 5)
        .attr("y", function(d, i) {return dy*i + 15;})
        .text( function(d) {return d.name + "          (" + d.volume  + ")";})
        .attr("font-size", "15px")
        .style("font-weight", "bold");
                });