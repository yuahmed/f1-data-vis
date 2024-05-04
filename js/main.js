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
  console.log(view);
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

var i = 0;
var txt = "Formula 1 (F1) is the top tier of single-seater auto racing, overseen by the Fédération Internationale de l'Automobile (FIA) and owned by the Formula One Group. Since its inception in 1950, the FIA Formula One World Championship has featured a series of races known as Grands Prix, held globally on specialized circuits. The term 'formula' denotes the standardized regulations that all participating cars must adhere to. In addition to teams, known as constructors, upon selecting a constructor, we present another bar chart showcasing the top drivers associated with that constructor. To evaluate drivers' performances, we've developed a ratio comparing their grid pole position (determined by qualifying races) to their race pole position (the final race result). This ratio rewards drivers who effectively navigate from a disadvantaged starting position to achieve a commendable finish, reflecting their overall performance throughout the race.";
var speed = 20;
var pauseDuration = 1000; /* The duration of pause in milliseconds */

function typeWriter() {
  var introductionElement = document.getElementById("introduction");

  if (i < txt.length) {
    introductionElement.innerHTML += txt.charAt(i);
    if (txt.charAt(i) === '.' || txt.charAt(i) === '!') {
      introductionElement.innerHTML += '<br><br>';
      i++;
      setTimeout(typeWriter, pauseDuration); // Pause after each sentence
    } else {
      i++;
      setTimeout(typeWriter, speed);
    }
  }
};

document.addEventListener("DOMContentLoaded", function() {
  typeWriter(); // Call typeWriter() function when the document finishes loading
});

