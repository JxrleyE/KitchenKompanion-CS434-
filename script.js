function openCity(tab) {
  // Hide all elements with class="tabcontent" by default
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");

  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Show the specific tab content
  document.getElementById(tab).style.display = "block";

//Update the recipies
  if (tab === "Recipes") updateRecipeCards();
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();


const buttons = document.querySelectorAll(".tablink");

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function() {

    console.log("Clicked: ", buttons[i].innerText);

    const currActive = document.querySelector(".tablink.active");

      currActive.classList.remove("active");

      currIcon = currActive.querySelector("img");
      currIcon.src = currIcon.src.replace("-active.svg", "-inactive.svg")

      buttons[i].classList.add("active");

      newIcon = buttons[i].querySelector("img");
      newIcon.src = newIcon.src.replace("-inactive.svg", "-active.svg")
  });
}
const searchBar = document.getElementById("search_bar")

searchBar.addEventListener("input", function() {
    displayItems()
})

let inventory = [
  { name: "Milk", quantity: 2, location: "Fridge", expiration: "2026-10-29", owner: "Shared" },
  { name: "Eggs", quantity: 12, location: "Fridge", expiration: "2026-11-02", owner: "Mine" },
  { name: "Cheese", quantity: 1, location: "Fridge", expiration: "2026-11-10", owner: "Shared" },
  { name: "Butter", quantity: 2, location: "Fridge", expiration: "2026-12-01", owner: "Shared" },
  { name: "Heavy Cream", quantity: 1, location: "Fridge", expiration: "2026-11-06", owner: "Shared" },
  { name: "Chicken", quantity: 1, location: "Fridge", expiration: "2026-11-07", owner: "Mine" },
  { name: "Spinach", quantity: 1, location: "Fridge", expiration: "2026-11-05", owner: "Shared" },
  { name: "Rice", quantity: 2, location: "Pantry", expiration: "2027-02-15", owner: "Shared" },
  { name: "Pasta", quantity: 3, location: "Pantry", expiration: "2027-03-20", owner: "Mine" },
  { name: "Garlic", quantity: 1, location: "Pantry", expiration: "2026-11-20", owner: "Shared" },
  { name: "Tortillas", quantity: 1, location: "Pantry", expiration: "2026-11-15", owner: "Shared" },
  { name: "Frozen Peas", quantity: 2, location: "Freezer", expiration: "2027-01-10", owner: "Shared" }
];

let currentLocation = "Fridge";

let editingItem = null;

function changeLocation(location) {

  currentLocation = location;

  hideForm();

  document.getElementById("locationTitle").textContent =
    location + " Items";

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

function expirationText(item) {
  if (!item.expiration) return { text: "No expiration date", status: "" };
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  let parts = item.expiration.split("-");
  let days = Math.round((new Date(parts[0], parts[1] - 1, parts[2]) - today) / 86400000);

  if (days < 0) return { text: "⚠ Expired " + item.expiration, status: "expired" };
  if (days <= 3) return { text: "Expires in " + days + (days === 1 ? " day" : " days"), status: "expiring-soon" };
  return { text: "Expires: " + item.expiration, status: "" };
}

function displayItems() {

  let list = document.getElementById("inventoryList");
  list.innerHTML = "";
  let user_search = searchBar.value.toLowerCase()
  let count = 0

 
  for (let i = 0; i < inventory.length; i++) {

    let item = inventory[i];

    if (item.location === currentLocation && item.name.toLowerCase().includes(user_search)) {
      count++

      let exp = expirationText(item);

      let card = document.createElement("div");
      card.className = "food-card " + exp.status;  
      if (item.quantity === 0) card.classList.add("out-of-stock");

      let info = document.createElement("div");
      info.className = "food_info";
      info.addEventListener("click", function() { showForm(item); });  

      let nameRow = document.createElement("div");
      nameRow.className = "food_name_row";

      let name = document.createElement("h4");
      name.textContent = item.name;

      let owner = document.createElement("span");
      owner.className = "tag " + item.owner.toLowerCase();
      owner.textContent = item.owner;

      let expiration = document.createElement("p");
      expiration.textContent = item.quantity === 0 ? "Out of stock" : exp.text;   
      if (exp.status === "expired") expiration.className = "exp-expired";
      if (exp.status === "expiring-soon") expiration.className = "exp-soon";

      let quantity = document.createElement("p");
      quantity.className = "food_quantity";
      quantity.textContent = item.quantity;   

      nameRow.appendChild(name);
      nameRow.appendChild(owner);

      info.appendChild(nameRow);
      info.appendChild(expiration);
      card.appendChild(info);

      if (item.quantity === 0) {
        let addToList = document.createElement("button");
        addToList.className = "small-button";
        addToList.textContent = "+ Shopping list";
        addToList.addEventListener("click", function() {
          addShoppingItem(item.name, 1, guessCategory(item.location), item.owner, "");
          addToList.textContent = "✓ Added";
          addToList.disabled = true;
        });
        card.appendChild(addToList);
      }
      let controls = document.createElement("div");
      controls.className = "qty-controls";

      let minus = document.createElement("button");
      minus.textContent = "−";
      minus.setAttribute("aria-label", "Use one " + item.name);
      minus.addEventListener("click", function() {
        if (item.quantity > 0) item.quantity--;
        displayItems();
      });

      let plus = document.createElement("button");
      plus.textContent = "+";
      plus.setAttribute("aria-label", "Add one " + item.name);
      plus.addEventListener("click", function() {
        item.quantity++;
        displayItems();
      });

      controls.appendChild(minus);
      controls.appendChild(quantity);
      controls.appendChild(plus);

      card.appendChild(controls);
      list.appendChild(card);
    }
  }

  if (count == 0) {
    list.innerHTML = "<p class='empty-message'>No matching items found</p>"
  }
}
const addItem = document.getElementById("add_item");


function showForm(item) {
  editingItem = item || null;

  if (editingItem) {
    document.getElementById("add_title").textContent = "Edit " + editingItem.name;
    document.getElementById("new_name").value = editingItem.name;
    document.getElementById("new_quantity").value = editingItem.quantity;
    document.getElementById("new_expiration").value = editingItem.expiration;
    document.getElementById("new_owner").value = editingItem.owner;
    document.getElementById("add_submit").textContent = "Save";
    document.getElementById("delete_item").style.display = "block";
  } else {
    addItem.reset();
    document.getElementById("add_title").textContent =
      "Add to " + currentLocation;
    document.getElementById("add_submit").textContent = "Add";
    document.getElementById("delete_item").style.display = "none";
  }

  addItem.style.display = "block";
  document.getElementById("form_backdrop").style.display = "block";
}

function hideForm() {
  addItem.style.display = "none";
  document.getElementById("form_backdrop").style.display = "none";
  addItem.reset();
  editingItem = null;
}

addItem.addEventListener("submit", function(event) {
  event.preventDefault();

  let name = document.getElementById("new_name").value.trim();
  if (name == "") return;

  let details = {
    name: name,
    quantity: Number(document.getElementById("new_quantity").value),
    location: currentLocation,
    expiration: document.getElementById("new_expiration").value,
    owner: document.getElementById("new_owner").value
  };

  if (editingItem) {
    details.location = editingItem.location;
    Object.assign(editingItem, details);  
  } else {
    inventory.push(details);
  }

  searchBar.value = "";
  hideForm();
  displayItems();
});

function deleteEditingItem() {
  inventory.splice(inventory.indexOf(editingItem), 1);
  hideForm();
  displayItems();
}
changeLocation("Fridge");

// -----------------------------------
// SHOPPING TAB 
// -----------------------------------

let shoppingItems = [
  { name: "Apples", quantity: 6, category: "Produce", owner: "Mine", note: "Honeycrisp", checked: false },
  { name: "Milk", quantity: 1, category: "Dairy & Eggs", owner: "Shared", note: "2%", checked: false },
  { name: "Pasta", quantity: 2, category: "Pantry", owner: "Shared", note: "", checked: false }
];

const categories = ["Produce", "Dairy & Eggs", "Meat", "Pantry", "Frozen", "Other"];

const categoryToLocation = {
  "Produce": "Fridge", "Dairy & Eggs": "Fridge", "Meat": "Fridge",
  "Pantry": "Pantry", "Frozen": "Freezer", "Other": "Pantry"
};

function guessCategory(location) {
  if (location === "Freezer") return "Frozen";
  if (location === "Pantry") return "Pantry";
  if (location === "Fridge") return "Dairy & Eggs";
  return "Other";
}

const shoppingForm = document.getElementById("shoppingForm");
const shoppingInput = document.getElementById("shoppingInput");
const shoppingList = document.getElementById("shoppingList");

function addShoppingItem(name, quantity, category, owner, note) {
  let existing = shoppingItems.find(item => item.name.toLowerCase() === name.toLowerCase() && !item.checked);
  if (existing) {
    existing.quantity += quantity;
  } else {
    shoppingItems.push({ name, quantity, category, owner, note, checked: false });
  }
  displayShoppingItems();
}

function displayShoppingItems() {
  shoppingList.innerHTML = "";

  let left = shoppingItems.filter(item => !item.checked).length;
  let checked = shoppingItems.length - left;
  document.getElementById("shoppingSummary").textContent =
    left + (left === 1 ? " item" : " items") + " to buy" + (checked ? " · " + checked + " checked" : "");

  categories.forEach(category => {
    let group = shoppingItems.filter(item => item.category === category);
    if (group.length === 0) return;

    const header = document.createElement("li");
    header.className = "category-title";
    header.textContent = category;
    shoppingList.appendChild(header);

    group.forEach(item => {
      const index = shoppingItems.indexOf(item);
      const listItem = document.createElement("li");
      const checkbox = document.createElement("input");
      const label = document.createElement("label");
      const removeButton = document.createElement("button");

      listItem.className = "shopping-item" + (item.checked ? " checked" : "");

      checkbox.type = "checkbox";
      checkbox.id = "shop_" + index;
      checkbox.checked = item.checked;
      checkbox.addEventListener("change", () => {
        item.checked = checkbox.checked;
        displayShoppingItems();
      });

      label.textContent = item.name;
      label.htmlFor = checkbox.id;

      const text = document.createElement("div");
      text.className = "item-text";
      const details = document.createElement("div");
      details.className = "item-details";
      details.innerHTML = "<span class='tag " + item.owner.toLowerCase() + "'>" + item.owner + "</span>";
      if (item.note) details.append(item.note);
      text.append(label, details);

      const qty = document.createElement("span");
      qty.className = "item-qty";
      qty.textContent = "×" + item.quantity;

      removeButton.type = "button";
      removeButton.className = "remove-button";
      removeButton.textContent = "✕";
      removeButton.setAttribute("aria-label", "Remove " + item.name);
      removeButton.addEventListener("click", () => {
        shoppingItems.splice(index, 1);
        displayShoppingItems();
      });

      listItem.append(checkbox, text, qty, removeButton);
      shoppingList.appendChild(listItem);
    });
  });

  if (shoppingItems.length === 0) {
    shoppingList.innerHTML = "<p class='empty-message'>Your list is empty.</p>";
  }

  document.getElementById("putAwayButton").style.display = checked ? "block" : "none";
}
function putAwayItems() {
  shoppingItems.filter(item => item.checked).forEach(item => {
    let location = categoryToLocation[item.category];
    let match = inventory.find(i => i.name.toLowerCase() === item.name.toLowerCase());
    if (match) {
      match.quantity += item.quantity;
    } else {
      inventory.push({ name: item.name, quantity: item.quantity, location: location, expiration: "", owner: item.owner });
    }
  });
  shoppingItems = shoppingItems.filter(item => !item.checked);
  displayShoppingItems();
  displayItems();
}

shoppingForm.addEventListener("submit", event => {
  event.preventDefault();

  const item = shoppingInput.value.trim();
  if (!item) return;
  addShoppingItem(
    item,
    Math.max(1, Number(document.getElementById("shoppingQty").value) || 1),
    document.getElementById("shoppingCategory").value,
    document.getElementById("shoppingOwner").value,
    document.getElementById("shoppingNote").value.trim()
  );

  shoppingInput.value = "";
  document.getElementById("shoppingQty").value = 1;
  document.getElementById("shoppingNote").value = "";
});

displayShoppingItems();

const recipes = {
  alfredo: {
    title: "Alfredo Pasta", time: 30,
    ingredients: ["Pasta", "Butter", "Heavy Cream", "Parmesan", "Garlic", "Black Pepper"],
    steps: ["Boil pasta until al dente.", "Melt butter and cook garlic for 1 minute.",
            "Add cream and simmer 3–4 minutes.", "Stir in parmesan and toss with pasta."]
  },
  omelet: {
    title: "Cheese Omelet", time: 15,
    ingredients: ["Eggs", "Cheese", "Butter", "Milk", "Spinach"],
    steps: ["Whisk eggs with milk.", "Melt butter in a pan.",
            "Pour in eggs, add spinach and cheese.", "Fold and cook until set."]
  },
  tacos: {
    title: "Chicken Tacos", time: 25,
    ingredients: ["Chicken", "Tortillas", "Onion", "Salsa", "Lime", "Cilantro", "Cheese"],
    steps: ["Cook the chicken 6–7 minutes per side.", "Slice chicken and dice onion.",
            "Warm the tortillas.", "Fill with chicken, salsa, cheese, cilantro and lime."]
  }
};

function findInventoryItem(name) {
  return inventory.find(item => item.name.toLowerCase() === name.toLowerCase() && item.quantity > 0);
}

function getMissingIngredients(key) {
  return recipes[key].ingredients.filter(name => !findInventoryItem(name));
}

function updateRecipeCards() {
  document.querySelectorAll("#recipeList .recipe-card").forEach(card => {
    let key = card.getAttribute("onclick").match(/'(.+)'/)[1];
    let total = recipes[key].ingredients.length;
    let missing = getMissingIngredients(key);
    let status = card.querySelector(".ready, .almost-ready");

    if (missing.length === 0) {
      status.className = "ready";
      status.textContent = "✓ You have everything";
    } else {
      status.className = "almost-ready";
      status.textContent = "You have " + (total - missing.length) + " of " + total + " ingredients";
    }
  });
}

function searchRecipes() {
  let search = document.getElementById("recipeSearch").value.toLowerCase();
  document.querySelectorAll("#recipeList .recipe-card").forEach(card => {
    let title = card.querySelector("h4").textContent.toLowerCase();
    card.style.display = title.includes(search) ? "flex" : "none";
  });
}

function showRecipe(key) {
  let recipe = recipes[key];
  let missing = getMissingIngredients(key);

  let html = "<button class='back-button' onclick='hideRecipe()'>‹ Back to recipes</button>";
  html += "<h2>" + recipe.title + "</h2>";
  html += "<p class='recipe-meta'>" + recipe.time + " min • " +
          (recipe.ingredients.length - missing.length) + " of " + recipe.ingredients.length + " ingredients in your kitchen</p>";

  html += "<h3>Ingredients</h3><ul class='ingredient-list'>";
  recipe.ingredients.forEach(name => {
    let item = findInventoryItem(name);
    if (item) {
      html += "<li class='have-ingredient'>✓ " + name + "<small>In your " + item.location.toLowerCase() + "</small></li>";
    } else {
      html += "<li class='missing-ingredient'>✕ " + name + "<small>Not in your kitchen</small></li>";
    }
  });
  html += "</ul>";

  if (missing.length > 0) {
    html += "<button class='shopping-button' id='addMissingButton' onclick=\"addMissingToList('" + key + "')\">" +
            "Add " + missing.length + " missing to shopping list</button>";
  }

  html += "<h3>Steps</h3><ol class='recipe-steps'>";
  recipe.steps.forEach(step => { html += "<li>" + step + "</li>"; });
  html += "</ol>";

  document.getElementById("recipeDetails").innerHTML = html;
  document.getElementById("recipeList").style.display = "none";
  document.getElementById("recipeDetails").style.display = "block";
  document.getElementById("Recipes").scrollTop = 0;
}

function hideRecipe() {
  document.getElementById("recipeDetails").style.display = "none";
  document.getElementById("recipeList").style.display = "block";
}

function addMissingToList(key) {
  getMissingIngredients(key).forEach(name => {
    addShoppingItem(name, 1, "Other", "Shared", "For " + recipes[key].title);
  });
  let button = document.getElementById("addMissingButton");
  button.outerHTML = "<div class='success-message'>✓ Added to your shopping list</div>";
}

updateRecipeCards();
