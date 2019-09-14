fetch("bus_data.json")
.then(function(data) {
  return data.json();
})
.then(function(bus_data) {
  createViews(bus_data);
});

var bus_list_button = document.getElementsByClassName("nav-item")[0];
bus_list_button.addEventListener("click", function() {
  showBuses();
  document.getElementsByClassName("nav-item")[0].classList.add("active-nav");
  document.getElementsByClassName("nav-item")[1].classList.remove("active-nav");
});

var route_list_button = document.getElementsByClassName("nav-item")[1];
route_list_button.addEventListener("click", function() {
  showRoutes();
  document.getElementsByClassName("nav-item")[0].classList.remove("active-nav");
  document.getElementsByClassName("nav-item")[1].classList.add("active-nav");
});

var bus_container = document.getElementsByClassName("bus-container")[0];
var route_container = document.getElementsByClassName("route-container")[0];
var buses_page = document.getElementById("buses-page");
var timetables_page = document.getElementById("timetables-page");
var routes_page = document.getElementById("routes-page");
var routes = [
  'Casuarina to Darwin and return',
  'Casuarina to Palmerston and return',
  'Casuarina to northern suburbs and return',
  'Darwin to Palmerston and return',
  'Darwin to Darwin suburbs and return',
  'Palmerston to Palmerston suburbs and return',
  'Rural areas to Palmerston and return',
  'Mindil Beach sunset market'
];
var route_names = document.getElementsByClassName("route-name");

// create routes_page
function createRoutesPage(bus_data) {
  var routes_header = document.createElement("h2");
  routes_header.innerHTML = "Routes";
  var routes_topbar = document.getElementsByClassName("top-bar")[1];
  routes_page.appendChild(routes_topbar);
  routes_topbar.appendChild(routes_header);

  bus_data.forEach(function(bus) {
    var trip_name = bus["route"];
      switch (trip_name) {
        case 'Casuarina to Darwin and return':
          createBusButton(bus, "route", 0);
          break;
        case 'Casuarina to Palmerston and return':
          createBusButton(bus, "route", 1);
          break;
        case 'Casuarina to northern suburbs and return':
          createBusButton(bus, "route", 2);
          break;
        case 'Darwin to Palmerston and return':
          createBusButton(bus, "route", 3);
          break;
        case 'Darwin to Darwin suburbs and return':
          createBusButton(bus, "route", 4);
          break;
        case 'Palmerston to Palmerston suburbs and return':
          createBusButton(bus, "route", 5);
          break;
        case 'Rural areas to Palmerston and return':
          createBusButton(bus, "route", 6);
          break;
        case 'Mindil Beach sunset market':
          createBusButton(bus, "route", 7);
          break;
        default:
          break;
      }
  });
}

// create buses_page
function createBusesPage(bus_data) {
  var buses_header = document.createElement("h2");
  buses_header.innerHTML = "Buses";
  var buses_topbar = document.getElementsByClassName("top-bar")[0];
  buses_topbar.appendChild(buses_header);
  document.getElementsByClassName("nav-item")[0].classList.add("active-nav");

  bus_data.forEach(function(bus) {
    createBusButton(bus, "bus");
  });
}

function createBusButton(bus, view, index) {
  var button = document.createElement("div");
  button.innerHTML = bus.bus;
  button.classList.add("bus-button");
  switch (view) {
    case 'bus':
      (bus_container).appendChild(button);
      break;
    case 'route':
      (route_names)[index].appendChild(button);
  }

  // set each button to create its timetable
  button.addEventListener("click", function() {
    buses_page.style.display = "None";
    routes_page.style.display = "None";
    timetables_page.style.display = "Block";
    createTimetablesPage(bus);
  });
}

// Code from https://www.valentinog.com/blog/html-table/
function createTimetablesPage(bus, trip = 0) { // using bus data
  // reset timetable-container everytime a bus button is clicked
  showTimetables();
  document.getElementById("bus-nav").classList.remove("active-nav");
  document.getElementById("timetable-container").remove();

  // create divs, set ID, append
  var timetable_container = document.createElement("div");
  var route_info = document.createElement("div");
  var route_switcher = document.createElement("div");
  var route_desc = document.createElement("div");
  var name = document.createElement("div");
  var trip_container = document.createElement("div");
  timetable_container.id = "timetable-container";
  route_info.id = "route-info";
  route_switcher.id = "route-switcher";
  route_desc.id = "route-desc";
  route_desc.classList.add("route-desc");
  name.id = "name";
  name.classList.add("routing", "rs-name");
  trip_container.id = "trip-container";
  timetables_page.appendChild(timetable_container);
  timetable_container.appendChild(route_info);
  route_info.appendChild(route_desc);
  route_info.appendChild(route_switcher);
  route_switcher.appendChild(name);
  timetable_container.appendChild(trip_container);

  // CREATE TIMETABLE INFO
  if (bus["trips"].length > 1) {
    // create switcher if bus has 2 trips (e.g. C->D, D->C)
    var switcher = document.createElement("div");
    switcher.id = "switcher";
    switcher.classList.add("routing");
    route_switcher.appendChild(switcher);

    // create route-switcher labels and button
    name.innerHTML = bus["trips"][trip]["name"];
    var switch_button = document.createElement("div");
    switch_button.classList.add("rs-switcher");
    switch_button.innerHTML = "&#x21c4";

    // add button to switch div in route_info div
    switcher.appendChild(switch_button);

    // switch button changes trip value to the other one
    switch_button.addEventListener("click", function() {
      if (trip == 0) {
        createTimetablesPage(bus, trip = 1);
      } else {
        createTimetablesPage(bus, trip = 0);
      }
    });

  // if bus has only one trip (e.g. C <-> C)
  } else {
    // just display the trip name in route_info
    name.innerText = bus["trips"][0]["name"];
  }

  // show trip desc (i.e. via ...)
  var trip_desc = document.createElement("div");
  var bus_number = document.createElement("div");
  route_desc.appendChild(bus_number);
  // route_desc.appendChild(trip_desc);
  route_desc.appendChild(route_switcher);
  trip_desc.innerHTML = bus["trips"][trip]["desc"];
  trip_desc.classList.add("trip-desc");
  bus_number.classList.add("bus-number");
  bus_number.innerHTML = bus["bus"];

  /*
      .---------------------------------.
     | bus #, next stop, stop name, ETA |
     '---------------------------------'
  */

  // create the timetable
  // for each trip
  for (i = 0; i < bus["trips"].length; i++) {
    // create a trip_div
    var trip_div = document.createElement("div");
    trip_div.id = ("trip"+i);
    trip_div.classList.add("trip-div");

    // for each trip_div
    for (j = 0; j < bus["trips"][i]["services"].length; j++) {
      var timetable = (bus["trips"][i]["services"][j]["timetable"]);
      // create a table_div
      var table_div = document.createElement("div");
      table_div.id = ("trip"+i+"service"+(j));
      table_div.classList.add("table-div");

      var table = document.createElement("table");
      var data = Object.keys(timetable[0]);
      if (j > 0) {
        table_div.classList.add("hide");
      }
      createTableHead(table, data);
      createTableBody(table, timetable);
      table_div.appendChild(table);
      trip_div.appendChild(table_div);
    }
    trip_container.appendChild(trip_div);
    
    var serv_btn_container = document.createElement("div");
    // for each trip_div, create service buttons (days)
    for (k = bus["trips"][i]["services"].length-1; k >= 0; k--) {
      var service_button = document.createElement("div");
      service_button.classList.add("service-button");
      service_button.innerHTML = bus["trips"][i]["services"][k]["service"];
      service_button.id = ("service"+k);
      serv_btn_container.classList.add("serv-btn-container");
      serv_btn_container.prepend(service_button)
      trip_div.prepend(serv_btn_container);

      service_button.addEventListener("click", function(evt) {
        // https://stackoverflow.com/questions/19650368/hide-div-by-class-id
        var divs_to_hide = document.getElementsByClassName("table-div");
        for(var n = 0; n < divs_to_hide.length; n++) {
          divs_to_hide[n].classList.add("hide");
        }
        var target = evt.target.getAttribute('id');
        document.getElementById("trip"+(trip)+target).classList.remove("hide");
      });
    }
  }

  // chooses which table to show based on defaults
  if (bus["trips"].length > 1) {
    var trip0 = document.getElementById("trip0");
    var trip1 = document.getElementById("trip1");
    if (trip == 0) {
      trip0.classList.remove("hide");
      trip1.classList.add("hide");
    } else if (trip == 1) {
      trip0.classList.add("hide");
      trip1.classList.remove("hide");
    }
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

// show pages
function showBuses(){
  buses_page.style.display = "Block";
  timetables_page.style.display = "None";
  routes_page.style.display = "None";
}

function showRoutes(){
  routes_page.style.display = "Block";
  timetables_page.style.display = "None";
  buses_page.style.display = "None";
}

function showTimetables(){
  timetables_page.style.display = "Block";
  buses_page.style.display = "None";
  routes_page.style.display = "None";
}

function createViews(bus_data) {
  createBusesPage(bus_data);
  createRoutesPage(bus_data);
  showBuses();
}