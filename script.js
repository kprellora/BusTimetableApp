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
      // bus_list.classList.add("hide");
      // table.classList.remove("hide");

      var timetable = [];
      var major_stops = Object.keys(element.timetable[0]);
      timetable[0] = major_stops;      
      for (i = 0; i < element.timetable.length; i++) {
        timetable.push(Object.values(element.timetable[i]));
      }
      // console.log(timetable);

      createTable(timetable);
    });
  });
}
