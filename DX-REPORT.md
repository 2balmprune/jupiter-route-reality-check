# Jupiter Developer Experience Report

Project: Jupiter Route Reality Check

## Summary

I built a keyless, browser-first route readiness checker that uses Jupiter Tokens V2, Price V3, and Swap V2 `/order` to answer a practical question before wallet signing: does a token have enough metadata, price coverage, liquidity, and route information to be worth presenting to a user?

The APIs were fast to discover through `llms.txt`, and the response shapes are highly usable by an agent. The strongest developer experience is the keyless path: I got from docs to three successful API calls in under 20 minutes without a wallet, API key, RPC node, SDK, or build step.

## What Worked Well

1. `llms.txt` is excellent as an agent entrypoint. It gave me product taxonomy, base URLs, endpoint names, authentication notes, rate limits, and raw Markdown links in one pass.
2. Keyless access is a major advantage for prototypes. It allowed immediate testing of Price, Tokens, and Swap V2.
3. Tokens V2 search returns enough metadata to build real UI immediately: icon, symbol, mint, verification status, liquidity, holder count, organic score, stats windows, and tags.
4. Swap V2 `/order` is useful even when the dummy taker has no funds. It still returns route plan, USD values, price impact, request ID, routing mode, and an intelligible `Insufficient funds` error.
5. Price V3 response objects are compact enough for UI state but still include useful fields like liquidity, decimals, block ID, and 24-hour price change.

## Friction And Specific Findings

### 1. The bounty asks for the email tied to a Developer Platform account, but keyless prototyping is explicitly supported

I built this project without an API key because the docs say keyless access is available for prototyping. The submission form still asks for the Developer Platform account email so usage can be cross-referenced.

Suggestion: let submissions choose between `keyless prototype` and `API-key project`, then ask for an account email only in the API-key path.

### 2. `/order` returns a rich quote and an error at the same time

Using a dummy taker produced an `Insufficient funds` error, but the response still included a route plan, USD values, price impact, router, mode, fee fields, and request ID. That is valuable behavior, but it is not obvious from the first-read docs that a quote with an execution-precondition error can still be useful.

Suggestion: document "quote-with-error" semantics. A small table would help:

- `NO_ROUTES_FOUND`: no route data
- `Insufficient funds`: route exists, taker cannot execute
- missing/invalid taker: transaction assembly problem

### 3. Token search responses are very large

`/tokens/v2/search?query=SOL` returns rich nested stats for many results. This is great for data-heavy tools, but it is more than a simple selector needs.

Suggestion: add an optional `fields=` or `compact=true` query mode for autocomplete and token pickers. A compact response with `id`, `symbol`, `name`, `icon`, `decimals`, `isVerified`, `organicScore`, `usdPrice`, and `liquidity` would reduce bandwidth and parsing.

### 4. The docs index explains product boundaries, but route-readiness is not presented as a first-class use case

Many developers need to answer "should I show this route to the user?" before signing. Today that requires piecing together Tokens, Price, and Swap docs.

Suggestion: add a guide called "Preflight a Swap Route" that combines:

- token search and verification
- price/liquidity lookup
- `/order` with a taker
- interpreting price impact and route plan
- handling insufficient funds/no-route errors

### 5. CORS worked for the public APIs I used, which is a hidden strength

The browser app directly called `api.jup.ag` without a backend proxy. That made the prototype very fast to ship.

Suggestion: explicitly document browser/CORS expectations for keyless access. Developers building dashboards and widgets will care.

## AI Stack Feedback

I used `llms.txt` rather than the CLI or MCP because this environment already had shell and browser access, and the project only needed read/quote APIs. The docs index was enough to route me to the relevant APIs quickly.

What would improve agent usage:

1. Put a minimal working `fetch()` example directly beside each base URL in `llms.txt` or `llms-full.txt`.
2. Add "agent-safe prototyping" examples that avoid private keys and signing.
3. Mark which endpoints are safe to call keylessly from a browser.
4. Include expected error JSON examples in the docs, not only successful responses.

## How I Would Rebuild The Developer Platform Experience

I would make the first screen a live API workbench rather than a docs/dashboard split:

1. Search a token.
2. Pick a quote path.
3. See generated curl, TypeScript, and Python snippets.
4. Toggle keyless/API-key mode.
5. Inspect response shape and error cases.
6. Save the call as a "recipe".

This would let developers interact with the APIs the moment they land, then graduate naturally into account creation once rate limits, analytics, or execution needs matter.

## What I Wish Existed

- Compact token search responses.
- A preflight-route guide.
- A route-readiness endpoint that combines token metadata, price, liquidity, and quoteability.
- Official browser examples for read-only experiences.
- Error taxonomy for `/order` and `/build`.
- A no-wallet sandbox taker mode for quote-only demos.

## Reproducibility

Run:

```bash
node scripts/smoke-test.mjs
```

Observed keyless calls on May 10, 2026:

- Price V3 returned SOL and USDC prices.
- Tokens V2 returned verified SOL metadata and related tokens.
- Swap V2 `/order` returned route metadata plus `Insufficient funds` for the dummy taker.
