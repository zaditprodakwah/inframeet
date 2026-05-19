# INFRAMEET - Key Metrics & Trust Engine

## Trust Score Engine Overview
The reputation of every entity is represented by a dynamic **Trust Score (0 to 100)** calculated using log-based entries in the `reputation_logs` table.

### Point Weights & Formula
- **Proof Approvals**:
  - Legal Document: `+25`
  - Contract / Invoice: `+20`
  - Certificate: `+15`
  - Publication: `+15`
  - Portfolio Item: `+10`
  - Testimonial: `+10`
  - Identity: `+0` (private verification)
- **Claim Verified**: `+20`
- **Widget Integration**:
  - Verified Widget Install: `+3`
  - 100 unique impressions/clicks in 30 days: `+5`
- **Escrow Settlement (if enabled)**:
  - Escrow released: `+10`
  - Verified buyer review: `+5`

### Reputation Decay Engine
To ensure listings stay active, reputations decay over time:
- **Decay Trigger**: Run daily at **03:00 UTC** via GitHub Actions.
- **Decay Rule**: Deduct **-5 points** if the entity has had no approved proofs or verified activity in the last **60 days**.
- **Boundaries**: The score is clamped between `0` and `100`.

---
