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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <Form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              {...register('email')}
              type="email"
              label="Email address"
              placeholder="Email address"
              autoComplete="email"
              error={errors.email}
            />

            <Input
              {...register('password')}
              type="password"
              label="Password"
              placeholder="Password"
              autoComplete="current-password"
              error={errors.password}
            />
          </div>

          {error && <FormError message={error} />}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isSubmitting}
            loadingText="Signing in..."
          >
            Sign in
          </Button>
        </Form>
      </div>
    </div>
  );
}