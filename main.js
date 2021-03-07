/*
uname & pwd: HelloWorld321
Source: https://rapidapi.com/Gramzivi/api/covid-19-data/endpoints
Secret-Key: f937845ee4msh47f965e7cb84a7bp18b3a9jsn57f01b71a7ee
*/
const data = null;

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
	if (this.readyState === this.DONE) {
		console.log(this.responseText);
	}
});

xhr.open("GET", "https://covid-19-data.p.rapidapi.com/totals");
xhr.setRequestHeader("x-rapidapi-key", "f937845ee4msh47f965e7cb84a7bp18b3a9jsn57f01b71a7ee");
xhr.setRequestHeader("x-rapidapi-host", "covid-19-data.p.rapidapi.com");

xhr.send(data);

xhr.onload = () => {
  console.log(xhr);

  let info = JSON.parse(xhr.response);
  page_update(info);

  if (xhr.status === 200) {
    console.log(info);
  } else {
    console.log(`error ${xhr.status} ${xhr.statusText}`)
  }
}

function page_update(info) {
  let tag = document.getElementById('cases');
  let confimed = info[0].confirmed;
  let dead = info[0].deaths;
  let cases = '';
  let death = '';

  if (confimed > 1000000) {
    confimed = confimed / 1000000;
    cases = 'M'
  } else if (1000 < confimed && confimed < 1000000) {
    confimed = confimed / 1000;
    cases = 'K';
  }

  if (dead > 1000000) {
    dead = dead / 1000000;
    death = 'M';
  } else if (1000 < dead && dead < 1000000) {
    dead = dead / 1000;
    death = 'K';
  }

  tag.innerHTML = `World Wide Cases: ${confimed.toFixed(1)}${cases}<br>World Wide Deaths: ${dead.toFixed(1)}${death}`;
  console.log(confimed)
}

function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}