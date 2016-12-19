function draw_line(data, data1) {
    // Create parameters
        var chartwidth = 450;
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
        
        xAxisGroup.call(xAxis)
            .attr("class", "lineaxis");
    
        yAxisGroup.call(yAxis)
            .attr("class", "lineaxis");
        
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
                .x(function (d) { return xScale(d.mon) ; })
                .y(function (d) { return yScale(d.vol / 46.0) ; });
        
        chart.append("path")
            .attr("d", lines(data))
            .attr("stroke", "#253494")
            .attr("stroke-width", 2)
            .attr("fill", "none");
        
        chart.append("path")
            .attr("d", lines(data1))
            .attr("stroke", "lightseagreen")
            .attr("stroke-width", 2)
            .attr("fill", "none");
        

        // draw dots
        var dataPoints = dot1.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("class",function (d) {return d.mon; })
                .attr("r", 5)
                .attr("cx", function (d) {return xScale(d.mon); })
                .attr("cy", function (d) {return yScale(d.vol / 46.0); })
                .attr("fill", "#253494")
                .attr("opacity", 0.8)
                .on('mouseenter', function(d, i) {
                    d3.select(this).style({stroke: "black"});
                })
                .on('mouseleave', function(d, i) {
                    d3.select(this).style({stroke: undefined});
                })
        
        var dataPoints1 = dot.selectAll("circle")
                .data(data1)
                .enter()
                .append("circle")
                .attr("class",function (d) {return d.mon; })
                .attr("r",5)
                .attr("cx",function(d){return xScale(d.mon)})
                .attr("cy",function(d){return yScale(d.vol / 46.0)})
                .attr("fill","lightseagreen")
                .attr("opacity", 0.8)
                .on('mouseenter', function(d, i) {
                    d3.select(this).style({stroke: "black"});
                })
                .on('mouseleave', function(d, i) {
                    d3.select(this).style({stroke: undefined});
                })
        

    }
    
    //draw line chart!!
    d3.json("https://raw.githubusercontent.com/bw1332/VisualizationProj/master/source/fii.json",function(error,result){

    draw_line(getMonthAndAmount(result),getMonthAndContasts(result));
    });