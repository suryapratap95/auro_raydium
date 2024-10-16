import assert from 'assert';
import {getBestSwapQuote, getPossiblePaths } from '../utils/qoutecalculator.js'


describe('Raydium Swap Quote Tests', () => {
  it('should return possible paths for ETH/USDC', async () => {
    const paths = await getPossiblePaths('ETH/USDC');
    assert.deepStrictEqual(paths, [['ETH', 'USDC'], ['ETH', 'SOL', 'USDC']]);
  });

  it('should calculate best swap quote for a direct path', async () => {
    const quote = await getBestSwapQuote(['ETH', 'USDC'], 1, 'SELL');
    assert(quote > 0, 'Quote should be greater than zero');
  });

  it('should calculate best swap quote for a multi-hop path', async () => {
    const quote = await getBestSwapQuote(['ETH', 'SOL', 'USDC'], 1, 'SELL');
    assert(quote > 0, 'Quote should be greater than zero');
  });
});
