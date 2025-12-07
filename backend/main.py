"""
DevScore Backend - FastAPI Application
Run with: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import sqlite3
from contextlib import contextmanager

from score_engine import calculate_devscore
from qubic_client import QubicClient

app = FastAPI(
    title="DevScore API",
    description="Blockchain-backed developer reputation engine",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Qubic client
qubic = QubicClient()

# Database setup
def init_db():
    """Initialize SQLite database with users table."""
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                wallet_address TEXT UNIQUE NOT NULL,
                github_username TEXT,
                discord_username TEXT,
                current_score INTEGER DEFAULT 0,
                nft_token_id TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS activity_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                commits INTEGER DEFAULT 0,
                pull_requests INTEGER DEFAULT 0,
                issues INTEGER DEFAULT 0,
                discord_messages INTEGER DEFAULT 0,
                calculated_score INTEGER DEFAULT 0,
                recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)
        conn.commit()

@contextmanager
def get_db():
    """Database connection context manager."""
    conn = sqlite3.connect("devscore.db")
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

# Pydantic models
class UserCreate(BaseModel):
    wallet_address: str
    github_username: Optional[str] = None
    discord_username: Optional[str] = None

class ActivityData(BaseModel):
    commits: int = 0
    pull_requests: int = 0
    issues: int = 0
    discord_messages: int = 0

class MintRequest(BaseModel):
    wallet_address: str
    score: int
    activity: ActivityData

class DashboardResponse(BaseModel):
    wallet_address: str
    github_username: Optional[str]
    discord_username: Optional[str]
    current_score: int
    activity: ActivityData
    nft_token_id: Optional[str]

# API Endpoints

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "service": "DevScore API"}

@app.post("/api/users/register")
async def register_user(user: UserCreate):
    """Register a new user with their wallet address."""
    with get_db() as conn:
        try:
            conn.execute(
                "INSERT INTO users (wallet_address, github_username, discord_username) VALUES (?, ?, ?)",
                (user.wallet_address, user.github_username, user.discord_username)
            )
            conn.commit()
            return {"success": True, "message": "User registered successfully"}
        except sqlite3.IntegrityError:
            raise HTTPException(status_code=400, detail="Wallet address already registered")

@app.get("/api/activity/{wallet_address}")
async def fetch_activity(wallet_address: str):
    """
    Fetch developer activity from GitHub and Discord.
    In production, this would call the actual GitHub and Discord APIs.
    """
    # Mock activity data - replace with actual API calls
    activity = ActivityData(
        commits=150,
        pull_requests=25,
        issues=12,
        discord_messages=340
    )
    
    # Calculate score
    score = calculate_devscore(
        commits=activity.commits,
        pull_requests=activity.pull_requests,
        issues=activity.issues,
        discord_messages=activity.discord_messages
    )
    
    # Store activity in database
    with get_db() as conn:
        user = conn.execute(
            "SELECT id FROM users WHERE wallet_address = ?",
            (wallet_address,)
        ).fetchone()
        
        if user:
            conn.execute(
                """INSERT INTO activity_history 
                   (user_id, commits, pull_requests, issues, discord_messages, calculated_score)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                (user["id"], activity.commits, activity.pull_requests, 
                 activity.issues, activity.discord_messages, score)
            )
            conn.execute(
                "UPDATE users SET current_score = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                (score, user["id"])
            )
            conn.commit()
    
    return {
        "activity": activity.dict(),
        "score": score
    }

@app.post("/api/calculate-score")
async def calculate_score(activity: ActivityData):
    """Calculate DevScore from activity data."""
    score = calculate_devscore(
        commits=activity.commits,
        pull_requests=activity.pull_requests,
        issues=activity.issues,
        discord_messages=activity.discord_messages
    )
    return {"score": score}

@app.post("/api/mint-nft")
async def mint_nft(request: MintRequest):
    """
    Mint a DevScore NFT on Qubic testnet.
    Contains the user's score and activity metrics.
    """
    try:
        # Mint NFT using Qubic client
        result = qubic.mint_devscore_nft(
            wallet_address=request.wallet_address,
            score=request.score,
            commits=request.activity.commits,
            pull_requests=request.activity.pull_requests,
            issues=request.activity.issues,
            discord_messages=request.activity.discord_messages
        )
        
        # Store NFT token ID in database
        with get_db() as conn:
            conn.execute(
                "UPDATE users SET nft_token_id = ? WHERE wallet_address = ?",
                (result["token_id"], request.wallet_address)
            )
            conn.commit()
        
        return {
            "success": True,
            "token_id": result["token_id"],
            "transaction_hash": result["transaction_hash"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard/{wallet_address}")
async def get_dashboard(wallet_address: str):
    """Get dashboard data for a user."""
    with get_db() as conn:
        user = conn.execute(
            "SELECT * FROM users WHERE wallet_address = ?",
            (wallet_address,)
        ).fetchone()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get latest activity
        activity = conn.execute(
            """SELECT * FROM activity_history 
               WHERE user_id = ? 
               ORDER BY recorded_at DESC LIMIT 1""",
            (user["id"],)
        ).fetchone()
        
        activity_data = ActivityData()
        if activity:
            activity_data = ActivityData(
                commits=activity["commits"],
                pull_requests=activity["pull_requests"],
                issues=activity["issues"],
                discord_messages=activity["discord_messages"]
            )
        
        return DashboardResponse(
            wallet_address=user["wallet_address"],
            github_username=user["github_username"],
            discord_username=user["discord_username"],
            current_score=user["current_score"] or 0,
            activity=activity_data,
            nft_token_id=user["nft_token_id"]
        )

@app.get("/api/leaderboard")
async def get_leaderboard(limit: int = 10):
    """Get top developers by score."""
    with get_db() as conn:
        users = conn.execute(
            """SELECT wallet_address, github_username, current_score, nft_token_id
               FROM users 
               WHERE current_score > 0
               ORDER BY current_score DESC 
               LIMIT ?""",
            (limit,)
        ).fetchall()
        
        return {
            "leaderboard": [
                {
                    "rank": idx + 1,
                    "wallet_address": user["wallet_address"],
                    "username": user["github_username"] or f"dev_{user['wallet_address'][:8]}",
                    "score": user["current_score"],
                    "has_nft": user["nft_token_id"] is not None
                }
                for idx, user in enumerate(users)
            ]
        }

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
