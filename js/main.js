let constructorChart;

// let driverChart;

// creating the CONSTRUCTOR CHART
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



    // Draw the visualization for the first time
    constructorChart = new ConstructorChart(
      { parentElement: "#const-chart-area"},
      top10data
    );

   constructorChart.updateVis();
  })

  .catch((error) => {
    console.log("Error loading the data");
    console.log(error);
  });

  function updateSorting(){
    constructorChart.updateVis()
  }

// function createDriverChart(teamName){
//   // creating the DRIVER chart
// d3.csv("data/racexpole.csv")
// .then((csv) => {
//   data = csv;

//   //converting to numerics
//   data.forEach(function (d) {
//     d.racexgrid = +d.racexgrid;
//     d.race_poles = +d.race_poles;
//     d.grid_poles = +d.grid_poles
   
//   });

//   data = data.filter((d) => d.name === teamName);

//   //sorting by constructor points
//   data = data.sort((a, b) => b.points - a.points);
 

//   //console.log(data.slice(0,10))

//   data = data.slice(0, 7); // TEMPORARY!!!

//   //console.log(top10data)

//   // creating the color scale
//   const colorScale = d3
//     .scaleLinear()
//     .domain([data[0].racexgrid, 0]) //MAY NEED CHANGE
//     .range(["red", "green"]); //TEMPORARY

//   // Draw the visualization for the first time
//   driverChart = new DriverChart(
//     { parentElement: "#driver-chart-area", colorScale: colorScale },
//     data
//   );

//  driverChart.updateVis();
// })

// .catch((error) => {
//   console.log("Error loading the data");
//   console.log(error);
// });

// }


//createDriverChart('Ferrari');
