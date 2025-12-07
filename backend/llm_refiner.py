"""
LLM Refinement Module

Uses OpenAI API to refine and enhance activity descriptions
and provide insights about developer behavior.
"""

import os
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

class LLMRefiner:
    """Refines activity data using OpenAI LLM."""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize LLM refiner with API key."""
        self.api_key = api_key or OPENAI_API_KEY
        if not self.api_key:
            print("Warning: OpenAI API key not configured")
        self.model = "gpt-3.5-turbo"
    
    async def refine_activity_summary(
        self,
        activity_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Refine activity data with LLM insights - COMPREHENSIVE VERSION.
        
        Returns enhanced descriptions, detailed insights, and comprehensive analysis.
        """
        if not self.api_key:
            return {
                "summary": self._create_detailed_fallback_summary(activity_data),
                "insights": self._create_detailed_fallback_insights(activity_data),
                "languages_used": self._extract_languages(activity_data),
                "top_projects": self._extract_top_projects(activity_data),
                "contribution_areas": self._extract_contribution_areas(activity_data),
                "development_style": self._analyze_development_style(activity_data),
                "refined": False
            }
        
        try:
            from openai import OpenAI
            import json
            
            client = OpenAI(api_key=self.api_key)
            
            # Prepare detailed prompt
            activity_str = self._format_activity_detailed(activity_data)
            
            prompt = f"""Analyze this developer's GitHub profile comprehensively and provide:

1. EXECUTIVE SUMMARY (2-3 sentences)
   - Overall developer profile and strengths

2. TECHNICAL SKILLS (languages, frameworks, tools used)
   - Based on repositories and commits

3. TOP CONTRIBUTIONS (3-4 key projects)
   - Most active repositories with contribution levels

4. DEVELOPMENT PATTERNS (3-4 insights)
   - How they code, what they focus on

5. IMPACT & INFLUENCE (followers, projects, influence)

6. GROWTH OPPORTUNITIES (2-3 recommendations)
   - How to become even more impactful

7. EXPERTISE AREAS (technologies and domains)

GitHub Activity Data:
{activity_str}

Format as JSON with keys: "summary", "technical_skills", "top_contributions", "development_patterns", "impact", "recommendations", "expertise_areas"
"""
            
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert developer analyst. Provide comprehensive, detailed analysis of developer profiles."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=1500
            )
            
            response_text = response.choices[0].message.content
            
            try:
                result = json.loads(response_text)
                return {
                    **result,
                    "languages_used": self._extract_languages(activity_data),
                    "top_projects": self._extract_top_projects(activity_data),
                    "refined": True
                }
            except json.JSONDecodeError:
                return {
                    "summary": response_text[:300],
                    "insights": [response_text[300:600]],
                    "refined": True,
                    "languages_used": self._extract_languages(activity_data),
                    "top_projects": self._extract_top_projects(activity_data),
                }
        
        except Exception as e:
            print(f"Error refining with LLM: {e}")
            return {
                "summary": self._create_detailed_fallback_summary(activity_data),
                "insights": self._create_detailed_fallback_insights(activity_data),
                "languages_used": self._extract_languages(activity_data),
                "top_projects": self._extract_top_projects(activity_data),
                "contribution_areas": self._extract_contribution_areas(activity_data),
                "development_style": self._analyze_development_style(activity_data),
                "refined": False,
                "error": str(e)
            }
    
    def _extract_languages(self, activity_data: Dict[str, Any]) -> List[str]:
        """Extract programming languages used."""
        activity = activity_data.get("activity", {})
        commits = activity.get("commits", {})
        language_breakdown = commits.get("language_breakdown", {})
        return sorted(language_breakdown.keys(), key=lambda x: language_breakdown[x], reverse=True)
    
    def _extract_top_projects(self, activity_data: Dict[str, Any]) -> List[Dict]:
        """Extract top projects by contribution."""
        activity = activity_data.get("activity", {})
        repos = activity.get("repositories", {})
        repo_list = repos.get("repositories", [])
        return sorted(repo_list, key=lambda x: x.get("stars", 0), reverse=True)[:5]
    
    def _extract_contribution_areas(self, activity_data: Dict[str, Any]) -> List[str]:
        """Extract areas of contribution."""
        activity = activity_data.get("activity", {})
        repos = activity.get("repositories", {})
        repo_list = repos.get("repositories", [])
        
        areas = set()
        for repo in repo_list:
            description = (repo.get("description") or "").lower()
            if description:
                if any(word in description for word in ["web", "frontend", "react", "vue", "angular"]):
                    areas.add("Web Development")
                if any(word in description for word in ["backend", "api", "server", "database", "django", "fastapi"]):
                    areas.add("Backend Development")
                if any(word in description for word in ["mobile", "ios", "android", "flutter"]):
                    areas.add("Mobile Development")
                if any(word in description for word in ["data", "ml", "ai", "machine", "neural", "tensorflow", "pytorch"]):
                    areas.add("Data/AI/ML")
                if any(word in description for word in ["devops", "docker", "kubernetes", "cloud", "aws", "azure", "gcp"]):
                    areas.add("DevOps/Cloud")
                if any(word in description for word in ["tool", "cli", "lib", "framework", "utility"]):
                    areas.add("Tools & Libraries")
        
        return list(areas) if areas else ["General Development"]
    
    def _analyze_development_style(self, activity_data: Dict[str, Any]) -> str:
        """Analyze development style based on activity."""
        summary = activity_data.get("summary", {})
        prs = summary.get("total_prs", 0)
        issues = summary.get("total_issues", 0)
        commits = summary.get("total_commits", 0)
        
        if prs > commits * 0.2:
            return "Collaborative - Strong focus on code review and teamwork"
        elif issues > commits * 0.2:
            return "Community-focused - Active in discussions and issue resolution"
        elif commits > 500:
            return "Prolific contributor - High commit volume and productivity"
        else:
            return "Balanced - Mix of commits, PRs, and community engagement"
    
    def _format_activity_detailed(self, activity_data: Dict[str, Any]) -> str:
        """Format activity data with full detail for LLM."""
        summary = activity_data.get("summary", {})
        activity = activity_data.get("activity", {})
        user_info = activity_data.get("user_info", {})
        
        commits = activity.get("commits", {})
        prs = activity.get("pull_requests", {})
        issues = activity.get("issues", {})
        repos = activity.get("repositories", {})
        
        output = f"""
=== DEVELOPER PROFILE ===
Username: {activity_data.get("username")}
Name: {user_info.get("name", "N/A")}
Bio: {user_info.get("bio", "N/A")}
Location: {user_info.get("location", "N/A")}
Followers: {user_info.get("followers")}
Following: {user_info.get("following")}
Public Repositories: {user_info.get("public_repos")}

=== ACTIVITY SUMMARY (Last {summary.get("time_period", "30 days")}) ===
Total Commits: {summary.get("total_commits")}
Pull Requests: {summary.get("total_prs")} (Merged: {prs.get("merged", 0)}, Open: {prs.get("open", 0)})
Issues: {summary.get("total_issues")} (Closed: {issues.get("closed", 0)}, Open: {issues.get("open", 0)})
Repositories with Commits: {commits.get("repositories_with_commits", 0)}
Total Stars Across Repos: {summary.get("total_stars")}

=== PROGRAMMING LANGUAGES ===
{self._format_languages(commits.get("language_breakdown", {}))}

=== TOP REPOSITORIES ===
{self._format_repos(repos.get("repositories", [])[:10])}

=== CONTRIBUTION BREAKDOWN ===
Commits by Repository:
{self._format_commits_by_repo(commits.get("by_repository", {}))}

=== RECENT COMMITS (Sample) ===
{self._format_recent_commits(commits.get("commit_details", [])[:15])}
"""
        return output
    
    def _format_languages(self, language_breakdown: Dict[str, int]) -> str:
        """Format language breakdown."""
        if not language_breakdown:
            return "No language data"
        sorted_langs = sorted(language_breakdown.items(), key=lambda x: x[1], reverse=True)
        return "\n".join([f"  • {lang}: {count} commits" for lang, count in sorted_langs[:10]])
    
    def _format_repos(self, repos: List[Dict]) -> str:
        """Format repository list."""
        if not repos:
            return "No repositories"
        return "\n".join([
            f"  • {repo['name']}: {(repo.get('description') or 'N/A')[:60]}... ({repo['stars']} ⭐, {repo['forks']} 🔀)"
            for repo in repos
        ])
    
    def _format_commits_by_repo(self, commits_by_repo: Dict[str, Any]) -> str:
        """Format commits by repository."""
        if not commits_by_repo:
            return "No commit data"
        sorted_repos = sorted(commits_by_repo.items(), key=lambda x: x[1]['count'], reverse=True)
        return "\n".join([
            f"  • {repo_name}: {data['count']} commits ({data.get('language', 'Unknown')})"
            for repo_name, data in sorted_repos[:15]
        ])
    
    def _format_recent_commits(self, commit_details: List[Dict]) -> str:
        """Format recent commits."""
        if not commit_details:
            return "No commit details"
        return "\n".join([
            f"  • [{commit['repo']}] {commit['message'].split(chr(10))[0][:50]}..."
            for commit in commit_details[:10]
        ])
    
    def _create_detailed_fallback_summary(self, activity_data: Dict[str, Any]) -> str:
        """Create detailed fallback summary without LLM."""
        summary = activity_data.get("summary", {})
        user_info = activity_data.get("user_info", {})
        commits_data = activity_data.get("activity", {}).get("commits", {})
        
        commits = summary.get("total_commits", 0)
        prs = summary.get("total_prs", 0)
        languages = list(commits_data.get("language_breakdown", {}).keys())
        
        lang_str = ", ".join(languages[:5]) if languages else "multiple languages"
        
        if commits > 500:
            return f"{user_info.get('name', 'Developer')} is a prolific contributor with {commits} commits across {summary.get('public_repos')} repositories, primarily using {lang_str}. Strong track record with {prs} pull requests."
        elif prs > commits * 0.3:
            return f"Collaborative developer {user_info.get('name', '')} with {commits} commits and {prs} PRs, demonstrating strong teamwork in {lang_str}."
        else:
            return f"Active developer {user_info.get('name', '')} with {commits} commits, {prs} PRs, and expertise in {lang_str}."
    
    def _create_detailed_fallback_insights(self, activity_data: Dict[str, Any]) -> List[str]:
        """Create detailed fallback insights without LLM."""
        summary = activity_data.get("summary", {})
        activity = activity_data.get("activity", {})
        repos = activity.get("repositories", {})
        
        insights = []
        
        # Insight 1: Contribution level
        commits = summary.get("total_commits", 0)
        if commits > 500:
            insights.append("Exceptional contributor with 500+ commits showing strong development momentum")
        elif commits > 200:
            insights.append(f"Consistent contributor with {commits} commits across multiple projects")
        elif commits > 50:
            insights.append(f"Active contributor with {commits} commits indicating regular development activity")
        else:
            insights.append(f"Moderate contribution level with {commits} commits")
        
        # Insight 2: Language diversity
        commits_data = activity.get("commits", {})
        languages = commits_data.get("language_breakdown", {})
        if len(languages) >= 5:
            insights.append(f"Polyglot developer - proficient in {len(languages)} different programming languages")
        elif len(languages) >= 3:
            insights.append(f"Multi-language expertise across {', '.join(list(languages.keys())[:3])}")
        else:
            insights.append(f"Specialized in {', '.join(languages.keys())}")
        
        # Insight 3: Project scope
        repo_count = repos.get("total", 0)
        total_stars = repos.get("total_stars", 0)
        if total_stars > 100:
            insights.append(f"Impactful projects with {total_stars}+ stars, demonstrating popular contributions")
        elif repo_count > 20:
            insights.append(f"Diverse portfolio with {repo_count}+ repositories across different domains")
        else:
            insights.append(f"Focused development with {repo_count} key repositories")
        
        # Insight 4: Collaboration style
        prs = summary.get("total_prs", 0)
        issues = summary.get("total_issues", 0)
        if prs > commits * 0.2:
            insights.append("Strong team player with significant pull request contributions")
        elif issues > commits * 0.2:
            insights.append("Active community participant engaged in issue tracking and resolution")
        else:
            insights.append("Independent builder focused on code contributions and development")
        
        return insights[:5]
    
    async def generate_activity_description(
        self,
        username: str,
        commits: int,
        prs: int,
        issues: int,
        repos: int
    ) -> str:
        """Generate a natural language description of activity."""
        if not self.api_key:
            return self._create_fallback_description(username, commits, prs, issues, repos)
        
        try:
            from openai import OpenAI
            
            client = OpenAI(api_key=self.api_key)
            
            prompt = f"""In one sentence, describe {username}'s GitHub activity this month:
- {commits} commits
- {prs} pull requests
- {issues} issues
- {repos} repositories

Be professional and positive."""
            
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=100
            )
            
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            print(f"Error generating description: {e}")
            return self._create_fallback_description(username, commits, prs, issues, repos)
    
    def _format_activity_for_prompt(self, activity_data: Dict[str, Any]) -> str:
        """Format activity data for LLM prompt."""
        summary = activity_data.get("summary", {})
        return f"""
- Username: {activity_data.get("username")}
- Commits (30 days): {summary.get("total_commits")}
- Pull Requests: {summary.get("total_prs")}
- Issues: {summary.get("total_issues")}
- Public Repositories: {summary.get("public_repos")}
- Total Stars: {summary.get("total_stars")}
- Followers: {activity_data.get("user_info", {}).get("followers")}
"""
    
    def _create_fallback_summary(self, activity_data: Dict[str, Any]) -> str:
        """Create fallback summary if LLM unavailable."""
        summary = activity_data.get("summary", {})
        commits = summary.get("total_commits", 0)
        prs = summary.get("total_prs", 0)
        
        if commits > 100 and prs > 20:
            return f"Highly active developer with {commits} commits and {prs} pull requests in the last 30 days."
        elif commits > 50 and prs > 10:
            return f"Actively contributing with {commits} commits and {prs} pull requests."
        else:
            return f"Developer with {commits} commits and {prs} pull requests recently."
    
    def _create_fallback_insights(self, activity_data: Dict[str, Any]) -> List[str]:
        """Create fallback insights if LLM unavailable."""
        summary = activity_data.get("summary", {})
        repos = activity_data.get("activity", {}).get("repositories", {})
        
        insights = []
        
        # Insight 1: Activity level
        total_commits = summary.get("total_commits", 0)
        if total_commits > 200:
            insights.append("Very high commit velocity indicating strong development momentum.")
        elif total_commits > 50:
            insights.append("Consistent contribution pattern showing regular development activity.")
        else:
            insights.append("Moderate activity level with room for increased contributions.")
        
        # Insight 2: Repository diversity
        total_repos = repos.get("total", 0)
        if total_repos > 20:
            insights.append("Diverse portfolio across multiple projects demonstrates broad expertise.")
        else:
            insights.append("Focus on fewer projects allows for deeper specialization.")
        
        # Insight 3: PR/Issue balance
        prs = summary.get("total_prs", 0)
        issues = summary.get("total_issues", 0)
        if prs > issues * 1.5:
            insights.append("Strong focus on writing code with significant PR contributions.")
        else:
            insights.append("Good balance between code contributions and issue reporting/resolution.")
        
        return insights[:3]
    
    def _create_fallback_description(
        self,
        username: str,
        commits: int,
        prs: int,
        issues: int,
        repos: int
    ) -> str:
        """Create fallback description."""
        activities = []
        if commits > 0:
            activities.append(f"{commits} commits")
        if prs > 0:
            activities.append(f"{prs} PRs")
        if issues > 0:
            activities.append(f"{issues} issues")
        
        activity_str = ", ".join(activities)
        return f"{username} contributed {activity_str} across {repos} repositories this month."
    
    async def enhance_activity_data(
        self,
        activity_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Enhance activity data with LLM-generated insights and descriptions.
        
        Adds refined descriptions while preserving original data.
        """
        summary = activity_data.get("summary", {})
        
        # Generate description
        description = await self.generate_activity_description(
            username=activity_data.get("username", "Developer"),
            commits=summary.get("total_commits", 0),
            prs=summary.get("total_prs", 0),
            issues=summary.get("total_issues", 0),
            repos=summary.get("public_repos", 0)
        )
        
        # Get insights
        refined = await self.refine_activity_summary(activity_data)
        
        # Merge results
        return {
            **activity_data,
            "refined": {
                "description": description,
                "summary": refined.get("summary", ""),
                "insights": refined.get("insights", []),
                "languages_used": refined.get("languages_used", []),
                "top_projects": refined.get("top_projects", []),
                "contribution_areas": refined.get("contribution_areas", []),
                "development_style": refined.get("development_style", ""),
                "recommendations": refined.get("recommendations", ""),
                "llm_enabled": refined.get("refined", False)
            }
        }
    
    def _create_fallback_description(
        self,
        username: str,
        commits: int,
        prs: int,
        issues: int,
        repos: int
    ) -> str:
        """Create fallback description without LLM."""
        if commits > 500:
            return f"{username} is exceptionally prolific with {commits} commits this month."
        elif prs > commits * 0.3:
            return f"{username} is a collaborative developer with strong PR contributions ({prs} PRs)."
        elif commits > 100:
            return f"{username} is an active contributor with consistent development activity ({commits} commits)."
        else:
            return f"{username} is developing across {repos} repositories with {commits} commits and {prs} PRs."


async def enhance_github_activity(
    activity_data: Dict[str, Any],
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    Convenience function to enhance GitHub activity data with LLM insights.
    
    Args:
        activity_data: Raw GitHub activity data
        api_key: Optional OpenAI API key
    
    Returns:
        Enhanced activity data with LLM insights
    """
    refiner = LLMRefiner(api_key=api_key)
    return await refiner.enhance_activity_data(activity_data)
