# INFRAMEET - Unit Testing Plan

This plan establishes unit targets for every logic module in the codebase.

## Target Modules & Test Specifications

### 1. Reputation Calculations (`lib/trust-score.ts`)
- **Test Scenarios**:
  - Test calculation returns a valid, clamped number between 0 and 100.
  - Test points are added exactly as defined in weight standards.
  - Test that negative points are ignored or handled safely.
- **Coverage Target**: 100% of calculation lines covered.

### 2. Spam Detection Heuristics (`lib/spam-detection.ts`)
- **Test Scenarios**:
  - Test disposable domain lookup returns `true` for `mailinator.com` and `false` for `gmail.com`.
  - Test that strings exceeding the threshold raise a spam flag.
- **Coverage Target**: > 90%.
