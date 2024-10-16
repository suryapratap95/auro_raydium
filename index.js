// const { getBestSwapQuote, getPossiblePaths } = require('./utils/qoutecalculator');

import {getBestSwapQuote, getPossiblePaths } from './utils/qoutecalculator.js'

async function calculateBestQuote(tokenPair, amount, side) {
  const paths = await getPossiblePaths(tokenPair);
  let bestQuote = null;
  let bestStrategy = null;

  for (let split = 0.1; split <= 1; split += 0.1) {
    const splitAmount = amount * split;

    for (let path of paths) {
      const quote = await getBestSwapQuote(path, splitAmount, side);

      if (!bestQuote || quote > bestQuote) {
        bestQuote = quote;
        bestStrategy = { path, split };
      }
    }
  }

  return { bestQuote, bestStrategy };
}

// Test with ETH/USDC pair, selling 1 ETH
calculateBestQuote('ETH-USDC', 1, 'SELL').then(result => {
  console.log('Best Quote:', result.bestQuote);
  console.log('Best Strategy:', result.bestStrategy);
});
