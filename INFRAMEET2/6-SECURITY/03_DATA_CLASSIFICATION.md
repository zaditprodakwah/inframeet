# INFRAMEET - Data Classification Grid

Our database fields are cataloged into three safety classifications to comply with security standards.

| Table Name | Column Name | Classification | Handling & Access Controls |
|------------|-------------|----------------|----------------------------|
| `profiles` | `full_name` | **Public** | Publicly readable. |
| `profiles` | `avatar_url` | **Public** | Publicly readable. |
| `omni_directory` | `metadata_public` | **Public** | Publicly readable. |
| `omni_directory` | `metadata_private`| **Private** | Owner only. Encrypted in transit. |
| `entity_inquiries`| `inquiry_data` | **Private** | Owner only. Contains lead data. |
| `entity_claim_requests` | `verification_token`| **Sensitive** | Encrypted. Never exposed to client. |
| `escrow_ledger`| `amount_idr` | **Sensitive** | Exposed only to buyer, provider, and admin. |
