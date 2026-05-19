# INFRAMEET - Worker Automation Specification

Background workflows run as lightweight, cron-scheduled tasks on **GitHub Actions**. This page defines the strict contracts and logic for each active workflow.

## 1. Trust Score Decay (`trust-score-decay.yml`)
- **Schedule**: Cron `0 3 * * *` (Daily at 03:00 UTC).
- **Rationale**: 03:00 UTC is chosen to offload daily maintenance tasks to low-traffic windows.
- **Input/Output Contract**: Calls DB RPC `apply_trust_decay()`. Returns array of processed entity IDs.
- **Error Handling**: Captures SQL errors, logs to `system_events` with `severity = 'error'`.
- **Telegram Notification**:
  ```
  ⚠️ [INFRAMEET WORKER ERROR]
  Job: Trust Score Decay
  Time: 2026-05-19T03:01:22Z
  Error: SQL Database Pool Timeout on apply_trust_decay()
  ```
- **Retry Logic**: Max 3 retries, with a 5-minute exponential backoff.
- **Consistency Check**: Verifies that no decayed entities end up with scores below 0 or above 100.

## 2. Widget Rewards Aggregator (`widget-rewards.yml`)
- **Schedule**: Cron `0 4 * * *` (Daily at 04:00 UTC).
- **Input/Output Contract**: Aggregates `widget_events` from previous 24 hours. Awards `+$0.05` per click, up to the daily payout cap.
- **Retry Logic**: Standard runner restart on error.

## 3. Spam Scoring Analyzer (`spam-scoring.yml`)
- **Schedule**: Run every 6 hours (`0 */6 * * *`).
- **Logic**: Performs bulk keyword-spam scans and disposable domain checks on inquiries in `staging_inbox`.
