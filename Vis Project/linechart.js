// Create parameters
        var chartwidth = 600;
        var chartheight = 200;
        var margin = { top: 20, left: 50, right: 20, bottom: 20};
        var innerWidth = chartwidth - margin.left - margin.right;
        var innerHeight = chartheight - margin.top - margin.bottom;
    
    // Global parameters
        var chart = d3.select("#linechart");
        var xAxisGroup = chart.append("g")
            .attr("transform", "translate(0," + (innerHeight + margin.top) + ")");
        var yAxisGroup = chart.append("g")
            .attr("transform", "translate(" + margin.left + ",0)");
        var dot = chart.append("g");
        var dot1 = chart.append("g");
    
    function draw_line(data, data1) {
        chart
            .attr("width", chartwidth)
            .attr("height", chartheight);
        
        // Create scale and domain
        var xScale = d3.scale.linear()
                .range([margin.left, innerWidth + margin.right])
                .domain([1, 12]);
        
        var yScale = d3.scale.linear()
                .range([innerHeight + margin.bottom, margin.bottom])
                .domain([0, 13.5]);
        
        // define Axis
        var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");
  
        var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");
        
        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);
        
        // add text for xAxis
        
        chart.append("text")
            .attr("transform", "translate(" + (innerWidth - 10) + "," + (innerHeight + 5) + ")")
            .style("text-anchor", "right")
            .text("Month");
        
        // add text for yAxis
        chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", margin.left)
            .attr("x", -40)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Volume");
        
        // draw lines
        var lines = d3.svg.line()
                .x(function (d) { return xScale(d.month) ; })
                .y(function (d) { return yScale(d.volume / 48.0) ; });
        
        chart.append("path")
            .attr("d", lines(data1))
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("fill", "none");
        
        chart.append("path")
            .attr("d", lines(data))
            .attr("stroke", "pink")
            .attr("stroke-width", 2)
            .attr("fill", "none");
        
        // draw dots
        var dataPoints = dot1.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("r", 5)
                .attr("cx", function (d) {return xScale(d.month); })
                .attr("cy", function (d) {return yScale(d.volume / 48.0); })
                .attr("fill", "pink")
                .attr("opacity", 0.8)
                .on('mouseenter', function(d, i) {
                    d3.select(this).style({stroke: "black"});
                    d3.select("#tooltip1").style({
                        visibility:"visible",
                        top: d3.event.clientY,
                        left: d3.event.clientX
                    }).text("volume: " + d.volume + " month: " + d.month)
                })
                .on('mouseleave', function(d, i) {
                    d3.select(this).style({stroke: undefined});
                    d3.select("#tooltip1").style({
                        visibility: "hidden"
                    })
                })
        
        var dataPoints1 = dot.selectAll("circle")
                .data(data1)
                .enter()
                .append("circle")
                .attr("r",5)
                .attr("cx",function(d){return xScale(d.month)})
                .attr("cy",function(d){return yScale(d.volume / 48.0)})
                .attr("fill","blue")
                .attr("opacity", 0.8)
                .on('mouseenter', function(d, i) {
                    d3.select(this).style({stroke: "black"});
                    d3.select("#tooltip1").style({
                        visibility:"visible",
                        top: d3.event.clientY,
                        left: d3.event.clientX
                    }).text("volume: " + d.volume + " month: " + d.month)
                })
                .on('mouseleave', function(d, i) {
                    d3.select(this).style({stroke: undefined});
                    d3.select("#tooltip1").style({
                        visibility:"hidden"
                    })
                })
        

    }
    
    //draw line chart!!
    d3.json("volume.json",function(error,result){
            data = result;
            d3.json("volume1.json",function(error,result){
            data1 = result;
            draw_line(data,data1);})
    
        })