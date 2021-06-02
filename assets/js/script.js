var recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
var inputArea = document.getElementById("recentSearches");
var input = "";

//when enter button clicked
document.getElementById("button").addEventListener("click", function () {
  //grab input
  input = document.getElementById("input").value;
  input.trim();
  //push input to recent searches and only keep 5
  recentSearches.push(input);
  recentSearches.reverse();
  recentSearches.splice(5);
  //save recent searches to local storage
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  getWeatherData();
});

//document.querySelector("h4").addEventListener('click', function() {
  //searchTerm = document.querySelector("h4").value;
  //input = document.getElementById("input");
  //input.value = searchTerm;
//});

//display recent searches
var displayRecentSearches = function () {
  for (i = 0; i < recentSearches.length; i++) {
    inputArea.innerHTML += "<h4>" + recentSearches[i] + "</h4>";
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
      var alphaDate = response.dt * 1000;
      var currentDate = new Date(alphaDate);

      var displayAreaEl = document.querySelector('.display-area');
      displayAreaEl.innerHTML = '<div class="main-weather"><h2>'+ response.name +' ('+ currentDate +')</h2></div>';
      var mainWeatherEl = document.querySelector('.main-weather')
      mainWeatherEl.innerHTML += '<h3><i class="fas fa-thermometer-half"></i> Temp: '+ response.main.temp +'&deg;F</h3>';
      mainWeatherEl.innerHTML += '<h3><i class="fas fa-wind"></i> Wind: '+ response.wind.speed +' MPH</h3>';
      mainWeatherEl.innerHTML += '<h3><i class="fas fa-tint"></i> Humidity: '+ response.main.humidity +'%</h3>';
    });
};

displayRecentSearches();
