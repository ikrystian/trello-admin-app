import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import LandingPage from '@/components/LandingPage';
import { getDictionary } from '@/lib/dictionaries'; // Import dictionary loader

// This server component handles the root path '/'
// It checks authentication status and redirects to dashboard only if user is logged in
export default async function RootPage() { // Remove params
  const headersList = headers();
  const cookie = headersList.get('cookie') || '';
  const hasAuthCookie = cookie.includes('auth_session=');
  const dictionary = await getDictionary(); // Load the default (Polish) dictionary

  // If the user is logged in, redirect to dashboard
  if (hasAuthCookie) {
    redirect(`/dashboard`); // Update redirect URL to non-localized
  }

  // If not logged in, show the landing page, passing the entire dictionary
  // LandingPage will internally pass the necessary parts to LandingPageContent
  // Note: This assumes the main dictionary structure matches LandingPageContentDictionary
  // We might need to adjust the main Dictionary type in dictionaries.ts later
  return <LandingPage dictionary={dictionary} />; // Remove lang prop
}
