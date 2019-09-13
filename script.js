fetch("bus_data.json")
.then(function(data) {
  return data.json();
  })
.then(function(bus_data) {
  listAllBuses(bus_data);
});
  
var buses_page = document.getElementById("buses-page");
var timetables_page = document.getElementById("timetables-page");

// create a button for each bus
function listAllBuses(bus_data) {
  bus_data.forEach(function(bus) {
    var button = document.createElement("button");
    button.innerHTML = bus.bus;
    button.classList.add("bus-button");
    buses_page.appendChild(button);
    
    // set each button to create its timetable
    button.addEventListener("click", function() {
      // buses_page.classList.add("hide");
      // table.classList.remove("hide");
      createTimetablePage(bus);
    });
  });
}

// Code from https://www.valentinog.com/blog/html-table/
function createTimetablePage(bus, trip = 0) { // using bus data

  // create divs, set ID, append
  var timetable_container = document.createElement("div");
  var info_container = document.createElement("div");
  var route_info = document.createElement("div");
  var trip_container = document.createElement("div");
  timetable_container.id = "timetable-container";
  info_container.id = "info-container";
  route_info.id = "route-info";
  trip_container.id = "trip-container";
  timetables_page.appendChild(timetable_container);
  timetable_container.appendChild(info_container);
  info_container.appendChild(route_info);
  timetable_container.appendChild(trip_container);
    // create route switcher if bus has 2 trips (e.g. C->D, D->C)
    var route_switcher = document.createElement("div");
    var origin = document.createElement("div");
    var switcher = document.createElement("div");
    var destination = document.createElement("div");
    route_switcher.id = "route-switcher";
    origin.id = "origin";
    switcher.id = "switcher";
    destination.id = "destination";
    origin.classList.add("routing");
    switcher.classList.add("routing");
    destination.classList.add("routing");
    route_info.appendChild(route_switcher);
    route_switcher.appendChild(origin);
    route_switcher.appendChild(switcher);
    route_switcher.appendChild(destination);

    // create route-switcher labels and button
    origin.innerHTML = bus["trips"][trip]["origin"];
    destination.innerHTML = bus["trips"][trip]["destination"];
    var switch_button = document.createElement("button");
    switch_button.innerHTML = "&#x21c4";
    // add button to switch div in route_info div
    switcher.appendChild(switch_button);
    });
    // just display the trip name in route_info
    var p = document.createElement("p");
    p.innerHTML = (bus["trips"][0]["name"]);
    route_info.appendChild(p);
}

  // show trip desc (i.e. via ...)
  var trip_desc = document.createElement("p");
  trip_desc.innerHTML = (bus["trips"][trip]["desc"]);
  route_info.appendChild(trip_desc);
  createTableHead(table, data);
  createTableBody(table, timetable);
  }
}

// create major stops heading
function createTableHead(table, data) {
  var thead = table.createTHead();
  var row = thead.insertRow();
  for (var key of data) {
    var th = document.createElement("th");
    var text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

// create rows of trips
function createTableBody(table, data) {
  for (var element of data) {
    var row = table.insertRow();
    for (key in element) {
      var cell = row.insertCell();
      var text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}