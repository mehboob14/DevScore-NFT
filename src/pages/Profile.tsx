import { Github, MessageCircle, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import NFTCard from "@/components/cards/NFTCard";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { useDevScore } from "@/hooks/useDevScore";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const wallet = useWallet();
  const devScore = useDevScore();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Mock profile data
  const profileData = {
    username: "developer_123",
    joinedDate: "January 2024",
    githubUsername: "developer_123",
    discordUsername: "dev#1234",
    totalScore: devScore.score || 742,
    rank: 42,
    badges: [
      { name: "Early Adopter", icon: "🌟" },
      { name: "100 Commits", icon: "💻" },
      { name: "PR Master", icon: "🔀" },
      { name: "Community Helper", icon: "🤝" },
    ],
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
          <div className="max-w-4xl mx-auto">
            {!wallet.isConnected ? (
              <div className="glass-card p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Connect to View Profile</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Connect your Qubic wallet to view and manage your developer profile.
                </p>
                <Button variant="gradient" size="lg" onClick={wallet.connect}>
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <>
                {/* Profile Header */}
                <div className="glass-card p-8 mb-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-bold text-primary-foreground shadow-lg shadow-primary/30">
                      {profileData.username.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold mb-1">{profileData.username}</h1>
                      <p className="text-muted-foreground text-sm mb-3">
                        Member since {profileData.joinedDate}
                      </p>

                      {/* Wallet Address */}
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono bg-secondary px-3 py-1.5 rounded-lg text-muted-foreground">
                          {wallet.address?.slice(0, 20)}...{wallet.address?.slice(-8)}
                        </code>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyAddress}>
                          {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 text-center">
                      <div>
                        <p className="text-3xl font-bold gradient-text">{profileData.totalScore}</p>
                        <p className="text-sm text-muted-foreground">DevScore</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold">#{profileData.rank}</p>
                        <p className="text-sm text-muted-foreground">Rank</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connected Accounts & Badges */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Connected Accounts */}
                  <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold mb-4">Connected Accounts</h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-3">
                          <Github className="h-5 w-5 text-foreground" />
                          <div>
                            <p className="font-medium">{profileData.githubUsername}</p>
                            <p className="text-xs text-muted-foreground">GitHub</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-xs text-primary">Connected</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-3">
                          <MessageCircle className="h-5 w-5 text-foreground" />
                          <div>
                            <p className="font-medium">{profileData.discordUsername}</p>
                            <p className="text-xs text-muted-foreground">Discord</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-xs text-primary">Connected</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold mb-4">Earned Badges</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {profileData.badges.map((badge) => (
                        <div
                          key={badge.name}
                          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                        >
                          <span className="text-2xl">{badge.icon}</span>
                          <span className="text-sm font-medium">{badge.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* NFTs */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Your NFTs</h2>
                  {devScore.hasMinted && devScore.nftData ? (
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
                  ) : (
                    <div className="glass-card p-8 text-center">
                      <p className="text-muted-foreground mb-4">
                        You haven't minted your DevScore NFT yet.
                      </p>
                      <Button variant="gradient" asChild>
                        <a href="/dashboard">Go to Dashboard to Mint</a>
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
