import { useState } from "react";
import { Trophy, TrendingUp, Filter } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import LeaderboardCard from "@/components/cards/LeaderboardCard";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";

const Leaderboard = () => {
  const wallet = useWallet();
  const [timeFilter, setTimeFilter] = useState<"all" | "month" | "week">("all");

  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, username: "satoshi_dev", score: 987, change: 2 },
    { rank: 2, username: "vitalik_codes", score: 945, change: -1 },
    { rank: 3, username: "alice_rust", score: 923, change: 1 },
    { rank: 4, username: "bob_js", score: 891, change: 3 },
    { rank: 5, username: "charlie_py", score: 867, change: 0 },
    { rank: 6, username: "diana_go", score: 842, change: -2 },
    { rank: 7, username: "eve_solidity", score: 821, change: 5 },
    { rank: 8, username: "frank_ts", score: 798, change: -1 },
    { rank: 9, username: "grace_cpp", score: 776, change: 2 },
    { rank: 10, username: "henry_java", score: 754, change: 0 },
  ];

  const topThree = leaderboardData.slice(0, 3);

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
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-primary" />
                  Leaderboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Top developers ranked by their DevScore
                </p>
              </div>
              <div className="flex gap-2">
                {(["all", "month", "week"] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={timeFilter === filter ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimeFilter(filter)}
                  >
                    {filter === "all" ? "All Time" : filter === "month" ? "This Month" : "This Week"}
                  </Button>
                ))}
              </div>
            </div>

            {/* Top 3 Podium */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Second Place */}
              <div className="md:order-1 glass-card p-6 text-center animate-fade-in" style={{ animationDelay: "100ms" }}>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                  {topThree[1]?.username.charAt(0).toUpperCase()}
                </div>
                <p className="font-semibold text-lg">{topThree[1]?.username}</p>
                <p className="text-3xl font-bold gradient-text mt-2">{topThree[1]?.score}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <span className="text-xl">🥈</span> 2nd Place
                </div>
              </div>

              {/* First Place */}
              <div className="md:order-0 glass-card p-8 text-center relative overflow-hidden animate-fade-in glow-primary">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-primary-foreground shadow-lg shadow-yellow-500/30">
                    {topThree[0]?.username.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-semibold text-xl">{topThree[0]?.username}</p>
                  <p className="text-4xl font-bold gradient-text mt-2">{topThree[0]?.score}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-sm">
                    <span className="text-2xl">👑</span> Champion
                  </div>
                </div>
              </div>

              {/* Third Place */}
              <div className="md:order-2 glass-card p-6 text-center animate-fade-in" style={{ animationDelay: "200ms" }}>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                  {topThree[2]?.username.charAt(0).toUpperCase()}
                </div>
                <p className="font-semibold text-lg">{topThree[2]?.username}</p>
                <p className="text-3xl font-bold gradient-text mt-2">{topThree[2]?.score}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <span className="text-xl">🥉</span> 3rd Place
                </div>
              </div>
            </div>

            {/* Full Leaderboard */}
            <LeaderboardCard users={leaderboardData} />

            {/* Your Ranking */}
            {wallet.isConnected && (
              <div className="mt-6 glass-card p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">Y</span>
                  </div>
                  <div>
                    <p className="font-semibold">Your Ranking</p>
                    <p className="text-sm text-muted-foreground">Keep building to climb up!</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Rank</p>
                  <p className="text-2xl font-bold gradient-text">#42</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaderboard;
