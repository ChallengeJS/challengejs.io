const communicate = require('../communicate');
const COINS = [
  {denom: "quarter", value: 25},
  {denom: "dime", value: 10},
  {demon: "nickel", value: 5},
  {denom: "penny", value: 1}
];

const fullInventory = {
  quarter: 99,
  dime: 99,
  nickel: 99,
  penny: 99
};

const emptyInventory = {
  quarter: 2,
  dimes: 3,
  nickel: 3,
  penny: 100
};

communicate.sendToParent(makeChange(92), COINS, fullInventory);
