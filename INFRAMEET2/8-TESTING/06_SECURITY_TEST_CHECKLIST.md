# INFRAMEET - Production Security Audit Checklist

To protect sensitive escrow data, these tests run weekly:
- [ ] **SQL Injection Audit**: Verify that all database calls parameterize queries (Supabase JS SDK handles this automatically).
- [ ] **XSS Validation Check**: Inject HTML tags (`<script>`) into all form fields (inquiries, reviews) and confirm output displays as escaped text.
- [ ] **Rate Limit Stress Test**: Run load scripts (`autocannon`) against API paths and confirm HTTP `429` error code triggers.
