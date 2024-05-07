let constructorChart;

// let driverChart;

let views = {
  intro: document.getElementById("intro"),
  charts: document.getElementById("charts"),
};

if (window.location.hash) {
  displayView(window.location.hash);
} else {
  //default view: intro
  displayView("intro");
}

function displayView(view) {
  //view = view.replace("#", "");

  for (key in views) {
    views[key].style.display = "none";
  }
  // console.log(view);
  views[view].style.display = "block";

  if (view == "charts") {
    createConstructorChart();
  }
}

function createConstructorChart() {
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
        { parentElement: "#const-chart-area" },
        top10data
      );

      constructorChart.updateVis();
    })

    .catch((error) => {
      console.log("Error loading the data");
      console.log(error);
    });
}

function updateSorting() {
  constructorChart.updateVis();
}
