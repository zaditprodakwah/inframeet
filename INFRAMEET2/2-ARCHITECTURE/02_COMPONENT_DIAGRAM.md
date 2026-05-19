# INFRAMEET - Component Diagram

This Mermaid Component Diagram outlines how the core components of the system interact, establishing boundaries between the client, server, background workers, and persistent storage.

```mermaid
graph TD
    subgraph Client_Side [Client Side]
        Browser[Web Browser / Visitor]
        Widget[Embedded Web Widget]
        NextJS_Client[Next.js React Pages]
    end

    subgraph Hosting_Layer [Hosting Layer (Vercel)]
        NextJS_API[Next.js Server API Routes]
        Auth_Middleware[Auth Middleware / JWT]
        Rate_Limiter[In-Memory Rate Limiter]
    end

    subgraph Storage_Layer [Storage Layer]
        Supabase_DB[(Supabase PostgreSQL Database)]
        Supabase_Storage[Supabase Bucket / Cloudinary]
    end

    subgraph Background_Workers [Automation Layer (GitHub Actions)]
        Decay_Worker[Trust Score Decay Worker]
        Widget_Worker[Widget Reward Aggregator]
        Spam_Worker[Spam Analyzer Pipeline]
    end

    %% Interactions
    Browser -->|HTTPS / UI| NextJS_Client
    Widget -->|CORS Event Log| NextJS_API
    NextJS_Client -->|Fetch API| NextJS_API
    
    NextJS_API -->|Auth / Middleware| Auth_Middleware
    NextJS_API -->|Query / RPC| Supabase_DB
    
    Decay_Worker -->|Trigger RPC| Supabase_DB
    Widget_Worker -->|Update stats| Supabase_DB
    Spam_Worker -->|Evaluate queue| Supabase_DB

    NextJS_API -->|Upload Proof Files| Supabase_Storage
```
