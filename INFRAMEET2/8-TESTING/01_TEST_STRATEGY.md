# INFRAMEET - Testing Strategy & Quality Framework

INFRAMEET implements a highly structured, automated testing hierarchy:
- **Unit Tests (Jest)**: Target utility operations (trust score calculation formulas, spam-score analyzers).
- **Integration Tests (Supertest)**: Target Next.js endpoints (verifying that a POST creates correct entries).
- **E2E Tests (Playwright)**: Target standard user paths (sign up, profile creation, badge setup).
- **Security Checklists (Snyk/Audit)**: Scans packages for known vulnerability leaks.
