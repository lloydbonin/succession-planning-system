"use client";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
      },
    });

    if (error) {
      alert(`Login failed: ${error.message}`);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            Succession Planning System
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in using your institutional Google account.
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full rounded-xl bg-slate-800 py-3 text-sm font-medium text-white hover:bg-slate-700"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}