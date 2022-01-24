// personal key goes into api constant (it will be disabled after the graded project, for security)
const api = "871b1ca27dfbb558cfcae80665059258";

const iconP = document.getElementById("icon-present");
const loc = document.querySelector("#location");
const temps = document.querySelector(".temperature");
const desc = document.querySelector(".weatherDescription");
const uviT = document.querySelector(".uvi");

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
      const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}&units=metric`;
      const uviD = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${api}`;

      // using fetch to get UVI data
      fetch(uviD)
        .then((response) => {
          // log to find uvi data
          console.log(response);
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
          // @2x.png icon is twice the size but it doesn't have shading
          const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;

          // changing text in html doc
          iconP.src = iconUrl;
          loc.textContent = `${place}`;
          // Weather description in words, for possible accessibility
          desc.textContent = `${description}`;
          temps.textContent = `${temp.toFixed(2)} °C`;
        });
    });
  }
});
