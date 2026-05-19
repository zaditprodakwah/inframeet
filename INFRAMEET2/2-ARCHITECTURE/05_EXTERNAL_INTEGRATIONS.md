# INFRAMEET - External Integrations

To enrich provider profiles dynamically, INFRAMEET supports modular ingestion pipelines.

## OpenAlex Academic Enrichment
For entities with an academic focus, the background worker syncs publications using OpenAlex:
- **API Endpoint**: `https://api.openalex.org/authors/...`
- **Identifier**: ORCID or OpenAlex Author ID.
- **Calculated Metric**: Ingests `citation_count` and `h_index` into `entity_academic_profiles` to grant `academic_verified` status.

---
