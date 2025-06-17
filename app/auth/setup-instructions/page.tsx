'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function AuthSetupInstructionsPage() {
  const [copiedItems, setCopiedItems] = useState<{ [key: string]: boolean }>({});

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems({ ...copiedItems, [key]: true });
      setTimeout(() => {
        setCopiedItems({ ...copiedItems, [key]: false });
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/auth" className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Link>
          
          <div className="text-center">
            <h1 className="overspray-title text-white text-4xl lg:text-6xl mb-4">
              OAUTH SETUP
            </h1>
            <p className="text-gray-300">
              Configure Google and Apple authentication for your Khorosan store
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Supabase Configuration */}
        <div className="mb-12">
          <h2 className="overspray-title text-white text-2xl mb-6">1. Supabase Configuration</h2>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-300 mb-4">
              First, you need to configure OAuth providers in your Supabase dashboard:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-6">
              <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-gray-300">Supabase Dashboard</a></li>
              <li>Navigate to Authentication → Providers</li>
              <li>Configure Google and Apple OAuth providers</li>
              <li>Add the redirect URLs shown below</li>
            </ol>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Site URL:</label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 bg-black border border-gray-600 rounded px-3 py-2 text-green-400 text-sm">
                    {currentDomain}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(currentDomain, 'siteUrl')}
                    className="border-gray-600 text-white hover:bg-gray-800"
                  >
                    {copiedItems.siteUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Redirect URLs:</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-black border border-gray-600 rounded px-3 py-2 text-green-400 text-sm">
                      {currentDomain}/auth/callback
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(`${currentDomain}/auth/callback`, 'redirectUrl')}
                      className="border-gray-600 text-white hover:bg-gray-800"
                    >
                      {copiedItems.redirectUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Google OAuth Setup */}
        <div className="mb-12">
          <h2 className="overspray-title text-white text-2xl mb-6">2. Google OAuth Setup</h2>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <h3 className="text-lg font-semibold text-white">Google Cloud Console</h3>
            </div>
            
            <ol className="list-decimal list-inside space-y-3 text-gray-300 mb-6">
              <li>
                Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-gray-300 inline-flex items-center">
                  Google Cloud Console <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>Create a new project or select an existing one</li>
              <li>Enable the Google+ API</li>
              <li>Go to "Credentials" and create OAuth 2.0 Client IDs</li>
              <li>Set the application type to "Web application"</li>
              <li>Add authorized redirect URIs:</li>
            </ol>
            
            <div className="bg-black border border-gray-600 rounded p-4 mb-4">
              <p className="text-sm text-gray-400 mb-2">Authorized redirect URIs:</p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 text-green-400 text-sm">
                  {currentDomain}/auth/callback
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(`${currentDomain}/auth/callback`, 'googleRedirect')}
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  {copiedItems.googleRedirect ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm">
              After creating the OAuth client, copy the Client ID and Client Secret to your Supabase dashboard under Authentication → Providers → Google.
            </p>
          </div>
        </div>

        {/* Apple OAuth Setup */}
        <div className="mb-12">
          <h2 className="overspray-title text-white text-2xl mb-6">3. Apple OAuth Setup</h2>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <h3 className="text-lg font-semibold text-white">Apple Developer Console</h3>
            </div>
            
            <ol className="list-decimal list-inside space-y-3 text-gray-300 mb-6">
              <li>
                Go to the <a href="https://developer.apple.com/" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-gray-300 inline-flex items-center">
                  Apple Developer Console <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>Sign in with your Apple Developer account</li>
              <li>Go to "Certificates, Identifiers & Profiles"</li>
              <li>Create a new App ID or select an existing one</li>
              <li>Enable "Sign In with Apple" capability</li>
              <li>Create a Services ID for web authentication</li>
              <li>Configure the Services ID with your domain and redirect URL:</li>
            </ol>
            
            <div className="bg-black border border-gray-600 rounded p-4 mb-4">
              <p className="text-sm text-gray-400 mb-2">Domain:</p>
              <div className="flex items-center space-x-2 mb-3">
                <code className="flex-1 text-green-400 text-sm">
                  {currentDomain.replace('https://', '').replace('http://', '')}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(currentDomain.replace('https://', '').replace('http://', ''), 'appleDomain')}
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  {copiedItems.appleDomain ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <p className="text-sm text-gray-400 mb-2">Return URL:</p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 text-green-400 text-sm">
                  {currentDomain}/auth/callback
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(`${currentDomain}/auth/callback`, 'appleRedirect')}
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  {copiedItems.appleRedirect ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm">
              After configuring Apple Sign In, you'll need to generate a private key and configure it in your Supabase dashboard under Authentication → Providers → Apple.
            </p>
          </div>
        </div>

        {/* Testing */}
        <div className="mb-12">
          <h2 className="overspray-title text-white text-2xl mb-6">4. Testing</h2>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-300 mb-4">
              Once you've configured both providers in Supabase:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-6">
              <li>Return to the sign-in page</li>
              <li>Try signing in with Google or Apple</li>
              <li>You should be redirected back to your app after successful authentication</li>
              <li>Check the Supabase dashboard to see authenticated users</li>
            </ol>
            
            <div className="bg-yellow-900/20 border border-yellow-700 rounded p-4">
              <p className="text-yellow-300 text-sm">
                <strong>Note:</strong> OAuth providers may take a few minutes to become active after configuration. 
                If you encounter issues, check the Supabase logs in your dashboard for detailed error messages.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Link href="/auth">
            <Button className="btn-primary mr-4">
              Test Authentication
            </Button>
          </Link>
          <Link href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="btn-secondary">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Supabase Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}