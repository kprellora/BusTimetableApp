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

      var timetable = element.timetable;
      createTimetable(timetable);
    });
  });
}

// Majority of table code from https://www.valentinog.com/blog/html-table/
function createTimetable(timetable) {
  document.getElementById("current-table").remove();
  let table = document.createElement('table');
  table.id = "current-table";
  bus_table.appendChild(table);
  let data = Object.keys(timetable[0]);
  createTableHead(table, data);
  createTableBody(table, timetable);
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