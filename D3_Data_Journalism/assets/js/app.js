// @TODO: YOUR CODE HERE!
var svgWidth = 1100;
var svgHeight = 800;

var margin = {
  top: 100,
  right: 40,
  bottom: 150,
  left: 60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(journoData) {

  // Step 1: Parse Data/Cast as numbers
    // ==============================
    journoData.forEach(function(data) {
      data.income = +data.income;
      data.healthcare = +data.healthcare;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([35000, d3.max(journoData, d => d.income)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(journoData, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(journoData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "yellow")
    .attr("opacity", ".8")
    .style("stroke", "black")
    .attr("stroke-width", "2");
    
    var circleText = chartGroup.append("text")
    .style("text-anchor", "middle")
    .selectAll("tspan")
    .data(journoData)    
    .enter()
    .append("tspan")
      .text(d => d.abbr)
      .attr("x", d => xLinearScale(d.income))
      .attr("y", d => yLinearScale(d.healthcare)+4);

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([90.5, -60])
      .style("background-color", "aqua")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .html(function(d) {
        return (`${d.state}<br>Income: $${d.income} <br>People with Healthcare: ${d.healthcare}%`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("People with Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
      .attr("class", "axisText")
      .text("Income ($)");

      chartGroup.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "24px") 
      .style("text-decoration", "underline")  
      .text("Average Income and Percentage of People With Healthcare in Each State");

  }).catch(function(error) {
    console.log(error);
  });

