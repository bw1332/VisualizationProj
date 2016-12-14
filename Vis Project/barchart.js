d3.json("bars.json", function(json) {
	var chartwidth= 500;
    var chartheight = 600;
    
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
    
    var dx = (chartwidth -300) / max_n;
    
    var dy = chartheight / data.length;

    // bars
    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", function(d, i) {return "bar " + d.name;})
        .attr("x", function(d, i) {return 0;})
        .attr("y", function(d, i) {return (dy+5)*i;})
        .attr("width", function(d, i) {return dx*d.volume})
        .attr("height", dy)
        .attr("fill", "lightgreen");

    // labels
    var text = svg.selectAll(".text1")
        .data(data)
        .enter()
        .append("text")
//        .attr("class", function(d, i) {return "label " + d.label;})
        .attr("x", 5)
        .attr("y", function(d, i) {return (dy+5)*i + 20;})
        .text( function(d) {return d.name;})
        .style("font-size", "15px")
        .style("font-weight", "bold");
//});
    var text1 = svg.selectAll(".text2")
        .data(data)
        .enter()
        .append("text")
//        .attr("class", function(d, i) {return "label " + d.label;})
        .attr("x", 400)
        .attr("y", function(d, i) {return (dy+5)*i + 20;})
        .text( function(d) {return d.volume;})
        .style({"font-size": "15px", "fill":"#777"})
        .style("font-weight", "bold");
                });