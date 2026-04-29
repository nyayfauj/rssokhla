'use client';

import { useState, useEffect } from 'react';
import { account, ID } from '../appwrite';
import type { Models } from 'appwrite';

export default function AuthPage() {
  const [loggedInUser, setLoggedInUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const user = await account.get();
      setLoggedInUser(user);
    } catch (err) {
      setLoggedInUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      setLoggedInUser(user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function register(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await account.create(ID.unique(), email, password, name);
      await login();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    setError('');
    try {
      await account.deleteSession('current');
      setLoggedInUser(null);
      setEmail('');
      setPassword('');
      setName('');
    } catch (err: any) {
      setError(err.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-12 bg-zinc-900 border border-zinc-800 rounded-2xl text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Appwrite Auth</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loggedInUser ? (
        <div className="text-center space-y-4">
          <p className="text-lg">Logged in as <span className="font-bold text-red-400">{loggedInUser.name || loggedInUser.email}</span></p>
          <button 
            onClick={logout}
            className="w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <form className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Name (for registration)</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <button 
              type="button" 
              onClick={login}
              className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-xl font-medium transition-colors"
            >
              Login
            </button>
            <button 
              type="button" 
              onClick={register}
              className="flex-1 py-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 rounded-xl font-medium transition-colors"
            >
              Register
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
