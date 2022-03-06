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
var svg = d3.select(".scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// translate pushes the object along the axes
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//import data
d3.csv("data.csv").then(function(healthData){

//parse data to integer
    healthData.forEach(function(data) {
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
    });

// add x axis
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, data=>data.poverty),d3.max(healthData, data=>data.poverty)])
    .range([0,width])
    svg.append("g")
    .call(d3.axisBottom(xLinearScale));

// Add y axis
    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, data=>data.obesity),d3.max(healthData, data=>data.obesity)])
    .range([height,0])
    svg.append("g")
    .call(d3.axisLeft(yLinearScale));

//Add dots
svg.append('g')
    .selectAll("dot")
    .data(healthData)
    .join("circle")
    .attr("cx", function (data) { return x(data.poverty); } )
    .attr("cy", function (data) { return y(data.obesity); } )
    .attr("r", 2)
    .style("fill", "#69b3a2")


}).catch(function(error) {
    console.log(error);
  });