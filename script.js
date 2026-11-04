
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

//Logic to handle when user searches for an item
const searchBar = document.getElementById("search_bar")

searchBar.addEventListener("input", function() {
    displayItems()
})

// Sample inventory items
let inventory = [
  { name: "Milk", quantity: 2, location: "Fridge", expiration: "2026-10-29", owner: "Shared" },
  { name: "Eggs", quantity: 12, location: "Fridge", expiration: "2026-11-02", owner: "Mine" },
  { name: "Cheese", quantity: 1, location: "Fridge", expiration: "2026-11-10", owner: "Shared" },
  { name: "Rice", quantity: 2, location: "Pantry", expiration: "2027-02-15", owner: "Shared" },
  { name: "Pasta", quantity: 3, location: "Pantry", expiration: "2027-03-20", owner: "Mine" },
  { name: "Frozen Peas", quantity: 2, location: "Freezer", expiration: "2027-01-10", owner: "Shared" }
];



// KITCHEN TAB FEATURES //

// Default storage 
let currentLocation = "Fridge";


// Switch storage logic
function changeLocation(location) {

  currentLocation = location;

  hideForm();

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


// Display food inventory
function displayItems() {

  let list = document.getElementById("inventoryList");

  // Clear previous items
  list.innerHTML = "";

  let user_search = searchBar.value.toLowerCase()

  let count = 0

  // Loop through inventory
  for (let i = 0; i < inventory.length; i++) {

    let item = inventory[i];

    // Only show items in selected location
    if (item.location === currentLocation && item.name.toLowerCase().includes(user_search)) {
      count++

      let card = document.createElement("div");
      card.className = "food-card";

      let info = document.createElement("div");
      info.className = "food_info";

      let nameRow = document.createElement("div");
      nameRow.className = "food_name_row";

      let name = document.createElement("h4");
      name.textContent = item.name;

      let owner = document.createElement("span");
      owner.className = "tag " + item.owner.toLowerCase();
      owner.textContent = item.owner;

      let expiration = document.createElement("p");
      expiration.textContent = "Expires: " + item.expiration;

      let quantity = document.createElement("p");
      quantity.className = "food_quantity";
      quantity.textContent = "Qty: " + item.quantity;

      nameRow.appendChild(name);
      nameRow.appendChild(owner);

      info.appendChild(nameRow);
      info.appendChild(expiration);

      card.appendChild(info);
      card.appendChild(quantity);
      list.appendChild(card);
    }
  }

  if (count == 0) {
    list.innerHTML = "No matching items found"
  }
}


//Add item logic
const addItem = document.getElementById("add_item");

function showForm() {
  document.getElementById("add_title").textContent =
    "Add to " + currentLocation;

  addItem.style.display = "block";
  document.getElementById("Kitchen").scrollTop = 0;
}

function hideForm() {
  addItem.style.display = "none";
  addItem.reset();
}

addItem.addEventListener("submit", function(event) {
  event.preventDefault();

  let name = document.getElementById("new_name").value.trim();
  if (name == "") return;

  inventory.push({
    name: name,
    quantity: Number(document.getElementById("new_quantity").value),
    location: currentLocation,
    expiration: document.getElementById("new_expiration").value,
    owner: document.getElementById("new_owner").value
  });

  searchBar.value = "";
  hideForm();
  displayItems();
});

// Show Fridge inventory when the page loads
changeLocation("Fridge");

// -----------------------------------
// SHOPPING TAB FEATURES
// -----------------------------------

const shoppingItems = ["Apples", "Milk", "Pasta"];

const shoppingForm = document.getElementById("shoppingForm");
const shoppingInput = document.getElementById("shoppingInput");
const shoppingList = document.getElementById("shoppingList");

function displayShoppingItems() {
  shoppingList.innerHTML = "";

  shoppingItems.forEach((item, index) => {
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");
    const label = document.createElement("label");
    const removeButton = document.createElement("button");

    checkbox.type = "checkbox";
    label.textContent = item;

    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      shoppingItems.splice(index, 1);
      displayShoppingItems();
    });

    listItem.append(checkbox, label, removeButton);
    shoppingList.appendChild(listItem);
  });
}

shoppingForm.addEventListener("submit", event => {
  event.preventDefault();

  const item = shoppingInput.value.trim();
  if (!item) return;

  shoppingItems.push(item);
  shoppingInput.value = "";
  displayShoppingItems();
});

displayShoppingItems();

