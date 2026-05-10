# Jupiter Route Reality Check

Small browser-first Jupiter Developer Platform experiment for the Superteam/Jupiter "Not Your Regular Bounty" track.

It answers a practical pre-trade question without requiring wallet signing:

> If I want to swap a token into USDC, does Jupiter's public data suggest this route is ready, liquid, verified, and likely to quote cleanly?

## APIs Used

- Tokens V2: `GET https://api.jup.ag/tokens/v2/search?query=...`
- Price V3: `GET https://api.jup.ag/price/v3?ids=...`
- Swap V2: `GET https://api.jup.ag/swap/v2/order?...`

The app intentionally uses keyless access so reviewers can open it without secrets. It sends a quote request with the system program as a dummy taker, then treats `Insufficient funds` as useful route metadata rather than as a failed demo.

## Run

Open `index.html` in a browser, or serve the directory:

```bash
python3 -m http.server 8123
```

Then visit:

```text
http://localhost:8123
```

## Smoke Test

```bash
node scripts/smoke-test.mjs
```

The smoke test checks that Tokens, Price, and Swap `/order` all return JSON with expected top-level fields.

## Files

- `index.html`: self-contained app
- `scripts/smoke-test.mjs`: API smoke test
- `DX-REPORT.md`: developer experience report for the bounty submission
