import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Trophy, User, Settings, Github, MessageCircle } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const integrations = [
    { icon: Github, label: "GitHub", connected: true },
    { icon: MessageCircle, label: "Discord", connected: false },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen pt-20 pb-6 px-4 border-r border-border/50 bg-sidebar">
      <div className="flex-1 space-y-6">
        {/* Navigation */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Navigation
          </h3>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className={`h-5 w-5 ${
                  location.pathname === item.path ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                }`} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Integrations */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Integrations
          </h3>
          <div className="space-y-1">
            {integrations.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm"
              >
                <div className="flex items-center gap-3 text-muted-foreground">
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  item.connected ? "bg-primary" : "bg-muted-foreground/30"
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="pt-4 border-t border-border">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
