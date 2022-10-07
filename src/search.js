document.getElementById("search-box").addEventListener("input", showList);
document.getElementById("location-display").addEventListener("click", () => {
  displaySearch();
});
document.getElementById("search-item-current-location").addEventListener("click", () => {
  selectItem(undefined);
});

async function displaySearch(display = true) {
  document.getElementById("weather").hidden = display;
  document.getElementById("location-display").hidden = display;
  document.getElementById("search").hidden = !display;
  let e = document.getElementById("search-box");
  e.hidden = !display;
  e.value = "";
  if (display) {
    e.select();
    showList();
  }
}

async function showList() {
  const templateSearchItem = document.getElementById("template-search-item");
  const searchItemsNode = document.getElementById("search-list-items");
  searchItemsNode.innerHTML = "";
  getCities().then(cities => {
    const searchTerm = document.getElementById("search-box").value.toLowerCase();
    cities
      .filter(city => city.name.toLowerCase().startsWith(searchTerm))
      .forEach(city => {
        searchItemNode = templateSearchItem.content.cloneNode(true);
        searchItemNode.querySelector(".location-name").innerHTML = city.name;
        searchItemsNode.appendChild(searchItemNode);
        searchItemNode = searchItemsNode.lastElementChild;
        searchItemNode.addEventListener("click", () => {
          selectItem(city);
        });
      });
  });
}

async function selectItem(city) {
  displaySearch(false);
  if (city == undefined) {
    loadWeatherData(true);
  } else {
    setLocation(city);
    loadWeatherData();
  }
}
