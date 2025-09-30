"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubscribe = async () => {
    setError('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    
    setIsLoading(true);
    
    try {
      
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        alert('¡Gracias por suscribirte! Revisa tu email.');
        setEmail('');
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  };

  return (
    <div className="p-8 lg:p-16 lg:pr-8">
      <div className="max-w-md">
        <p className="text-orange-500 font-semibold text-lg mb-3">
          Our Subscribe
        </p>
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
          Sign Up for Exclusive Deals Up to 50% Off!
        </h2>

        <div className="space-y-3">
          {/* Subscribe Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email"
                className="w-full px-6 py-4 rounded-full bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                disabled={isLoading}
              />
            </div>
            <Button 
              onClick={handleSubscribe}
              disabled={isLoading || !email}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-4 text-lg font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Subscribe'}
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm px-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}