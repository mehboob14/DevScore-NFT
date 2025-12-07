import { useState, useCallback } from "react";
import { toast } from "sonner";

interface Activity {
  commits: number;
  pullRequests: number;
  issues: number;
  discordMessages: number;
}

interface GitHubSummary {
  total_commits: number;
  total_prs: number;
  total_issues: number;
  public_repos: number;
  total_stars: number;
  time_period: string;
}

interface RefinedInsights {
  description?: string;
  summary?: string;
  insights?: string[];
  recommendation?: string;
  languages_used?: string[];
  top_projects?: Array<{ name: string; stars: number; forks?: number; description?: string }>;
  contribution_areas?: string[];
  development_style?: string;
  technical_skills?: string;
  top_contributions?: string;
  development_patterns?: string[];
  impact?: string;
  recommendations?: string;
  expertise_areas?: string;
  llm_enabled?: boolean;
}

interface DevScoreState {
  score: number;
  activity: Activity;
  isLoading: boolean;
  isMinting: boolean;
  hasMinted: boolean;
  nftData: {
    tokenId: string;
    mintedAt: string;
  } | null;
  githubUsername?: string;
  refinedInsights?: RefinedInsights;
}

const calculateScore = (activity: Activity): number => {
  // Score calculation algorithm
  const commitScore = activity.commits * 2;
  const prScore = activity.pullRequests * 5;
  const issueScore = activity.issues * 3;
  const discordScore = Math.floor(activity.discordMessages * 0.5);
  
  return Math.min(commitScore + prScore + issueScore + discordScore, 1000);
};

const mintNFT = async (score: number, activity: Activity): Promise<{ tokenId: string }> => {
  // Simulate minting delay
  await new Promise((resolve) => setTimeout(resolve, 3000));
  
  const tokenId = Math.random().toString(36).substring(2, 10).toUpperCase();
  return { tokenId };
};

export const useDevScore = () => {
  const [state, setState] = useState<DevScoreState>({
    score: 0,
    activity: {
      commits: 0,
      pullRequests: 0,
      issues: 0,
      discordMessages: 0,
    },
    isLoading: false,
    isMinting: false,
    hasMinted: false,
    nftData: null,
  });

  const fetchActivity = useCallback(async (githubUsername?: string) => {
    if (!githubUsername) {
      toast.error("GitHub username is required");
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      // Fetch from backend GitHub integration
      const response = await fetch(
        `http://localhost:8000/api/github/activity/${githubUsername}?refine=true`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch GitHub activity");
      }

      const data = await response.json();
      const summary = data.summary || {};

      const activity: Activity = {
        commits: summary.total_commits || 0,
        pullRequests: summary.total_prs || 0,
        issues: summary.total_issues || 0,
        discordMessages: 0,
      };

      const score = calculateScore(activity);
      const refined = data.refined || {};

      setState((prev) => ({
        ...prev,
        activity,
        score,
        isLoading: false,
        githubUsername,
        refinedInsights: refined,
      }));

      toast.success(
        `Activity synced! ${activity.commits} commits, ${activity.pullRequests} PRs`
      );
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      const message = error instanceof Error ? error.message : "Failed to fetch activity";
      toast.error(message);
    }
  }, []);

  const syncFromWallet = useCallback(async (walletAddress: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(
        `http://localhost:8000/api/github/sync-score/${walletAddress}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Failed to sync score");
      }

      const data = await response.json();
      const score = data.score || 0;
      const summary = data.activity_summary || {};

      const activity: Activity = {
        commits: summary.total_commits || 0,
        pullRequests: summary.total_prs || 0,
        issues: summary.total_issues || 0,
        discordMessages: 0,
      };

      setState((prev) => ({
        ...prev,
        activity,
        score,
        isLoading: false,
        githubUsername: data.github_username,
        refinedInsights: data.refined_insights || {},
      }));

      toast.success("DevScore updated from GitHub!");
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      const message = error instanceof Error ? error.message : "Failed to sync score";
      toast.error(message);
    }
  }, []);

  const mint = useCallback(async () => {
    if (state.score === 0) {
      toast.error("Please fetch your GitHub activity first");
      return;
    }

    setState((prev) => ({ ...prev, isMinting: true }));

    try {
      const { tokenId } = await mintNFT(state.score, state.activity);

      setState((prev) => ({
        ...prev,
        isMinting: false,
        hasMinted: true,
        nftData: {
          tokenId,
          mintedAt: new Date().toLocaleDateString(),
        },
      }));

      toast.success(
        `NFT Minted! Your DevScore NFT #${tokenId} is on Qubic Testnet`
      );
    } catch (error) {
      setState((prev) => ({ ...prev, isMinting: false }));
      toast.error("Failed to mint NFT. Please try again.");
    }
  }, [state.score, state.activity]);

  return {
    ...state,
    fetchActivity,
    syncFromWallet,
    mint,
  };
};
