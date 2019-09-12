var bus_list = document.getElementById("bus-list");
var bus_table = document.getElementById("bus-table");

fetch("main.json")
  .then(function(routes) {
    return routes.json();
  })
  .then(function(routes_data) {
    createBusesView(routes_data);
  })
  
function createBusesView(routes_data) {
  routes_data.forEach(function(element) {
    var button = document.createElement("button");
    button.innerHTML = element.route;
    button.classList.add("bus-button");
    bus_list.appendChild(button);
    
    button.addEventListener("click", function() {
    });
  });
}
