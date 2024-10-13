const { redisClient } = require('./poolDataFetcher');
const { getBestSplitQuote } = require('./quotecalculator');

async function waitForPoolData(symbol) {
  let retries = 0;
  while (retries < 10) {
    try {
      await getBestSplitQuote(symbol, 1);
      return;
    } catch (error) {
      console.log(`Waiting for pool data for ${symbol}...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      retries++;
    }
  }
  throw new Error(`Timeout waiting for pool data for ${symbol}`);
}

async function runTest() {
  try {
    // Ensure Redis client is connected
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    const symbol = 'ETH/USDC';
    const amount = 1; // 1 ETH to swap

    await waitForPoolData(symbol);

    const bestQuote = await getBestSplitQuote(symbol, amount);
    console.log(`Best swap quote for ${amount} ETH: ${bestQuote} USDC`);

  } catch (error) {
    console.error('Error in test:', error);
  } finally {
    // Close the Redis connection
    await redisClient.quit();
  }
}

runTest();