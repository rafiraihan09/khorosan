'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would integrate with your email service
    console.log('Newsletter subscription:', email);
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <section className="py-16 bg-black text-white w-screen">
      <div className="w-full flex items-center justify-center">
        <div className="text-center px-4 sm:px-6 lg:px-8 max-w-3xl w-full">
          <h2 className="overspray-title text-white text-3xl lg:text-5xl mb-3">
            STAY UPDATED
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Be the first to know about new collections, exclusive offers, and insider news.
          </p>

          {isSubscribed ? (
            <div className="bg-white text-black p-3 rounded text-center max-w-sm mx-auto">
              <p className="">Thank you for subscribing!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-black text-white border-gray-600 placeholder-gray-400 h-10"
              />
              <Button 
                type="submit" 
                className="bg-white text-black hover:bg-gray-100 px-6 h-10"
              >
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;