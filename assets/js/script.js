var recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
var inputArea = document.getElementsByClassName("input-area");

document.getElementById("button").addEventListener("click", function () {
  var input = document.getElementById("input").value;
  input.trim();
  recentSearches.push(input);
  recentSearches.reverse();
  recentSearches.splice(5);

  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
});

var createHistory = function () {
  for (i = 0; i < recentSearches.length; i++) {
    var newSearch = document.createElement("h4");
    newSearch.textContent = recentSearches[i];
    
  }
};
