export const drugsAvailable = [
  {
    name: "Weed",
    basePrice: 100,
    quantity: 10,
    minPrice: 50,
    maxPrice: 150,
    selected: false,
  },
  {
    name: "Cocaine",
    basePrice: 200,
    quantity: 5,
    minPrice: 100,
    maxPrice: 250,
    selected: false,
  },
  {
    name: "Heroin",
    basePrice: 300,
    quantity: 3,
    minPrice: 150,
    maxPrice: 400,
    selected: false,
  },
  {
    name: "Meth",
    basePrice: 400,
    quantity: 2,
    minPrice: 200,
    maxPrice: 500,
    selected: false,
  },
];

export const playerRanks = [
  { name: "Newbie", minCash: 0, maxCash: 1000 },
  { name: "Dealer", minCash: 1001, maxCash: 5000 },
  { name: "Kingpin", minCash: 5001, maxCash: 10000 },
  { name: "Drug Lord", minCash: 10001, maxCash: 100000 },
];

export const randomEvents = [
  { name: "Police Raid", cashChange: -500, drugsChange: -5 },
  { name: "Drug Bust", cashChange: -1000, drugsChange: -10 },
  { name: "Mugging", cashChange: -100, drugsChange: -1 },
  { name: "Casino Win", cashChange: 500, drugsChange: 0 },
];
