import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  verified_email: boolean;
  email_verified_at: string | null;
  created_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          setUser(session.user);
          await fetchProfileAndRoles(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setRoles([]);
        }
      } catch (err) {
        console.error("Error fetching initial session:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        if (session?.user) {
          setUser(session.user);
          await fetchProfileAndRoles(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setRoles([]);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfileAndRoles = async (userId: string) => {
    try {
      // Fetch profile and user roles in parallel to minimize latency
      const [profileRes, rolesRes] = await Promise.all([
        supabaseClient.from("profiles").select("*").eq("id", userId).single(),
        supabaseClient.from("user_roles").select("role").eq("user_id", userId),
      ]);

      if (profileRes.error && profileRes.status !== 406) {
        console.error("Error fetching user profile:", profileRes.error);
      } else if (profileRes.data) {
        setProfile(profileRes.data as UserProfile);
      }

      if (rolesRes.error) {
        console.error("Error fetching user roles:", rolesRes.error);
      } else if (rolesRes.data) {
        setRoles(rolesRes.data.map((r) => r.role));
      }
    } catch (err) {
      console.error("Unexpected error in fetchProfileAndRoles:", err);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabaseClient.auth.signOut();
      setUser(null);
      setProfile(null);
      setRoles([]);
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: string) => roles.includes(role);

  return {
    user,
    profile,
    roles,
    isLoading,
    signOut,
    hasRole,
    isAdmin: hasRole("admin"),
    isVerifier: hasRole("verifier"),
    isModerator: hasRole("moderator"),
  };
}
