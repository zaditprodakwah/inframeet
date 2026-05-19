# INFRAMEET Documentation Portal

Welcome to the official, restructured, and enriched INFRAMEET documentation suite. This directory contains the complete technical blueprint, specifications, user flows, database schemas, and operational SOPs for the platform.

It is structured into **11 logical categories** under the `/docs` folder, serving as a single source of truth for founders, human developers, content moderators, and future AI Coder agents.

---

## 🗺️ Documentation Directory Map

### [1. Overview](file:///Users/mac/Downloads/INFRAMEET2/docs/1-OVERVIEW)
* [01_EXECUTIVE_SUMMARY.md](file:///Users/mac/Downloads/INFRAMEET2/docs/1-OVERVIEW/01_EXECUTIVE_SUMMARY.md) - Platform purpose, value propositions, and core personas.
* [02_VISION_&_GOALS.md](file:///Users/mac/Downloads/INFRAMEET2/docs/1-OVERVIEW/02_VISION_&_GOALS.md) - Architectural vision, pillars, and system principles.
* [03_KEY_METRICS.md](file:///Users/mac/Downloads/INFRAMEET2/docs/1-OVERVIEW/03_KEY_METRICS.md) - Detailed weights of the Reputation Score Engine and daily decay formula.
* [04_SUCCESS_CRITERIA.md](file:///Users/mac/Downloads/INFRAMEET2/docs/1-OVERVIEW/04_SUCCESS_CRITERIA.md) - Definition of Done and launch readiness checklists.

### [2. Architecture](file:///Users/mac/Downloads/INFRAMEET2/docs/2-ARCHITECTURE)
* [01_SYSTEM_ARCHITECTURE.md](file:///Users/mac/Downloads/INFRAMEET2/docs/2-ARCHITECTURE/01_SYSTEM_ARCHITECTURE.md) - Domain separation rules (client vs. server-authoritative).
* [02_COMPONENT_DIAGRAM.md](file:///Users/mac/Downloads/INFRAMEET2/docs/2-ARCHITECTURE/02_COMPONENT_DIAGRAM.md) - **Visual Component Diagram (Mermaid)** of system boundaries.
* [03_DATA_FLOW.md](file:///Users/mac/Downloads/INFRAMEET2/docs/2-ARCHITECTURE/03_DATA_FLOW.md) - **Visual sequence flow (Mermaid)** of security RPCs.
* [04_DEPLOYMENT_ARCHITECTURE.md](file:///Users/mac/Downloads/INFRAMEET2/docs/2-ARCHITECTURE/04_DEPLOYMENT_ARCHITECTURE.md) - Multi-platform integration topology (Vercel, Supabase, Cloudflare, GitHub).
* [05_EXTERNAL_INTEGRATIONS.md](file:///Users/mac/Downloads/INFRAMEET2/docs/2-ARCHITECTURE/05_EXTERNAL_INTEGRATIONS.md) - Academic enrichment pipelines (OpenAlex integration).
* [06_WORKER_AUTOMATION.md](file:///Users/mac/Downloads/INFRAMEET2/docs/2-ARCHITECTURE/06_WORKER_AUTOMATION.md) - **Worker Specs** for background crons, including retry logic and Telegram warnings.

### [3. Product](file:///Users/mac/Downloads/INFRAMEET2/docs/3-PRODUCT)
* [01_PERSONAS_&_WORKFLOWS.md](file:///Users/mac/Downloads/INFRAMEET2/docs/3-PRODUCT/01_PERSONAS_&_WORKFLOWS.md) - Deep journeys for Owners, Visitors, and Verifiers.
* [02_FEATURE_MODULES.md](file:///Users/mac/Downloads/INFRAMEET2/docs/3-PRODUCT/02_FEATURE_MODULES.md) - Technical specifications for verification, claims, leads, reviews, and widgets.
* [03_ACCEPTANCE_CRITERIA.md](file:///Users/mac/Downloads/INFRAMEET2/docs/3-PRODUCT/03_ACCEPTANCE_CRITERIA.md) - High-level system requirements.
* [04_USER_FLOWS_DETAILED.md](file:///Users/mac/Downloads/INFRAMEET2/docs/3-PRODUCT/04_USER_FLOWS_DETAILED.md) - Detailed sequence charts of user transitions.
* [05_GLOSSARY.md](file:///Users/mac/Downloads/INFRAMEET2/docs/3-PRODUCT/05_GLOSSARY.md) - Specialized domain jargon.

### [4. Data](file:///Users/mac/Downloads/INFRAMEET2/docs/4-DATA)
* [01_DATA_MODEL.md](file:///Users/mac/Downloads/INFRAMEET2/docs/4-DATA/01_DATA_MODEL.md) - Conceptual & logical data model and **Consolidated ERD (Mermaid)**.
* [02_SCHEMA_DEFINITION.sql](file:///Users/mac/Downloads/INFRAMEET2/docs/4-DATA/02_SCHEMA_DEFINITION.sql) - Database schema script tables and definitions.
* [03_RLS_POLICIES.md](file:///Users/mac/Downloads/INFRAMEET2/docs/4-DATA/03_RLS_POLICIES.md) - PostgreSQL Row-Level Security rules.
* [04_INDEXING_STRATEGY.md](file:///Users/mac/Downloads/INFRAMEET2/docs/4-DATA/04_INDEXING_STRATEGY.md) - Indexes tailored to preserve fast searches and aggregations.
* [05_MIGRATION_GUIDE.md](file:///Users/mac/Downloads/INFRAMEET2/docs/4-DATA/05_MIGRATION_GUIDE.md) - **Database Migration Strategy**, rollback mechanisms, and backups checklist.

### [5. API](file:///Users/mac/Downloads/INFRAMEET2/docs/5-API)
* [01_API_DESIGN_PRINCIPLES.md](file:///Users/mac/Downloads/INFRAMEET2/docs/5-API/01_API_DESIGN_PRINCIPLES.md) - Standard wrappers, HTTP rate limits, and CORS setups.
* [02_ROUTE_SPECIFICATION.md](file:///Users/mac/Downloads/INFRAMEET2/docs/5-API/02_ROUTE_SPECIFICATION.md) - Multi-module routes reference specification tables.
* [03_ERROR_CODES.md](file:///Users/mac/Downloads/INFRAMEET2/docs/5-API/03_ERROR_CODES.md) - Registry of system error codes (400_, 409_, 429_, 500_) and mitigations.
* [04_RATE_LIMITING.md](file:///Users/mac/Downloads/INFRAMEET2/docs/5-API/04_RATE_LIMITING.md) - Rate limit thresholds and Cloudflare Turnstile token verification.
* [05_RESPONSE_EXAMPLES.md](file:///Users/mac/Downloads/INFRAMEET2/docs/5-API/05_RESPONSE_EXAMPLES.md) - **Actual JSON Response Examples** for success and failure endpoints.
* [06_AUTHENTICATION.md](file:///Users/mac/Downloads/INFRAMEET2/docs/5-API/06_AUTHENTICATION.md) - NextAuth + Supabase JWT decoding and RBAC middleware.

### [6. Security](file:///Users/mac/Downloads/INFRAMEET2/docs/6-SECURITY)
* [01_SECURITY_MODEL.md](file:///Users/mac/Downloads/INFRAMEET2/docs/6-SECURITY/01_SECURITY_MODEL.md) - Defense-in-depth principles.
* [02_RLS_RULES_PSEUDOCODE.md](file:///Users/mac/Downloads/INFRAMEET2/docs/6-SECURITY/02_RLS_RULES_PSEUDOCODE.md) - **RLS Policies in Pseudocode** easily readable by human developers.
* [03_DATA_CLASSIFICATION.md](file:///Users/mac/Downloads/INFRAMEET2/docs/6-SECURITY/03_DATA_CLASSIFICATION.md) - Classification grid for Public, Private, and Sensitive fields.
* [04_THREAT_MODEL.md](file:///Users/mac/Downloads/INFRAMEET2/docs/6-SECURITY/04_THREAT_MODEL.md) - Attack surfaces (manipulation, reviews spam, Sybils) and mitigations.
* [05_COMPLIANCE_CHECKLIST.md](file:///Users/mac/Downloads/INFRAMEET2/docs/6-SECURITY/05_COMPLIANCE_CHECKLIST.md) - GDPR and privacy checklists.
* [06_INCIDENT_RESPONSE.md](file:///Users/mac/Downloads/INFRAMEET2/docs/6-SECURITY/06_INCIDENT_RESPONSE.md) - Leak/intrusion containment containment flow.

### [7. Implementation](file:///Users/mac/Downloads/INFRAMEET2/docs/7-IMPLEMENTATION)
* [01_PHASE_BREAKDOWN.md](file:///Users/mac/Downloads/INFRAMEET2/docs/7-IMPLEMENTATION/01_PHASE_BREAKDOWN.md) - 7-phase build order roadmap from foundation to rollout.
* [02_ATOMIC_TASKS.md](file:///Users/mac/Downloads/INFRAMEET2/docs/7-IMPLEMENTATION/02_ATOMIC_TASKS.md) - **Jira/GitHub-compatible task breakdown** with GIVEN/WHEN/THEN criteria.
* [03_ACCEPTANCE_CRITERIA_PER_TASK.md](file:///Users/mac/Downloads/INFRAMEET2/docs/7-IMPLEMENTATION/03_ACCEPTANCE_CRITERIA_PER_TASK.md) - Task-level behavior scenario records.
* [04_DEPENDENCIES_MAP.md](file:///Users/mac/Downloads/INFRAMEET2/docs/7-IMPLEMENTATION/04_DEPENDENCIES_MAP.md) - Mermaid visual roadmap of dependencies.
* [05_EFFORT_ESTIMATION.md](file:///Users/mac/Downloads/INFRAMEET2/docs/7-IMPLEMENTATION/05_EFFORT_ESTIMATION.md) - Estimation hour indices and critical execution risks.

### [8. Testing](file:///Users/mac/Downloads/INFRAMEET2/docs/8-TESTING)
* [01_TEST_STRATEGY.md](file:///Users/mac/Downloads/INFRAMEET2/docs/8-TESTING/01_TEST_STRATEGY.md) - Automation testing hierarchy and strategies.
* [02_UNIT_TEST_PLAN.md](file:///Users/mac/Downloads/INFRAMEET2/docs/8-TESTING/02_UNIT_TEST_PLAN.md) - Target logic units and coverage expectations.
* [03_INTEGRATION_TEST_PLAN.md](file:///Users/mac/Downloads/INFRAMEET2/docs/8-TESTING/03_INTEGRATION_TEST_PLAN.md) - RPC/API route integration test scenarios.
* [04_E2E_TEST_SCENARIOS.md](file:///Users/mac/Downloads/INFRAMEET2/docs/8-TESTING/04_E2E_TEST_SCENARIOS.md) - E2E Playwright customer journeys scenarios.
* [05_PERFORMANCE_BENCHMARKS.md](file:///Users/mac/Downloads/INFRAMEET2/docs/8-TESTING/05_PERFORMANCE_BENCHMARKS.md) - Speed targets, Edge caching guidelines, and optimization thresholds.
* [06_SECURITY_TEST_CHECKLIST.md](file:///Users/mac/Downloads/INFRAMEET2/docs/8-TESTING/06_SECURITY_TEST_CHECKLIST.md) - SQLi, XSS, and rate limit audit routines.

### [9. Deployment](file:///Users/mac/Downloads/INFRAMEET2/docs/9-DEPLOYMENT)
* [01_DEPLOYMENT_CHECKLIST.md](file:///Users/mac/Downloads/INFRAMEET2/docs/9-DEPLOYMENT/01_DEPLOYMENT_CHECKLIST.md) - Complete checklist cover auth, payments, database, and domains.
* [02_INFRASTRUCTURE_SETUP.md](file:///Users/mac/Downloads/INFRAMEET2/docs/9-DEPLOYMENT/02_INFRASTRUCTURE_SETUP.md) - Step-by-step setup guides for Supabase and Vercel.
* [03_ENVIRONMENT_CONFIGURATION.md](file:///Users/mac/Downloads/INFRAMEET2/docs/9-DEPLOYMENT/03_ENVIRONMENT_CONFIGURATION.md) - Configuration variables and **Feature Flag Strategy**.
* [04_ROLLBACK_PROCEDURES.md](file:///Users/mac/Downloads/INFRAMEET2/docs/9-DEPLOYMENT/04_ROLLBACK_PROCEDURES.md) - Standard rollback instructions for broken releases.
* [05_TROUBLESHOOTING.md](file:///Users/mac/Downloads/INFRAMEET2/docs/9-DEPLOYMENT/05_TROUBLESHOOTING.md) - Solutions for CORS, Turnstile errors, and pool timeouts.

### [10. Operations](file:///Users/mac/Downloads/INFRAMEET2/docs/10-OPERATIONS)
* [01_ADMIN_RUNBOOK.md](file:///Users/mac/Downloads/INFRAMEET2/docs/10-OPERATIONS/01_ADMIN_RUNBOOK.md) - **Operations SOP** covering daily moderator verification checks.
* [02_MONITORING_&_ALERTING.md](file:///Users/mac/Downloads/INFRAMEET2/docs/10-OPERATIONS/02_MONITORING_&_ALERTING.md) - **Monitoring Runbook** tracking latency metrics, threshold alerts, and Slack integration.
* [03_INCIDENT_RESPONSE.md](file:///Users/mac/Downloads/INFRAMEET2/docs/10-OPERATIONS/03_INCIDENT_RESPONSE.md) - Resolving content moderation, fraudulent claiming, and review manipulation.
* [04_BACKUP_&_RECOVERY.md](file:///Users/mac/Downloads/INFRAMEET2/docs/10-OPERATIONS/04_BACKUP_&_RECOVERY.md) - Physical backup schedule recovery protocols.
* [05_DATABASE_MAINTENANCE.md](file:///Users/mac/Downloads/INFRAMEET2/docs/10-OPERATIONS/05_DATABASE_MAINTENANCE.md) - Index reindexing structures and weekly vacumming.
* [06_SCALING_PROCEDURES.md](file:///Users/mac/Downloads/INFRAMEET2/docs/10-OPERATIONS/06_SCALING_PROCEDURES.md) - Standard scaling steps from Free Tier to Pro tiers.

### [11. Reference](file:///Users/mac/Downloads/INFRAMEET2/docs/11-REFERENCE)
* [01_GLOSSARY.md](file:///Users/mac/Downloads/INFRAMEET2/docs/11-REFERENCE/01_GLOSSARY.md) - Definitive multi-lingual term definitions.
* [02_ACRONYMS.md](file:///Users/mac/Downloads/INFRAMEET2/docs/11-REFERENCE/02_ACRONYMS.md) - Core acronym keys (RLS, BAST, JWT, UGC).
* [03_CHANGELOG.md](file:///Users/mac/Downloads/INFRAMEET2/docs/11-REFERENCE/03_CHANGELOG.md) - Release notes and version records of structural changes.
* [04_FAQ.md](file:///Users/mac/Downloads/INFRAMEET2/docs/11-REFERENCE/04_FAQ.md) - Common business and development FAQs.
* [05_CONTACT_&_SUPPORT.md](file:///Users/mac/Downloads/INFRAMEET2/docs/11-REFERENCE/05_CONTACT_&_SUPPORT.md) - Emergency operational contact matrices.

---

## 🛠️ Validation & Documentation Integrity
This documentation suite is dynamically validated for link integrity, completeness, and folder structures. The directory layout maps exactly to standard production-ready universal directory specifications.
