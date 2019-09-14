fetch("bus_data.json")
.then(function(data) {
  return data.json();
})
.then(function(bus_data) {
  listAllBuses(bus_data);
});

var bus_list_button = document.getElementById("bus-list");
bus_list_button.addEventListener("click", function() {
  buses_page.style.display = "Block";
  timetables_page.style.display = "None";
});

var bus_container = document.getElementsByClassName("bus-container")[0];
var buses_page = document.getElementById("buses-page");
var timetables_page = document.getElementById("timetables-page");
timetables_page.style.display = "None";

// create a button for each bus
function listAllBuses(bus_data) {
  bus_data.forEach(function(bus) {
    var button = document.createElement("div");
    button.innerHTML = bus.bus;
    button.classList.add("bus-button");
    button.style.backgroundColor = ("#"+bus.colour);
    bus_container.appendChild(button);

    // set each button to create its timetable
    button.addEventListener("click", function() {
      buses_page.style.display = "None";
      timetables_page.style.display = "Block";
      createTimetablePage(bus);
    });
  });
}

// Code from https://www.valentinog.com/blog/html-table/
function createTimetablePage(bus, trip = 0) { // using bus data
  // reset timetable-container everytime a bus button is clicked
  document.getElementById("timetable-container").remove();

  // create divs, set ID, append
  var timetable_container = document.createElement("div");
  var info_container = document.createElement("div");
  var route_info = document.createElement("div");
  var route_switcher = document.createElement("div");
  var route_desc = document.createElement("div");
  var name = document.createElement("div");
  var trip_container = document.createElement("div");
  timetable_container.id = "timetable-container";
  info_container.id = "info-container";
  route_info.id = "route-info";
  route_switcher.id = "route-switcher";
  route_desc.id = "route-desc";
  route_desc.classList.add("route-desc");
  name.id = "name";
  name.classList.add("routing", "rs-name");
  trip_container.id = "trip-container";
  timetables_page.appendChild(timetable_container);
  timetable_container.appendChild(info_container);
  info_container.appendChild(route_info);
  route_info.appendChild(route_switcher);
  route_info.appendChild(route_desc);
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
        createTimetablePage(bus, trip = 1);
      } else {
        createTimetablePage(bus, trip = 0);
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
  route_desc.appendChild(trip_desc);
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
      // console.log(table_div.id);
      if (j > 0) {
        table_div.classList.add("hide");
      }
      createTableHead(table, data);
      createTableBody(table, timetable);
      table_div.appendChild(table);
      trip_div.appendChild(table_div);
    }
    trip_container.appendChild(trip_div);

    // for each trip_div, create service buttons (days)
    for (k = bus["trips"][i]["services"].length-1; k >= 0; k--) {
      var service_button = document.createElement("button");
      service_button.innerHTML = bus["trips"][i]["services"][k]["service"];
      service_button.id = ("service"+k);
      trip_div.prepend(service_button);

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