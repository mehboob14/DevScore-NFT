import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, MessageCircle, Sparkles, Shield, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,255,0.1),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(167,139,250,0.1),transparent_50%)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-primary-foreground font-bold">DS</span>
          </div>
          <span className="text-2xl font-bold gradient-text">DevScore</span>
        </div>
        <Link to="/dashboard">
          <Button variant="glass" size="lg">
            Launch App
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Powered by Qubic Blockchain</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            Your Developer
            <br />
            <span className="gradient-text">Reputation On-Chain</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "200ms" }}>
            DevScore aggregates your GitHub commits, pull requests, and Discord activity 
            into a verifiable score minted as an NFT on Qubic testnet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "300ms" }}>
            <Link to="/dashboard">
              <Button variant="gradient" size="xl">
                <Sparkles className="h-5 w-5 mr-2" />
                Get Your DevScore
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button variant="glass" size="xl">
                View Leaderboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-32">
          <div className="glass-card p-8 animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Github className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">GitHub Integration</h3>
            <p className="text-muted-foreground">
              Automatically tracks your commits, pull requests, issues, and contributions across all repositories.
            </p>
          </div>

          <div className="glass-card p-8 animate-fade-in" style={{ animationDelay: "500ms" }}>
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
              <MessageCircle className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Discord Activity</h3>
            <p className="text-muted-foreground">
              Measures your community engagement through Discord messages and helpful interactions.
            </p>
          </div>

          <div className="glass-card p-8 animate-fade-in" style={{ animationDelay: "600ms" }}>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">NFT Verification</h3>
            <p className="text-muted-foreground">
              Your DevScore is minted on Qubic blockchain, providing immutable proof of your skills.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {[
            { value: "10K+", label: "Developers" },
            { value: "500K+", label: "Commits Tracked" },
            { value: "50K+", label: "NFTs Minted" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 animate-fade-in"
              style={{ animationDelay: `${700 + index * 100}ms` }}
            >
              <p className="text-4xl font-bold gradient-text mb-2">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 DevScore. Built on Qubic Testnet.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Documentation
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              GitHub
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
