import { ClerkProvider } from '@clerk/clerk-react';

// Your Clerk publishable key - this is safe to include in client code
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE';

interface ClerkProviderWrapperProps {
  children: React.ReactNode;
}

const ClerkProviderWrapper = ({ children }: ClerkProviderWrapperProps) => {
  // Show configuration message if key is not set
  if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'pk_test_YOUR_KEY_HERE') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Clerk Setup Required</h1>
          <p className="text-muted-foreground">
            To enable authentication, add your Clerk publishable key to the environment.
          </p>
          <div className="bg-card border border-border rounded-lg p-4 text-left">
            <p className="text-sm text-muted-foreground mb-2">Add this to your secrets:</p>
            <code className="text-xs text-primary">VITE_CLERK_PUBLISHABLE_KEY=pk_test_...</code>
          </div>
          <p className="text-xs text-muted-foreground">
            Get your key from the{' '}
            <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Clerk Dashboard
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: 'hsl(175, 80%, 50%)',
          colorBackground: 'hsl(222, 47%, 9%)',
          colorInputBackground: 'hsl(222, 47%, 14%)',
          colorInputText: 'hsl(210, 40%, 98%)',
          colorText: 'hsl(210, 40%, 98%)',
          colorTextSecondary: 'hsl(215, 20%, 55%)',
          borderRadius: '0.75rem',
        },
        elements: {
          card: 'bg-card border border-border backdrop-blur-xl',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton: 'bg-secondary hover:bg-secondary/80 border-border text-foreground',
          socialButtonsBlockButtonText: 'text-foreground',
          formButtonPrimary: 'bg-gradient-to-r from-primary to-accent hover:opacity-90',
          footerActionLink: 'text-primary hover:text-primary/80',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
};

export default ClerkProviderWrapper;
