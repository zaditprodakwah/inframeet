# INFRAMEET - Threat Model & Mitigations

An analysis of potential security risks targeting INFRAMEET and how we systematically mitigate them.

## 1. Trust Score Manipulation (Sybil Attacks)
- **Threat**: Attackers register hundreds of free entities and build artificial Trust Scores.
- **Mitigation**: Trust points are restricted. Standard profiles start with low weight. Proofs require manual approval by authenticated verifiers. Action events are processed strictly via daily backend workers.

## 2. Review Spam
- **Threat**: Competing entities flood listings with false negative reviews.
- **Mitigation**: Custom rate limiter blocks multiple reviews from the same IP/email lifetime. If escrow is active, high-trust badges are only awarded for verified reviews linked to successful escrow releases.

## 3. Captcha Bypass
- **Threat**: Automated bots flood inquiry forms with spam.
- **Mitigation**: Cloudflare Turnstile verification occurs server-side on Next.js endpoints. Non-verified Turnstile tokens are rejected at the gate.
