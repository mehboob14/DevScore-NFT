import { useEffect } from "react";
import { GitCommit, GitPullRequest, AlertCircle, MessageCircle, RefreshCw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import StatCard from "@/components/cards/StatCard";
import ScoreCard from "@/components/cards/ScoreCard";
import ActivityCard from "@/components/cards/ActivityCard";
import NFTCard from "@/components/cards/NFTCard";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { useDevScore } from "@/hooks/useDevScore";

const Dashboard = () => {
  const wallet = useWallet();
  const devScore = useDevScore();

  // Mock recent activities
  const githubActivities = [
    { type: "commit", title: "feat: Add user authentication", timestamp: "2 hours ago", points: 10 },
    { type: "pr", title: "Fix: Resolve memory leak in worker", timestamp: "5 hours ago", points: 25 },
    { type: "issue", title: "Bug: Login fails on Safari", timestamp: "1 day ago", points: 15 },
  ];

  const discordActivities = [
    { type: "message", title: "Helped user with API integration", timestamp: "3 hours ago", points: 5 },
    { type: "message", title: "Answered question about hooks", timestamp: "6 hours ago", points: 5 },
    { type: "message", title: "Shared code snippet", timestamp: "1 day ago", points: 3 },
  ];

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
                onClick={devScore.fetchActivity}
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
                  <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                    <ActivityCard
                      title="GitHub Activity"
                      icon={GitCommit}
                      activities={githubActivities}
                    />
                    <ActivityCard
                      title="Discord Activity"
                      icon={MessageCircle}
                      activities={discordActivities}
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
