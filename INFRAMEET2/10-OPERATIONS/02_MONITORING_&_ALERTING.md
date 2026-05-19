# INFRAMEET - Monitoring & Alerting Runbook

## Core Metrics to Track

| Metric Name | Tracking Target | Alert Threshold | Severity Level |
|-------------|-----------------|-----------------|----------------|
| API Latency | Next.js API Routes| `> 800ms` for 5 mins| **Warning** |
| Database Pool Time| Supabase Postgres| `> 15s` pool wait time | **Critical** |
| Error Rate | Sentry Log Count| `> 20 errors` per min | **Critical** |
| Captcha Failures | Turnstile Verifications | `> 50%` failure rate | **Warning** |

## Alert Thresholds & Escalation
- **Warning**: Sends Slack/Telegram alerts to the engineering channel.
- **Critical**: Triggers PagerDuty notifications, calling the on-duty systems architect immediately.
