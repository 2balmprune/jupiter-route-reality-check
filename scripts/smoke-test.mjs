const SOL = "So11111111111111111111111111111111111111112";
const USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const TAKER = "11111111111111111111111111111111";

async function getJson(url) {
  const response = await fetch(url);
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${text}`);
  }

  return JSON.parse(text);
}

const tokenResults = await getJson("https://api.jup.ag/tokens/v2/search?query=SOL");
if (!Array.isArray(tokenResults) || tokenResults.length === 0) {
  throw new Error("Tokens search returned no results for SOL");
}

const prices = await getJson(`https://api.jup.ag/price/v3?ids=${SOL},${USDC}`);
if (!prices[SOL]?.usdPrice || !prices[USDC]?.usdPrice) {
  throw new Error("Price API response did not include SOL and USDC prices");
}

const order = await getJson(
  `https://api.jup.ag/swap/v2/order?inputMint=${SOL}&outputMint=${USDC}&amount=100000000&taker=${TAKER}`,
);
if (!order.routePlan || !order.requestId) {
  throw new Error("Swap order response did not include routePlan and requestId");
}

console.log(
  JSON.stringify(
    {
      tokenResults: tokenResults.length,
      solUsd: prices[SOL].usdPrice,
      usdcUsd: prices[USDC].usdPrice,
      orderMode: order.mode,
      orderError: order.error ?? null,
      requestId: order.requestId,
    },
    null,
    2,
  ),
);
