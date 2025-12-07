import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface ScoreCardProps {
  score: number;
  maxScore?: number;
  onMint: () => void;
  isMinting: boolean;
  hasMinted: boolean;
}

const ScoreCard = ({ score, maxScore = 1000, onMint, isMinting, hasMinted }: ScoreCardProps) => {
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass-card p-8 flex flex-col items-center">
      <h3 className="text-lg font-semibold text-muted-foreground mb-6">Your DevScore</h3>
      
      {/* Score Ring */}
      <div className="relative w-64 h-64 mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Score Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-bold gradient-text">{score}</span>
          <span className="text-sm text-muted-foreground mt-1">/ {maxScore}</span>
        </div>
      </div>

      {/* Tier Badge */}
      <div className="glass-card px-4 py-2 mb-6 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent" />
        <span className="text-sm font-medium">
          {score >= 800 ? "Elite Developer" :
           score >= 600 ? "Senior Developer" :
           score >= 400 ? "Mid Developer" :
           score >= 200 ? "Junior Developer" : "Newcomer"}
        </span>
      </div>

      {/* Mint Button */}
      <Button
        variant="gradient"
        size="lg"
        onClick={onMint}
        disabled={isMinting || hasMinted}
        className="w-full max-w-xs"
      >
        {isMinting ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Minting...
          </>
        ) : hasMinted ? (
          <>
            <Sparkles className="h-4 w-4" />
            NFT Minted!
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Mint DevScore NFT
          </>
        )}
      </Button>
    </div>
  );
};

export default ScoreCard;
