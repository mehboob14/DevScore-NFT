import { useEffect, useState } from "react";
import { GitCommit, GitPullRequest, AlertCircle, MessageCircle, RefreshCw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import StatCard from "@/components/cards/StatCard";
import ScoreCard from "@/components/cards/ScoreCard";
import ActivityCard from "@/components/cards/ActivityCard";
import NFTCard from "@/components/cards/NFTCard";
import { GitHubConnect } from "@/components/GitHubConnect";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { useDevScore } from "@/hooks/useDevScore";

const Dashboard = () => {
  const wallet = useWallet();
  const devScore = useDevScore();
  const [githubConnected, setGithubConnected] = useState(false);
  const [connectedUsername, setConnectedUsername] = useState("");

  // Check GitHub connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!wallet.address) return;
      try {
        const response = await fetch(
          `http://localhost:8000/api/github/check/${wallet.address}`
        );
        const data = await response.json();
        if (data.connected) {
          setGithubConnected(true);
          setConnectedUsername(data.github_username);
        }
      } catch (err) {
        console.error("Error checking GitHub connection:", err);
      }
    };

    checkConnection();
  }, [wallet.address]);

  const handleGitHubConnected = (username: string) => {
    setGithubConnected(true);
    setConnectedUsername(username);
  };

  const handleGitHubDisconnected = () => {
    setGithubConnected(false);
    setConnectedUsername("");
  };

  const handleSyncActivity = () => {
    if (githubConnected && connectedUsername) {
      devScore.fetchActivity(connectedUsername);
    } else {
      devScore.syncFromWallet(wallet.address || "");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isConnected={wallet.isConnected}
        walletAddress={wallet.address || undefined}
        onConnect={wallet.connect}
        onDisconnect={wallet.disconnect}
      />

      <div className="flex pt-16">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Track your developer activity and reputation score
                </p>
              </div>
              <Button
                variant="glow"
                onClick={handleSyncActivity}
                disabled={devScore.isLoading || !wallet.isConnected}
              >
                {devScore.isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Activity
                  </>
                )}
              </Button>
            </div>

            {!wallet.isConnected ? (
              /* Connect Wallet Prompt */
              <div className="glass-card p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Connect Your Wallet</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Connect your Qubic testnet wallet to start tracking your developer activity and mint your DevScore NFT.
                </p>
                <Button variant="gradient" size="lg" onClick={wallet.connect} disabled={wallet.isConnecting}>
                  {wallet.isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              </div>
            ) : (
              <>
                {/* GitHub Connection Section */}
                <div className="mb-8">
                  <GitHubConnect
                    walletAddress={wallet.address || ""}
                    onConnected={handleGitHubConnected}
                    onDisconnected={handleGitHubDisconnected}
                  />
                </div>

                {/* Refined Insights Section */}
                {devScore.refinedInsights && (devScore.refinedInsights.llm_enabled || devScore.refinedInsights.languages_used) && (
                  <div className="mb-8 glass-card p-6">
                    <h2 className="text-xl font-semibold mb-4">AI-Powered Profile Analysis</h2>
                    <div className="space-y-6">
                      {devScore.refinedInsights.description && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Activity Summary</p>
                          <p className="text-base">{devScore.refinedInsights.description}</p>
                        </div>
                      )}
                      
                      {devScore.refinedInsights.languages_used && devScore.refinedInsights.languages_used.length > 0 && (
                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground mb-3">Programming Languages</p>
                          <div className="flex flex-wrap gap-2">
                            {devScore.refinedInsights.languages_used.map((lang: string, idx: number) => (
                              <span key={idx} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {devScore.refinedInsights.contribution_areas && devScore.refinedInsights.contribution_areas.length > 0 && (
                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground mb-3">Expertise Areas</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {devScore.refinedInsights.contribution_areas.map((area: string, idx: number) => (
                              <div key={idx} className="p-2 rounded bg-secondary/50 text-sm">
                                ✓ {area}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {devScore.refinedInsights.top_projects && devScore.refinedInsights.top_projects.length > 0 && (
                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground mb-3">Top Projects</p>
                          <div className="space-y-2">
                            {devScore.refinedInsights.top_projects.slice(0, 5).map((project: any, idx: number) => (
                              <div key={idx} className="p-2 rounded bg-secondary/50 text-sm flex justify-between items-center">
                                <span className="font-medium">{project.name}</span>
                                <span className="text-xs text-muted-foreground">⭐ {project.stars}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {devScore.refinedInsights.development_style && (
                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground mb-2">Development Style</p>
                          <p className="text-base italic">{devScore.refinedInsights.development_style}</p>
                        </div>
                      )}
                      
                      {devScore.refinedInsights.insights && devScore.refinedInsights.insights.length > 0 && (
                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground mb-3">Key Insights</p>
                          <ul className="space-y-2">
                            {devScore.refinedInsights.insights.map((insight: string, idx: number) => (
                              <li key={idx} className="flex gap-2">
                                <span className="text-primary">•</span>
                                <span className="text-sm">{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    title="Total Commits"
                    value={devScore.activity.commits}
                    icon={GitCommit}
                    change="+12 this week"
                    changeType="positive"
                    delay={0}
                  />
                  <StatCard
                    title="Pull Requests"
                    value={devScore.activity.pullRequests}
                    icon={GitPullRequest}
                    change="+3 this week"
                    changeType="positive"
                    delay={100}
                  />
                  <StatCard
                    title="Issues Resolved"
                    value={devScore.activity.issues}
                    icon={AlertCircle}
                    change="+5 this week"
                    changeType="positive"
                    delay={200}
                  />
                  <StatCard
                    title="Discord Messages"
                    value={devScore.activity.discordMessages}
                    icon={MessageCircle}
                    change="+45 this week"
                    changeType="positive"
                    delay={300}
                  />
                </div>

                {/* Score and Activities */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-1">
                    <ScoreCard
                      score={devScore.score}
                      onMint={devScore.mint}
                      isMinting={devScore.isMinting}
                      hasMinted={devScore.hasMinted}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <ActivityCard
                      title="GitHub Activity"
                      icon={GitCommit}
                      activities={githubConnected && devScore.activity.commits > 0 ? [
                        { 
                          type: "commit", 
                          title: `${devScore.activity.commits} commits tracked`, 
                          timestamp: "Latest sync",
                          points: devScore.activity.commits * 2
                        },
                        { 
                          type: "pr", 
                          title: `${devScore.activity.pullRequests} pull requests`, 
                          timestamp: "This month",
                          points: devScore.activity.pullRequests * 5
                        },
                        { 
                          type: "issue", 
                          title: `${devScore.activity.issues} issues resolved`, 
                          timestamp: "This month",
                          points: devScore.activity.issues * 3
                        },
                      ] : [
                        { type: "commit", title: "Connect GitHub to see activity", timestamp: "—", points: 0 },
                      ]}
                    />
                  </div>
                </div>

                {/* NFT Display */}
                {devScore.hasMinted && devScore.nftData && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Your DevScore NFT</h2>
                    <div className="max-w-sm">
                      <NFTCard
                        tokenId={devScore.nftData.tokenId}
                        score={devScore.score}
                        commits={devScore.activity.commits}
                        pullRequests={devScore.activity.pullRequests}
                        issues={devScore.activity.issues}
                        discordMessages={devScore.activity.discordMessages}
                        mintedAt={devScore.nftData.mintedAt}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
