"use client";

import Link from "next/link";
import { useAuthorizedUser } from "@/hooks/useAuthorizedUser";

type EmployeeProfileActionsProps = {
  employeeId: string;
  readiness: string;
};

export default function EmployeeProfileActions({
  employeeId,
  readiness,
}: EmployeeProfileActionsProps) {
  const { user, loading } = useAuthorizedUser();

  return (
    <div className="flex flex-col items-start gap-3 md:items-end">
      <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">
        {readiness}
      </div>

      {!loading && user && user.role !== "viewer" && (
        <Link
          href={`/employees/${employeeId}/edit`}
          className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Edit Profile
        </Link>
      )}
    </div>
  );
}