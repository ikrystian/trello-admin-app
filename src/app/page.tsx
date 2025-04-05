import { Suspense } from 'react';
import LandingPage from '@/components/LandingPage';
import { getDictionary } from '@/lib/dictionaries';

// This server component handles the root path '/'
// It checks authentication status and redirects to dashboard only if user is logged in
export default async function RootPage() {
  // Fetch the dictionary on the server
  const dictionary = await getDictionary();

  // We'll let the client-side auth check handle the redirect
  // Wrap LandingPage in a Suspense boundary to handle useSearchParams
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LandingPage dictionary={dictionary} />
    </Suspense>
  );
}
