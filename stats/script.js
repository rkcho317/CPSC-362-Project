const nationPoitiveCases = document.querySelector("#nation_positive_cases")
const nationDeaths = document.querySelector("#nation_deaths")
const nationHospitalization = document.querySelector("#nation_hospitalization")
const nationTests = document.querySelector("#nation_total_tests")

const state_stats = document.querySelector("#state-stats")
const state_positive = document.querySelector("#state_positive_cases")
const state_deaths = document.querySelector("#state_deaths")
const state_hospitalized = document.querySelector("#state_hospitalization")
const state_total_tests = document.querySelector("#state_total_tests")

function getCasesTotal() {
    state_stats.style.visibility = "hidden"
    fetch("https://api.covidtracking.com/v1/us/daily.json")
    .then(response => response.json())
    .then(values => {
        nationPoitiveCases.textContent = values[0].positive.toLocaleString()
        nationDeaths.textContent = values[0].death.toLocaleString()
        nationHospitalization.textContent = values[0].hospitalized.toLocaleString()
        nationTests.textContent = values[0].totalTestResults.toLocaleString()
    })

    setSelectOptions()
}

function setSelectOptions() {
    let selectOptions = document.querySelector("select")

    for (key in state_map) {
        let options = document.createElement("option")
        options.text = state_map[key].toString()
        options.value = key.toString()
        selectOptions.append(options)
    }
}

document.addEventListener("DOMContentLoaded", getCasesTotal)

function onChange(selectedChoice){
    var selectedStateName = selectedChoice.options[selectedChoice.selectedIndex].text;  //Gets selected value
    var key = getKeyByValue(state_map, selectedStateName);  //Gets the key for the selected value, only works if all values are unique
    let url = "https://api.covidtracking.com/v1/states/"+key+"/current.json"
    fetch(url)
    .then(response => response.json())
    .then(values => {
        state_positive.textContent = values.positive.toLocaleString()
        state_deaths.textContent = values.death.toLocaleString()
        state_hospitalized.textContent = values.hospitalizedCurrently.toLocaleString()
        state_total_tests.textContent = values.totalTestResults.toLocaleString()
    })
    state_stats.style.visibility = "visible"
}

//Assists the onChange() function
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }
