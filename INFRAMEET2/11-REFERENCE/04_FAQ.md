# INFRAMEET - Frequently Asked Questions (FAQ)

### Q: Why does the system use log-based reputation?
A: Log-based reputation prevents administrators or owners from writing arbitrary scores. Every change in an entity's Trust Score must be backed by a verifiable record in the `reputation_logs` table.

### Q: How can I change the decay speed?
A: You can update the decay logic by modifying the Scheduled GitHub Actions Cron parameters in `.github/workflows/trust-score-decay.yml` and the database function `apply_trust_decay()`.

---
