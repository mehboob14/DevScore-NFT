import { useState } from "react";
import { Github, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface GitHubConnectProps {
  walletAddress: string;
  onConnected?: (username: string) => void;
  onDisconnected?: () => void;
}

export function GitHubConnect({ walletAddress, onConnected, onDisconnected }: GitHubConnectProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connectedUsername, setConnectedUsername] = useState("");
  const [error, setError] = useState("");

  // Check connection status
  const checkConnection = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/github/check/${walletAddress}`);
      const data = await response.json();
      
      if (data.connected) {
        setConnected(true);
        setConnectedUsername(data.github_username);
      }
    } catch (err) {
      console.error("Error checking GitHub connection:", err);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a GitHub username");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/github/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
          github_username: username.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to connect GitHub account");
      }

      setConnected(true);
      setConnectedUsername(username.trim());
      setUsername("");
      toast.success(`GitHub account '${username.trim()}' connected successfully!`);
      
      if (onConnected) {
        onConnected(username.trim());
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to connect GitHub account";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setConnected(false);
    setConnectedUsername("");
    setUsername("");
    setError("");
    toast.info("GitHub account disconnected");
    
    if (onDisconnected) {
      onDisconnected();
    }
  };

  if (!walletAddress) {
    return null;
  }

  return (
    <Card className="glass-card border-none">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Github className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>GitHub Connection</CardTitle>
            <CardDescription>Link your GitHub account to track development activity</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {connected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-green-900 dark:text-green-200">Connected</p>
                <p className="text-sm text-green-800 dark:text-green-300">{connectedUsername}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="flex-1"
              >
                Disconnect
              </Button>
              <Button
                variant="glow"
                size="sm"
                className="flex-1"
                onClick={checkConnection}
              >
                Verify
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github-username" className="text-sm">
                GitHub Username
              </Label>
              <Input
                id="github-username"
                placeholder="e.g., octocat"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                disabled={loading}
                className="glass-input"
              />
              <p className="text-xs text-muted-foreground">
                Enter your GitHub username (case-sensitive)
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !username.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Github className="h-4 w-4 mr-2" />
                  Connect GitHub
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
