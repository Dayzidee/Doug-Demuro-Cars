import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const signUpSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setServerError(null);
    try {
      await registerUser({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
      });
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
          <h1 className="text-h1 font-heading uppercase mb-md">Sign Up</h1>
          <p className="text-neutral-metallic-silver/70 mb-lg">Create your account to start bidding and selling.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg text-left">
            <div>
              <label htmlFor="full_name" className="sr-only">Full Name</label>
              <input type="text" id="full_name" {...register('full_name')} className={formInputStyles} placeholder="Full Name" />
              {errors.full_name && <p className={formErrorStyles}>{errors.full_name.message}</p>}
            </div>
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
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input type="password" id="confirmPassword" {...register('confirmPassword')} className={formInputStyles} placeholder="Confirm Password" />
              {errors.confirmPassword && <p className={formErrorStyles}>{errors.confirmPassword.message}</p>}
            </div>

            {serverError && <p className={`${formErrorStyles} text-center`}>{serverError}</p>}

            <button type="submit" disabled={isSubmitting} className="w-full bg-primary-gradient text-white font-bold py-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-lg text-sm">
            <p className="text-neutral-metallic-silver/70">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-secondary-golden-yellow hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
