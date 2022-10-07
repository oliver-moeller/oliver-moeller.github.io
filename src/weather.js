loadWeatherData();

/////

async function loadWeatherData(refreshLocation = false) {
  getLocation(refreshLocation)
    .then(({ name, latitude, longitude, currentLatitude, currentLongitude }) => {
      let e = document.getElementById("top-bar");
      e.classList.add("animate-gradient-slide");

      document.getElementById("location-name").innerHTML = name;
      document.getElementById("coordinates").innerHTML =
        currentLatitude == undefined
          ? ""
          : parseFloat(currentLatitude).toFixed(2) + ", " + parseFloat(currentLongitude).toFixed(2);
      getWeatherData(latitude, longitude).then(res => {
        document.getElementById("timestamp").innerHTML = new Date().toLocaleString();
        displayWeatherData(res);
        e.classList.remove("animate-gradient-slide");
      });
    })
    .catch(() => {
      document.getElementById("search-item-current-location").disabled = true; // TODO: button is not disabled on reload (remember decision and block location)
      displaySearch();
    });
}

async function getWeatherData(latitude, longitude) {
  let date = new Date();
  date.setMinutes(0, 0, 0); // start with last full hour
  date = date.toISOString();

  let lastDate = new Date();
  lastDate.setDate(lastDate.getDate() + 10);
  lastDate = lastDate.toISOString();

  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // TODO: use `https://api.brightsky.dev/current_weather?lat=${latitude}&lon=${longitude}&tz=${timeZone}` for current weather, set start-date to next hour
  // TODO: error handling
  return fetch(
    `https://api.brightsky.dev/weather?date=${date}&last_date=${lastDate}&lat=${latitude}&lon=${longitude}&tz=${timeZone}`
    //"/temp/weatherData.json"
  ).then(res => {
    return res.json();
  });
}

async function displayWeatherData(weatherData) {
  const dateFormat = new Intl.DateTimeFormat(window.navigator.language, {
    weekday: "short",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  const timeFormat = new Intl.DateTimeFormat(window.navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const weatherNode = document.getElementById("weather-data");
  const templateDay = document.getElementById("template-day");
  const templateNow = document.getElementById("template-now");
  const templateHour = document.getElementById("template-hour");

  weatherNode.innerHTML = "";
  let date = "";
  let lastDate = "";
  let dayNode = {};
  let first = true;

  weatherData.weather.forEach(hour => {
    date = dateFormat.format(new Date(hour.timestamp));
    if (!lastDate || lastDate != date) {
      dayNode = templateDay.content.cloneNode(true);
      dayNode.querySelector("summary > .summary-text").innerHTML = date;
      weatherNode.appendChild(dayNode);
      dayNode = weatherNode.lastElementChild;
      lastDate = date;
    }
    let hourNode = (first ? templateNow : templateHour).content.cloneNode(true);

    hourNode.querySelector("span.time").innerHTML = timeFormat.format(new Date(hour.timestamp));
    hourNode.querySelector("span.icon").innerHTML = iconMappings[hour.icon] || "thermometer";
    hourNode.querySelector("span.temperature").innerHTML = formatNumber(hour.temperature, 1);
    hourNode.querySelector("span.precipitation").innerHTML = formatNumber(hour.precipitation, 1);
    hourNode.querySelector("span.wind-direction").style.transform = "rotate(" + parseInt(hour.wind_direction) + "deg)";
    hourNode.querySelector("span.wind-speed").innerHTML = formatNumber(hour.wind_speed, 1);
    if (first) {
      hourNode.querySelector("span.humidity").innerHTML = formatNumber(hour.relative_humidity, 1);
      hourNode.querySelector("span.pressure").innerHTML = formatNumber(hour.pressure_msl, 1);
      hourNode.querySelector("span.sunshine").innerHTML = formatNumber(hour.sunshine, 0);
      hourNode.querySelector("span.cloud-cover").innerHTML = formatNumber(hour.cloud_cover, 0);
      first = false;
      let e = dayNode.querySelector("details > div ");
      e.insertBefore(hourNode, e.firstChild);
    } else {
      dayNode.querySelector("details > div > .hours").appendChild(hourNode);
    }
  });

  weatherNode.querySelector("details").setAttribute("open", "");
}

function formatNumber(value, decimals) {
  if (value != undefined) {
    return value.toFixed(decimals);
  } else {
    if (decimals) {
      return "-." + "-".repeat(decimals);
    } else {
      return "—";
    }
  }
}

// TODO: unique icons
const iconMappings = {
  "clear-day": "clear_day",
  "clear-night": "clear_night",
  "partly-cloudy-day": "partly_cloudy_day",
  "partly-cloudy-night": "partly_cloudy_night",
  cloudy: "cloudy",
  fog: "foggy",
  wind: "air",
  rain: "rainy",
  sleet: "weather_snowy",
  snow: "weather_snowy",
  hail: "weather_snowy",
  thunderstorm: "thunderstorm",
};
