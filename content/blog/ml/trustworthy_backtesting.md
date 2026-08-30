+++
title = "Backtesting you can trust: determinism, costs and common errors"
date = 2026-08-30T00:00:00+05:30
draft = false
math = false
author = "Krishnatejaswi S"
description = "Why most backtests lie — lookahead bias, fantasy fills, ignored Indian charges — and how deterministic Parquet outputs make results diffable, re-auditable, and reproducible."
tags = ["machine-learning", "quant", "backtesting", "data-engineering", "python"]
+++

You can trust a backtest only when you can reproduce every result and inspect every trade. A high return is not enough.

When I built [bhav](https://github.com/KTS-o7/bhav), an open-source NSE options backtesting engine for Upstox historical data, I focused on three common errors: lookahead bias, unrealistic fills and missing costs. I also made deterministic output a design requirement.

## Avoid the three common errors

### Keep future data out of a decision

Lookahead bias is usually subtle. A 20-day support level may use partial history at the start of the test. An ATM strike may be chosen from the day’s close, rather than the price at the decision time. An expiry map downloaded today may include contracts that did not exist then.

Use structure rather than memory. bhav replays 1-minute bars in order and calls lifecycle hooks such as `on_bar`. A strategy cannot inspect a bar it has not received. A `warmup_days` setting replays earlier bars without trading, so indicators have real history on the first test day.

### Include expired option contracts

Today’s option chain excludes contracts that have expired. Using it creates survivorship bias. bhav uses Upstox expired-instrument data, so a test can include contracts that existed during the period. If your source cannot supply expired contracts, state that limit clearly.

### Do not assume a mid-price fill

The candle close and bid-ask midpoint are often unavailable fills. This matters most for an illiquid expiry-day option. A ₹2 spread on a ₹6 premium can remove much of a strategy’s apparent edge. Model a spread, slippage and the side of the trade.

## Put all trading costs in the result

For Indian options, include STT, brokerage, exchange transaction charges, SEBI charges, stamp duty and GST. Costs that look small on one trade can remove the return from an intraday strategy.

Contract sizes and strike steps also change. A strategy with an untradeable position size is not useful. Read these values from versioned reference data, such as the [NSE derivatives circulars](https://nsearchives.nseindia.com/content/circulars/FAOP70616.pdf), and apply the cost model inside portfolio accounting.

## Make each run reproducible

Use this rule: the same input data and configuration must produce byte-identical output. bhav writes `trades.parquet`, `equity_curve.parquet`, `metrics.json` and a `manifest.json` with a checksum for each run. This lets you:

1. compare result changes during code review
2. reproduce a result months later
3. inspect one trade against its underlying data

A chart is useful for explanation, but it is not evidence. Keep the trade log, configuration, source revision and data checksum with every result.

## Check these option-specific rules

Even with all of the above, options have their own traps:

- expiry rules, because a weekly contract changes by date
- the futures basis, because it can change the ATM strike
- deep out-of-the-money liquidity, because a printed candle is not proof of a tradeable price

## The takeaway

A backtest is a claim about an alternative past, not a prediction. Keep it reproducible. Model the costs and fills you would face. Include expired contracts. Then a reviewer can test the claim instead of trusting a chart.
