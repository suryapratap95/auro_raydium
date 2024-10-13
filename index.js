const { Connection } = require('@solana/web3.js');
const { Pool } = require('@raydium-io/raydium-sdk');
const redis = require('redis');

const redisClient = redis.createClient();
const connection = new Connection('https://api.mainnet-beta.solana.com');

async function fetchAndCachePoolData(poolAddress) {
  const pool = await Pool.load(connection, poolAddress);
  const reserveData = {
    baseReserve: pool.baseTokenAmount.toString(),
    quoteReserve: pool.quoteTokenAmount.toString(),
  };

  await redisClient.set(poolAddress, JSON.stringify(reserveData), redis.print);
}

function startFetchingPoolData(poolAddresses) {
  setInterval(async () => {
    for (const address of poolAddresses) {
      await fetchAndCachePoolData(address);
    }
  }, 60 * 1000); // Fetch every minute
}

const poolAddresses = ['POOL_ADDRESS_1', 'POOL_ADDRESS_2']; // Add Raydium pool addresses
startFetchingPoolData(poolAddresses);
