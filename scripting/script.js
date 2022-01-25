// todays date needs to be shown
let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

let fullDate = `${day}-${month}-${year}`;
console.log(fullDate);
// find a place to put the date in
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

  // function displayCities(cityList) {
  //   $(".townships").empty();
  //   var dataList = localStorage.getItem("cityList");
  //   cityList = JSON.parse(dataList);
  //   // returning as a string, find javascript function to parse cityList
  //   if (dataList) {
  //     for (var i = 0; i < cityList.length; i++) {
  //       var container = $("<div class=card></div>").text(cityList[i]);
  //       $(".townships").prepend(container);
  //     }
  //   }
  // }

  // const stored = localStorage.getItem("cityList");
  // if (stored) {
  //   cityList = JSON.parse(stored);
  // } else {
  //   cityList = [];
  // }
  // //var cityList = [];
  // $("#submitCity").click(function (event) {
  //   event.preventDefault();
  //   const citySeven = $("#city").val();
  //   // push city to cityList array
  //   cityList.push(city);
  //   // set cityList in localStorage (remember to use stringify!)
  //   localStorage.setItem("cityList", JSON.stringify(cityList));
  //   // check length of array. if > 5 then don't add.
  //   displayCities(cityList);
});
