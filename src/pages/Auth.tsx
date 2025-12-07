import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, isLoaded, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,255,0.1),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(167,139,250,0.1),transparent_50%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">DS</span>
          </div>
          <span className="text-3xl font-bold gradient-text">DevScore</span>
        </Link>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-8"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp
                ? 'Sign up to start tracking your developer score'
                : 'Sign in to track your developer reputation'}
            </p>
          </div>

          {/* Clerk Component */}
          <div className="clerk-wrapper">
            {isSignUp ? (
              <SignUp
                routing="hash"
                signInUrl="/auth"
                redirectUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'bg-transparent shadow-none p-0 w-full',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    socialButtonsBlockButton: 'bg-secondary hover:bg-muted border border-border text-foreground transition-all duration-200',
                    socialButtonsBlockButtonText: 'text-foreground font-medium',
                    socialButtonsProviderIcon: 'w-5 h-5',
                    dividerRow: 'my-4',
                    dividerText: 'text-muted-foreground text-xs',
                    dividerLine: 'bg-border',
                    formFieldInput: 'bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary',
                    formFieldLabel: 'text-foreground text-sm font-medium',
                    formButtonPrimary: 'bg-gradient-to-r from-primary to-[hsl(200,80%,60%)] text-primary-foreground font-semibold hover:opacity-90 transition-opacity',
                    footerAction: 'hidden',
                    identityPreview: 'bg-secondary border-border',
                    identityPreviewText: 'text-foreground',
                    identityPreviewEditButton: 'text-primary hover:text-primary/80',
                  },
                }}
              />
            ) : (
              <SignIn
                routing="hash"
                signUpUrl="/auth"
                redirectUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'bg-transparent shadow-none p-0 w-full',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    socialButtonsBlockButton: 'bg-secondary hover:bg-muted border border-border text-foreground transition-all duration-200',
                    socialButtonsBlockButtonText: 'text-foreground font-medium',
                    socialButtonsProviderIcon: 'w-5 h-5',
                    dividerRow: 'my-4',
                    dividerText: 'text-muted-foreground text-xs',
                    dividerLine: 'bg-border',
                    formFieldInput: 'bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary',
                    formFieldLabel: 'text-foreground text-sm font-medium',
                    formButtonPrimary: 'bg-gradient-to-r from-primary to-[hsl(200,80%,60%)] text-primary-foreground font-semibold hover:opacity-90 transition-opacity',
                    footerAction: 'hidden',
                    identityPreview: 'bg-secondary border-border',
                    identityPreviewText: 'text-foreground',
                    identityPreviewEditButton: 'text-primary hover:text-primary/80',
                  },
                }}
              />
            )}
          </div>

          {/* Toggle Sign In/Up */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-medium"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </motion.div>

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Auth;
