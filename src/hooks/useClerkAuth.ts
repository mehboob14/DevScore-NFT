import { useAuth, useUser } from '@clerk/clerk-react';

export const useClerkAuth = () => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  const logout = async () => {
    await signOut();
  };

  const getGitHubConnection = () => {
    if (!user) return null;
    return user.externalAccounts?.find(
      (account) => account.provider === 'github'
    );
  };

  const getDiscordConnection = () => {
    if (!user) return null;
    return user.externalAccounts?.find(
      (account) => account.provider === 'discord'
    );
  };

  return {
    isLoaded,
    isSignedIn,
    user,
    logout,
    getGitHubConnection,
    getDiscordConnection,
    githubUsername: getGitHubConnection()?.username,
    discordUsername: getDiscordConnection()?.username,
  };
};
