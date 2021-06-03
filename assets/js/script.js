var recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
var history = document.getElementById("recentSearches");
var input = "";
var currentDate = moment().format("dddd, MMMM Do YYYY");

displayRecentSearches();

//when enter button clicked
document.getElementById("button").addEventListener("click", function () {
  //grab input
  input = document.getElementById("input").value;
  input.trim();
  //push input to recent searches and only keep 5
  recentSearches.push(input);
  recentSearches.splice(5);
  //save recent searches to local storage
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches.reverse()));
  getWeatherData();
});

//display recent searches
function displayRecentSearches() {
  for (i = 0; i < recentSearches.length; i++) {
    console.log(recentSearches[i]);
    history.innerHTML += "<h4>" + recentSearches[i] + "</h4>";
  }
};



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
        '<div class="main-weather"><h2>' +
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
        futureDate = moment.unix(futureDay.dt).format("dddd, MMMM Do");
        var futureItem = document.createElement('div');
        futureItem.setAttribute('class', 'future-item');
        futureItem.innerHTML = '<h2>'+ futureDate +'</h2>';
        futureItem.innerHTML += '<h3><i class="fas fa-thermometer-half"></i> Temp: '+ futureDay.temp.day +'</h3>';
        futureItem.innerHTML += '<h3><i class="fas fa-wind"></i> Wind: '+ futureDay.wind_speed +'</h3>';
        futureItem.innerHTML += '<h3><i class="fas fa-tint"></i> Humidity: '+ futureDay.humidity +'</h3>';
        futureWeatherEl.appendChild(futureItem);
      }
    });
};

