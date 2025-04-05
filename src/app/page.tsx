import { redirect } from 'next/navigation';
import LandingPage from '@/components/LandingPage';
import { getDictionary } from '@/lib/dictionaries';
import { SESSION_COOKIE_NAME } from '@/lib/auth-utils-edge';

// This server component handles the root path '/'
// It checks authentication status and redirects to dashboard only if user is logged in
export default async function RootPage() {
  // Fetch the dictionary on the server
  const dictionary = await getDictionary();

  // We'll let the client-side auth check handle the redirect
  return <LandingPage dictionary={dictionary} />;
}
