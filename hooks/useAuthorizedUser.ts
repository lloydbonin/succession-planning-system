"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type AuthorizedUser = {
  email: string;
  role: string;
};

export function useAuthorizedUser() {
  const [user, setUser] = useState<AuthorizedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAuthorizedUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser?.email) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("authorized_users")
        .select("email, role")
        .eq("email", authUser.email)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        setUser(null);
      } else {
        setUser(data);
      }

      setLoading(false);
    }

    loadAuthorizedUser();
  }, []);

  return { user, loading };
}