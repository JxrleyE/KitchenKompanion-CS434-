
function openCity(tab) {
  // Hide all elements with class="tabcontent" by default
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");

  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Show the specific tab content
  document.getElementById(tab).style.display = "block";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

// Logic to handle color changes in NAV bar when switching tabs
const buttons = document.querySelectorAll(".tablink");

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function() {

    console.log("Clicked: ", buttons[i].innerText);

    const currActive = document.querySelector(".tablink.active");

    // Make it inactive so that text changes
      currActive.classList.remove("active"); 

      // Change its icon to inactive
      currIcon = currActive.querySelector("img");
      currIcon.src = currIcon.src.replace("-active.svg", "-inactive.svg")

      // Swapping to new active button
      buttons[i].classList.add("active");

      // changing new icon to active 
      newIcon = buttons[i].querySelector("img");
      newIcon.src = newIcon.src.replace("-inactive.svg", "-active.svg")
  });
}


// -----------------------------------
// KITCHEN TAB FEATURES
// -----------------------------------

// Sample inventory items
let inventory = [
  {
    name: "Milk",
    quantity: 2,
    location: "Fridge",
    expiration: "2026-10-29",
    owner: "Shared"
  },
  {
    name: "Eggs",
    quantity: 12,
    location: "Fridge",
    expiration: "2026-11-02",
    owner: "Mine"
  },
  {
    name: "Cheese",
    quantity: 1,
    location: "Fridge",
    expiration: "2026-11-10",
    owner: "Shared"
  },
  {
    name: "Rice",
    quantity: 2,
    location: "Pantry",
    expiration: "2027-02-15",
    owner: "Shared"
  },
  {
    name: "Pasta",
    quantity: 3,
    location: "Pantry",
    expiration: "2027-03-20",
    owner: "Mine"
  },
  {
    name: "Frozen Peas",
    quantity: 2,
    location: "Freezer",
    expiration: "2027-01-10",
    owner: "Shared"
  }
];

// Default storage location
let currentLocation = "Fridge";


// Task 1: Switch between storage locations
function changeLocation(location) {

  currentLocation = location;

  // Update section heading
  document.getElementById("locationTitle").textContent =
    location + " Items";

  // Highlight selected storage button
  let storageButtons = document.querySelectorAll(
    ".storage-buttons button"
  );

  for (let i = 0; i < storageButtons.length; i++) {
    if (storageButtons[i].textContent === location) {
      storageButtons[i].classList.add("active");
    } else {
      storageButtons[i].classList.remove("active");
    }
  }

  displayItems();
}


// Task 2: Display food inventory
function displayItems() {

  let list = document.getElementById("inventoryList");

  // Clear previous items
  list.innerHTML = "";

  // Loop through inventory
  for (let i = 0; i < inventory.length; i++) {

    let item = inventory[i];

    // Only show items in selected location
    if (item.location === currentLocation) {

      let card = document.createElement("div");
      card.className = "food-card";

      let name = document.createElement("h4");
      name.textContent = item.name;

      let quantity = document.createElement("p");
      quantity.textContent = "Quantity: " + item.quantity;

      let expiration = document.createElement("p");
      expiration.textContent = "Expires: " + item.expiration;

      let owner = document.createElement("p");
      owner.textContent = "Tag: " + item.owner;

      card.appendChild(name);
      card.appendChild(quantity);
      card.appendChild(expiration);
      card.appendChild(owner);

      list.appendChild(card);
    }
  }
}


// Show Fridge inventory when the page loads
changeLocation("Fridge");
