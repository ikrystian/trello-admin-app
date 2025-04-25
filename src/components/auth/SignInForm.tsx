'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRegistrationStatus } from '@/hooks/useRegistrationStatus';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading, error } = useAuth();
  const { registrationEnabled } = useRegistrationStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn({ email, password });
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Zaloguj się</h1>
        <p className="text-muted-foreground mt-2">
          Wprowadź swoje dane, aby się zalogować
        </p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary"
            placeholder="twoj@email.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Hasło
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logowanie...' : 'Zaloguj się'}
        </button>
      </form>

      <div className="text-center text-sm">
        {registrationEnabled ? (
          <p>
            Nie masz konta?{' '}
            <Link href="/sign-up" className="text-primary hover:underline">
              Zarejestruj się
            </Link>
          </p>
        ) : registrationEnabled === false ? (
          <p>
            Rejestracja nowych użytkowników jest obecnie wyłączona.
            Skontaktuj się z administratorem systemu, aby uzyskać dostęp.
          </p>
        ) : null}
      </div>
    </div>
  );
}
