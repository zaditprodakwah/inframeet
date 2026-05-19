# INFRAMEET - Platform Scaling Blueprint

When platform traffic exceeds the limits of free tiers, follow this escalation roadmap:

## Step 1: Upgrade Supabase Instance
- **Trigger**: DB storage > 500MB or CPU usage > 80% consistently.
- **Action**: Upgrade from Free Tier to **Supabase Pro Tier** ($25/month) to enable dedicated resources and daily backup retentions.

## Step 2: Transition Vercel Projects
- **Trigger**: Serverless function runtimes consistently exceed Vercel's daily free allotment.
- **Action**: Upgrade hosting plan to Vercel Pro.

---
# SECTION 7: WIDGET REWARD ECONOMY

## 7.1 Reward Mechanics (How it Works)

```
INFRAMEET Entity Owner
  ↓
Creates widget badge + embeds on website
  ↓
Website Visitor sees badge: "Verified by INFRAMEET ⭐ 4.8"
  ↓
┌─────────────────────────────────────────┐
│ INTERACTION & REWARD ACCRUAL            │
├─────────────────────────────────────────┤
│ Visitor clicks badge                    │
│  → Redirects to entity profile          │
│  → INFRAMEET tracks: widget_click       │
│  → Owner gets: $0.05 reward             │
│                                         │
│ Visitor installs widget on their site   │
│  → New entity gets widget + code        │
│  → Original owner gets referral reward  │
│  → Referral reward: $0.20               │
│                                         │
│ Other events (optional):                │
│  → Page view: $0.005 (if tracked)       │
│  → Sign-up from widget: $0.50           │
│  → Verified purchase (escrow): $0.10    │
└─────────────────────────────────────────┘
  ↓
Owner's reward balance grows: $5, $10, $50...
  ↓
Owner requests payout (minimum: $10)
  ↓
System creates payout transaction (Stripe → Bank)
  ↓
Owner receives money in 2-5 business days
```

## 7.2 Reward Schedule & Pricing

```
┌─────────────────────┬──────────┬──────────────────────┐
│ Action              │ Reward   │ Frequency/Limit      │
├─────────────────────┼──────────┼──────────────────────┤
│ Widget click        │ $0.05    │ Per unique session   │
│ Widget new install  │ $0.20    │ Once per new entity  │
│ Page view (view)    │ $0.005   │ Once per session     │
│ Verified review     │ $0.02    │ Per approved review  │
│ Inquiry received    │ $0.10    │ Per valid inquiry    │
│ Referral signup     │ $1.00    │ Once per new user    │
│ Referral verified   │ $2.00    │ If referred user verified badge │
└─────────────────────┴──────────┴──────────────────────┘

Notes:
- Widget click: Must be unique session (tracked by session_id)
  Same visitor = max 1 click reward per 24 hours
- Widget new install: Only paid first time entity installs widget
  Re-installs or updates don't generate reward
- Page view: Counted once per browser session (24h window)
- Inquiry: Only non-spam inquiries count (spam_score < 0.5)
```

## 7.3 Widget Reward Aggregation Job (Background)

```
TRIGGER: Daily, 1 AM UTC (runs on GitHub Actions worker)

JOB: widget_reward_aggregation

STEPS:
1. SELECT all active widget_installations
2. For each installation:
   a) SELECT widget_events WHERE created_at >= yesterday AND created_at < today
   b) Group by event_type: count clicks, installs, views
   c) Calculate reward_amount:
      - clicks: COUNT(*) * 0.05
      - installs: COUNT(DISTINCT entity_id) * 0.20
      - views: COUNT(*) * 0.005
      - total_daily_reward = clicks + installs + views
   d) UPDATE widget_installations SET reward_balance += total_daily_reward
   e) INSERT system_event {event_type: 'widget_reward_accrued', amount, widget_id}
3. END

OUTPUT: 
  - Each owner's reward_balance increases by calculated amount
  - Dashboard shows "Earned $X today" metric
  - System event logged for audit trail

EXAMPLE:
  Widget 1: 
    - 150 clicks × $0.05 = $7.50
    - 2 new installs × $0.20 = $0.40
    - 300 views × $0.005 = $1.50
    - Daily total: $9.40
    - Running balance: $50.00 + $9.40 = $59.40
```

## 7.4 Payout Flow (User Request)

```
Owner Views Dashboard
  ↓
  Sees: "Reward Balance: $45.23"
  Button: "Withdraw Funds" (enabled if balance >= $10)
  ↓
Owner clicks "Withdraw"
  ↓
Payout Form:
  - Amount: $45.23 (default) or custom amount <= balance
  - Destination: Select saved bank account OR add new
  - Payment method: Stripe Direct (only option for MVP)
  ↓
Owner reviews & confirms
  ↓
Backend:
  1. Validate amount (>= $10, <= balance)
  2. TRY: Create Stripe payout via API
     → Stripe processes payment
     → Returns payout_id + status
  3. INSERT escrow_ledger OR payout_record {
       directory_id,
       amount,
       status: 'pending',
       payout_id,
       requested_at,
       expected_arrival: NOW() + 2-5 days
     }
  4. UPDATE widget_installations SET reward_balance = 0
  5. Stripe webhook listener awaits confirmation
  ↓
Stripe webhook: "payout.completed"
  → UPDATE payout_record {status: 'completed', completed_at}
  → Email owner: "Payout of $45.23 sent to [account]. Arrives in 2-5 days"
  ↓
Owner checks bank account → Money arrives 2-5 days
```

## 7.5 Tax & Compliance Implications

### Important: Widget Rewards Are Business Income

**For Users:**
- Widget rewards are considered "self-employment income" / "freelance income"
- Owner responsible for reporting on tax return
- Threshold: 
  - US: No specific threshold, but income > $400/year requires Schedule C
  - Indonesia: All business income reportable (no minimum)
- Payout form should note: "Widget rewards are income. Report to tax authority."

**For INFRAMEET:**
- If payout > $600/year (US): Must file 1099-NEC (if user is US-based)
- Should request W-9 or foreign tax info from users on payout form
- Keep records: payout amount, date, recipient, for tax compliance

**Implementation:**
```
Payout Form Addition:
- [ ] I understand widget rewards are taxable income
- [ ] I confirm tax residency country: [select dropdown]
- [ ] I consent to tax withholding if required by jurisdiction
```

## 7.6 Anti-Fraud Measures (Widget Rewards)

### Prevent Gaming the System

**Fraud vector 1: Self-clicking widget repeatedly**
- Detection: Same IP clicks same widget >5x in 1 hour
- Prevention: Rate limit per IP + session tracking
- Action: Flag widget as suspicious, suspend rewards temporarily

**Fraud vector 2: Bot/automated clicks**
- Detection: Unnatural click patterns (all at same second, no page view delay)
- Prevention: Browser fingerprinting, JavaScript verification (cannot fake widget click easily)
- Action: Invalidate fraudulent clicks, warn owner

**Fraud vector 3: Colluding parties (friend clicks widget repeatedly)**
- Detection: Multiple clicks from different IPs but same location (browser geo)
- Prevention: Monitor geographic clustering + suspicious account behavior
- Action: Investigate, freeze rewards if confirmed fraud

**Fraud vector 4: Fake installs**
- Detection: Widget installed on random domains, 1000 clicks in 1 hour
- Prevention: Validate installation_url (domain must resolve, WHOIS check)
- Action: Disable widget, block installation, notify owner

### Reward Verification Checklist
- [ ] Session-based click deduplication (1 click per 24h per visitor)
- [ ] IP-based rate limiting (max 50 clicks per IP per day)
- [ ] Browser fingerprinting (detect spoofed user agents)
- [ ] Geo-clustering detection (alert if clicks from impossible locations)
- [ ] Auto-suspension: Widget disabled if daily reward > 10x historical average
- [ ] Manual review: All payouts > $500/month flagged for admin review

---
