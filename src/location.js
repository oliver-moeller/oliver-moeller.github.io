async function getLocation(refresh = false) {
  if ("location" in localStorage && !refresh) {
    return JSON.parse(localStorage.location);
  } else {
    return getCurrentCoordinates().then(async ({ latitude, longitude }) => {
      const city = await getCity(latitude, longitude);
      const location = { ...city, currentLatitude: latitude, currentLongitude: longitude };
      setLocation(location);
      return location;
    });
  }
}

async function getCities() {
  if ("cities" in sessionStorage) {
    return JSON.parse(sessionStorage.cities);
  } else {
    return fetch("/resources/cities.json").then(async res => {
      const res_1 = await res.json();
      sessionStorage.cities = JSON.stringify(res_1);
      return res_1;
    });
  }
}

async function getCity(latitude, longitude) {
  latitude = parseFloat(latitude);
  longitude = parseFloat(longitude);
  const distance = city => {
    return Math.pow(parseFloat(city.latitude) - latitude, 2) + Math.pow(parseFloat(city.longitude) - longitude, 2); // sqrt does not matter for sorting
  };
  return getCities().then(cities => {
    return cities.sort((a, b) => distance(a) >= distance(b))[0];
  });
}

async function getCurrentCoordinates() {
  return getCurrentPosition({ maximumAge: 600000 }).then(position => {
    return { latitude: parseFloat(position.coords.latitude), longitude: parseFloat(position.coords.longitude) };
  });
}

async function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options));
}

function setLocation({ name, latitude, longitude, currentLatitude, currentLongitude }) {
  localStorage.location = JSON.stringify({ name, latitude, longitude, currentLatitude, currentLongitude });
}
