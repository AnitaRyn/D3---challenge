// set up the chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

//canvas size
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//create an SVG wrapper,append an SVG group that will hold the chart,and shift the latter by left and top margins
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
//import data
d3.csv("data.csv").then(function(healthData){

//parse data to integer
    healthData.forEach(function(data) {
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
    });

// create scale fuctions
    //x scale
    var xLinearScale = d3.scaleLinear()
    .domain([5,d3.max(healthData, data=>data.poverty),])
    .range([0,width])
    
    //y scale
    var yLinearScale = d3.scaleLinear()
    .domain([0,d3.max(healthData, data=>data.obesity)])
    .range([height,0])

    //create axis functions 
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

// Append the axes to the chartGroup
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis);

//Create data points/ circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", data=> xLinearScale(data.poverty))
        .attr("cy", data=> yLinearScale(data.obesity))
        .attr("r", 10)
        .attr("fill", "#69b3a2");

//initialize tooltip
    var tooltip = d3.tip()
        .attr("class","tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .offset([80,-70])
        .html(function(data){
            return (`${data.state}<br>Poverty: ${data.poverty}<br>Obesity: ${data.obesity}`);
      });
  
//create tooltip chart
    chartGroup.call(tooltip);
  
//create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
        tooltip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          tooltip.hide(data);
    
        });       
//Create x label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .attr("data-axis-name","poverty")
        .text("Poverty");

//Create y label
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .attr("data-axis-name","obesity")
        .classed("axis-text", true)
        .text("Obesity");
    }) .catch(function(error) {
    console.log(error);
});