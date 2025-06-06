'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRegistrationStatus } from '@/hooks/useRegistrationStatus';

export default function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { signUp, isLoading, error } = useAuth();
  const { registrationEnabled, isLoading: isCheckingRegistration } = useRegistrationStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setFormError('Hasła nie są identyczne');
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setFormError('Hasło musi mieć co najmniej 6 znaków');
      return;
    }

    await signUp({ name, email, password });
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Utwórz konto</h1>
        <p className="text-muted-foreground mt-2">
          {registrationEnabled === false
            ? "Rejestracja jest obecnie wyłączona"
            : "Wprowadź swoje dane, aby utworzyć konto"}
        </p>
      </div>

      {/* Show loading state while checking registration status */}
      {isCheckingRegistration && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Show registration disabled message */}
      {registrationEnabled === false && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-md">
            <h3 className="font-medium text-lg mb-2">Rejestracja wyłączona</h3>
            <p>
              Rejestracja nowych użytkowników jest obecnie wyłączona.
              Skontaktuj się z administratorem systemu, aby uzyskać dostęp.
            </p>
          </div>

          <div className="text-center text-sm mt-6">
            <p>
              Masz już konto?{' '}
              <Link href="/sign-in" className="text-primary hover:underline">
                Zaloguj się
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Show registration form if enabled */}
      {registrationEnabled === true && (
        <>
          {(error || formError) && (
            <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md">
              {formError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Imię i nazwisko
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary"
                placeholder="Jan Kowalski"
              />
            </div>

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

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Potwierdź hasło
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? 'Tworzenie konta...' : 'Zarejestruj się'}
            </button>
          </form>

          <div className="text-center text-sm">
            <p>
              Masz już konto?{' '}
              <Link href="/sign-in" className="text-primary hover:underline">
                Zaloguj się
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
