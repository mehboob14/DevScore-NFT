# GitHub and LLM Integration Setup Guide

## Overview

You now have a fully integrated GitHub API connection with LLM-powered insights in your DevScore app!

## What's New

### Backend Modules

1. **`github_integration.py`** - Fetches real GitHub data:

   - User commits, PRs, issues
   - Repository metrics
   - Activity summaries

2. **`llm_refiner.py`** - Uses OpenAI GPT to refine activity:

   - AI-generated summaries
   - Development insights
   - Personalized recommendations

3. **Updated `main.py`** - New endpoints:
   - `POST /api/github/connect` - Connect wallet to GitHub
   - `GET /api/github/activity/{username}` - Fetch real GitHub activity
   - `POST /api/github/sync-score/{wallet}` - Sync score from GitHub
   - `GET /api/github/check/{wallet}` - Check connection status

### Frontend Components

1. **`GitHubConnect.tsx`** - Beautiful GitHub connection UI

   - Connect/disconnect GitHub accounts
   - Visual connection status
   - Validation and error handling

2. **Updated `useDevScore.ts`** - Real API calls:

   - `fetchActivity(username)` - Fetch specific user
   - `syncFromWallet(address)` - Sync from database
   - Real score calculation from GitHub

3. **Updated `Dashboard.tsx`** - Full integration:
   - GitHub connection widget
   - AI-powered insights display
   - Real activity metrics
   - Dynamic activity cards

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

The new packages added:

- `openai==1.3.9` - For LLM integration

### 2. Configure Environment Variables

**Update your `.env` file** with:

```env
# Existing settings
VITE_SUPABASE_PROJECT_ID="mqvyknbdptkeyaofhbru"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://mqvyknbdptkeyaofhbru.supabase.co"
GITHUB_API_TOKEN="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"
GITHUB_API_URL="https://api.github.com"

# NEW: Add OpenAI API key for LLM features
OPENAI_API_KEY="sk-your-openai-api-key-here"
```

Get your OpenAI API key from: https://platform.openai.com/account/api-keys

### 3. Start the Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### 4. Start the Frontend

```bash
# In the root directory
npm run dev
# or
yarn dev
# or
bun run dev
```

## How It Works

### User Flow

1. **Connect Wallet** - User connects their Qubic testnet wallet
2. **Connect GitHub** - User enters their GitHub username
   - Backend validates the username with GitHub API
   - Wallet-GitHub link is stored in SQLite
3. **Fetch Activity** - Click "Sync Activity"
   - Fetches real commits, PRs, issues from GitHub
   - LLM generates insights and descriptions
   - Score calculated and displayed
4. **Mint NFT** - User can mint their score as an NFT

### Data Flow

```
User Input (GitHub username)
    ↓
GitHub API (fetch activity)
    ↓
LLM Refiner (AI insights)
    ↓
Score Calculation
    ↓
Database Storage
    ↓
Frontend Display with Insights
```

## API Endpoints

### Connect GitHub

```bash
POST /api/github/connect
{
  "wallet_address": "qubic_address",
  "github_username": "octocat"
}
```

### Get GitHub Activity (with LLM refinement)

```bash
GET /api/github/activity/octocat?days=30&refine=true
```

### Sync Score from Wallet

```bash
POST /api/github/sync-score/qubic_address
```

### Check Connection

```bash
GET /api/github/check/qubic_address
```

## Features

✅ **Real GitHub Integration**

- Pulls actual commits, PRs, issues
- Tracks activity over configurable time period
- Accurate score calculation

✅ **LLM-Powered Insights**

- AI-generated summaries
- Development pattern analysis
- Personalized recommendations
- Graceful fallback if API unavailable

✅ **Beautiful UI**

- GitHub connection widget
- Real-time activity cards
- AI insights display
- Error handling and validation

✅ **Database Integration**

- Stores wallet-GitHub links
- Activity history tracking
- Score persistence

## Troubleshooting

### GitHub Connection Fails

- Verify GitHub API token is correct
- Check username is case-sensitive
- Ensure `.env` is loaded in backend

### LLM Features Not Working

- Add `OPENAI_API_KEY` to `.env`
- Get key from OpenAI dashboard
- Features still work without it (fallback mode)

### Score Not Updating

- Ensure GitHub account is connected
- Check backend logs for errors
- Verify backend is running on port 8000

### CORS Errors

- Backend CORS is configured for "\*"
- Frontend must access `http://localhost:8000`
- Adjust CORS in `main.py` if needed

## Next Steps

1. Test GitHub connection with your username
2. Verify activity data is fetching correctly
3. Check OpenAI integration for AI insights
4. Mint your first DevScore NFT!

---

Enjoy your integrated DevScore app! 🚀
