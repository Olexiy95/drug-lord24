import { drugsAvailable, playerRanks, randomEvents } from "./models.js";

// Initial game state

let playerInventory = {
  drugs: [
    { name: "Weed", quantity: 0, basePrice: 100, selected: false },
    { name: "Cocaine", quantity: 0, basePrice: 200, selected: false },
    { name: "Heroin", quantity: 0, basePrice: 300, selected: false },
    { name: "Meth", quantity: 0, basePrice: 400, selected: false },
  ],
};

let player = {
  cash: 1000,
  debt: 500,
  inventory: playerInventory,
  location: "New York",
};

let selectedDrug = null;

// List of available drugs and their prices

// Update UI elements
function updateUI() {
  document.getElementById("cash").innerText = `$${player.cash}`;
  document.getElementById("debt").innerText = `$${player.debt}`;
  document.getElementById("location").innerText = `${player.location}`;

  document.getElementById("inventory").innerHTML = ""; // Clear existing inventory
  player.inventory.drugs.forEach((drug) => {
    const drugItem = document.createElement("li");
    drugItem.role = "button";
    drugItem.className = "list-group-item";
    drugItem.innerHTML = `
  <div class="drug-item">
      <span class="drug-name">${drug.name}</span>
      <span class="drug-quantity">${drug.quantity}</span>

      <span class="drug-price">$${drug.basePrice}</span>
      
  </div>
    `;
    document.getElementById("inventory").appendChild(drugItem);
    drugItem.addEventListener("click", () => {
      player.drugs[drug].selected = !player.drugs[drug].selected;
      selectedDrug = player.drugs[drug].selected ? player.drugs[drug] : null;
      updateListStyles();
      sellButton.disabled = !selectedDrug;
    });
  });

  // Update drug list
  // updateList();
  initialiseDrugs("drug-list", drugsAvailable);
}

const sellButton = document.getElementById("sell-drugs");

const initialiseDrugs = (elementId, drugList) => {
  const targetList = document.getElementById(elementId);
  targetList.innerHTML = ""; // Clear existing items

  drugList.forEach((drug) => {
    const drugItem = document.createElement("li");
    drugItem.role = "button";
    drugItem.className = "list-group-item";
    drugItem.innerHTML = `
  <div class="drug-item">
      <span class="drug-name">${drug.name}</span>
      <span class="drug-quantity">${drug.quantity}</span>
      <span class="drug-price">$${drug.basePrice}</span>
  </div>
    `;
    drugItem.style.backgroundColor = drug.selected ? "lightblue" : "white";
    drugItem.addEventListener("click", () => {
      drugClicked(drug, drugItem);
    });
    targetList.appendChild(drugItem);
  });
};

let updateList = () => {
  console.log("updating list");
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

  updateListStyles();
  buyButton.disabled = !selectedDrug;
};

let buyButton = document.getElementById("buy-drugs");

// Buy drugs
buyButton.addEventListener("click", () => {
  if (selectedDrug) {
    console.log("selected drug", selectedDrug);
    if (player.cash >= selectedDrug.basePrice) {
      player.drugs[selectedDrug.name].quantity += 1;
      player.cash -= selectedDrug.basePrice;

      updateUI();
    } else {
      alert("Not enough cash to buy drugs!");
    }
  }
  // if (player.cash >= drugsAvailable[0].price) {
  //   player.drugs += 1;
  //   player.cash -= drugsAvailable[0].price;
  //   updateUI();
  // } else {
  //   alert("Not enough cash to buy drugs!");
  // }
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

console.log("player", player);

// Travel to a new location
// document.getElementById("travel").addEventListener("click", () => {
//   let locations = ["New York", "Los Angeles", "Miami", "Chicago"];

//   let currentLocationIndex = locations.indexOf(player.location);
//   locations.splice(currentLocationIndex, 1);
//   //   console.log(locations);

//   player.location = locations[Math.floor(Math.random() * locations.length)];
//   updateUI();
// });

// Initialize the game
updateUI();
