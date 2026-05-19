# INFRAMEET - Common Deployment Troubleshooting

A list of known edge cases and mitigation steps:
- **Widget CORS Errors**: Ensure the external partner's domain has been added to `widget_installations` with `status = 'active'`.
- **Database Connection Pool Timeout**: Occurs when Vercel serverless routes scale rapidly. Ensure Next.js instantiates a single, cached Supabase client instance instead of creating new instances on every request.
