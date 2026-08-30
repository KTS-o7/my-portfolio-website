+++
title = "Backtesting You Can Trust: Determinism, Cost Models, and the Lies Most Backtests Tell"
date = 2026-08-30T00:00:00+05:30
draft = false
math = false
author = "Krishnatejaswi S"
description = "Why most backtests lie — lookahead bias, fantasy fills, ignored Indian charges — and how deterministic Parquet outputs make results diffable, re-auditable, and reproducible."
tags = ["machine-learning", "quant", "backtesting", "data-engineering", "python"]
+++

The first backtest I ever trusted showed 40% annualized returns on a NIFTY options strategy. I ran it live with a small allocation and lost money for three straight weeks. The strategy wasn't wrong in spirit — the backtest was. It filled me at mid-price on illiquid strikes, charged zero transaction costs, and quietly used a price that wasn't knowable at the time I "decided" to enter. Each error was a few basis points. Compounded over hundreds of trades, they were the entire edge.

That experience is why, when I built [bhav](https://github.com/KTS-o7/bhav) — an open-source backtesting engine for NSE options on Upstox historical data — I spent more time on what the engine *refuses* to fake than on what it computes. This post is about the three places backtests lie, and the one property that keeps them honest: determinism.

## The usual lies

### Lookahead bias is rarely obvious

Nobody writes `if tomorrow.high > today.close: buy()`. The real leaks are subtler. You compute a 20-day rolling support level and let the strategy use it from day 1 of your window — but the first 19 days had no history, so your "rolling" level was silently built from future-looking partial windows. You pick the ATM strike off the day's close instead of the price at your decision time. You use an expiry map you downloaded *today*, which includes contracts listed after your backtest's decision point.

The fix isn't vigilance, it's structure. In bhav, the engine replays 1-minute bars strictly in order and calls lifecycle hooks (`on_bar`, `on_day_start`, `on_day_end`) — a strategy cannot see a bar it hasn't been called with. For lookback strategies, a `warmup_days` parameter replays pre-window bars as no-ops so the moving average exists from day one: history, not hindsight.

### Survivorship bias, options edition

Equity people worry about delisted stocks. In options, the analog is worse: the chain you see today only contains contracts that are *currently listed*. Backtest against today's chain and you've excluded every weekly expiry that already died — which is most of the data you need. bhav pulls from Upstox's `expired-instruments` endpoints so you can get premiums for contracts that expired months or years ago. If your data source can't give you dead contracts, you don't have a backtest, you have a highlight reel.

### Fills at mid-price are a fantasy

The most common fill model is "you get the candle close" or "you get the mid of the bid-ask." On a liquid NIFTY ATM contract at 10:30 AM, fine. On a 15:20 expiry-day OTM option with a ₹2-wide spread on a ₹6 premium, you've assumed away a third of your premium per trade. A short premium strategy that "makes" ₹4 per lot is losing money the moment you model crossing even half the spread. If your engine can't model slippage honestly, every result it produces has an invisible sign flip waiting.

## The cost model is the strategy

Indian markets have a charge stack that generic backtest libraries don't know exists: STT (on the sell side for options, and a punishing rate on exercised ITM contracts), capped brokerage, exchange transaction charges, SEBI charges, stamp duty on the buy side, and GST. Individually each is small. On an intraday options strategy, the stack routinely eats 20–40% of gross P&L.

Then there's lot size. Contract sizes and strike steps change, and each underlying has its own rules. A strategy with an untradeable position size is optimizing a number that doesn't exist. A reliable engine reads those values from versioned instrument reference data and applies its cost model inside portfolio accounting.

## Determinism is a feature, not a nicety

Here's the property I care about most: **same input data + same config ⇒ byte-identical output.** Every bhav run writes to `runs/<run_id>/`: `trades.parquet`, `equity_curve.parquet`, `metrics.json`, and a `manifest.json` carrying a SHA256 checksum of the metrics. Three reasons this matters:

1. **Diffable in code review.** When I change the cost model or fix an expiry-handling bug, I re-run the same strategy on the same cached data and diff the metrics. If `trades.parquet` changed in a way the diff doesn't explain, the bug is in my change — same discipline as a failing test.
2. **Reproducible months later.** "It returned 18% in March" is a claim. "Run ID `a4f2`, git commit `x`, checksum `y`" is evidence. The local Parquet cache pins the data layer too — every candle is fetched from Upstox once and reused, so the API changing under you doesn't change a re-run.
3. **Re-auditable.** A Parquet trade log is a ledger. You can open it in pandas six months later, filter to one suspicious day, and check every fill against the underlying candles.

Compare that to the industry standard deliverable: a screenshot of an equity curve. A screenshot can't be diffed, re-audited, or checksummed. It's marketing material wearing a lab coat. If someone shows you a backtest and can't produce the trade log, the correct prior is that the result is wrong.

## Option-specific gotchas that still bite

Even with all of the above, options have their own traps:

- **Expiry handling.** Weekly expiries mean your ATM contract is a *different instrument* depending on the day. Roll logic that's off by one day silently switches you into a contract with different gamma. Test the roll explicitly.
- **Basis bias.** NIFTY options price off the futures, not the spot index. Picking your ATM strike off raw spot puts you one strike off on high-basis days, systematically. bhav's `--atm-reference futures` mode exists because I hit exactly this.
- **Illiquidity at the tails.** Deep OTM strikes have candle data and no real liquidity. The candle prints a price; that doesn't mean you could have traded there. Discount or exclude them.

None of these are exotic. All of them flip strategies from profitable to not.

## The takeaway

A backtest is not a prediction. It's a claim about a counterfactual, only as good as the audit trail behind it. My bar: if I can't re-run your backtest byte-for-byte, can't see every fill with its cost breakdown, and can't check that the data included dead contracts and realistic spreads — I don't believe the number, and neither should you. The interesting question isn't "does this strategy backtest well?" It's "what would have to be true for this backtest to be lying?" Build the engine so that question is easy to answer, and most of the lying stops on its own.
