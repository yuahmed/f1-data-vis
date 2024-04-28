/* javascript */

// setting up SVG drawing area

var margin = { top: 40, right: 10, bottom: 60, left: 60 };

var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var svg = d3
  .select("#const-chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left} , ${margin.top})`);

// Scales
var x = d3
  .scaleBand()
  .range([0, width - margin.right - margin.left])
  .paddingInner(0.05);

var y = d3.scaleLinear().range([height, 0]);

// Initialize data
loadData();

// initializing data
var data;

// defining axes
var xAxis = d3.axisBottom(x).tickSizeOuter(0);
var yAxis = d3.axisLeft(y).tickSizeOuter(0);

svg
  .append("g")
  .attr("class", "x-axis axis")
  .attr("transform", `translate(0, ${height})`);
svg.append("g").attr("class", "y-axis axis");

// Load CSV file
function loadData() {
  d3.csv("data/constructor_data.csv")
    .then((csv) => {
      //converting to numerics
      csv.forEach(function (d) {
        d.points = +d.points;
        d.wins = +d.wins;
      });

      //sorting by constructor points
      data = csv.sort((a, b) => b.points - a.points);

      //console.log(data.slice(0,10))

      data = data.slice(0, 10);

      // Draw the visualization for the first time
      updateVisualization();
    })
    .catch((error) => {
      console.log("Error loading the data");
    });
}

// Render visualization
function updateVisualization() {
  console.log("The dataset:", data);

  //get selected ranking type
  // const points = d3.select("#points").property("value");

  //setting domains
  x.domain(data.map((d) => d.name));
  console.log(data.map((d) => d.name));
  y.domain([0, data[0].points]); //data is sorted in descending, points of first ele are max

  // creating axis
  svg.select(".x-axis").call(xAxis);
  svg.select(".y-axis").call(yAxis);

  //creating bars for bar chart
  const bars = svg.selectAll(".bar").data(data, (d) => d.name);

  // making rectangles for bar chart
  bars
    .join("rect")
    .attr("class", "bar")
    .attr("fill", "steelblue")
    .attr("x", (d) => x(d.name))
    .attr("y", (d) => y(d.points))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.points));
}
