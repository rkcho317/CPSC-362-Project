// //Sample code for displaying a line graph
// var GRAPH = new Chart(document.getElementById("line-chart"), {
//   type: 'line',
//   data: {
//     labels: [1500, 1600, 1700, 1750, 1800],
//     datasets: [{
//       data: [86, 114, 106, 106, 107],
//       label: "Africa",
//       borderColor: "#3e95cd",
//       fill: false
//     }, {
//       data: [282, 350, 411, 502, 635],
//       label: "Asia",
//       borderColor: "#8e5ea2",
//       fill: false
//     }, {
//       data: [168, 170, 178, 190, 203],
//       label: "Europe",
//       borderColor: "#3cba9f",
//       fill: false
//     }, {
//       data: [40, 20, 10, 16, 24],
//       label: "Latin America",
//       borderColor: "#e8c3b9",
//       fill: false
//     }, {
//       data: [6, 3, 2, 2, 7],
//       label: "North America",
//       borderColor: "#c45850",
//       fill: false
//     }
//     ]
//   },
//   options: {
//     title: {
//       display: true,
//       text: 'World population per region (in millions)'
//     }
//   }
// });
var GRAPH;
Chart.defaults.global.defaultFontSize = 16;

var USStates = [];

//Navbar on click
function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

//Function that executes when page is finished loading, displays default graph
function PageLoad() {
  //Reset radio buttons
  document.getElementById("radioCases").checked = true;

  $.ajax({
    async: true,
    type: 'GET',
    url: "https://disease.sh/v3/covid-19/historical/USA?lastdays=all",
    success: function (data) {
      //console.log(data.timeline.cases);

      var tempDates = Object.keys(data.timeline.cases);
      var tempCases = Object.values(data.timeline.cases);
      //var tempDeaths = Object.values(data.timeline.deaths);

      var weeklyAverages = [];  //Array of weekly averages
      //var weeklyDeaths = [];  //Array of weekly death averages
      var weeklyAverageDates = []; //Array of weekly average dates, used as labels for x-axis

      var dayCounter = 0; //7 day counter
      var sevenDayTotal = 0;  //Total count for each week, resets every 7 days  
      var changePerDay = 0;

      //var deathsSevenDayTotal = 0;
      //var deathsChangesPerDay = 0;

      for (var i = 1; i < tempCases.length; i++) {
        changePerDay = tempCases[i] - tempCases[i - 1];
        //deathsChangesPerDay = tempDeaths[i] - tempDeaths[i - 1];

        if (dayCounter >= 7) {
          //It is the end of the 7 day week, calculate the average
          //1. Add weekly average and date to respective arrays
          //2. Reset counters
          weeklyAverages.push(Math.ceil(sevenDayTotal / 7));
          weeklyAverageDates.push(tempDates[i - 7]);  //Adds the first date of the 7 day period
          //weeklyDeaths.push(Math.ceil(deathsSevenDayTotal / 7));

          sevenDayTotal = 0;
          //deathsSevenDayTotal = 0;
          dayCounter = 0;
        }
        sevenDayTotal += changePerDay;
        //deathsSevenDayTotal += deathsChangesPerDay;

        ++dayCounter;
      }

      GRAPH = new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
          labels: weeklyAverageDates,
          datasets: [{
            data: weeklyAverages,
            label: "US",
            borderColor: "#cd3e3e",
            fill: false
          }
          // },
          // {
          //   data: weeklyDeaths,
          //   label: "Deaths",
          //   borderColor: "#000000",
          //   fill: false
          // }
          ]
        },
        options: {
          title: {
            display: true,
            text: 'US Covid Cases Weekly Average'
          },
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Number of Cases'
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Week'
              }
            }]
          }
        }
      });
    },
    error: function () {
      console.log("Error: Ajax call failed");
    }
  });

  //Get Array of US states/counties/territories that users can query
  $.ajax({
    async: true,
    type: 'GET',
    url: "https://disease.sh/v3/covid-19/historical/usacounties",
    success: function (data) {
      USStates = Object.values(data);
      //console.log(USStates);

      var selectBox = document.getElementById('USStateSelect');
      for (var i = 0, l = USStates.length; i < l; i++) {
        var option = USStates[i];
        var text = option.toUpperCase();
        selectBox.options.add(new Option(text, option));
      }
    },
    error: function () {
      console.log("Error: Failed to get US states");
    }
  });
}

//This function displays the number of new covid cases per day in USA
//New cases are determined by looking at changes from the previous day
function GetUSACovidCasesPerDay() {

  $.ajax({
    async: true,
    type: 'GET',
    url: "https://disease.sh/v3/covid-19/historical/USA?lastdays=all",
    success: function (data) {
      //console.log(data);


      //callback
      var tempDates = Object.keys(data.timeline.cases);
      var tempCases = Object.values(data.timeline.cases);
      var changesPerDay = [];


      changesPerDay[0] = 0; //First element = 0 because we start with 0 new cases
      for (var i = 1; i < tempCases.length; i++) {
        //Fix outlier data from API
        changesPerDay[i] = tempCases[i] - tempCases[i - 1];
        //console.log(changesPerDay[i]);
        if (changesPerDay[i] > 1000000) {
          changesPerDay[i] = changesPerDay[i - 1];
        }
        //console.log(changesPerDay[i]);

      }
      GRAPH.options.scales.yAxes[0].scaleLabel.labelString = "Number of Cases";

      GRAPH.data.datasets[0].pointRadius = 0;
      GRAPH.data.labels = tempDates;
      GRAPH.data.datasets[0].data = changesPerDay;
      GRAPH.update();

    }
  });

}

//This function displays the number of new covid deaths per day in USA
//New cases are determined by looking at changes from the previous day
function GetUSACovidDeathsPerDay() {

  $.ajax({
    async: true,
    type: 'GET',
    url: "https://disease.sh/v3/covid-19/historical/USA?lastdays=all",
    success: function (data) {
      //console.log(data);


      //callback
      var tempDates = Object.keys(data.timeline.deaths);
      var tempCases = Object.values(data.timeline.deaths);
      var changesPerDay = [];


      changesPerDay[0] = 0; //First element = 0 because we start with 0 new cases
      for (var i = 1; i < tempCases.length; i++) {
        //Fix outlier data from API
        changesPerDay[i] = tempCases[i] - tempCases[i - 1];
        //console.log(changesPerDay[i]);
        if (changesPerDay[i] > 1000000) {
          changesPerDay[i] = changesPerDay[i - 1];
        }
        //console.log(changesPerDay[i]);

      }
      GRAPH.options.title.display = true;
      GRAPH.options.title.text = "US Covid Daily Deaths";
      GRAPH.options.scales.yAxes[0].scaleLabel.labelString = "Number of Deaths";

      GRAPH.data.datasets[0].pointRadius = 0;
      GRAPH.data.labels = tempDates;
      GRAPH.data.datasets[0].data = changesPerDay;
      GRAPH.update();

    }
  });

}

//This function displays the average Covid cases per week in USA
//New cases are determined by looking at changes from the previous day
function GetUSACovidCasesWeeklyAverage() {

  $.ajax({
    async: true,
    type: 'GET',
    url: "https://disease.sh/v3/covid-19/historical/USA?lastdays=all",
    success: function (data) {
      //console.log(data.timeline.cases);


      //callback
      var tempDates = Object.keys(data.timeline.cases);
      var tempCases = Object.values(data.timeline.cases);
      var weeklyAverages = [];  //Array of weekly averages
      var weeklyAverageDates = []; //Array of weekly average dates, used as labels for x-axis
      var dayCounter = 0; //7 day counter
      var sevenDayTotal = 0;  //Total count for each week, resets every 7 days  
      var changePerDay = 0;

      for (var i = 1; i < tempCases.length; i++) {
        //This if statement is used to filter outliers from the dataset (eg. +1,000,000 US covid cases a day)
        // if(tempCases[i] > 1000000){
        //   tempCases[i] = tempCases[i - 1];  //Reuse the previous day's count if it is an outlier
        // }
        changePerDay = tempCases[i] - tempCases[i - 1];
        if (dayCounter >= 7) {
          //It is the end of the 7 day week, calculate the average
          //1. Add weekly average and date to respective arrays
          //2. Reset counters
          weeklyAverages.push(Math.ceil(sevenDayTotal / 7));
          weeklyAverageDates.push(tempDates[i - 7]);  //Adds the first date of the 7 day period
          sevenDayTotal = 0;
          dayCounter = 0;


        }
        sevenDayTotal += changePerDay;
        ++dayCounter;
      }

      //Set Graph Properties
      GRAPH.options.title.display = true;
      GRAPH.options.title.text = "US Covid Cases Weekly Average";
      GRAPH.data.datasets[0].pointRadius = 3;
      GRAPH.data.labels = weeklyAverageDates;
      GRAPH.data.datasets[0].data = weeklyAverages;
      GRAPH.update();

    },
    error: function () {
      console.log("Error: Ajax call failed");
    }
  });

}

//This function displays the average Covid deaths per week in USA
//New cases are determined by looking at changes from the previous day
function GetUSACovidDeathsWeeklyAverage() {

  $.ajax({
    async: true,
    type: 'GET',
    url: "https://disease.sh/v3/covid-19/historical/USA?lastdays=all",
    success: function (data) {
      //console.log(data.timeline.cases);


      //callback
      var tempDates = Object.keys(data.timeline.deaths);
      var tempCases = Object.values(data.timeline.deaths);
      var weeklyAverages = [];  //Array of weekly averages
      var weeklyAverageDates = []; //Array of weekly average dates, used as labels for x-axis
      var dayCounter = 0; //7 day counter
      var sevenDayTotal = 0;  //Total count for each week, resets every 7 days  
      var changePerDay = 0;

      for (var i = 1; i < tempCases.length; i++) {
        //This if statement is used to filter outliers from the dataset (eg. +1,000,000 US covid cases a day)
        // if(tempCases[i] > 1000000){
        //   tempCases[i] = tempCases[i - 1];  //Reuse the previous day's count if it is an outlier
        // }
        changePerDay = tempCases[i] - tempCases[i - 1];
        if (dayCounter >= 7) {
          //It is the end of the 7 day week, calculate the average
          //1. Add weekly average and date to respective arrays
          //2. Reset counters
          weeklyAverages.push(Math.ceil(sevenDayTotal / 7));
          weeklyAverageDates.push(tempDates[i - 7]);  //Adds the first date of the 7 day period
          sevenDayTotal = 0;
          dayCounter = 0;


        }
        sevenDayTotal += changePerDay;
        ++dayCounter;
      }

      //Set Graph Properties
      GRAPH.options.title.display = true;
      GRAPH.options.title.text = "US Covid Deaths Weekly Average";
      GRAPH.data.datasets[0].pointRadius = 3;
      GRAPH.data.labels = weeklyAverageDates;
      GRAPH.data.datasets[0].data = weeklyAverages;
      GRAPH.update();

    },
    error: function () {
      console.log("Error: Ajax call failed");
    }
  });

}

//This function is executed when the user selects a US State to view
//Query the API for the selected state and display the cases
function OnUSStateSelectChange(selectedChoice) {

  if(document.getElementById('radioCases').checked) {
    //Male radio button is checked
    OnCasesClick();
  }else if(document.getElementById('radioDeaths').checked) {
    //Female radio button is checked
    OnDeathsClick();
  }

  // //Check if the user wants to view cases from all states
  // var selectedStateName = selectedChoice.options[selectedChoice.selectedIndex].text;
  // if (selectedStateName == "ALL") {
  //   GetUSACovidCasesWeeklyAverage();
  // }
  // else {
  //   $.ajax({
  //     async: true,
  //     type: 'GET',
  //     url: "https://disease.sh/v3/covid-19/historical/usacounties/" + selectedChoice.value + "?lastdays=all",
  //     success: function (data) {
  //       //console.log(data.length);

  //       var dailyCases = [];
  //       var dates = [];

  //       for (var countyCount = 0; countyCount < data.length; countyCount++) {
  //         var countyData = data[countyCount];
  //         var tempCases = Object.values(countyData.timeline.cases);
  //         //console.log(tempCases);
  //         //Initialize array to 0 on first iteration
  //         if (countyCount == 0) {
  //           dates = Object.keys(countyData.timeline.cases);
  //           for (var i = 0; i < tempCases.length; i++) {
  //             dailyCases[i] = 0;
  //           }
  //         }

  //         for (var i = 0; i < tempCases.length; i++) {
  //           dailyCases[i] = dailyCases[i] + tempCases[i];

  //         }

  //       }

  //       //console.log(dailyCases[dailyCases.length - 1]);
  //       //console.log(dates);

  //       var weeklyAverages = [];  //Array of weekly averages
  //       var weeklyAverageDates = []; //Array of weekly average dates, used as labels for x-axis
  //       var dayCounter = 0; //7 day counter
  //       var sevenDayTotal = 0;  //Total count for each week, resets every 7 days  
  //       var changePerDay = 0;

  //       for (var i = 1; i < dailyCases.length; i++) {
  //         changePerDay = dailyCases[i] - dailyCases[i - 1];
  //         if (dayCounter >= 7) {
  //           weeklyAverages.push(Math.ceil(sevenDayTotal / 7));
  //           weeklyAverageDates.push(dates[i - 7]);  //Adds the first date of the 7 day period
  //           sevenDayTotal = 0;
  //           dayCounter = 0;
  //         }
  //         sevenDayTotal += changePerDay;
  //         ++dayCounter;
  //       }



  //       //Set Graph Properties
  //       GRAPH.options.title.display = true;
  //       GRAPH.options.title.text = selectedStateName + " Covid Cases Weekly Average";
  //       GRAPH.data.datasets[0].pointRadius = 3;
  //       GRAPH.data.datasets[0].label = selectedStateName;
  //       GRAPH.data.labels = weeklyAverageDates;
  //       GRAPH.data.datasets[0].data = weeklyAverages;
  //       GRAPH.update();
  //     },
  //     error: function () {
  //       console.log("Error: Failed to get Covid cases for the selected state");
  //     }
  //   });
  // }

}

//Handles loading modal while waiting for Ajax call to finish
$body = $("body");
$(document).on({
  ajaxStart: function () { $body.addClass("loading"); },
  ajaxStop: function () { $body.removeClass("loading"); }
});

function OnCasesClick() {
  //console.log("OnCasesClicked");

  //Get Selected US state value
  var e = document.getElementById("USStateSelect");
  var selectedChoice = e.options[e.selectedIndex];
  //console.log(selectedChoice);

  //Run Query for selected state
  //Check if the user wants to view cases from all states
  var selectedStateName = selectedChoice.text;
  //console.log(selectedStateName);
  if (selectedStateName == "ALL") {
    GetUSACovidCasesWeeklyAverage();
  }
  else {
    $.ajax({
      async: true,
      type: 'GET',
      url: "https://disease.sh/v3/covid-19/historical/usacounties/" + selectedChoice.value + "?lastdays=all",
      success: function (data) {
        //console.log(data.length);

        var dailyCases = [];
        var dates = [];

        for (var countyCount = 0; countyCount < data.length; countyCount++) {
          var countyData = data[countyCount];
          var tempCases = Object.values(countyData.timeline.cases);
          //console.log(tempCases);
          //Initialize array to 0 on first iteration
          if (countyCount == 0) {
            dates = Object.keys(countyData.timeline.cases);
            for (var i = 0; i < tempCases.length; i++) {
              dailyCases[i] = 0;
            }
          }

          for (var i = 0; i < tempCases.length; i++) {
            dailyCases[i] = dailyCases[i] + tempCases[i];

          }

        }

        //console.log(dailyCases[dailyCases.length - 1]);
        //console.log(dates);

        var weeklyAverages = [];  //Array of weekly averages
        var weeklyAverageDates = []; //Array of weekly average dates, used as labels for x-axis
        var dayCounter = 0; //7 day counter
        var sevenDayTotal = 0;  //Total count for each week, resets every 7 days  
        var changePerDay = 0;

        for (var i = 1; i < dailyCases.length; i++) {
          changePerDay = dailyCases[i] - dailyCases[i - 1];
          if (dayCounter >= 7) {
            weeklyAverages.push(Math.ceil(sevenDayTotal / 7));
            weeklyAverageDates.push(dates[i - 7]);  //Adds the first date of the 7 day period
            sevenDayTotal = 0;
            dayCounter = 0;
          }
          sevenDayTotal += changePerDay;
          ++dayCounter;
        }



        //Set Graph Properties
        GRAPH.options.title.display = true;
        GRAPH.options.title.text = selectedStateName + " Covid Cases Weekly Average";
        GRAPH.options.scales.yAxes[0].scaleLabel.labelString = "Number of Cases";

        GRAPH.data.datasets[0].pointRadius = 3;
        GRAPH.data.datasets[0].label = selectedStateName;
        GRAPH.data.labels = weeklyAverageDates;
        GRAPH.data.datasets[0].data = weeklyAverages;
        GRAPH.update();
      },
      error: function () {
        console.log("Error: Failed to get Covid cases for the selected state");
      }
    });
  }



}

function OnDeathsClick() {
  //console.log("OnDeathsClicked");

 //Get Selected US state value
 var e = document.getElementById("USStateSelect");
 var selectedChoice = e.options[e.selectedIndex];
 //console.log(selectedChoice);

 //Run Query for selected state
 //Check if the user wants to view cases from all states
 var selectedStateName = selectedChoice.text;
 //console.log(selectedStateName);
 if (selectedStateName == "ALL") {
   GetUSACovidDeathsWeeklyAverage();
 }
 else {
   $.ajax({
     async: true,
     type: 'GET',
     url: "https://disease.sh/v3/covid-19/historical/usacounties/" + selectedChoice.value + "?lastdays=all",
     success: function (data) {
       //console.log(data.length);

       var dailyCases = [];
       var dates = [];

       for (var countyCount = 0; countyCount < data.length; countyCount++) {
         var countyData = data[countyCount];
         var tempCases = Object.values(countyData.timeline.deaths);
         //console.log(tempCases);
         //Initialize array to 0 on first iteration
         if (countyCount == 0) {
           dates = Object.keys(countyData.timeline.deaths);
           for (var i = 0; i < tempCases.length; i++) {
             dailyCases[i] = 0;
           }
         }

         for (var i = 0; i < tempCases.length; i++) {
           dailyCases[i] = dailyCases[i] + tempCases[i];

         }

       }

       //console.log(dailyCases[dailyCases.length - 1]);
       //console.log(dates);

       var weeklyAverages = [];  //Array of weekly averages
       var weeklyAverageDates = []; //Array of weekly average dates, used as labels for x-axis
       var dayCounter = 0; //7 day counter
       var sevenDayTotal = 0;  //Total count for each week, resets every 7 days  
       var changePerDay = 0;

       for (var i = 1; i < dailyCases.length; i++) {
         changePerDay = dailyCases[i] - dailyCases[i - 1];
         if (dayCounter >= 7) {
           weeklyAverages.push(Math.ceil(sevenDayTotal / 7));
           weeklyAverageDates.push(dates[i - 7]);  //Adds the first date of the 7 day period
           sevenDayTotal = 0;
           dayCounter = 0;
         }
         sevenDayTotal += changePerDay;
         ++dayCounter;
       }



       //Set Graph Properties
       GRAPH.options.title.display = true;
       GRAPH.options.title.text = selectedStateName + " Covid Deaths Weekly Average";
       GRAPH.options.scales.yAxes[0].scaleLabel.labelString = "Number of Deaths";
       GRAPH.data.datasets[0].pointRadius = 3;
       GRAPH.data.datasets[0].label = selectedStateName;
       GRAPH.data.labels = weeklyAverageDates;
       GRAPH.data.datasets[0].data = weeklyAverages;
       GRAPH.update();
     },
     error: function () {
       console.log("Error: Failed to get Covid cases for the selected state");
     }
   });
 }

}
