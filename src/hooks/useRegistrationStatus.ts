'use client';

import { useState, useEffect } from 'react';

export function useRegistrationStatus() {
  const [registrationEnabled, setRegistrationEnabled] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if registration is enabled by making a request to the API
    const checkRegistrationStatus = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/sign-up', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: 'test@example.com', name: 'Test', password: 'password' }),
        });
        
        // If the response is 403, registration is disabled
        setRegistrationEnabled(response.status !== 403);
      } catch {
        // If there's an error, assume registration is enabled
        setRegistrationEnabled(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkRegistrationStatus();
  }, []);

  return { registrationEnabled, isLoading };
}
