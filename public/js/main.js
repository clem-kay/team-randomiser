document.addEventListener("DOMContentLoaded", function () {
  let colors = ["red", "blue", "green", "yellow", "purple", "orange"];
  let wheel = document.getElementById("color-wheel");
  let startBtn = document.getElementById("start-btn");
  let selectedColorInput = document.getElementById("selected-color");
  let selectedTeamTitle = document.getElementById("result-modal-title");
  let selectedColorText = document.getElementById("selected-color");
  let modal = new bootstrap.Modal(document.getElementById("color-modal"));
  let saveSettingsBtn = document.getElementById("saveSettings");
  let colorListInput = document.getElementById("color-list");
  let teamSizeInput = document.getElementById("team-size");
  let saveResultBtn = document.getElementById("save-result");
  let teamMemberInput = document.getElementById("team-member")

  let spinning = false;
  let currentRotation = 0; // Store last rotation to continue smoothly

  function updateWheel() {
    let segments = colors.length;
    let angle = 360 / segments;
    let gradient = colors
      .map((color, index) => `${color} ${index * angle}deg ${(index + 1) * angle}deg`)
      .join(", ");
    wheel.style.background = `conic-gradient(${gradient})`;
  }

  function spinWheel() {
    if (spinning) return;
    spinning = true;

    let fullRotations = 5 * 360; // Ensure at least 5 full spins
    let randomDegree = Math.floor(Math.random() * 360);
    let targetRotation = currentRotation + fullRotations + randomDegree;

    wheel.style.transition = "transform 2s ease-out";
    wheel.style.transform = `rotate(${targetRotation}deg)`;

    setTimeout(() => {
      let finalAngle = targetRotation % 360;
      let selectedIndex = Math.floor((colors.length * finalAngle) / 360);
      let selectedColor = colors[colors.length - 1 - selectedIndex];
      selectedColorInput.value = selectedColor.toUpperCase();
      selectedTeamTitle.value = `Selected Team: ${selectedColor}`
      spinning = false;
      modal.show();

      currentRotation = targetRotation;
    }, 2000);
  }

  startBtn.addEventListener("click", spinWheel);

  saveResultBtn.addEventListener("click", function () {
    let teamMember = teamMemberInput.value.trim();
    let selectedColor = selectedColorInput.value.toUpperCase();
    let teamSize = parseInt(teamSizeInput.value) || 0;

    const data = JSON.stringify({ name: teamMember, team: selectedColor, teamSize: teamSize })
    console.table(data)

    fetch("/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data
    }).then(response => response.json()).then(data => {
      alert(data.message);
    });
    teamMemberInput.value=""
    modal.hide();
    fetchTeamMembers()
  });

  saveSettingsBtn.addEventListener("click", function () {
    let newColors = colorListInput.value.split(",").map(color => color.trim());
    if (newColors.length > 1) {
      colors = newColors;
      updateWheel();
    }
  });

  updateWheel();
});



let currentPage = 1;
const rowsPerPage = 5;
let teamMembers = []; // This will store team members from the backend

// Fetch team members from backend
async function fetchTeamMembers() {
  const response = await fetch('/team'); // Adjust API URL if needed
  teamMembers = await response.json();
  console.table(teamMembers)
  displayTable();
}

// Display table with pagination
function displayTable() {
  const tableBody = document.getElementById('team-table-body');
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const paginatedItems = teamMembers.slice(start, start + rowsPerPage);

  paginatedItems.forEach(member => {
    const row = `<tr>
                  <td>${member.name}</td>
                  <td>${member.team}</td>
                </tr>`;
    tableBody.innerHTML += row;
  });

  setupPagination();
}

// Filter table based on search input
function filterTable() {
  const searchValue = document.getElementById('search').value.toLowerCase();
  teamMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchValue) || 
    member.team.toLowerCase().includes(searchValue)
  );
  currentPage = 1;
  displayTable();
}

// Setup pagination
function setupPagination() {
  const paginationDiv = document.getElementById('pagination');
  paginationDiv.innerHTML = "";

  const totalPages = Math.ceil(teamMembers.length / rowsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.innerText = i;
    button.classList.add('btn', 'btn-primary', 'mx-1');
    button.onclick = () => {
      currentPage = i;
      displayTable();
    };
    paginationDiv.appendChild(button);
  }
}

// Load data when page loads
window.onload = fetchTeamMembers;
