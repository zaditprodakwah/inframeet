# INFRAMEET - Performance Benchmark Targets

Our Service Level Agreements (SLAs) guarantee sub-millisecond responses on all major directory loads.

## SLA Response SLA Targets
- **Homepage Initial Load**: < 500ms.
- **Directory Search Latency**: < 200ms.
- **Widget Embedded JS Load Time**: < 150ms.
- **Maximum Concurrent Widget Impressions**: 1,000 per second.

## Performance Optimization Rules
- Cache static directory pages on Vercel Edge.
- Load image assets strictly via Next.js `<Image />` to force optimization.
- Avoid bulky libraries in the widget script to keep build sizes under 15KB.
