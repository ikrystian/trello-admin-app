import { getDictionary } from '@/lib/dictionaries';
import DashboardClientContent from '@/components/DashboardClientContent';

// This is a Server Component
export default async function DashboardPage() {
  // Fetch the dictionary on the server
  const dictionary = await getDictionary();

  // Render the client component and pass the dictionary as props
  // The client component will handle authentication
  return (
    <DashboardClientContent dictionary={dictionary} />
  );
}
