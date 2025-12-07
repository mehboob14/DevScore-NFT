import { LucideIcon } from "lucide-react";

interface Activity {
  type: string;
  title: string;
  timestamp: string;
  points: number;
}

interface ActivityCardProps {
  title: string;
  icon: LucideIcon;
  activities: Activity[];
}

const ActivityCard = ({ title, icon: Icon, activities }: ActivityCardProps) => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      
      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
            >
              <div className="flex-1">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
              <span className="text-sm font-mono text-primary">+{activity.points}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;
