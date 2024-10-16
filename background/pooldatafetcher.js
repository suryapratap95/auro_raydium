// Importing using ES module syntax
import { Liquidity } from '@raydium-io/raydium-sdk';
import redisClient from '../config/redisconfig.js'; 
import { Connection } from '@solana/web3.js';
import { formatAmmKeysById } from '../fethpoolinfo.js'; 

const connection = new Connection('https://api.mainnet-beta.solana.com');

const poolAddresses = {
  'WETH-USDC': 'EoNrn8iUhwgJySD1pHu8Qxm5gSQqLK3za4m8xzD2RuEb',
  'SOL-USDC': '58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2',
  'WETH-SOL':'EFRwp6tG2h3QZnBDcSpoGi5YJMnJdSXnMzDGpWFyafkr'


};

// liqduity pool fetch
async function fetchPoolData() {


  for (const [pair, address] of Object.entries(poolAddresses)) {
    try {
      console.log('Fetching pool data for:', pair, address);

      // Await the result from formatAmmKeysById
      const poolData = await formatAmmKeysById(address);
      console.log(`Data for ${pair}:`, poolData);

      // Save to Redis cache
      await redisClient.set(pair, JSON.stringify(poolData));
      console.log(`Cached data for pool: ${pair}`);
    } catch (error) {
      console.error(`Failed to fetch or cache data for pool ${pair} (${address}):`, error.message);
      console.error('Stack Trace:', error.stack);
    }
  }
}

// update and fetch for every 10 minutes
setInterval(fetchPoolData, 600000);
fetchPoolData();
