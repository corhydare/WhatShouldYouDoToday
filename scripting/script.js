// todays date needs to be shown
let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

let fullDate = `${day}-${month}-${year}`;
console.log(fullDate);
// date goes in
const todays = document.getElementById("todays");
todays.textContent = `${fullDate}`;

// personal key goes into api constant (it will be disabled after the graded project, for security)
const api = "871b1ca27dfbb558cfcae80665059258";

// variables for the current weather
const iconP = document.getElementById("icon-present");
const loc = document.querySelector("#location");
const temps = document.querySelector(".temperature");
const desc = document.querySelector(".weatherDescription");
const uviT = document.querySelector(".uvi");
const fiveDays = document.querySelector("#fiveDays");
// asking for your location
window.addEventListener("load", () => {
  let lon;
  let lat;
  // geolocation prompt
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      // storing Longitude and Latitude in variables
      lon = position.coords.longitude;
      lat = position.coords.latitude;
      // normal weather and uv index are in separate api's now
      const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}&units=imperial`;
      const uviD = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${api}`;
      // using fetch to get UVI data
      fetch(uviD)
        .then((response) => {
          // log to find uvi data
          return response.json();
        })
        .then((data) => {
          const { uvi } = data.current;
          uviT.textContent = `UV index: ${uvi}`;
        });
      // ucing fetch to get other weather values
      fetch(base)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const { temp } = data.main;
          const place = data.name;
          const { description, icon } = data.weather[0];
          const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;

          // changing text in html doc
          iconP.src = iconUrl;
          loc.textContent = `${place}`;
          // Weather description in words, for possible accessibility
          desc.textContent = `${description}`;
          temps.textContent = `${temp.toFixed(0)} °F`;
        });
    });
  }
});

$("#notfar").click(function (event) {
  event.preventDefault();
  const selectedCity = $("#city").val();

  var urlFive = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity},us&appid=${api}&cnt=40`;

  fetch(urlFive)
    .then((response) => {
      // log to find uvi data
      console.log(response);
      return response.json();
    })
    .then((data) => {
      const { temp } = data.list;
      const placeF = data.name;
      const { description } = data.weather;

      // changing text in html doc
      fiveDays.textContent = `${placeF} ${description} ${temp.toFixed(0)} °F`;
    });
});

// and now forecast api

// momentary time
function show(data) {
  return (
    "<h2>" +
    data.name +
    moment().format(" (MM/DD/YYYY)") +
    "</h2>" +
    `
      <p><strong>Temperature</strong>: ${data.main.temp} °F</p>
      <p><strong>Humidity</strong>: ${data.main.humidity}%</p>
      <p><strong>Wind Speed</strong>: ${data.wind.speed} MPH</p>
      `
  );
}
// main way to ask for location
function displayCities(storedLocation) {
  $(".townships").empty();
  var list = localStorage.getItem("storedLocation");
  storedLocation = JSON.parse(list);
}

function showForecast(data) {
  console.log(data);
  var forecast = data.list; // [{},{},{}]
  // 40 objects broken down, then we take the mid day time and d
  var currentForecast = [];
  for (var i = 0; i < forecast.length; i++) {
    var currentObject = forecast[i];
    var noonish = currentObject.dt_txt.split(" ")[1];
    if (noonish === "12:00:00") {
      // data to be shown
      var main = currentObject.main;
      var temp = main.temp;
      // not idea why i'm getting errors while still displaying proper data
      var description = currentObject.weather[0].description;
      var date = moment(currentObject.dt_txt).format("l");
      var icon = currentObject.weather[0].icon;
      var iconurl = "https://openweathermap.org/img/w/" + icon + ".png";

      let forecastCard = `
      <div class="col-sm Present">
      <div class="card">
      <div class="card-body fiveDays">
      <p><strong>${date}</strong></p>
      <div><img src=${iconurl} /></div>
      <p>Temp: ${temp} °F</p>
      <p>${description}</p></div>
      </div>
      </div>`;
      currentForecast.push(forecastCard);
    }
  }
  $("#fiveDays").html(currentForecast.join(""));
}

// more fetching for the data

var stored = localStorage.getItem("storedLocation");
if (stored) {
  storedLocation = JSON.parse(stored);
} else {
  storedLocation = [];
}
// when submitting city magic happens
$("#notfar").click(function (event) {
  event.preventDefault();
  var city = $("#city").val();
  // saving city into local storage
  storedLocation.push(city);
  // local storage saves the cities (i can't figure out how to prevent duplicates in the localstorage without extra functions and loops)
  localStorage.setItem("storedLocation", JSON.stringify(storedLocation));
  // prevents overflow and erases the old stuff
  localStorage.clear();
  // magic is in progress
  displayCities(storedLocation);
  if (city != "") {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${api}`
    )
      .then((answering) => {
        return answering.json();
      })
      .then((moreData) => {
        var display = show(moreData);
        $("#sDisplay").html(display);
      });
  }
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&APPID=${api}`
  )
    .then((answering) => {
      return answering.json();
    })
    .then((moreData) => {
      var forecastDisplay = showForecast(moreData);
    });
}),
  displayCities(storedLocation);
