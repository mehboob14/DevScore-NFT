# Architecture & Integration Guide

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DEVSCORE APPLICATION                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────── FRONTEND (React) ──────────────────────────┐ │
│  │                                                                    │ │
│  │  Dashboard.tsx                                                     │ │
│  │  ├─ GitHubConnect.tsx (NEW)                                       │ │
│  │  ├─ useDevScore.ts (MODIFIED - Real API calls)                   │ │
│  │  └─ Activity Display (Dynamic real data)                          │ │
│  │                                                                    │ │
│  │  Components: Button, Card, Input, Form, Toast                    │ │
│  │  Styling: Tailwind CSS, Shadcn/ui, lucide-react icons            │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                              │ HTTP/REST                                │
│                              ▼                                          │
│  ┌──────────────────────── BACKEND (FastAPI) ──────────────────────┐ │
│  │                                                                  │ │
│  │  main.py (MODIFIED)                                            │ │
│  │  ├─ POST /api/github/connect (NEW)                             │ │
│  │  ├─ GET /api/github/activity/{username} (NEW)                  │ │
│  │  ├─ POST /api/github/sync-score/{wallet} (NEW)                 │ │
│  │  ├─ GET /api/github/check/{wallet} (NEW)                       │ │
│  │  ├─ Existing endpoints (unchanged)                             │ │
│  │  └─ CORS enabled                                               │ │
│  │                                                                  │ │
│  │  ┌─ github_integration.py (NEW - 397 lines)                    │ │
│  │  │  ├─ GitHubClient class                                      │ │
│  │  │  ├─ async methods for API calls                             │ │
│  │  │  └─ Error handling & data parsing                           │ │
│  │  │                                                              │ │
│  │  └─ llm_refiner.py (NEW - 356 lines)                          │ │
│  │     ├─ LLMRefiner class                                        │ │
│  │     ├─ AI insight generation                                   │ │
│  │     └─ Graceful fallback                                       │ │
│  │                                                                  │ │
│  │  score_engine.py (Existing)                                     │ │
│  │  ├─ calculate_devscore()                                       │ │
│  │  └─ Scoring algorithm                                          │ │
│  │                                                                  │ │
│  └────┬─────────────────────────────────┬──────────────────────────┘ │
│       │ httpx async calls               │                             │
│       ▼                                 ▼                             │
│  ┌─────────────────┐          ┌──────────────────────┐                │
│  │  GitHub API     │          │  OpenAI API          │                │
│  │  api.github.com │          │  (GPT-3.5-turbo)     │                │
│  │                 │          │  platform.openai.com │                │
│  │ • Commits       │          │                      │                │
│  │ • PRs           │          │ Generate:            │                │
│  │ • Issues        │          │ • Summaries          │                │
│  │ • User Info     │          │ • Insights           │                │
│  │ • Repos         │          │ • Recommendations    │                │
│  │ • Stars         │          └──────────────────────┘                │
│  └────────┬────────┘                                                   │
│           │ Activity Data                                              │
│           ▼                                                            │
│  ┌──────────────────────────────────────────────────────┐             │
│  │  Data Processing & Storage                           │             │
│  │                                                      │             │
│  │  • Parse GitHub response                            │             │
│  │  • Call LLM for refinement                          │             │
│  │  • Calculate score                                  │             │
│  │  • Store in SQLite                                  │             │
│  │  • Return to frontend                               │             │
│  │                                                      │             │
│  └────────────────┬─────────────────────────────────────┘             │
│                   ▼                                                    │
│  ┌──────────────────────────────────────────────────────┐             │
│  │  SQLite Database (devscore.db)                       │             │
│  │                                                      │             │
│  │  users table:                                        │             │
│  │  ├─ id, wallet_address (PK)                         │             │
│  │  ├─ github_username (NEW)                           │             │
│  │  ├─ current_score                                   │             │
│  │  └─ nft_token_id                                    │             │
│  │                                                      │             │
│  │  activity_history table:                            │             │
│  │  ├─ id, user_id (FK)                                │             │
│  │  ├─ commits, pull_requests, issues                  │             │
│  │  ├─ calculated_score                                │             │
│  │  └─ recorded_at                                     │             │
│  │                                                      │             │
│  └──────────────────────────────────────────────────────┘             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
USER INITIATES CONNECTION
        │
        ▼
┌─────────────────────┐
│ Enter GitHub        │
│ Username in UI      │
└────────┬────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ GitHubConnect.tsx validates input      │
│ Sends: wallet_address + github_username│
└────────┬─────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ POST /api/github/connect               │
│ Backend receives request               │
└────────┬─────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ GitHubClient validates username        │
│ Calls GitHub API: /users/{username}    │
└────────┬─────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ GitHub API responds with user data     │
│ Returns: avatar_url, followers, etc.   │
└────────┬─────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ Backend stores in users table          │
│ Link: wallet_address ↔ github_username │
└────────┬─────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ Return response to frontend            │
│ Status: success, username, avatar_url  │
└────────┬─────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ Frontend displays connected status     │
│ Shows GitHub username + avatar         │
└─────────────────────────────────────────┘

─────────────────────────────────────────

USER SYNCS ACTIVITY
        │
        ▼
┌─────────────────────┐
│ Click "Sync Activity"│
│ Button on Dashboard │
└────────┬────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ useDevScore.fetchActivity() called     │
│ With github_username parameter         │
└────────┬─────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ GET /api/github/activity/{username}    │
│ With refine=true for LLM processing    │
└────────┬─────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ GitHubClient fetches activity:         │
│ • Commits (last 30 days)               │
│ • Pull requests (merged, open)         │
│ • Issues (created, resolved)           │
│ • Repository metrics                   │
│ • User followers/following             │
└────────┬─────────────────────────────────┘
         │
         ▼ (Parallel requests to GitHub API)
┌────────────────────────────────────────┐
│ GitHub API responses for:              │
│ • repos/{owner}/commits                │
│ • search/issues (PRs)                  │
│ • search/issues (issues)               │
│ • repos (by owner)                     │
└────────┬─────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ LLMRefiner.enhance_activity_data()     │
│ Called if refine=true                  │
└────────┬─────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ Call OpenAI API (GPT-3.5-turbo)        │
│ Provide activity data in prompt        │
└────────┬─────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ OpenAI generates:                      │
│ • Activity summary                     │
│ • 3 key insights                       │
│ • 1 recommendation                     │
└────────┬─────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ Backend calculates DevScore:           │
│ (commits×2) + (prs×5) + (issues×3)    │
│ Max: 1000                              │
└────────┬─────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ Store in activity_history table:       │
│ • user_id, commits, prs, issues        │
│ • calculated_score, timestamp          │
│ Update users table: current_score      │
└────────┬─────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ Return complete response to frontend:  │
│ • Raw activity metrics                 │
│ • Calculated score                     │
│ • LLM-refined insights                 │
│ • Description, summary, tips           │
└────────┬─────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ Frontend displays:                     │
│ • AI Insights section                  │
│ • Real activity stats                  │
│ • Updated DevScore                     │
│ • Ready to mint NFT button             │
└─────────────────────────────────────────┘
```

---

## 🔌 API Integration Points

### GitHub API Integration

```python
# github_integration.py uses:
httpx.AsyncClient()  # Async HTTP requests
GitHub API v2022-11-28
Endpoints:
  - GET /users/{username}
  - GET /users/{username}/repos
  - GET /repos/{owner}/{repo}/commits
  - GET /search/issues (for PRs and issues)
  - GET /users/{username}/starred
```

### OpenAI API Integration

```python
# llm_refiner.py uses:
openai.ChatCompletion.create()
Model: gpt-3.5-turbo
Role: system - "You are a developer productivity analyst"
Task: Analyze activity data and generate insights
```

### Frontend API Calls

```typescript
// useDevScore.ts and GitHubConnect.tsx
fetch('http://localhost:8000/api/github/...')
Methods: POST, GET
Content-Type: application/json
```

---

## 💾 Database Schema

```sql
-- Existing table (no changes)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wallet_address TEXT UNIQUE NOT NULL,
    github_username TEXT,  -- NEW field (existing column)
    discord_username TEXT,
    current_score INTEGER DEFAULT 0,
    nft_token_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Existing table (no changes)
CREATE TABLE activity_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    commits INTEGER DEFAULT 0,
    pull_requests INTEGER DEFAULT 0,
    issues INTEGER DEFAULT 0,
    discord_messages INTEGER DEFAULT 0,
    calculated_score INTEGER DEFAULT 0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔐 Environment Configuration

```
.env file structure:

# GitHub Integration (Backend)
GITHUB_API_TOKEN=github_pat_...
GITHUB_API_URL=https://api.github.com

# OpenAI Integration (NEW)
OPENAI_API_KEY=sk-...

# Existing Supabase Config
VITE_SUPABASE_PROJECT_ID=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_URL=...
```

---

## 🚀 Deployment Checklist

### Backend

- [ ] Python 3.8+ installed
- [ ] Dependencies: `pip install -r requirements.txt`
- [ ] .env configured with API keys
- [ ] Database initialized (auto-init on startup)
- [ ] Port 8000 available
- [ ] CORS configured appropriately

### Frontend

- [ ] Node.js 16+ installed
- [ ] Dependencies: `npm install` or `yarn install`
- [ ] .env configured with Supabase keys
- [ ] API endpoint configured (http://localhost:8000)
- [ ] Port 5173 available

### APIs

- [ ] GitHub API token valid
- [ ] OpenAI API key valid
- [ ] Rate limits understood
- [ ] Error handling verified

---

## 📈 Performance Optimization

### Caching Opportunities

- Cache GitHub activity for 1 hour
- Cache user profiles for 24 hours
- Cache LLM responses with same input

### Async Optimizations

- Parallel GitHub API calls
- Non-blocking OpenAI calls
- Background job processing (future)

### Database Optimizations

- Index on wallet_address
- Index on github_username
- Index on created_at for queries

---

## 🔒 Security Measures

### API Key Protection

- ✅ Keys in .env (never in code)
- ✅ No keys in git commits
- ✅ Environment-based loading

### Input Validation

- ✅ GitHub username validation
- ✅ Wallet address validation
- ✅ JSON schema validation (Pydantic)

### Error Handling

- ✅ No sensitive data in errors
- ✅ Graceful API failures
- ✅ Rate limit handling

---

## 📊 Monitoring & Logging

### What to Monitor

- API response times
- GitHub API rate limits
- OpenAI API costs
- Error rates
- Database queries

### Logging Points

- GitHub API requests
- LLM API requests
- Database operations
- Error conditions

---

## 🔄 Integration Sequence

```
1. User connects wallet
   ↓
2. User enters GitHub username
   ↓
3. GitHubConnect sends to backend
   ↓
4. Backend validates with GitHub
   ↓
5. Connection stored in database
   ↓
6. Frontend shows connected status
   ↓
7. User clicks "Sync Activity"
   ↓
8. Fetch real GitHub data (parallel)
   ↓
9. Call OpenAI for insights
   ↓
10. Calculate DevScore
   ↓
11. Store activity in database
   ↓
12. Return to frontend with all data
   ↓
13. Display: metrics, score, insights
   ↓
14. User ready to mint NFT
```

---

## 🎯 Future Integration Points

### Discord Integration

- Similar pattern to GitHub
- Fetch messages, activity
- Track community engagement

### Activity Webhooks

- Real-time updates
- Event-driven scoring
- Instant notifications

### Analytics Dashboard

- Aggregate data views
- Trend analysis
- Performance metrics

---

**Architecture is clean, modular, and ready for expansion!** 🏗️
