"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { account } from '../../../service/appwrite';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../header';

type SignUpFormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const SignUpPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: SignUpFormInputs) => {
    try {
      await account.create('unique()', data.email, data.password);
      const session = await account.createEmailPasswordSession(data.email, data.password);
      console.log(session);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='bg-white min-h-screen'>
      <Header />
      <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign up for your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  required
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.email ? 'border-red-500 ring-red-500' : ''
                    }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{String(errors.email?.message)}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  {...register('password')}
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.password ? 'border-red-500 ring-red-500' : ''
                    }`}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{String(errors.password?.message)}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  {...register('confirmPassword')}
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.confirmPassword ? 'border-red-500 ring-red-500' : ''
                    }`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{String(errors.confirmPassword?.message)}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
