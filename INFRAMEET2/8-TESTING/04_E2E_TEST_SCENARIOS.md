# INFRAMEET - Playwright E2E User Journey Scenarios

Automated end-to-end flows executed before every production deployment.

## Flow 1: User Signup, Listing Claim, and Proof Submission
```
[Visitor Signup] --> [Verify Email] --> [Register Entity] --> [Automated Domain Claim] --> [Upload Business License (Proof)]
```
1. Playwright launches browser and navigates to `/signup`.
2. Fills form with test user data and submits.
3. Simulates email verification via API token extraction.
4. Navigates to directory registration, creates entity "Test Corp".
5. Enters claiming flow, verifies domain verification succeeded.
6. Navigates to proof upload, selects corporate certificate file, and submits.
7. Verifies dashboard displays "Status: Pending".
