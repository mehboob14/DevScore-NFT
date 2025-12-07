"""
DevScore Calculation Engine

This module contains the scoring algorithm that calculates a developer's
reputation score based on their activity across platforms.

Score Components:
- Commits: Base contribution metric
- Pull Requests: Collaborative work indicator
- Issues: Community engagement and bug reporting
- Discord Messages: Community participation

The maximum score is capped at 1000.
"""

from typing import Dict

# Scoring weights
WEIGHTS = {
    "commit": 2,           # Each commit is worth 2 points
    "pull_request": 5,     # PRs are worth more due to code review value
    "issue": 3,            # Issues show community engagement
    "discord_message": 0.5 # Community participation (capped contribution)
}

# Maximum scores per category (to prevent gaming)
MAX_SCORES = {
    "commits": 400,        # Max 200 commits at 2 points each
    "pull_requests": 250,  # Max 50 PRs at 5 points each
    "issues": 150,         # Max 50 issues at 3 points each
    "discord": 200,        # Max 400 messages at 0.5 points each
}

# Total maximum score
MAX_TOTAL_SCORE = 1000


def calculate_devscore(
    commits: int = 0,
    pull_requests: int = 0,
    issues: int = 0,
    discord_messages: int = 0
) -> int:
    """
    Calculate the DevScore based on developer activity.
    
    Args:
        commits: Number of GitHub commits
        pull_requests: Number of merged pull requests
        issues: Number of issues created/resolved
        discord_messages: Number of Discord messages
    
    Returns:
        Integer score between 0 and 1000
    """
    # Calculate raw scores
    commit_score = min(commits * WEIGHTS["commit"], MAX_SCORES["commits"])
    pr_score = min(pull_requests * WEIGHTS["pull_request"], MAX_SCORES["pull_requests"])
    issue_score = min(issues * WEIGHTS["issue"], MAX_SCORES["issues"])
    discord_score = min(discord_messages * WEIGHTS["discord_message"], MAX_SCORES["discord"])
    
    # Sum all scores
    total_score = commit_score + pr_score + issue_score + discord_score
    
    # Cap at maximum
    return min(int(total_score), MAX_TOTAL_SCORE)


def get_score_breakdown(
    commits: int = 0,
    pull_requests: int = 0,
    issues: int = 0,
    discord_messages: int = 0
) -> Dict[str, int]:
    """
    Get a detailed breakdown of score components.
    
    Args:
        commits: Number of GitHub commits
        pull_requests: Number of merged pull requests
        issues: Number of issues created/resolved
        discord_messages: Number of Discord messages
    
    Returns:
        Dictionary with score breakdown by category
    """
    commit_score = min(commits * WEIGHTS["commit"], MAX_SCORES["commits"])
    pr_score = min(pull_requests * WEIGHTS["pull_request"], MAX_SCORES["pull_requests"])
    issue_score = min(issues * WEIGHTS["issue"], MAX_SCORES["issues"])
    discord_score = min(discord_messages * WEIGHTS["discord_message"], MAX_SCORES["discord"])
    
    total = min(int(commit_score + pr_score + issue_score + discord_score), MAX_TOTAL_SCORE)
    
    return {
        "commits": int(commit_score),
        "pull_requests": int(pr_score),
        "issues": int(issue_score),
        "discord": int(discord_score),
        "total": total
    }


def get_tier(score: int) -> str:
    """
    Determine the developer tier based on score.
    
    Args:
        score: The calculated DevScore
    
    Returns:
        String representing the developer tier
    """
    if score >= 800:
        return "Elite Developer"
    elif score >= 600:
        return "Senior Developer"
    elif score >= 400:
        return "Mid Developer"
    elif score >= 200:
        return "Junior Developer"
    else:
        return "Newcomer"


# Example usage
if __name__ == "__main__":
    # Test the scoring function
    test_activity = {
        "commits": 150,
        "pull_requests": 25,
        "issues": 12,
        "discord_messages": 340
    }
    
    score = calculate_devscore(**test_activity)
    breakdown = get_score_breakdown(**test_activity)
    tier = get_tier(score)
    
    print(f"DevScore: {score}")
    print(f"Breakdown: {breakdown}")
    print(f"Tier: {tier}")
