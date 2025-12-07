# GitHub Integration API Documentation

## Base URL

```
http://localhost:8000
```

## Authentication

All requests include GitHub API token from environment variables (transparent to client).

---

## Endpoints

### 1. Connect GitHub Account

**Connect a wallet address to a GitHub username.**

```http
POST /api/github/connect
Content-Type: application/json

{
  "wallet_address": "string",
  "github_username": "string"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "GitHub account 'octocat' connected successfully",
  "github_username": "octocat",
  "github_url": "https://github.com/octocat",
  "avatar_url": "https://avatars.githubusercontent.com/u/1?v=4"
}
```

**Response (Error):**

```json
{
  "detail": "Failed to connect GitHub account: User not found"
}
```

**Status Codes:**

- `200` - Successfully connected
- `400` - Invalid username or connection failed
- `500` - Server error

**Example cURL:**

```bash
curl -X POST http://localhost:8000/api/github/connect \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "qubic_test_123",
    "github_username": "octocat"
  }'
```

---

### 2. Fetch GitHub Activity

**Get developer activity with optional LLM-powered insights.**

```http
GET /api/github/activity/{github_username}?days=30&refine=true
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| days | integer | 30 | Number of days to look back |
| refine | boolean | true | Enable LLM insights |

**Response (Full):**

```json
{
  "username": "octocat",
  "user_info": {
    "name": "The Octocat",
    "avatar_url": "https://avatars.githubusercontent.com/u/1?v=4",
    "bio": "GitHub's mascot",
    "location": "San Francisco",
    "followers": 3938,
    "following": 9,
    "public_repos": 2
  },
  "activity": {
    "commits": {
      "total": 156,
      "by_repository": {
        "Hello-World": {
          "count": 45,
          "url": "https://github.com/octocat/Hello-World"
        },
        "Spoon-Knife": {
          "count": 111,
          "url": "https://github.com/octocat/Spoon-Knife"
        }
      },
      "time_range_days": 30
    },
    "pull_requests": {
      "total": 23,
      "merged": 18,
      "open": 5,
      "prs": [
        {
          "title": "Fix: Update README",
          "url": "https://github.com/octocat/Hello-World/pull/1",
          "repo": "Hello-World",
          "state": "merged",
          "created_at": "2024-12-01T10:00:00Z"
        }
      ]
    },
    "issues": {
      "total": 12,
      "closed": 10,
      "open": 2,
      "issues": []
    },
    "repositories": {
      "total": 2,
      "total_stars": 89,
      "total_forks": 45,
      "repositories": [
        {
          "name": "Hello-World",
          "url": "https://github.com/octocat/Hello-World",
          "description": "My first repository on GitHub!",
          "language": "Python",
          "stars": 70,
          "forks": 40,
          "updated_at": "2024-12-05T15:30:00Z"
        }
      ]
    }
  },
  "summary": {
    "total_commits": 156,
    "total_prs": 23,
    "total_issues": 12,
    "public_repos": 2,
    "total_stars": 89,
    "time_period": "Last 30 days"
  },
  "refined": {
    "description": "Octocat contributed 156 commits and 23 pull requests across 2 repositories this month.",
    "summary": "Highly active developer with consistent contributions across multiple projects.",
    "insights": [
      "Strong focus on code contributions with significant PR activity.",
      "Diverse portfolio across multiple projects demonstrates broad expertise.",
      "High engagement with community through issue tracking and resolution."
    ],
    "recommendation": "Continue maintaining this excellent contribution pace while exploring deeper specialization in key areas.",
    "llm_enabled": true
  }
}
```

**Response (Without Refinement):**
Remove `refined` object when `refine=false`.

**Status Codes:**

- `200` - Successfully fetched
- `400` - Invalid username or API error
- `500` - Server error

**Example cURL:**

```bash
# With LLM refinement
curl "http://localhost:8000/api/github/activity/octocat?days=30&refine=true"

# Without LLM refinement
curl "http://localhost:8000/api/github/activity/octocat?days=30&refine=false"

# Different time range
curl "http://localhost:8000/api/github/activity/octocat?days=7&refine=true"
```

---

### 3. Sync DevScore from GitHub

**Fetch GitHub activity and sync to wallet's DevScore.**

```http
POST /api/github/sync-score/{wallet_address}
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| wallet_address | string | Qubic wallet address |

**Response:**

```json
{
  "success": true,
  "wallet_address": "qubic_test_123",
  "github_username": "octocat",
  "score": 542,
  "activity_summary": {
    "total_commits": 156,
    "total_prs": 23,
    "total_issues": 12,
    "public_repos": 2,
    "total_stars": 89,
    "time_period": "Last 30 days"
  },
  "refined_insights": {
    "description": "Octocat is a highly active developer...",
    "summary": "Consistent, high-quality contributions...",
    "insights": ["Insight 1", "Insight 2", "Insight 3"],
    "recommendation": "Keep contributing...",
    "llm_enabled": true
  },
  "timestamp": "Last 30 days"
}
```

**Score Calculation:**

```
commits × 2 + pull_requests × 5 + issues × 3 + discord_messages × 0.5
Maximum: 1000
```

Example: 156 commits + 23 PRs + 12 issues

```
(156 × 2) + (23 × 5) + (12 × 3) = 312 + 115 + 36 = 463
```

**Status Codes:**

- `200` - Successfully synced
- `404` - User not found or GitHub not connected
- `500` - Server error

**Example cURL:**

```bash
curl -X POST http://localhost:8000/api/github/sync-score/qubic_test_123
```

---

### 4. Check GitHub Connection Status

**Check if a wallet has a connected GitHub account.**

```http
GET /api/github/check/{wallet_address}
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| wallet_address | string | Qubic wallet address |

**Response (Connected):**

```json
{
  "connected": true,
  "github_username": "octocat"
}
```

**Response (Not Connected):**

```json
{
  "connected": false
}
```

**Status Codes:**

- `200` - Always succeeds
- `500` - Server error

**Example cURL:**

```bash
curl http://localhost:8000/api/github/check/qubic_test_123
```

---

## Error Handling

### Common Error Responses

**Invalid GitHub Username:**

```json
{
  "detail": "Failed to connect GitHub account: Not Found"
}
```

**Network Error:**

```json
{
  "detail": "Failed to fetch GitHub activity: Connection refused"
}
```

**Rate Limited:**

```json
{
  "detail": "Failed to fetch GitHub activity: API rate limit exceeded"
}
```

### HTTP Status Codes

| Code | Meaning                         |
| ---- | ------------------------------- |
| 200  | Success                         |
| 400  | Bad request or GitHub API error |
| 404  | Resource not found              |
| 500  | Server error                    |

---

## Rate Limiting

GitHub API has rate limits:

- Authenticated: 5000 requests/hour
- Per-user: 60 requests/minute

The backend caches responses where possible.

---

## Data Retention

- **Connection**: Stored permanently in database
- **Activity**: Stored in `activity_history` table with timestamp
- **Score**: Updated on each sync, historical records kept

---

## Webhook Events (Future)

These are planned for future implementation:

- `github.activity.updated` - When activity is synced
- `github.connected` - When account is connected
- `github.disconnected` - When account is disconnected

---

## TypeScript Types

For frontend integration:

```typescript
interface GitHubUser {
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  followers: number;
  following: number;
  public_repos: number;
}

interface Activity {
  commits: number;
  pullRequests: number;
  issues: number;
  discordMessages: number;
}

interface RefinedInsights {
  description: string;
  summary: string;
  insights: string[];
  recommendation: string;
  llm_enabled: boolean;
}

interface ActivityResponse {
  username: string;
  user_info: GitHubUser;
  activity: {
    commits: any;
    pull_requests: any;
    issues: any;
    repositories: any;
  };
  summary: {
    total_commits: number;
    total_prs: number;
    total_issues: number;
    public_repos: number;
    total_stars: number;
    time_period: string;
  };
  refined?: RefinedInsights;
}
```

---

## Implementation Examples

### JavaScript/TypeScript

```typescript
// Connect GitHub
const connectGitHub = async (walletAddress: string, username: string) => {
  const response = await fetch("http://localhost:8000/api/github/connect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      wallet_address: walletAddress,
      github_username: username,
    }),
  });
  return await response.json();
};

// Get activity with insights
const getActivity = async (username: string) => {
  const response = await fetch(
    `http://localhost:8000/api/github/activity/${username}?refine=true`
  );
  return await response.json();
};

// Sync score
const syncScore = async (walletAddress: string) => {
  const response = await fetch(
    `http://localhost:8000/api/github/sync-score/${walletAddress}`,
    { method: "POST" }
  );
  return await response.json();
};
```

### Python

```python
import httpx

# Connect GitHub
async def connect_github(wallet_address: str, username: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            'http://localhost:8000/api/github/connect',
            json={
                'wallet_address': wallet_address,
                'github_username': username
            }
        )
    return response.json()

# Get activity
async def get_activity(username: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f'http://localhost:8000/api/github/activity/{username}?refine=true'
        )
    return response.json()
```

---

## Performance Tips

1. **Cache results** - Activity data doesn't change frequently
2. **Batch requests** - Get multiple users' data in parallel
3. **Use days parameter** - Smaller time ranges fetch faster
4. **Disable refine** - Skip LLM if not needed for speed

---

## Support

For issues or questions:

1. Check `GITHUB_INTEGRATION.md` for setup help
2. Review error messages in response
3. Check backend logs for details
4. Ensure all environment variables are set

---

**API Version:** 1.0.0  
**Last Updated:** December 2024
