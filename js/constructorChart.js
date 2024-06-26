let driverChart;

class ConstructorChart {
  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    // Configuration object with defaults
    this.config = {
      parentElement: _config.parentElement,
      margin: _config.margin || { top: 40, right: 10, bottom: 60, left: 60 },
      containerWidth: _config.containerWidth || 960,
      containerHeight: _config.containerHeight || 500,
      tooltipPadding: _config.tooltipPadding || 15,
    };

    //this.dispatcher = _dispatcher;
    this.data = _data;
    this.initVis();
  }

  /**
   * Initialize scales/axes and append static elements, such as axis titles
   */
  initVis() {
    let vis = this;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    // Initialize scales

    // // creating the color scale
    // vis.colorScale = this.config.colorScale;

    //x and y scale
    vis.xScale = d3.scaleBand().range([0, vis.width]).paddingInner(0.05);

    vis.yScale = d3.scaleLinear().range([vis.height, 0]);

    // defining axes
    vis.xAxis = d3.axisBottom(vis.xScale).tickSizeOuter(0);
    vis.yAxis = d3.axisLeft(vis.yScale).tickSizeOuter(0);

    // Define size of SVG drawing area
    vis.svg = d3
      .select(vis.config.parentElement)
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    // SVG Group containing the actual chart; D3 margin convention
    vis.chart = vis.svg
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left},${vis.config.margin.top})`
      );

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0,${vis.height})`);

    // Append y-axis group
    vis.yAxisG = vis.chart.append("g").attr("class", "axis y-axis");
  }

  /**
   * Prepare data and scales before we render it
   */
  updateVis() {
    let vis = this;

    const rankType = d3.select("#ranking-type").property("value");

    vis.data = vis.data.sort((a, b) => b[rankType] - a[rankType]);

    // Specify accessor functions
    vis.colorValue = (d) => d[rankType];
    vis.xValue = (d) => d.name;
    vis.yValue = (d) => d[rankType];

    // Set the scale input domains
    vis.xScale.domain(vis.data.map(vis.xValue));
    vis.yScale.domain([0, d3.max(vis.data, vis.yValue)]);

    vis.renderVis(rankType);
  }

  filterData(teamName) {
    d3.csv("data/racexpole.csv")
      .then((csv) => {
        data = csv;

        //converting to numerics
        data.forEach(function (d) {
          d.racexgrid = +d.racexgrid;
          d.race_poles = +d.race_poles;
          d.grid_poles = +d.grid_poles;
        });

        data = data.filter((d) => d.name === teamName);

        //sorting by constructor points
        data = data.sort((a, b) => b.points - a.points);

        d3.select("#driver-chart-area").selectAll("*").remove();
        //console.log(data.slice(0,10))

        data = data.slice(0, 7); // TEMPORARY!!!

        //console.log(top10data)

        // creating the color scale
        const colorScale = d3
          .scaleLinear()
          .domain([data[0].racexgrid, 0]) //MAY NEED CHANGE
          .range(["#8E3C06", "#C98703"]); //colors pass WebAIM

        // Draw the visualization for the first time
        driverChart = new DriverChart(
          { parentElement: "#driver-chart-area", colorScale: colorScale },
          data
        );

        const numberOfDrivers = data.length;
        d3.select("#driverTitle").text(
          `Top ${numberOfDrivers} Drivers of ${teamName}`
        );

        driverChart.updateVis();
      })

      .catch((error) => {
        console.log("Error loading the data");
        console.log(error);
      });
  }

  /**
   * Bind data to visual elements
   */
  renderVis(rankType) {
    let vis = this;
    // console.log(rankType);
    // console.log(vis.data[0][rankType]);

    vis.chart.selectAll(".bar").remove();
    vis.svg.selectAll(".axis-title").remove();

    // Append axis title
    vis.svg
      .append("text")
      .attr("class", "axis-title")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", ".71em")
      .text(`${rankType}`);

    // creating the color scale
    vis.colorScale = d3
      .scaleLinear()
      .domain([vis.data[0][rankType], 0])
      .range(["#8E3C06", "#C98703"]); //colors pass WebAIM

    // Add rectangles
    vis.bars = vis.chart
      .selectAll(".bar")
      .data(vis.data) //binding data to rectangles
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => vis.xScale(d.name)) // Set x position based on data"s key using x-scale
      .attr("y", (d) => vis.yScale(d[rankType])) // Set y position based on count using y-scale
      .attr("width", vis.xScale.bandwidth()) // Set bar width based on band scale
      .attr("height", (d) => vis.height - vis.yScale(d[rankType]))
      .attr("fill", (d) => vis.colorScale(d[rankType]))

      .on("mouseover", (event, d) => {
        d3
          .select("#tooltip")
          .style("display", "block")
          .style("left", event.pageX + vis.config.tooltipPadding + "px")
          .style("top", event.pageY + vis.config.tooltipPadding + "px").html(`
                <div class="tooltip-title">${d.name}</div>
                <div><i>1950-2023</i></div>
                <ul>
                  <li>Total Points: ${d.points}</li>
                  <li>Total Wins: ${d.wins}</li>
                </ul>
              `);
      })

      // Tooltip event listeners
      .on("mouseleave", () => {
        d3.select("#tooltip").style("display", "none");
      })
      
      //to render driver chart on click
      .on("click", (event, d) => {
        d3.select("#driverChart")
          .style("display", "block")
          .call(this.filterData(d.name));
      });

    // Update axes
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
  }
}
