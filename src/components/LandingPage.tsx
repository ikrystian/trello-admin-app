'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
// Import the component AND the dictionary type it expects
import LandingPageContent, { type LandingPageContentDictionary } from './LandingPageContent';

// No need for a separate LandingPageDictionary type here anymore

// Define the props type for LandingPage using the imported type
// We also need the toast part of the dictionary now
interface LandingPageProps {
  dictionary: LandingPageContentDictionary & {
    toast: { loggedOutTitle: string; loggedOutDescription: string; };
  };
  // Remove lang: string;
}

export default function LandingPage({ dictionary }: LandingPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Check if user has been logged out
    if (searchParams.has('logged_out')) {
      // Use dictionary for toast messages
      const toastTitle = dictionary.toast.loggedOutTitle;
      const toastDescription = dictionary.toast.loggedOutDescription;

      // Show toast notification
      toast.success(toastTitle, {
        description: toastDescription,
        duration: 3000,
      });

      // Remove the query parameter from the URL without reloading the page
      // or adding to history
      router.replace('/', { scroll: false });
    }
  }, [searchParams, dictionary, router]); // Add router to dependency array

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [isLoading, user, router]);

  // Pass only the dictionary down to the content component
  return <LandingPageContent dictionary={dictionary} />; // Remove lang prop
}
