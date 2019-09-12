var bus_list = document.getElementById("bus-list");
var bus_table = document.getElementById("bus-table");

fetch("bus_data.json")
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

function createTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function createTableBody(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}
