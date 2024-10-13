const { Connection, PublicKey } = require('@solana/web3.js');
const { Liquidity } = require('@raydium-io/raydium-sdk');
const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

async function connectToRedis() {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
}

const connection = new Connection(process.env.RPC_URL);

async function fetchAndCachePoolData(poolAddress) {
  try {
    const poolInfo = await Liquidity.fetchInfo({ connection, poolKeys: { id: new PublicKey(poolAddress) } });
    const reserveData = {
      baseReserve: poolInfo.baseReserve.toString(),
      quoteReserve: poolInfo.quoteReserve.toString(),
    };

    await redisClient.set(poolAddress, JSON.stringify(reserveData));
    console.log(`Cached data for pool: ${poolAddress}`);
  } catch (error) {
    console.error(`Failed to fetch or cache data for pool ${poolAddress}:`, error);
  }
}

const poolAddresses = {
  'ETH/USDC': '7o4DR3XdmS5UWuEiynyigP1susuCwWK5iEWZfDb8Ldzo', // ETH-USDC pool
  'SOL/USDC': 'CYbD9RaToYMtWKA7QZyoLahnHdWq553Vm62Lh6qWtuxq', // SOL-USDC pool
  // Add more pool addresses as needed
};

async function startFetchingPoolData() {
  console.log('Fetching pool data...');
  for (const [symbol, address] of Object.entries(poolAddresses)) {
    await fetchAndCachePoolData(address);
  }
}

// Connect to Redis and start the background fetching process
connectToRedis().then(() => {
  startFetchingPoolData();
  setInterval(startFetchingPoolData, 60 * 1000); // Fetch every minute
});

process.on('SIGINT', async () => {
  console.log('Closing Redis connection...');
  await redisClient.quit();
  process.exit(0);
});

module.exports = { redisClient, poolAddresses };