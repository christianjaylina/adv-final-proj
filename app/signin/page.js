'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, signInWithEmailAndPassword } from '../lib/firebase';
import Link from 'next/link';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);

      const userId = auth.currentUser?.uid;

      if (userId) {
        console.log('Logged in user ID:', userId); 
      } else {
        console.log('User is not authenticated');
      }

      router.push('/main');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <header className="w-full px-6 lg:px-8 h-16 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-transform">
          TodoList
        </Link>
      </header>

      <main className="flex-1 flex justify-center items-center">
        <div className="max-w-md w-full bg-white p-8 rounded-md shadow-md dark:bg-gray-800 dark:text-gray-100">
          <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full bg-indigo-500 text-white p-2 rounded-md shadow-md hover:bg-indigo-600">Sign In</button>
          </form>
          <div className="mt-4 text-center">
          <p>Don&apos;t have an account? <Link href="/signup" className="text-indigo-500 hover:text-indigo-300">Sign Up</Link></p>
          </div>
        </div>
      </main>

      <footer className="py-6 px-4 border-t border-gray-200 dark:border-gray-700 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">© 2024 TodoList. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SignIn;
