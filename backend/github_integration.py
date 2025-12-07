"""
GitHub API Integration Module

Handles fetching developer activity from GitHub including:
- Repository commits
- Pull requests
- Issues
- Star history
- Repository metrics
"""

import httpx
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dotenv import load_dotenv

load_dotenv()

GITHUB_API_TOKEN = os.getenv("GITHUB_API_TOKEN")
GITHUB_API_URL = os.getenv("GITHUB_API_URL", "https://api.github.com")

class GitHubClient:
    """Client for GitHub API interactions."""
    
    def __init__(self, token: Optional[str] = None):
        """Initialize GitHub client with API token."""
        self.token = token or GITHUB_API_TOKEN
        if not self.token:
            raise ValueError("GitHub API token not configured")
        
        self.base_url = GITHUB_API_URL
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        }
    
    async def get_user_info(self, username: str) -> Dict[str, Any]:
        """Fetch GitHub user information."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/users/{username}",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()
    
    async def get_user_commits(
        self, 
        username: str, 
        days: int = 90  # Extended from 30 to 90 days for more data
    ) -> Dict[str, Any]:
        """
        Fetch user commits across all repositories (comprehensive).
        
        Returns total commits, detailed commit history, and activity breakdown.
        """
        async with httpx.AsyncClient() as client:
            # Get user's repositories (increased to 200 for more data)
            repos_response = await client.get(
                f"{self.base_url}/users/{username}/repos?per_page=200&sort=updated",
                headers=self.headers
            )
            repos_response.raise_for_status()
            repos = repos_response.json()
            
            total_commits = 0
            commits_by_repo = {}
            commit_details = []
            language_breakdown = {}
            
            # Calculate date range
            since_date = (datetime.utcnow() - timedelta(days=days)).isoformat() + "Z"
            
            for repo in repos:
                try:
                    # Get commits for this repository (increased per_page)
                    commits_response = await client.get(
                        f"{self.base_url}/repos/{repo['full_name']}/commits?author={username}&since={since_date}&per_page=200",
                        headers=self.headers
                    )
                    
                    if commits_response.status_code == 200:
                        commits = commits_response.json()
                        commit_count = len(commits)
                        if commit_count > 0:
                            # Track language
                            if repo.get('language'):
                                language_breakdown[repo['language']] = language_breakdown.get(repo['language'], 0) + commit_count
                            
                            commits_by_repo[repo['name']] = {
                                "count": commit_count,
                                "url": repo['html_url'],
                                "language": repo.get('language', 'Unknown'),
                                "description": repo.get('description', ''),
                                "stars": repo.get('stargazers_count', 0),
                                "forks": repo.get('forks_count', 0)
                            }
                            
                            # Get detailed commit info
                            for commit in commits[:10]:  # Store details of top 10
                                commit_details.append({
                                    "repo": repo['name'],
                                    "message": commit.get('commit', {}).get('message', ''),
                                    "date": commit.get('commit', {}).get('author', {}).get('date', ''),
                                    "url": commit.get('html_url', '')
                                })
                            
                            total_commits += commit_count
                except Exception as e:
                    print(f"Error fetching commits for {repo['name']}: {e}")
                    continue
            
            return {
                "total": total_commits,
                "by_repository": commits_by_repo,
                "time_range_days": days,
                "language_breakdown": language_breakdown,
                "commit_details": commit_details[:50],  # Top 50 commits
                "repositories_with_commits": len(commits_by_repo)
            }
    
    async def get_user_pull_requests(
        self,
        username: str,
        days: int = 30
    ) -> Dict[str, Any]:
        """Fetch user's pull requests."""
        async with httpx.AsyncClient() as client:
            since_date = (datetime.utcnow() - timedelta(days=days)).isoformat() + "Z"
            
            # Search for PRs created by user
            query = f"author:{username} is:pr created:>{since_date}"
            response = await client.get(
                f"{self.base_url}/search/issues?q={query}&per_page=100",
                headers=self.headers
            )
            response.raise_for_status()
            data = response.json()
            
            prs = data.get("items", [])
            
            # Count merged PRs
            merged_count = 0
            open_count = 0
            
            for pr in prs:
                if pr.get("pull_request", {}).get("merged_at"):
                    merged_count += 1
                elif pr.get("state") == "open":
                    open_count += 1
            
            return {
                "total": len(prs),
                "merged": merged_count,
                "open": open_count,
                "prs": [
                    {
                        "title": pr.get("title"),
                        "url": pr.get("html_url"),
                        "repo": pr.get("repository_url", "").split("/")[-1],
                        "state": pr.get("state"),
                        "created_at": pr.get("created_at")
                    }
                    for pr in prs[:10]  # Return top 10
                ]
            }
    
    async def get_user_issues(
        self,
        username: str,
        days: int = 30
    ) -> Dict[str, Any]:
        """Fetch user's issues."""
        async with httpx.AsyncClient() as client:
            since_date = (datetime.utcnow() - timedelta(days=days)).isoformat() + "Z"
            
            # Search for issues created by user
            query = f"author:{username} is:issue created:>{since_date}"
            response = await client.get(
                f"{self.base_url}/search/issues?q={query}&per_page=100",
                headers=self.headers
            )
            response.raise_for_status()
            data = response.json()
            
            issues = data.get("items", [])
            
            # Count closed and open
            closed_count = sum(1 for i in issues if i.get("state") == "closed")
            open_count = len(issues) - closed_count
            
            return {
                "total": len(issues),
                "closed": closed_count,
                "open": open_count,
                "issues": [
                    {
                        "title": issue.get("title"),
                        "url": issue.get("html_url"),
                        "repo": issue.get("repository_url", "").split("/")[-1],
                        "state": issue.get("state"),
                        "created_at": issue.get("created_at")
                    }
                    for issue in issues[:10]  # Return top 10
                ]
            }
    
    async def get_user_stars(self, username: str) -> Dict[str, Any]:
        """Fetch repositories starred by user."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/users/{username}/starred?per_page=100&sort=updated",
                headers=self.headers
            )
            response.raise_for_status()
            repos = response.json()
            
            return {
                "total": len(repos),
                "recent": [
                    {
                        "name": repo.get("name"),
                        "url": repo.get("html_url"),
                        "description": repo.get("description"),
                        "stars": repo.get("stargazers_count")
                    }
                    for repo in repos[:10]
                ]
            }
    
    async def get_user_repos(self, username: str) -> Dict[str, Any]:
        """Fetch user's repositories with metrics."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/users/{username}/repos?per_page=100&sort=updated",
                headers=self.headers
            )
            response.raise_for_status()
            repos = response.json()
            
            total_stars = sum(repo.get("stargazers_count", 0) for repo in repos)
            total_forks = sum(repo.get("forks_count", 0) for repo in repos)
            
            return {
                "total": len(repos),
                "total_stars": total_stars,
                "total_forks": total_forks,
                "repositories": [
                    {
                        "name": repo.get("name"),
                        "url": repo.get("html_url"),
                        "description": repo.get("description"),
                        "language": repo.get("language"),
                        "stars": repo.get("stargazers_count"),
                        "forks": repo.get("forks_count"),
                        "updated_at": repo.get("updated_at")
                    }
                    for repo in repos[:20]
                ]
            }
    
    async def get_user_activity_summary(
        self,
        username: str,
        days: int = 30
    ) -> Dict[str, Any]:
        """
        Get comprehensive activity summary for a user.
        
        Returns all activity data in a structured format.
        """
        try:
            # Fetch all data in parallel
            user_info = await self.get_user_info(username)
            commits = await self.get_user_commits(username, days)
            pull_requests = await self.get_user_pull_requests(username, days)
            issues = await self.get_user_issues(username, days)
            repos = await self.get_user_repos(username)
            
            return {
                "username": username,
                "user_info": {
                    "name": user_info.get("name"),
                    "avatar_url": user_info.get("avatar_url"),
                    "bio": user_info.get("bio"),
                    "location": user_info.get("location"),
                    "followers": user_info.get("followers"),
                    "following": user_info.get("following"),
                    "public_repos": user_info.get("public_repos")
                },
                "activity": {
                    "commits": commits,
                    "pull_requests": pull_requests,
                    "issues": issues,
                    "repositories": repos
                },
                "summary": {
                    "total_commits": commits.get("total", 0),
                    "total_prs": pull_requests.get("total", 0),
                    "total_issues": issues.get("total", 0),
                    "public_repos": repos.get("total", 0),
                    "total_stars": repos.get("total_stars", 0),
                    "time_period": f"Last {days} days"
                }
            }
        except Exception as e:
            raise Exception(f"Failed to fetch GitHub activity: {str(e)}")


async def get_github_activity_for_user(
    username: str,
    days: int = 30,
    token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Convenience function to get GitHub activity for a user.
    
    Args:
        username: GitHub username
        days: Number of days to look back
        token: Optional API token (uses env token if not provided)
    
    Returns:
        Dictionary with comprehensive activity data
    """
    client = GitHubClient(token=token)
    return await client.get_user_activity_summary(username, days)
