/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import AppShell from "@/components/Appshell";
import { supabase } from "@/lib/supabase";
import { requireRole } from "@/lib/requireRole";
import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
};

export default function AdminUsersPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("viewer");

  // 🔐 Protect page (admin only)
  useEffect(() => {
    async function checkAccess() {
      const result = await requireRole(["admin"]);

      if (!result.allowed) {
        setAllowed(false);
      } else {
        setAllowed(true);
      }
    }

    checkAccess();
  }, []);

  // 📥 Fetch users
  async function fetchUsers() {
    const { data, error } = await supabase
      .from("authorized_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUsers(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (allowed) {
      fetchUsers();
    }
  }, [allowed]);

  // ➕ Add user
  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("authorized_users").insert([
      {
        email,
        full_name: fullName || null,
        role,
        is_active: true,
      },
    ]);

    if (error) {
      alert(`Error: ${error.message}`);
      return;
    }

    setEmail("");
    setFullName("");
    setRole("viewer");

    fetchUsers();
  }

  // 🔁 Update role
  async function updateRole(id: string, newRole: string) {
    await supabase
      .from("authorized_users")
      .update({ role: newRole })
      .eq("id", id);

    fetchUsers();
  }

  // 🔁 Toggle active
  async function toggleActive(id: string, current: boolean) {
    await supabase
      .from("authorized_users")
      .update({ is_active: !current })
      .eq("id", id);

    fetchUsers();
  }

  // 🔐 Loading state
  if (allowed === null) {
    return (
      <AppShell>
        <div className="p-6 text-black">Checking access...</div>
      </AppShell>
    );
  }

  // 🔐 Access denied
  if (!allowed) {
    return (
      <AppShell>
        <div className="p-6 text-center text-black">
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="text-sm text-slate-500">
            Admin access only.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6 text-black">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            User Management
          </h1>
          <p className="text-sm text-slate-500">
            Manage system access and roles.
          </p>
        </div>

        {/* ➕ Add User Form */}
        <form
          onSubmit={handleAddUser}
          className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border px-3 py-2"
            required
          />

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="rounded-xl border px-3 py-2"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-xl border px-3 py-2"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-slate-800 text-white"
          >
            Add User
          </button>
        </form>

        {/* 📋 Users Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.full_name || "—"}
                    </td>

                    {/* Role dropdown */}
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          updateRole(user.id, e.target.value)
                        }
                        className="rounded border px-2 py-1"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* Active toggle */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          toggleActive(user.id, user.is_active)
                        }
                        className={`rounded px-3 py-1 text-white ${
                          user.is_active
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}