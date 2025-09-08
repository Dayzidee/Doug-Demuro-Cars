import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../../hooks/useAuth';
import apiClient from '../../../services/api';
import { Link, useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const response = await apiClient.post('/auth/login', data);
      const { token } = response.data;
      await login(token);
      navigate('/dashboard');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  const formInputStyles = "w-full bg-backgrounds-card border border-glass p-sm text-white placeholder-neutral-metallic-silver/50 focus:outline-none focus:ring-2 focus:ring-primary-electric-cyan transition-all duration-300 rounded-md";
  const formErrorStyles = "text-red-400 text-xs mt-xs text-left";

  return (
    <div className="container mx-auto py-2xl flex justify-center">
      <div className="w-full max-w-md">
        <div className="bg-glass border border-glass rounded-xl p-lg shadow-lg text-center">
          <h1 className="text-h1 font-heading uppercase mb-md">Login</h1>
          <p className="text-neutral-metallic-silver/70 mb-lg">Access your dashboard and manage your bids.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg text-left">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input type="email" id="email" {...register('email')} className={formInputStyles} placeholder="Email Address" />
              {errors.email && <p className={formErrorStyles}>{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input type="password" id="password" {...register('password')} className={formInputStyles} placeholder="Password" />
              {errors.password && <p className={formErrorStyles}>{errors.password.message}</p>}
            </div>

            {serverError && <p className={`${formErrorStyles} text-center`}>{serverError}</p>}

            <button type="submit" disabled={isSubmitting} className="w-full bg-primary-gradient text-white font-bold py-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
              {isSubmitting ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          <div className="mt-lg text-sm">
            <p className="text-neutral-metallic-silver/70">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-secondary-golden-yellow hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
