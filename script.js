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

// https://stackoverflow.com/questions/15164655/generate-html-table-from-2d-javascript-array
function createTable(tableData) {
  current_table = document.getElementById("current-table");
  current_table.remove();
  
  var table = document.createElement('table');
  var tableHead = document.createElement('thead');
  var tableBody = document.createElement('tbody');
  table.id = "current-table";

  tableData[0].forEach(function(cellData) {
    var cell = document.createElement('td');
    cell.appendChild(document.createTextNode(cellData));
    row.appendChild(cell);
  });

  tableData.forEach(function(rowData) {
    var row = document.createElement('tr');
    rowData.forEach(function(cellData) {
      var cell = document.createElement('td');
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });
  table.appendChild(tableHead);  
  table.appendChild(tableBody);
  bus_table.appendChild(table);
}


