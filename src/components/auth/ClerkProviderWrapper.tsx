import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

interface ClerkProviderWrapperProps {
  children: React.ReactNode;
}

const ClerkProviderWrapper = ({ children }: ClerkProviderWrapperProps) => {
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
