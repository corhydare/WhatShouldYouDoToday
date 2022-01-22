// personal key goes into api constant

const api = "871b1ca27dfbb558cfcae80665059258";

const iconImg = document.getElementById("weather-icon");
const loc = document.querySelector("#location");
const tempC = document.querySelector(".c");
const desc = document.querySelector(".weatherDescription");
const uviT = document.querySelector(".uvi");

window.addEventListener("load", () => {
  let long;
  let lat;
  // Accesing Geolocation of User
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      // Storing Longitude and Latitude in variables
      long = position.coords.longitude;
      lat = position.coords.latitude;
      const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}&units=metric`;
      const uviD = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,daily&appid=${api}`;

      // Using fetch to get data
      fetch(uviD)
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((data) => {
          const { uvi } = data.current;
          uviT.textContent = `UV index: ${uvi}`;
        });

      fetch(base)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const { temp } = data.main;
          const place = data.name;
          const { description, icon } = data.weather[0];
          const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;

          // Interacting with DOM to show data
          iconImg.src = iconUrl;
          loc.textContent = `${place}`;
          desc.textContent = `${description}`;
          tempC.textContent = `${temp.toFixed(2)} °C`;
        });
    });
  }
});
