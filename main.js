import { marketDrugs, playerRanks, randomEvents } from "./models.js";

const SELL_BTN = document.getElementById("sell-drugs");
const BUY_BTN = document.getElementById("buy-drugs");

const INVENTORY_SELECTOR = document.getElementById("inventory");
const MARKET_SELECTOR = document.getElementById("market");

const BTN_SHOPPING = document.getElementById("btn-shopping");
const BTN_PLACES = document.getElementById("btn-places");
const BTN_FINANCES = document.getElementById("btn-finances");

const BTN_TRAVEL = document.getElementById("btn-travel");
const BTN_STAY = document.getElementById("btn-stay");

const GAME_INFO_SELECTOR = document.getElementById("game-info");
const DAY_COUNTER_SELECTOR = document.getElementById("day-counter");
const LOCATION_INDICATOR_SELECTOR =
  document.getElementById("location-indicator");

let marketDrugSelected = null;
let playerDrugSelected = null;

let dayCounter = 1;

// Initial game state

let playerInventory = {
  drugs: [],
  items: [],
  weapons: [],
};

let player = {
  cash: 1000,
  debt: 500,
  inventory: playerInventory,
  location: "New York",
};

const LOG_CONTENTS = ["Information about the game goes here..."];

GAME_INFO_SELECTOR.value = LOG_CONTENTS.join("\n");

// Update UI elements
function updateUiState() {
  document.getElementById("cash").innerText = `$${player.cash}`;
  document.getElementById("debt").innerText = `$${player.debt}`;

  updateDrugState();
  updateBuyButtonState();
  DAY_COUNTER_SELECTOR.innerHTML = `Day ${dayCounter}`;
  LOCATION_INDICATOR_SELECTOR.innerHTML = `${player.location}`;
}

// assumes INVENTORY_SELECTOR = document.getElementById("inventory"); // <tbody>
// and MARKET_SELECTOR = document.getElementById("market");           // <tbody>

const updateDrugState = () => {
  // Clear existing rows
  INVENTORY_SELECTOR.innerHTML = "";
  MARKET_SELECTOR.innerHTML = "";

  // MARKET TABLE ROWS
  marketDrugs.forEach((drug, idx) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="drug-name">${drug.name}</td>
      <td class="drug-quantity text-center">${drug.quantity}</td>
      <td class="drug-price text-end">$${drug.basePrice}</td>
    `;
    // reflect selected state on render
    if (drug.selected) row.classList.add("selected");

    row.addEventListener("click", () => {
      drugClicked({ scope: "market", idx, drug }, row);
    });

    MARKET_SELECTOR.appendChild(row);
  });

  // INVENTORY TABLE ROWS
  player.inventory.drugs.forEach((invDrug, idx) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="drug-name">${invDrug.name}</td>
      <td class="drug-quantity text-center">${invDrug.quantity}</td>
    `;
    // add a temporary flag for selection (separate from marketDrugs)
    if (invDrug.selected) row.classList.add("selected");

    row.addEventListener("click", () => {
      drugClicked({ scope: "inventory", idx, drug: invDrug }, row);
    });

    INVENTORY_SELECTOR.appendChild(row);
  });

  updateBuyButtonState();
  updateListStyles();
};

// highlight rows based on .selected flags
const updateListStyles = () => {
  // Market rows from marketDrugs.selected
  const marketRows = MARKET_SELECTOR.querySelectorAll("tr");
  marketRows.forEach((tr, i) => {
    tr.classList.toggle("selected", !!marketDrugs[i]?.selected);
  });

  // Inventory rows from inventory item .selected
  const invRows = INVENTORY_SELECTOR.querySelectorAll("tr");
  invRows.forEach((tr, i) => {
    tr.classList.toggle("selected", !!player.inventory.drugs[i]?.selected);
  });
};

// handle clicks for both tables
const drugClicked = ({ scope, idx, drug }, rowEl) => {
  if (scope === "market") {
    // deselect all other market items
    marketDrugs.forEach(
      (d, i) => (d.selected = i === idx ? !d.selected : false)
    );
    marketDrugSelected = marketDrugs[idx].selected ? drug : null;
    // when selecting in market, clear inventory selection
    player.inventory.drugs.forEach((d) => (d.selected = false));
    playerDrugSelected = null;
  } else {
    // inventory selection (for selling, etc.)
    player.inventory.drugs.forEach(
      (d, i) => (d.selected = i === idx ? !d.selected : false)
    );
    playerDrugSelected = player.inventory.drugs[idx].selected ? drug : null;
    // when selecting in inventory, clear market selection
    marketDrugs.forEach((d) => (d.selected = false));
    marketDrugSelected = null;
  }

  updateBuyButtonState();
  updateListStyles();
};

// unchanged, but now tied to table rows
const updateBuyButtonState = () => {
  BUY_BTN.disabled =
    !marketDrugSelected ||
    player.cash < marketDrugSelected.basePrice ||
    marketDrugSelected.quantity <= 0;
};

const drugTransaction = (drugName, cost, transactionType) => {
  if (transactionType === "purchase") {
    const drugExistsInInventory = player.inventory.drugs.find(
      (d) => d.name === drugName
    );

    if (drugExistsInInventory) {
      drugExistsInInventory.quantity += 1;
      player.cash -= cost;

      // initialiseDrugs("inventory", player.inventory.drugs);
    } else {
      const drugPayload = { name: drugName, quantity: 1 };
      // console.log("Adding new drug to inventory", drugPayload);
      player.inventory.drugs.push(drugPayload);
      player.cash -= cost;

      // console.log("New drug added to inventory", player.inventory);
    }
  } else if (transactionType === "sale") {
    // console.log("Selling drug:", drugName);
  }
  updateUiState();
};

// Buy drugs
BUY_BTN.addEventListener("click", () => {
  if (marketDrugSelected) {
    console.log("selected drug", marketDrugSelected);
    if (player.cash >= marketDrugSelected.basePrice) {
      marketDrugSelected.quantity -= 1; // Decrease the quantity of the drug available

      drugTransaction(
        marketDrugSelected.name,
        marketDrugSelected.basePrice,
        "purchase"
      );
      updateBuyButtonState();
    } else {
      alert("Not enough cash to buy drugs!");
    }
  }
});

// Sell drugs
SELL_BTN.addEventListener("click", () => {
  if (player.drugs > 0) {
    player.drugs -= 1;
    player.cash += 150; // selling for profit
    updateUI();
  } else {
    alert("You have no drugs to sell!");
  }
});

BTN_SHOPPING.addEventListener("click", () => {
  console.log("Shopping button clicked");
});

BTN_PLACES.addEventListener("click", () => {
  console.log("Places button clicked");
});

BTN_TRAVEL.addEventListener("click", () => {
  console.log("Travel button clicked");
});

BTN_STAY.addEventListener("click", () => {
  console.log("Stay Here button clicked");
  advanceDay();
});

const advanceDay = () => {
  console.log("Advancing to the next day");
  dayCounter++;
  DAY_COUNTER_SELECTOR.innerHTML = `Day ${dayCounter}`;
  updateUiState();
  if (dayCounter >= 50) {
    BTN_STAY.disabled = true;
    alert("Game Over");
  }
  // updateDayCounterUI();
};

console.log("player", player);

// Initialize the game
updateUiState();
