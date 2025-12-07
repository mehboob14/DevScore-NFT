import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  username: string;
  score: number;
  avatar?: string;
  change?: number;
}

interface LeaderboardCardProps {
  users: LeaderboardUser[];
}

const LeaderboardCard = ({ users }: LeaderboardCardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-mono text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Top Developers
        </h3>
      </div>
      <div className="divide-y divide-border/50">
        {users.map((user, index) => (
          <div
            key={user.username}
            className={`p-4 flex items-center gap-4 transition-colors hover:bg-secondary/30 ${
              user.rank <= 3 ? "bg-gradient-to-r from-primary/5 to-transparent" : ""
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Rank */}
            <div className="w-10 flex justify-center">
              {getRankIcon(user.rank)}
            </div>

            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
              user.rank === 1 ? "bg-gradient-to-br from-yellow-500 to-orange-500" :
              user.rank === 2 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
              user.rank === 3 ? "bg-gradient-to-br from-amber-500 to-amber-700" :
              "bg-secondary"
            }`}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className={user.rank <= 3 ? "text-primary-foreground" : "text-foreground"}>
                  {user.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <p className="font-medium">{user.username}</p>
              {user.change !== undefined && (
                <p className={`text-xs ${user.change > 0 ? "text-primary" : user.change < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                  {user.change > 0 ? `↑ ${user.change}` : user.change < 0 ? `↓ ${Math.abs(user.change)}` : "—"}
                </p>
              )}
            </div>

            {/* Score */}
            <div className="text-right">
              <p className="text-lg font-bold gradient-text">{user.score}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardCard;
