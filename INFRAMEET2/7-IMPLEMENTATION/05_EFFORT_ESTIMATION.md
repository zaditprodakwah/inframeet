# INFRAMEET - Effort Estimation Index

An index estimating engineering hours required to build the first production release of INFRAMEET.

| Feature Area | Complexity Class | Estimated Dev Hours | Key Engineering Risks |
|--------------|------------------|---------------------|-----------------------|
| Database Schema & RLS | Medium | 16 hours | Security rule leaks. |
| Auth & Profiles | Medium | 12 hours | OAuth token management.|
| Proof Submission | High | 24 hours | File size leaks, storage cost.|
| Trust Score Engine | High | 20 hours | Floating calculation errors.|
| Widgets & Analytics | High | 24 hours | Cross-origin CORS locks. |
| Worker Automations | Medium | 16 hours | GitHub runner limits. |
| Admin Panels | Medium | 16 hours | Role manipulation hacks. |
