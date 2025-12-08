import { Button, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Signin } from '../Services/AuthServices';
import { useNavigate, Link } from 'react-router-dom';
import { loginschema } from '../assets/LoginSchema';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const { handleSubmit, register, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginschema),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  });

  async function sendData(userData) {
    setLoading(true);
    setApiError(null);
    
    try {
      const res = await Signin(userData);
      
      console.log('Login result:', res);
      
      if (res.message === 'success') {
        // Token and user are already stored in AuthServices
        navigate('/');
      } else {
        setApiError(res.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-stone-50 p-8 py-24 rounded-2xl shadow-lg w-full max-w-lg">
        <h1 className="text-3xl text-amber-600 text-center mb-8">Login</h1>

        <form onSubmit={handleSubmit(sendData)} className="flex flex-col gap-4">
          
          <Input
            label="Email"
            type="email"
            variant="bordered"
            {...register("email")}
            isInvalid={Boolean(errors.email)}
            errorMessage={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            variant="bordered"
            {...register("password")}
            isInvalid={Boolean(errors.password)}
            errorMessage={errors.password?.message}
          />

          <Button
            isLoading={loading}
            className="bg-amber-600 hover:bg-amber-700 text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>

          {apiError && (
            <div className="text-center text-red-500 p-3 bg-red-50 rounded">
              {apiError}
            </div>
          )}

          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-amber-600 font-medium hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}