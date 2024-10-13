const { redisClient, poolAddresses } = require('./poolDataFetcher');

async function getPoolData(symbol) {
  const poolAddress = poolAddresses[symbol];
  if (!poolAddress) {
    throw new Error(`No pool address found for ${symbol}`);
  }
  const data = await redisClient.get(poolAddress);
  if (!data) {
    throw new Error(`No pool data found for ${symbol}. Make sure poolDataFetcher is running.`);
  }
  return JSON.parse(data);
}

function calculateSwapAmount(reserveIn, reserveOut, amountIn) {
  const amountInWithFee = amountIn * 0.9975; // 0.25% fee
  return (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);
}

async function getBestSplitQuote(symbol, amount) {
  const poolData = await getPoolData(symbol);
  
  const { baseReserve, quoteReserve } = poolData;
  return calculateSwapAmount(parseFloat(baseReserve), parseFloat(quoteReserve), amount);
}

module.exports = { getBestSplitQuote };