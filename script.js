const itemsPerPage = 25;
let currentPage = 1;
let currentSortColumn = 0;
let isAscending = true;
let filteredData = [];

// Fetch the dummy datas
fetch('dummy_employees.json')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#employeeTable tbody');
        const pagination = document.querySelector('#pagination');

        // Function to display data for the current page
        function displayData(page) {
            tableBody.innerHTML = '';
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedData = data.employees.slice(start, end);
            paginatedData.forEach(employee => {
                const row = document.createElement('tr');
                Object.values(employee).forEach(value => {
                    const cell = document.createElement('td');
                    cell.textContent = value;
                    cell.setAttribute('contenteditable', 'true');
                    row.appendChild(cell);
                });
                const deleteButtonCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-btn';
                deleteButton.onclick = () => deleteRow(row);
                deleteButtonCell.appendChild(deleteButton);
                row.appendChild(deleteButtonCell);
        
                tableBody.appendChild(row);
            });
        }
        // Function to setup pagination
        function setupPagination() {
            pagination.innerHTML = '';
            const totalPages = Math.ceil(data.employees.length / itemsPerPage);
            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.textContent = i;
                button.addEventListener('click', () => {
                    currentPage = i;
                    displayData(currentPage);
                    updatePaginationButtons();
                });
                pagination.appendChild(button);
            }
            updatePaginationButtons();
        }
        // Function to update active pagination buttons
        function updatePaginationButtons() {
            const buttons = document.querySelectorAll('.pagination button');
            buttons.forEach(button => {
                button.classList.remove('active');
                if (parseInt(button.textContent) === currentPage) {
                    button.classList.add('active');
                }
            });
        }

        displayData(currentPage);
        setupPagination();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
document.getElementById('downloadBtn').addEventListener('click', () => {
    const tableRows = Array.from(document.querySelectorAll('#employeeTable tbody tr'));
    const updatedData = tableRows.map(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        return cells.reduce((acc, cell, index) => {
            const headerText = document.querySelector('#employeeTable thead tr').children[index].textContent;
            acc[headerText.toLowerCase()] = cell.textContent;
            return acc;
        }, {});
    });
    const jsonContent = JSON.stringify({ employees: updatedData }, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited_employees.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Function to sort the table by a specific column
function sortTable(column) {
    const table = document.getElementById("employeeTable");
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const sortOrder = isAscending ? 1 : -1;
    rows.sort((a, b) => {
      const aValue = a.getElementsByTagName("td")[column].textContent.trim();
      const bValue = b.getElementsByTagName("td")[column].textContent.trim();
      return sortOrder * aValue.localeCompare(bValue);
    });
    rows.forEach(row => table.querySelector('tbody').appendChild(row));
    if (currentSortColumn === column) {
      isAscending = !isAscending;
    } else {
      currentSortColumn = column;
      isAscending = true;
    }
  }
// Function to delete a row from the table
  function deleteRow(row) {
    row.remove();
  }  

// Function to filter table data based on user input
  document.getElementById('filterInput').addEventListener('input', () => {
    const filterValue = document.getElementById('filterInput').value.toLowerCase();
    const rows = document.querySelectorAll('#employeeTable tbody tr');
    rows.forEach(row => {
      const designation = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
      if (designation.includes(filterValue)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
  
// Open the modal
const openModalBtn = document.getElementById("openModalBtn");
const modal = document.getElementById("myModal");
const closeModalBtn = document.getElementsByClassName("close")[0];

openModalBtn.onclick = function() {
  modal.style.display = "block";
};

// Close the modal when clicking on the close button or outside the modal
closeModalBtn.onclick = function() {
  modal.style.display = "none";
};

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Add record form submission
const addRecordForm = document.getElementById("addRecordForm");

addRecordForm.addEventListener("submit", function(event) {
  event.preventDefault();
  const formData = new FormData(this);
  const newRecord = {};
  formData.forEach(function(value, key) {
    newRecord[key] = value;
  });

  const tableBody = document.querySelector("#employeeTable tbody");
  const newRow = document.createElement("tr");
  Object.values(newRecord).forEach(value => {
    const cell = document.createElement("td");
    cell.textContent = value;
    newRow.appendChild(cell);
  });
  const deleteButtonCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete-btn";
  deleteButton.onclick = () => deleteRow(newRow);
  deleteButtonCell.appendChild(deleteButton);
  newRow.appendChild(deleteButtonCell);
  tableBody.appendChild(newRow);

  // Update filteredData array
  filteredData.push(newRecord);

  // Close the modal
  modal.style.display = "none";
});

