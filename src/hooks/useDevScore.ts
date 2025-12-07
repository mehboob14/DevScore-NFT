import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface Activity {
  commits: number;
  pullRequests: number;
  issues: number;
  discordMessages: number;
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
}

// Mock API functions - replace with actual backend calls
const fetchActivityFromBackend = async (): Promise<Activity> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  return {
    commits: Math.floor(Math.random() * 200) + 50,
    pullRequests: Math.floor(Math.random() * 50) + 10,
    issues: Math.floor(Math.random() * 30) + 5,
    discordMessages: Math.floor(Math.random() * 500) + 100,
  };
};

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

  const fetchActivity = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const activity = await fetchActivityFromBackend();
      const score = calculateScore(activity);

      setState((prev) => ({
        ...prev,
        activity,
        score,
        isLoading: false,
      }));

      toast({
        title: "Activity Synced",
        description: `Fetched ${activity.commits} commits, ${activity.pullRequests} PRs, and more!`,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      toast({
        title: "Sync Failed",
        description: "Failed to fetch activity. Please try again.",
        variant: "destructive",
      });
    }
  }, []);

  const mint = useCallback(async () => {
    if (state.score === 0) {
      toast({
        title: "No Score",
        description: "Please fetch your activity first.",
        variant: "destructive",
      });
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

      toast({
        title: "NFT Minted! 🎉",
        description: `Your DevScore NFT #${tokenId} has been minted on Qubic Testnet.`,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isMinting: false }));
      toast({
        title: "Minting Failed",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive",
      });
    }
  }, [state.score, state.activity]);

  return {
    ...state,
    fetchActivity,
    mint,
  };
};
