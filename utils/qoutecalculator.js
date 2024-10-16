import redisClient from '../config/redisconfig.js'; 

import  raydium  from '@raydium-io/raydium-sdk'

// Precompute swap paths
export async function getPossiblePaths(tokenPair) {
  //  Return predefined paths or fetch paths dynamically
  const paths = {
    'ETH-USDC': [['WETH', 'USDC'], ['WETH', 'SOL', 'USDC']],
    'SOL-USDC': [['SOL', 'USDC']],
    

  };
  return paths[tokenPair] || [];
}

// Calculate swap quote for a specific path
export async function getBestSwapQuote(path, amount, side) {
  let totalQuote = 0;
  try {
    for (let i = 0; i < path.length - 1; i++) {
      const fromToken = path[i];
      const toToken = path[i + 1];
      const pair = `${fromToken}-${toToken}`;
      console.log('pairs: ', pair)
      const poolData = await redisClient.get(pair);
      console.log('pooldata: ', poolData)
      if (!poolData) {
        throw new Error(`Pool data not found for ${pair}`);
      }

      const pool = JSON.parse(poolData);
      const quote = raydium.AMM.calculateSwap(pool, amount, side); 
      totalQuote += quote;
      amount = quote; 
    }
  } catch (error) {
    console.error(`Error calculating quote for path ${path}:`, error);
  }
  return totalQuote;
}

 export default    { getBestSwapQuote, getPossiblePaths };
