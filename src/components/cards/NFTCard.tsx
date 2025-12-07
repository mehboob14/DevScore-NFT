import { ExternalLink } from "lucide-react";

interface NFTCardProps {
  tokenId: string;
  score: number;
  commits: number;
  pullRequests: number;
  issues: number;
  discordMessages: number;
  mintedAt: string;
}

const NFTCard = ({ tokenId, score, commits, pullRequests, issues, discordMessages, mintedAt }: NFTCardProps) => {
  return (
    <div className="glass-card overflow-hidden group">
      {/* NFT Visual */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3 shadow-lg shadow-primary/30">
            <span className="text-3xl font-bold text-primary-foreground">{score}</span>
          </div>
          <p className="text-sm font-medium text-foreground">DevScore NFT</p>
          <p className="text-xs text-muted-foreground font-mono">#{tokenId}</p>
        </div>
      </div>

      {/* NFT Details */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold text-primary">{commits}</p>
            <p className="text-xs text-muted-foreground">Commits</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold text-primary">{pullRequests}</p>
            <p className="text-xs text-muted-foreground">PRs</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold text-primary">{issues}</p>
            <p className="text-xs text-muted-foreground">Issues</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold text-primary">{discordMessages}</p>
            <p className="text-xs text-muted-foreground">Discord</p>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Minted {mintedAt}</p>
          <button className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm">
            View on Explorer
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
