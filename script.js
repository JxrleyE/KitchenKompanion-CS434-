// NEW: becomes true once everything below has loaded
var appReady = false;

function openCity(tab) {
  // Hide all elements with class="tabcontent" by default
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");

  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Show the specific tab content
  document.getElementById(tab).style.display = "block";

  // NEW: refresh screens so they reflect changes made on other tabs
  if (appReady) {
    displayItems();
    displayShoppingItems();
    updateRecipeCards();
  }
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
// UPDATED: added a few more items so the screen shows a realistic list
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



// KITCHEN TAB FEATURES //

// Default storage
let currentLocation = "Fridge";

// NEW: current filter chip and the item being edited (null = adding)
let currentFilter = "All";
let editingItem = null;


// Switch storage logic
function changeLocation(location) {

  currentLocation = location;

  hideForm();

  // Update section heading
  document.getElementById("locationTitle").textContent =
    location + " Items";

  // NEW: search placeholder names the location being searched
  searchBar.placeholder = "Search " + location.toLowerCase() + " items";

  // Highlight selected storage button
  let storageButtons = document.querySelectorAll(
    ".storage-buttons button"
  );

  for (let i = 0; i < storageButtons.length; i++) {
    // UPDATED: compare only the location name (buttons now show a count too)
    if (storageButtons[i].textContent.startsWith(location)) {
      storageButtons[i].classList.add("active");
    } else {
      storageButtons[i].classList.remove("active");
    }
  }

  displayItems();
}


// NEW: filter chips (All / Expiring soon / Mine / Shared)
function setFilter(filter) {
  currentFilter = filter;
  let chips = document.querySelectorAll("#Kitchen .chip");
  for (let i = 0; i < chips.length; i++) {
    chips[i].classList.toggle("active", chips[i].getAttribute("onclick").includes("'" + filter + "'"));
  }
  displayItems();
}


// NEW: days until an item expires (negative = already expired)
function daysUntil(dateString) {
  if (!dateString) return null;
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  let parts = dateString.split("-");
  let date = new Date(parts[0], parts[1] - 1, parts[2]);
  return Math.round((date - today) / 86400000);
}

// NEW: readable expiration text, e.g. "Expires in 2 days"
function expirationText(item) {
  let days = daysUntil(item.expiration);
  if (days === null) return { text: "No expiration date", status: "" };
  if (days < 0) return { text: "⚠ Expired " + (-days) + (days === -1 ? " day ago" : " days ago"), status: "expired" };
  if (days === 0) return { text: "⚠ Expires today", status: "expired" };
  if (days <= 3) return { text: "Expires in " + days + (days === 1 ? " day" : " days"), status: "expiring-soon" };
  return { text: "Expires: " + item.expiration, status: "" };
}


// Display food inventory
function displayItems() {

  let list = document.getElementById("inventoryList");

  // Clear previous items
  list.innerHTML = "";

  let user_search = searchBar.value.toLowerCase()

  let count = 0

  // NEW: item counts on the Fridge / Pantry / Freezer buttons
  let storageButtons = document.querySelectorAll(".storage-buttons button");
  for (let i = 0; i < storageButtons.length; i++) {
    let loc = ["Fridge", "Pantry", "Freezer"][i];
    let total = inventory.filter(item => item.location === loc).length;
    storageButtons[i].textContent = loc + " (" + total + ")";
  }

  // NEW: sort so items expiring soonest are at the top
  let sorted = inventory.slice().sort(function(a, b) {
    return (daysUntil(a.expiration) ?? 9999) - (daysUntil(b.expiration) ?? 9999);
  });

  // Loop through inventory
  for (let i = 0; i < sorted.length; i++) {

    let item = sorted[i];
    let exp = expirationText(item);

    // NEW: apply filter chip
    if (currentFilter === "Expiring" && exp.status === "") continue;
    if ((currentFilter === "Mine" || currentFilter === "Shared") && item.owner !== currentFilter) continue;

    // Only show items in selected location
    if (item.location === currentLocation && item.name.toLowerCase().includes(user_search)) {
      count++

      let card = document.createElement("div");
      card.className = "food-card " + exp.status;   // UPDATED: colored edge when expiring

      let info = document.createElement("div");
      info.className = "food_info";
      info.title = "Tap to edit";
      info.addEventListener("click", function() { showForm(item); });   // NEW: tap to edit

      let nameRow = document.createElement("div");
      nameRow.className = "food_name_row";

      let name = document.createElement("h4");
      name.textContent = item.name;

      let owner = document.createElement("span");
      owner.className = "tag " + item.owner.toLowerCase();
      owner.textContent = item.owner;

      let expiration = document.createElement("p");
      expiration.textContent = exp.text;   // UPDATED: friendlier date text
      if (exp.status === "expired") expiration.className = "exp-expired";
      if (exp.status === "expiring-soon") expiration.className = "exp-soon";

      let quantity = document.createElement("p");
      quantity.className = "food_quantity";
      quantity.textContent = item.quantity;   // UPDATED: shown between - and + buttons

      nameRow.appendChild(name);
      nameRow.appendChild(owner);

      info.appendChild(nameRow);
      info.appendChild(expiration);

      // NEW: quick quantity update without opening a form
      let controls = document.createElement("div");
      controls.className = "qty-controls";

      let minus = document.createElement("button");
      minus.textContent = "−";
      minus.setAttribute("aria-label", "Use one " + item.name);
      minus.addEventListener("click", function() { changeQuantity(item, -1); });

      let plus = document.createElement("button");
      plus.textContent = "+";
      plus.setAttribute("aria-label", "Add one " + item.name);
      plus.addEventListener("click", function() { changeQuantity(item, 1); });

      controls.appendChild(minus);
      controls.appendChild(quantity);
      controls.appendChild(plus);

      card.appendChild(info);
      card.appendChild(controls);
      list.appendChild(card);
    }
  }

  // NEW: "Showing x items" count
  document.getElementById("itemCount").textContent = count + (count === 1 ? " item" : " items");

  // NEW: if the search matches items in another location, say where
  let hint = document.getElementById("otherLocation");
  hint.innerHTML = "";
  if (user_search !== "") {
    let elsewhere = inventory.filter(item =>
      item.location !== currentLocation && item.name.toLowerCase().includes(user_search));
    if (elsewhere.length > 0) {
      let box = document.createElement("div");
      box.className = "location-hint";
      let text = document.createElement("span");
      text.textContent = "Also found in " + elsewhere[0].location + ": " +
        elsewhere.map(item => item.name).join(", ");
      let go = document.createElement("button");
      go.textContent = "Show";
      go.addEventListener("click", function() { changeLocation(elsewhere[0].location); });
      box.appendChild(text);
      box.appendChild(go);
      hint.appendChild(box);
    }
  }

  if (count == 0) {
    list.innerHTML = "<p class='empty-message'>No matching items found</p>"
  }
}


// NEW: + / - buttons on each item
function changeQuantity(item, amount) {
  item.quantity += amount;

  if (item.quantity <= 0) {
    let index = inventory.indexOf(item);
    inventory.splice(index, 1);
    item.quantity = 1;
    displayItems();

    // Offer to put it on the shopping list
    showToast(item.name + " is used up.", "Add to list", function() {
      addShoppingItem(item.name, 1, "", item.owner, "");
      showToast(item.name + " added to shopping list.");
    });
    return;
  }
  displayItems();
}


//Add item logic
const addItem = document.getElementById("add_item");

// UPDATED: the same form is used to add a new item or edit an existing one
function showForm(item) {
  editingItem = item || null;

  if (editingItem) {
    document.getElementById("add_title").textContent = "Edit " + editingItem.name;
    document.getElementById("new_name").value = editingItem.name;
    document.getElementById("new_quantity").value = editingItem.quantity;
    document.getElementById("new_location").value = editingItem.location;
    document.getElementById("new_expiration").value = editingItem.expiration;
    document.getElementById("new_owner").value = editingItem.owner;
    document.getElementById("add_submit").textContent = "Save";
    document.getElementById("delete_item").style.display = "block";
  } else {
    addItem.reset();
    document.getElementById("add_title").textContent =
      "Add to " + currentLocation;
    document.getElementById("new_location").value = currentLocation;
    document.getElementById("new_name").value = searchBar.value;  // NEW: pre-fill from search
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
    location: document.getElementById("new_location").value,
    expiration: document.getElementById("new_expiration").value,
    owner: document.getElementById("new_owner").value
  };

  if (editingItem) {
    Object.assign(editingItem, details);   // NEW: save edits
    showToast(name + " updated.");
  } else {
    inventory.push(details);
    showToast(name + " added to " + details.location + ".");
  }

  searchBar.value = "";
  hideForm();
  changeLocation(details.location);
});

// NEW: remove an item (with Undo)
function deleteEditingItem() {
  let item = editingItem;
  let index = inventory.indexOf(item);
  inventory.splice(index, 1);
  hideForm();
  displayItems();
  showToast(item.name + " removed.", "Undo", function() {
    inventory.splice(index, 0, item);
    displayItems();
  });
}

// Show Fridge inventory when the page loads
changeLocation("Fridge");


// -----------------------------------
// NEW: TOAST MESSAGE (confirmation + Undo)
// -----------------------------------
let toastTimer;
function showToast(message, actionText, action) {
  let toast = document.getElementById("toast");
  let actionButton = document.getElementById("toastAction");
  document.getElementById("toastText").textContent = message;

  if (actionText) {
    actionButton.style.display = "block";
    actionButton.textContent = actionText;
    actionButton.onclick = function() {
      toast.style.display = "none";
      action();
    };
  } else {
    actionButton.style.display = "none";
  }

  toast.style.display = "flex";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { toast.style.display = "none"; }, 5000);
}


// -----------------------------------
// SHOPPING TAB FEATURES
// -----------------------------------

// UPDATED: each item now has quantity, store section, owner, note and checked state
let shoppingItems = [
  { name: "Apples", quantity: 6, category: "Produce", owner: "Mine", note: "Honeycrisp", checked: false },
  { name: "Milk", quantity: 1, category: "Dairy & Eggs", owner: "Shared", note: "2%", checked: false },
  { name: "Pasta", quantity: 2, category: "Pantry", owner: "Shared", note: "", checked: false }
];

const categories = ["Produce", "Dairy & Eggs", "Meat & Seafood", "Bakery", "Pantry", "Frozen", "Household", "Other"];

// NEW: guess the store section from the item name
const categoryWords = {
  "Produce": ["apple", "banana", "lime", "lemon", "onion", "garlic", "spinach", "lettuce", "tomato", "cilantro", "potato", "carrot", "avocado", "fruit", "berries"],
  "Dairy & Eggs": ["milk", "egg", "cheese", "parmesan", "butter", "yogurt", "cream"],
  "Meat & Seafood": ["chicken", "beef", "pork", "turkey", "fish", "salmon", "shrimp", "bacon"],
  "Bakery": ["bread", "bagel", "tortilla", "bun"],
  "Frozen": ["frozen", "ice cream", "pizza"],
  "Household": ["paper towel", "soap", "detergent", "trash bag", "foil", "sponge"],
  "Pantry": ["pasta", "rice", "oil", "salsa", "beans", "flour", "sugar", "coffee", "tea", "cereal", "sauce", "pepper", "salt"]
};
function guessCategory(name) {
  let lower = name.toLowerCase();
  for (let category in categoryWords) {
    if (categoryWords[category].some(word => lower.includes(word))) return category;
  }
  return "Other";
}

// NEW: where each section is usually stored when you get home
const categoryToLocation = {
  "Produce": "Fridge", "Dairy & Eggs": "Fridge", "Meat & Seafood": "Fridge",
  "Bakery": "Pantry", "Pantry": "Pantry", "Frozen": "Freezer", "Other": "Pantry"
};

const shoppingForm = document.getElementById("shoppingForm");
const shoppingInput = document.getElementById("shoppingInput");
const shoppingList = document.getElementById("shoppingList");


// NEW: adds an item, or increases the quantity if it's already on the list
function addShoppingItem(name, quantity, category, owner, note) {
  let existing = shoppingItems.find(item =>
    item.name.toLowerCase() === name.toLowerCase() && !item.checked);
  if (existing) {
    existing.quantity += quantity;
  } else {
    shoppingItems.push({
      name: name,
      quantity: quantity,
      category: category || guessCategory(name),
      owner: owner || "Shared",
      note: note || "",
      checked: false
    });
  }
  displayShoppingItems();
}


function displayShoppingItems() {
  shoppingList.innerHTML = "";

  let toBuy = shoppingItems.filter(item => !item.checked);
  let inCart = shoppingItems.filter(item => item.checked);

  // NEW: summary + badge on the Shopping tab
  document.getElementById("shoppingSummary").textContent =
    toBuy.length + (toBuy.length === 1 ? " item" : " items") + " to buy" +
    (inCart.length ? " · " + inCart.length + " in cart" : "");
  let badge = document.getElementById("shoppingBadge");
  badge.textContent = toBuy.length;
  badge.style.display = toBuy.length ? "block" : "none";

  // NEW: group the list by store section so it follows the store layout
  categories.forEach(category => {
    let group = toBuy.filter(item => item.category === category);
    if (group.length === 0) return;

    let header = document.createElement("li");
    header.className = "category-title";
    header.innerHTML = "<span>" + category + "</span><span>" + group.length + "</span>";
    shoppingList.appendChild(header);

    group.forEach(item => shoppingList.appendChild(createShoppingRow(item)));
  });

  if (toBuy.length === 0) {
    shoppingList.innerHTML = "<p class='empty-message'>" +
      (inCart.length ? "Everything is in your cart!" : "Your list is empty.") + "</p>";
  }

  displaySuggestions();
  displayCart(inCart);
}


// UPDATED: each row has a checkbox, details, quantity buttons and remove
function createShoppingRow(item) {
  const listItem = document.createElement("li");
  listItem.className = "shopping-item" + (item.checked ? " checked" : "");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = item.checked;
  checkbox.id = "shop_" + shoppingItems.indexOf(item);
  checkbox.addEventListener("change", () => {
    item.checked = checkbox.checked;
    displayShoppingItems();
  });

  const text = document.createElement("div");
  text.className = "item-text";

  const label = document.createElement("label");
  label.textContent = item.name;
  label.htmlFor = checkbox.id;

  const details = document.createElement("div");
  details.className = "item-details";
  const tag = document.createElement("span");
  tag.className = "tag " + item.owner.toLowerCase();
  tag.textContent = item.owner;
  details.appendChild(tag);
  if (item.note) {
    const note = document.createElement("span");
    note.textContent = item.note;
    details.appendChild(note);
  }
  text.append(label, details);

  const qty = document.createElement("div");
  qty.className = "item-qty-controls";
  const minus = document.createElement("button");
  minus.type = "button";
  minus.textContent = "−";
  minus.setAttribute("aria-label", "Fewer " + item.name);
  minus.addEventListener("click", () => {
    if (item.quantity > 1) item.quantity--;
    displayShoppingItems();
  });
  const amount = document.createElement("span");
  amount.textContent = item.quantity;
  const plus = document.createElement("button");
  plus.type = "button";
  plus.textContent = "+";
  plus.setAttribute("aria-label", "More " + item.name);
  plus.addEventListener("click", () => {
    item.quantity++;
    displayShoppingItems();
  });
  qty.append(minus, amount, plus);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "remove-button";
  removeButton.textContent = "✕";
  removeButton.setAttribute("aria-label", "Remove " + item.name);
  removeButton.addEventListener("click", () => {
    let index = shoppingItems.indexOf(item);
    shoppingItems.splice(index, 1);
    displayShoppingItems();
    showToast(item.name + " removed from list.", "Undo", function() {
      shoppingItems.splice(index, 0, item);
      displayShoppingItems();
    });
  });

  if (item.checked) {
    listItem.append(checkbox, text, removeButton);
  } else {
    listItem.append(checkbox, text, qty, removeButton);
  }
  return listItem;
}


// NEW: suggestions based on the kitchen (expired / running low / needed for a recipe)
function displaySuggestions() {
  let box = document.getElementById("shoppingSuggestions");
  let wasOpen = box.querySelector("details") && box.querySelector("details").open;
  box.innerHTML = "";

  let onList = shoppingItems.map(item => item.name.toLowerCase());
  let suggestions = [];

  inventory.forEach(item => {
    if (onList.includes(item.name.toLowerCase())) return;
    let days = daysUntil(item.expiration);
    if (days !== null && days < 0) {
      suggestions.push({ name: item.name, reason: "Expired in your " + item.location.toLowerCase(), owner: item.owner });
    } else if (item.quantity <= 1 && days !== null && days <= 3) {
      suggestions.push({ name: item.name, reason: "Last one, expires soon", owner: item.owner });
    }
  });

  for (let key in recipes) {
    getMissingIngredients(key).forEach(ingredient => {
      if (!onList.includes(ingredient.toLowerCase()) &&
          !suggestions.some(s => s.name.toLowerCase() === ingredient.toLowerCase())) {
        suggestions.push({ name: ingredient, reason: "Needed for " + recipes[key].title, owner: "Shared" });
      }
    });
  }

  if (suggestions.length === 0) return;

  let details = document.createElement("details");
  details.className = "suggestion-box";
  details.open = wasOpen;
  let summary = document.createElement("summary");
  summary.textContent = "Suggested from your kitchen (" + suggestions.length + ")";
  details.appendChild(summary);

  suggestions.forEach(s => {
    let row = document.createElement("div");
    row.className = "suggestion-row";
    let text = document.createElement("span");
    text.innerHTML = "<b></b><small></small>";
    text.querySelector("b").textContent = s.name;
    text.querySelector("small").textContent = s.reason;
    let add = document.createElement("button");
    add.className = "small-button";
    add.textContent = "+ Add";
    add.addEventListener("click", () => {
      let note = s.reason.startsWith("Needed for") ? s.reason.replace("Needed for", "For") : "";
      addShoppingItem(s.name, 1, "", s.owner, note);
      showToast(s.name + " added to list.");
    });
    row.append(text, add);
    details.appendChild(row);
  });

  box.appendChild(details);
}


// NEW: checked-off items can be put away straight into the kitchen inventory
function displayCart(inCart) {
  let section = document.getElementById("cartSection");
  section.innerHTML = "";
  if (inCart.length === 0) return;

  let box = document.createElement("div");
  box.className = "cart-box";
  box.innerHTML = "<h3>In cart (" + inCart.length + ")</h3>" +
    "<p>Home from the store? Choose where each item goes and add it to your kitchen.</p>";

  inCart.forEach(item => {
    let row = document.createElement("div");
    row.className = "putaway-row";
    let name = document.createElement("span");
    name.textContent = item.name + " ×" + item.quantity;

    let select = document.createElement("select");
    select.setAttribute("aria-label", "Where to put " + item.name);
    let places = item.category === "Household" ? ["Don't track"] : ["Fridge", "Pantry", "Freezer", "Don't track"];
    places.forEach(place => {
      let option = document.createElement("option");
      option.textContent = place;
      select.appendChild(option);
    });
    select.value = categoryToLocation[item.category] || "Don't track";
    item.putAwayIn = select.value;
    select.addEventListener("change", () => { item.putAwayIn = select.value; });

    let uncheck = document.createElement("button");
    uncheck.className = "remove-button";
    uncheck.textContent = "↺";
    uncheck.title = "Move back to list";
    uncheck.setAttribute("aria-label", "Move " + item.name + " back to list");
    uncheck.addEventListener("click", () => { item.checked = false; displayShoppingItems(); });

    row.append(name, select, uncheck);
    box.appendChild(row);
  });

  let putAway = document.createElement("button");
  putAway.className = "shopping-button";
  putAway.textContent = "Put away " + inCart.length + (inCart.length === 1 ? " item" : " items");
  putAway.addEventListener("click", () => putAwayItems(inCart));
  box.appendChild(putAway);

  section.appendChild(box);
}

function putAwayItems(inCart) {
  let added = 0;
  inCart.forEach(item => {
    if (item.putAwayIn && item.putAwayIn !== "Don't track") {
      let match = inventory.find(i =>
        i.name.toLowerCase() === item.name.toLowerCase() && i.location === item.putAwayIn);
      if (match) {
        match.quantity += item.quantity;
      } else {
        inventory.push({ name: item.name, quantity: item.quantity, location: item.putAwayIn, expiration: "", owner: item.owner });
      }
      added++;
    }
  });
  shoppingItems = shoppingItems.filter(item => !item.checked);
  displayShoppingItems();
  displayItems();
  updateRecipeCards();
  showToast(added + (added === 1 ? " item" : " items") + " added to your kitchen.");
}


// NEW: copy the list as text to paste into a message
function copyShoppingList() {
  let text = categories.map(category => {
    let group = shoppingItems.filter(item => item.category === category && !item.checked);
    if (group.length === 0) return "";
    return category + "\n" + group.map(item =>
      "- " + item.name + (item.quantity > 1 ? " x" + item.quantity : "") +
      (item.note ? " (" + item.note + ")" : "")).join("\n");
  }).filter(Boolean).join("\n\n");

  navigator.clipboard.writeText(text)
    .then(() => showToast("List copied. Paste it into a text or note."))
    .catch(() => showToast("Copying isn't available in this browser."));
}


shoppingForm.addEventListener("submit", event => {
  event.preventDefault();

  const item = shoppingInput.value.trim();
  if (!item) return;

  // UPDATED: uses quantity, section, owner and note
  let category = document.getElementById("shoppingCategory").value;
  addShoppingItem(
    item,
    Math.max(1, Number(document.getElementById("shoppingQty").value) || 1),
    category === "Auto section" ? "" : category,
    document.getElementById("shoppingOwner").value,
    document.getElementById("shoppingNote").value.trim()
  );

  shoppingInput.value = "";
  document.getElementById("shoppingQty").value = 1;
  document.getElementById("shoppingNote").value = "";
  shoppingInput.focus();
});


// -----------------------------------
// NEW: RECIPES TAB FEATURES
// (showRecipe and searchRecipes are called from the HTML)
// -----------------------------------

// use = how many units to subtract from inventory when the recipe is made
const recipes = {
  alfredo: {
    title: "Alfredo Pasta", time: 30,
    ingredients: [
      { name: "Pasta", amount: "1 box", use: 1 },
      { name: "Butter", amount: "1 stick", use: 1 },
      { name: "Heavy Cream", amount: "1 cup", use: 1 },
      { name: "Parmesan", amount: "1 cup grated", use: 1 },
      { name: "Garlic", amount: "2 cloves", use: 0 },
      { name: "Black Pepper", amount: "to taste", use: 0 }
    ],
    steps: ["Boil pasta in salted water until al dente.", "Melt butter and cook minced garlic for 1 minute.",
            "Add cream and simmer for 3–4 minutes.", "Stir in parmesan, toss with pasta and season with pepper."]
  },
  omelet: {
    title: "Cheese Omelet", time: 15,
    ingredients: [
      { name: "Eggs", amount: "3", use: 3 },
      { name: "Cheese", amount: "¼ cup shredded", use: 0 },
      { name: "Butter", amount: "1 tbsp", use: 0 },
      { name: "Milk", amount: "2 tbsp", use: 0 },
      { name: "Spinach", amount: "1 handful", use: 0 }
    ],
    steps: ["Whisk eggs with milk.", "Melt butter in a pan over medium heat.",
            "Pour in eggs and add spinach and cheese.", "Fold and cook until set."]
  },
  tacos: {
    title: "Chicken Tacos", time: 25,
    ingredients: [
      { name: "Chicken", amount: "1 lb", use: 1 },
      { name: "Tortillas", amount: "8", use: 1 },
      { name: "Onion", amount: "½", use: 0 },
      { name: "Salsa", amount: "½ cup", use: 0 },
      { name: "Lime", amount: "1", use: 0 },
      { name: "Cilantro", amount: "1 handful", use: 0 },
      { name: "Cheese", amount: "½ cup", use: 0 }
    ],
    steps: ["Season and cook chicken for 6–7 minutes per side.", "Slice the chicken and dice the onion.",
            "Warm the tortillas.", "Fill with chicken, salsa, cheese, cilantro and a squeeze of lime."]
  }
};

let recipeFilter = "All";

function findInventoryItem(name) {
  return inventory.find(item => item.name.toLowerCase() === name.toLowerCase() && item.quantity > 0);
}

function getMissingIngredients(key) {
  return recipes[key].ingredients
    .filter(ingredient => !findInventoryItem(ingredient.name))
    .map(ingredient => ingredient.name);
}

// Updates the "You have X of Y" line on each recipe card from the real inventory
function updateRecipeCards() {
  let cards = document.querySelectorAll("#recipeList .recipe-card");
  let search = document.getElementById("recipeSearch").value.toLowerCase();
  let shown = 0;

  cards.forEach(card => {
    let key = card.getAttribute("onclick").match(/'(.+)'/)[1];
    let recipe = recipes[key];
    let total = recipe.ingredients.length;
    let missing = getMissingIngredients(key);
    let have = total - missing.length;

    let status = card.querySelector(".ready, .almost-ready");
    if (missing.length === 0) {
      status.className = "ready";
      status.textContent = "✓ You have everything";
    } else {
      status.className = "almost-ready";
      status.textContent = "You have " + have + " of " + total + " · Missing: " + missing.join(", ").toLowerCase();
    }
    card.querySelector("p").textContent = recipe.time + " min • " + total + " ingredients";

    // search by recipe name or ingredient
    let matchesSearch = recipe.title.toLowerCase().includes(search) ||
      recipe.ingredients.some(i => i.name.toLowerCase().includes(search));
    let matchesFilter =
      recipeFilter === "All" ||
      (recipeFilter === "Ready" && missing.length === 0) ||
      (recipeFilter === "Almost" && missing.length >= 1 && missing.length <= 2) ||
      (recipeFilter === "Quick" && recipe.time < 20);

    card.style.display = matchesSearch && matchesFilter ? "flex" : "none";
    card.dataset.missing = missing.length;
    if (matchesSearch && matchesFilter) shown++;
  });

  // Sort: recipes you can make now come first
  let parent = cards[0].parentNode;
  let noRecipes = document.getElementById("noRecipes");
  Array.from(cards)
    .sort((a, b) => a.dataset.missing - b.dataset.missing)
    .forEach(card => parent.insertBefore(card, noRecipes));

  noRecipes.style.display = shown === 0 ? "block" : "none";
}

function searchRecipes() {
  updateRecipeCards();
}

function setRecipeFilter(filter) {
  recipeFilter = filter;
  document.querySelectorAll(".recipe-chip").forEach(chip => {
    chip.classList.toggle("active", chip.getAttribute("onclick").includes("'" + filter + "'"));
  });
  updateRecipeCards();
}

function showRecipe(key) {
  let recipe = recipes[key];
  let details = document.getElementById("recipeDetails");
  let missing = getMissingIngredients(key);
  let notOnList = missing.filter(name =>
    !shoppingItems.some(item => item.name.toLowerCase() === name.toLowerCase() && !item.checked));

  let html = "<button class='back-button' onclick='hideRecipe()'>‹ Back to recipes</button>";
  html += "<h2>" + recipe.title + "</h2>";
  html += "<p class='recipe-meta'>" + recipe.time + " min • " +
          (recipe.ingredients.length - missing.length) + " of " + recipe.ingredients.length + " ingredients in your kitchen</p>";

  html += "<h3>Ingredients</h3><ul class='ingredient-list'>";
  recipe.ingredients.forEach(ingredient => {
    let item = findInventoryItem(ingredient.name);
    let onList = shoppingItems.some(s => s.name.toLowerCase() === ingredient.name.toLowerCase() && !s.checked);
    if (item) {
      let exp = expirationText(item);
      html += "<li class='have-ingredient'>✓ <b>" + ingredient.name + "</b> — " + ingredient.amount +
        "<small>In your " + item.location.toLowerCase() + " (" + item.quantity + ")" +
        (exp.status === "expired" ? " · check: " + exp.text.replace("⚠ ", "").toLowerCase() : "") + "</small></li>";
    } else {
      html += "<li class='missing-ingredient'>✕ <b>" + ingredient.name + "</b> — " + ingredient.amount +
        "<small>" + (onList ? "On your shopping list" : "Not in your kitchen") + "</small></li>";
    }
  });
  html += "</ul>";

  if (notOnList.length > 0) {
    html += "<button class='secondary-button' onclick=\"addMissingToList('" + key + "')\">Add " +
      notOnList.length + " missing " + (notOnList.length === 1 ? "item" : "items") + " to shopping list</button>";
  }

  html += "<h3>Steps</h3><ol class='recipe-steps'>";
  recipe.steps.forEach(step => { html += "<li>" + step + "</li>"; });
  html += "</ol>";

  // "I made this" removes the used ingredients from the inventory
  html += "<button class='shopping-button' onclick=\"madeRecipe('" + key + "')\"" +
    (missing.length ? " disabled" : "") + ">I made this — update my kitchen</button>";
  if (missing.length) {
    html += "<p style='text-align:center;margin:0'>Get the missing ingredients first.</p>";
  }

  details.innerHTML = html;
  document.getElementById("recipeList").style.display = "none";
  details.style.display = "block";
  document.getElementById("Recipes").scrollTop = 0;
}

function hideRecipe() {
  document.getElementById("recipeDetails").style.display = "none";
  document.getElementById("recipeList").style.display = "block";
  updateRecipeCards();
}

function addMissingToList(key) {
  let added = [];
  getMissingIngredients(key).forEach(name => {
    if (!shoppingItems.some(item => item.name.toLowerCase() === name.toLowerCase() && !item.checked)) {
      addShoppingItem(name, 1, "", "Shared", "For " + recipes[key].title);
      added.push(name);
    }
  });
  showRecipe(key);
  showToast("Added " + added.join(", ").toLowerCase() + " to your list.", "View list", function() {
    buttons[1].click();
  });
}

function madeRecipe(key) {
  let before = inventory.map(item => Object.assign({}, item));
  let used = [];
  recipes[key].ingredients.forEach(ingredient => {
    let item = findInventoryItem(ingredient.name);
    if (item && ingredient.use > 0) {
      item.quantity -= ingredient.use;
      used.push(ingredient.name.toLowerCase());
    }
  });
  inventory = inventory.filter(item => item.quantity > 0);
  displayItems();
  displayShoppingItems();
  showRecipe(key);
  showToast("Kitchen updated: used " + (used.join(", ") || "nothing tracked") + ".", "Undo", function() {
    inventory = before;
    displayItems();
    displayShoppingItems();
    showRecipe(key);
  });
}

displayShoppingItems();
updateRecipeCards();
appReady = true;
