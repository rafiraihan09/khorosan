import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth types
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

// Auth functions with better error handling
export const signUp = async (email: string, password: string, name?: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || ''
        }
      }
    });
    
    if (error) {
      console.error('Supabase signup error:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error: any) {
    console.error('Signup error:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Supabase signin error:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error: any) {
    console.error('Signin error:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    throw error;
  }
};

// Google OAuth Sign In
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    
    if (error) {
      console.error('Google signin error:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error: any) {
    console.error('Google signin error:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    throw error;
  }
};

// Apple OAuth Sign In
export const signInWithApple = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) {
      console.error('Apple signin error:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error: any) {
    console.error('Apple signin error:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase signout error:', error);
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error('Signout error:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Get user error:', error);
      throw new Error(error.message);
    }
    return user;
  } catch (error: any) {
    console.error('Get current user error:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    throw error;
  }
};

export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Get session error:', error);
      throw new Error(error.message);
    }
    return session;
  } catch (error: any) {
    console.error('Get session error:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    throw error;
  }
};