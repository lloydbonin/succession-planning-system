"use client";

import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      // If logged in → go to dashboard
      window.location.href = "/dashboard";
    }

    checkUser();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}