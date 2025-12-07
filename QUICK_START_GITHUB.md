# 🚀 GitHub Integration - Quick Start

## What's New?

Your DevScore app now has **real GitHub integration** with **AI-powered insights**!

## Quick Setup (5 minutes)

### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Add OpenAI API Key

Edit `.env` and add:

```
OPENAI_API_KEY=sk-your-openai-key-here
```

Get key from: https://platform.openai.com/account/api-keys

### 3. Start Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### 4. Start Frontend

```bash
# In root directory
npm run dev  # or: yarn dev / bun run dev
```

## ✨ What Users Can Do Now

### 1. Connect GitHub

- Go to Dashboard (after wallet connection)
- See "GitHub Connection" card
- Enter GitHub username
- Click "Connect GitHub"

### 2. Sync Real Activity

- Click "Sync Activity" button
- Fetches real commits, PRs, issues (last 30 days)
- Shows AI-generated insights

### 3. See AI Insights

- **Summary**: One-sentence activity overview
- **Insights**: 3 key patterns in development behavior
- **Recommendation**: Personalized suggestion for improvement

### 4. Get Accurate Score

- Score calculated from REAL GitHub data
- No more mock data!
- Ready to mint as NFT

## 📊 What Gets Tracked

| Metric        | Source           |
| ------------- | ---------------- |
| Commits       | Real from GitHub |
| Pull Requests | Real from GitHub |
| Issues        | Real from GitHub |
| Repositories  | Real from GitHub |
| Stars         | Real from GitHub |
| Followers     | Real from GitHub |

## 🧠 LLM Features

The app uses **GPT-3.5-turbo** to:

- Analyze your GitHub activity
- Generate professional summaries
- Identify development patterns
- Provide actionable recommendations

**Falls back gracefully** if OpenAI unavailable.

## 🔗 New API Endpoints

```
POST   /api/github/connect                    - Connect GitHub account
GET    /api/github/activity/{username}        - Fetch & analyze activity
POST   /api/github/sync-score/{wallet}        - Sync score from GitHub
GET    /api/github/check/{wallet}             - Check connection status
```

## 📁 New Files

| File                               | Purpose            |
| ---------------------------------- | ------------------ |
| `backend/github_integration.py`    | GitHub API client  |
| `backend/llm_refiner.py`           | OpenAI integration |
| `src/components/GitHubConnect.tsx` | UI component       |
| `GITHUB_INTEGRATION.md`            | Full documentation |
| `IMPLEMENTATION_SUMMARY.md`        | Technical details  |

## 🔑 What You Already Have

Your existing `.env` already has:

- ✅ `GITHUB_API_TOKEN` - Your GitHub token
- ✅ `GITHUB_API_URL` - GitHub API endpoint
- ✅ `VITE_SUPABASE_*` - Supabase config
- ✅ Wallet setup

Just **add OpenAI key** and you're done!

## ⚙️ How It Works

```
User: Enters GitHub username
  ↓
Backend: Validates with GitHub API
  ↓
Backend: Fetches real activity data
  ↓
LLM: Generates insights & summary
  ↓
Frontend: Displays everything beautifully
  ↓
User: Sees real score, can mint NFT
```

## 🧪 Test It

### Test Connection

```bash
curl -X POST http://localhost:8000/api/github/connect \
  -H "Content-Type: application/json" \
  -d '{"wallet_address":"test","github_username":"octocat"}'
```

### Fetch Activity

```bash
curl http://localhost:8000/api/github/activity/octocat?refine=true
```

### Check Status

```bash
curl http://localhost:8000/api/github/check/test
```

## ❓ Troubleshooting

| Issue                   | Solution                                |
| ----------------------- | --------------------------------------- |
| GitHub connection fails | Check token in .env                     |
| No LLM insights         | Add OPENAI_API_KEY to .env              |
| Activity not fetching   | Verify GitHub username (case-sensitive) |
| CORS errors             | Backend CORS configured for \*          |

## 📚 Full Docs

See these files for details:

- `GITHUB_INTEGRATION.md` - Complete setup guide
- `IMPLEMENTATION_SUMMARY.md` - Technical architecture
- Code comments in backend files

## 🎉 You're Ready!

1. ✅ GitHub integration implemented
2. ✅ LLM insights ready
3. ✅ Beautiful UI components
4. ✅ Real data flowing
5. ✅ Just add OpenAI key and go!

**Start the app and connect your GitHub account!** 🚀
