# INFRAMEET - Go-Live Deployment Checklist

The definitive check sheet to clear before launching to production.

---
# SECTION 8: DEPLOYMENT CHECKLIST

## Pre-Launch (Go/No-Go)

**Database**
- [ ] SQL migration executed successfully in Supabase
- [ ] RLS policies enabled on all tables
- [ ] Indexes created on critical tables (omni_directory, trust_proofs, entity_inquiries)
- [ ] Database backups automated (daily snapshots enabled)
- [ ] Connection pooling configured

**Backend & API**
- [ ] All 25+ API routes implemented and tested
- [ ] Error codes consistent + documented
- [ ] Rate limiting active on all public endpoints
- [ ] CAPTCHA integration verified (Cloudflare Turnstile)
- [ ] File upload working (Cloudinary/R2)
- [ ] Email service tested (claim codes, notifications)
- [ ] Payment processing stubbed (Stripe test mode)

**Frontend (Vercel)**
- [ ] All user flows implemented (claim, proof, inquiry, review, widget)
- [ ] Mobile responsive (tested on iPhone + Android)
- [ ] Accessibility audit (keyboard nav, screen reader)
- [ ] Performance budget met (Lighthouse > 80)
- [ ] Error pages customized (404, 500, etc)

**Security**
- [ ] SSL/HTTPS enabled + auto-renewal configured
- [ ] CORS policy locked to production domain + widget domains
- [ ] API authentication verified (JWT expiry, refresh tokens)
- [ ] SQL injection prevention verified (parameterized queries)
- [ ] XSS prevention verified (sanitized user inputs)
- [ ] Environment variables rotated (no old keys in code)

**Monitoring & Logging**
- [ ] Error tracking (Sentry) configured + tested
- [ ] Analytics (PostHog/GA) configured + events firing
- [ ] Log aggregation (CloudWatch / LogRocket) set up
- [ ] Uptime monitoring (Pingdom / StatusPage) enabled
- [ ] Alert rules configured (error spike, downtime, payment failure)

**Legal & Compliance**
- [ ] Privacy Policy published + linked in footer
- [ ] Terms of Service published + accepted on signup
- [ ] Verification Methodology public document published
- [ ] Data deletion API implemented + tested
- [ ] Cookie consent banner (if using analytics)

**Team & Runbooks**
- [ ] On-call rotation established
- [ ] Incident response document created
- [ ] Deployment checklist documented
- [ ] Rollback procedures documented
- [ ] Support contact established (email/form)

## Go-Live Day

**Checks (Morning of launch)**
- [ ] Database health check: queries running sub 100ms
- [ ] API health check: all endpoints responding
- [ ] Frontend performance: Lighthouse score verified
- [ ] Backup verification: Last backup completed < 12h ago
- [ ] Monitoring dashboards open + watched
- [ ] Team on standby (not during midnight!)

**Launch**
- [ ] DNS pointed to Vercel (if new domain)
- [ ] First 100 users onboarded slowly (watch metrics)
- [ ] Verify: sign-up works, email codes sent, profile created
- [ ] Verify: user can create listing, upload proof, submit inquiry
- [ ] Verify: widget embeds correctly on test site
- [ ] Monitor error rate (should stay near 0%)

**Post-Launch (First 48h)**
- [ ] Daily standups (15 min, catch critical issues)
- [ ] Monitor: Error rate, API response times, database connections
- [ ] Monitor: Email deliverability (sent vs bounced)
- [ ] Monitor: Payment test transactions (if enabled)
- [ ] Respond to user support requests < 4 hours
- [ ] Fix critical bugs immediately, non-critical within 24h

---

## APPENDIX: Quick Reference

### Key Contacts (Placeholder)
- **Tech Lead:** [Name], Slack: @tech-lead
- **Product Manager:** [Name], Slack: @pm
- **Legal Advisor:** [Name], Email: legal@...
- **Vendor Support:** Supabase support, Stripe support, Cloudflare support

### Key Dashboard URLs
- **Vercel:** https://vercel.com/inframeet
- **Supabase:** https://app.supabase.com/project/[PROJECT_ID]
- **Stripe:** https://dashboard.stripe.com
- **GitHub:** https://github.com/inframeet/inframeet
- **Sentry:** https://sentry.io/inframeet

### Emergency Contacts
- **Database down:** Supabase status page + support ticket
- **Payment failing:** Stripe status + support dashboard
- **Email not delivering:** Check SendGrid bounce logs + domain auth
- **Widespread API errors:** Check Vercel logs + GitHub Actions status

---

# END OF INFRAMEET MASTER IMPLEMENTATION HANDBOOK

**Document Version:** 1.0  
**Last Updated:** 2025-05-19  
**Next Review:** After Phase 1 launch  
**Prepared for:** AI Coder / Google Antigravity IDE / Claude Code  

**Status:** ✅ READY FOR IMPLEMENTATION
