var recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
var searchHistory = document.querySelector('#recentSearches');
var input = "";
var currentDate = moment().format("dddd, MMMM Do YYYY");

//when enter button clicked
document.getElementById("button").addEventListener("click", function () {
  //grab input
  input = document.getElementById("input").value;
  input.trim();
  //push input to recent searches and only keep 5
  recentSearches.push(input);
  recentSearches.splice(1);
  //save recent searches to local storage
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  getWeatherData();
});

//display recent searches
var displayRecentSearches = function() {
  for(i = 0; i < recentSearches.length; i++) {
    var searchItem = document.createElement('button')
    searchItem.textContent = recentSearches[i]
    searchItem.setAttribute('class', 'search-item')
    searchHistory.appendChild(searchItem)
  };
};

displayRecentSearches();

var clickSearchItem = function() {
  if (recentSearches == 0) {
    return;
  } else {
    document.querySelector('.search-item').addEventListener('click', function() {
      var searchItemValue = document.querySelector('.search-item').innerHTML;
      input = searchItemValue;
      getWeatherData();
    });
  };
};

clickSearchItem();

//get info from weather api
var getWeatherData = function () {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      input +
      "&appid=a691fc3f095c0852e6f3b3099cf4fc01&units=imperial"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      var lat = response.coord.lat;
      var lon = response.coord.lon;

      //append weather info to html
      var displayAreaEl = document.querySelector(".display-area");
      displayAreaEl.innerHTML =
        '<div class="main-weather"><h2 class="light">' +
        response.name +
        " (" +
        currentDate +
        ")</h2></div>";
      displayAreaEl.innerHTML += '<div class="future-weather"></div>';
      var mainWeatherEl = document.querySelector(".main-weather");
      mainWeatherEl.innerHTML +=
        '<h3><i class="fas fa-thermometer-half"></i> Temp: ' +
        response.main.temp +
        "&deg;F</h3>";
      mainWeatherEl.innerHTML +=
        '<h3><i class="fas fa-wind"></i> Wind: ' +
        response.wind.speed +
        " MPH</h3>";
      mainWeatherEl.innerHTML +=
        '<h3><i class="fas fa-tint"></i> Humidity: ' +
        response.main.humidity +
        "%</h3>";

      return fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&exclude=hourly,minutely&appid=a691fc3f095c0852e6f3b3099cf4fc01&units=imperial"
      );
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      var futureWeatherEl = document.querySelector(".future-weather");
      for (i = 1; i < response.daily.length; i++) {
        var futureDay = response.daily[i];
        var futureDate = moment.unix(futureDay.dt).format("dddd, MMMM Do");
        var futureItem = document.createElement('div');
        futureItem.setAttribute('class', 'future-item');
        futureItem.innerHTML = '<h4>'+ futureDate +'</h4>';
        futureItem.innerHTML += '<h3><i class="fas fa-thermometer-half"></i> Temp: '+ futureDay.temp.day +'&deg;F</h3>';
        futureItem.innerHTML += '<h3><i class="fas fa-wind"></i> Wind: '+ futureDay.wind_speed +' MPH</h3>';
        futureItem.innerHTML += '<h3><i class="fas fa-tint"></i> Humidity: '+ futureDay.humidity +'%</h3>';
        futureWeatherEl.appendChild(futureItem);
      }
    });
};

