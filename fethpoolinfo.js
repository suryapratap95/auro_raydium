import {
    Liquidity,
    Market,
    findProgramAddress,
    LIQUIDITY_STATE_LAYOUT_V4,
    MARKET_STATE_LAYOUT_V3,
    SPL_MINT_LAYOUT,
} from '@raydium-io/raydium-sdk';
import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection('https://api.mainnet-beta.solana.com');

async function formatAmmKeysById(id) {
    const account = await connection.getAccountInfo(new PublicKey(id));

    console.log('Account data length:', account.data.length);
    console.log('Raw account data:', account.data);

    try {
        const info = LIQUIDITY_STATE_LAYOUT_V4.decode(account.data);
    } catch (decodeError) {
        console.error('Decoding error:', decodeError);
        console.error('Account data:', account.data);
    }

    if (account === null) throw Error('Get id info error');
    const info = LIQUIDITY_STATE_LAYOUT_V4.decode(account.data);

    const marketId = info.marketId;
    const marketAccount = await connection.getAccountInfo(marketId);
    if (marketAccount === null) throw Error('Get market info error');
    const marketInfo = MARKET_STATE_LAYOUT_V3.decode(marketAccount.data);

    const lpMint = info.lpMint;
    const lpMintAccount = await connection.getAccountInfo(lpMint);
    if (lpMintAccount === null) throw Error('Get lp mint info error');
    const lpMintInfo = SPL_MINT_LAYOUT.decode(lpMintAccount.data);

    return {
        id,
        baseMint: info.baseMint.toString(),
        quoteMint: info.quoteMint.toString(),
        lpMint: info.lpMint.toString(),
        baseDecimals: info.baseDecimal.toNumber(),
        quoteDecimals: info.quoteDecimal.toNumber(),
        lpDecimals: lpMintInfo.decimals,
        version: 4,
        programId: account.owner.toString(),
        authority: Liquidity.getAssociatedAuthority({ programId: account.owner }).publicKey.toString(),
        openOrders: info.openOrders.toString(),
        targetOrders: info.targetOrders.toString(),
        baseVault: info.baseVault.toString(),
        quoteVault: info.quoteVault.toString(),
        withdrawQueue: info.withdrawQueue.toString(),
        lpVault: info.lpVault.toString(),
        marketVersion: 3,
        marketProgramId: info.marketProgramId.toString(),
        marketId: info.marketId.toString(),
        marketAuthority: Market.getAssociatedAuthority({ programId: info.marketProgramId, marketId: info.marketId }).publicKey.toString(),
        marketBaseVault: marketInfo.baseVault.toString(),
        marketQuoteVault: marketInfo.quoteVault.toString(),
        marketBids: marketInfo.bids.toString(),
        marketAsks: marketInfo.asks.toString(),
        marketEventQueue: marketInfo.eventQueue.toString(),
        lookupTableAccount: PublicKey.default.toString()
    };
}

const targetPoolId = 'EoNrn8iUhwgJySD1pHu8Qxm5gSQqLK3za4m8xzD2RuEb';
const targetPoolInfo = await formatAmmKeysById(targetPoolId);

console.log('Final response is:', targetPoolInfo);

export { formatAmmKeysById };
