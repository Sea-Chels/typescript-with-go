import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Form, FormError } from '../components/ui/Form';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={ROUTES.STUDENTS} replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setError(null);

    const result = await login(data);

    if (!result.success) {
      setError(result.error || 'Login failed');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-primary/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-blue/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-4000" />
      </div>

      {/* Login card with glass effect */}
      <div className="relative max-w-md w-full space-y-8 p-8 bg-dark-surface/30 backdrop-blur-xl rounded-2xl border border-dark-border/50 shadow-2xl animate-slide-up">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-neon-purple/5 rounded-2xl pointer-events-none" />
        
        <div className="relative">
          <h2 className="mt-6 text-center text-3xl font-bold bg-gradient-to-r from-dark-text to-accent-light bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-dark-muted">
            Sign in to access your dashboard
          </p>
        </div>
        
        <Form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6 relative">
          <div className="space-y-5">
            <Input
              {...register('email')}
              type="email"
              label="Email address"
              placeholder="Enter your email"
              autoComplete="email"
              error={errors.email}
              variant="glass"
            />

            <Input
              {...register('password')}
              type="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors.password}
              variant="glass"
            />
          </div>

          {error && <FormError message={error} />}

          <div className="pt-2">
            <Button
              type="submit"
              variant="neon"
              fullWidth
              size="lg"
              isLoading={isSubmitting}
              loadingText="Signing in..."
              glow
            >
              <span className="font-semibold">Sign in</span>
            </Button>
          </div>

          {/* Additional links */}
          <div className="flex items-center justify-between text-sm">
            <button type="button" className="text-dark-muted hover:text-accent-light transition-colors">
              Forgot password?
            </button>
            <button type="button" className="text-accent-primary hover:text-accent-light transition-colors">
              Create account
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}