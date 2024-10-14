import { drugsAvailable, playerRanks, randomEvents } from "./models.js";

// Initial game state
let player = {
  cash: 1000,
  debt: 500,
  drugs: 0,
  location: "New York",
};

let selectedDrug = null;

// List of available drugs and their prices

let playerInventory = {
  drugs: [],
  cash: 1000,
  inventory: [],
};

// Update UI elements
function updateUI() {
  document.getElementById("cash").innerText = `$${player.cash}`;
  document.getElementById("debt").innerText = `$${player.debt}`;
  document.getElementById("location").innerText = `${player.location}`;

  // Update drug list
  updateList();
}

let updateList = () => {
  console.log("updaing lsit");
  const drugList = document.getElementById("drug-list");
  drugList.innerHTML = ""; // Clear existing items
  drugsAvailable.forEach((drug) => {
    const listItem = document.createElement("li");
    listItem.role = "button";
    listItem.className = "list-group-item";
    listItem.innerHTML = `
  <div class="drug-item">
    <span class="drug-name">${drug.name}</span>
    <span class="drug-quantity">${drug.quantity}</span>
    <span class="drug-price">$${drug.basePrice}</span>
  </div>
`;
    listItem.style.backgroundColor = drug.selected ? "lightblue" : "white";
    listItem.addEventListener("click", () => {
      drugClicked(drug, listItem);
    });
    drugList.appendChild(listItem);
  });
};

let updateListStyles = () => {
  const drugList = document.getElementById("drug-list");
  drugList.childNodes.forEach((item, index) => {
    item.style.backgroundColor = drugsAvailable[index].selected
      ? "lightblue"
      : "white";
  });
};

let drugClicked = (drug, listItem) => {
  drugsAvailable.forEach((d) => {
    if (d !== drug) {
      d.selected = false;
    }
  });
  drug.selected = !drug.selected;

  console.log("drug clicked", drug, listItem);
  selectedDrug = drug.selected ? drug : null;
  console.log("selected drug", selectedDrug);
  updateListStyles();
  buyButton.disabled = !selectedDrug;
};

let buyButton = document.getElementById("buy-drugs");

// Buy drugs
buyButton.addEventListener("click", () => {
  if (selectedDrug) {
    console.log("selected drug", selectedDrug);
    // if (player.cash >= selectedDrug.basePrice) {
    // player.drugs += 1;
    // player.cash -= selectedDrug.basePrice;
    // updateUI();
    // } else {
    // alert("Not enough cash to buy drugs!");
    // }
  }
  //   if (player.cash >= drugsAvailable[0].price) {
  //     player.drugs += 1;
  //     player.cash -= drugsAvailable[0].price;
  //     updateUI();
  //   } else {
  //     alert("Not enough cash to buy drugs!");
  //   }
});

// Sell drugs
document.getElementById("sell-drugs").addEventListener("click", () => {
  if (player.drugs > 0) {
    player.drugs -= 1;
    player.cash += 150; // selling for profit
    updateUI();
  } else {
    alert("You have no drugs to sell!");
  }
});

// Travel to a new location
document.getElementById("travel").addEventListener("click", () => {
  let locations = ["New York", "Los Angeles", "Miami", "Chicago"];

  let currentLocationIndex = locations.indexOf(player.location);
  locations.splice(currentLocationIndex, 1);
  //   console.log(locations);

  player.location = locations[Math.floor(Math.random() * locations.length)];
  updateUI();
});

// Initialize the game
updateUI();
