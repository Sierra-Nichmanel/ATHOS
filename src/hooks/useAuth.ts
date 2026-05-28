'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const setData = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchBusinessData(session.user.id);
      }
      
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchBusinessData(session.user.id);
      } else {
        setBusiness(null);
        setProfile(null);
      }
      
      setLoading(false);
    });

    setData();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const fetchBusinessData = async (userId: string) => {
    try {
      // Get profile and business
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*, businesses(*)')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      setProfile(profileData);
      setBusiness(profileData.businesses);
    } catch (err) {
      console.error('Unexpected error fetching business:', err);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return {
    user,
    session,
    loading,
    business,
    profile,
    signOut,
  };
}
