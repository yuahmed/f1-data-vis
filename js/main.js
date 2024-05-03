let constructorChart;

// Loading data CSV file
d3.csv("data/constructor_data.csv")
  .then((csv) => {
    data = csv;

    //converting to numerics
    data.forEach(function (d) {
      d.points = +d.points;
      d.wins = +d.wins;
    });

    //sorting by constructor points
    data = data.sort((a, b) => b.points - a.points);

    //console.log(data.slice(0,10))

    top10data = data.slice(0, 10);

    //console.log(top10data)

    // creating the color scale
    const colorScale = d3
      .scaleLinear()
      .domain([top10data[0].points, 0])
      .range(["lightgrey", "black"]);

    // Draw the visualization for the first time
    constructorChart = new ConstructorChart(
      { parentElement: "#const-chart-area", colorScale: colorScale },
      top10data
    );

   constructorChart.updateVis();
  })

  .catch((error) => {
    console.log("Error loading the data");
    console.log(error);
  });


