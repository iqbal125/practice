const prices1 = [7, 1, 5, 3, 6, 4]
const output1 = 5

const prices2 = [7, 6, 4, 3, 1]
const output2 = 0

function maxProfit(prices) {
  let maxProfit = 0

  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      if (prices[i] < prices[j]) {
        const profit = prices[j] - prices[i]
        if (profit > maxProfit) maxProfit = profit
      }
    }
  }

  return maxProfit
}

// Example usage:
const prices = [1, 5, 3, 6, 4]
console.log(maxProfit(prices2))

// loop over array starting from 0
// do second pass over array and subtract from outer number if inner number is higher than outer number

// if higher than max profit, set as new max profit.
