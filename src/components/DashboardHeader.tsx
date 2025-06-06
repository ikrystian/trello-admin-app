'use client';

import { Clock } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { UserMenu } from './UserMenu';

// Define the expected dictionary structure for this component
interface DashboardHeaderDictionary {
  title: string; // Assuming the main app title is needed
  // Add other header-specific strings if necessary
}

// Define props including the dictionary
interface DashboardHeaderProps {
  dictionary: DashboardHeaderDictionary;
}


export default function DashboardHeader({ dictionary }: DashboardHeaderProps) {

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">{dictionary.title}</span> {/* Use dictionary title */}
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
