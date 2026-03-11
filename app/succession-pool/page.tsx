import AppShell from "@/components/Appshell";
import { successionPool } from "@/data/successionPool";
import Link from "next/link";

function getReadinessClasses(readiness: string) {
  if (readiness === "Ready Now") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (readiness === "Ready in 1–2 Years") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-sky-100 text-sky-700";
}

export default function SuccessionPoolPage() {
  return (
    <AppShell>
      <div className="text-black">
        <h1 className="mb-6 text-3xl font-bold text-slate-800">
          Succession Pool
        </h1>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">Target Role</th>
                <th className="px-6 py-4">Talent Rank</th>
                <th className="px-6 py-4">Readiness</th>
                <th className="px-6 py-4">Progress</th>
              </tr>
            </thead>

            <tbody>
              {successionPool.map((candidate) => (
                <tr
                  key={candidate.id}
                  className="border-t border-slate-200 hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/employees/${candidate.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {candidate.name}
                    </Link>
                  </td>

                  <td className="px-6 py-4">{candidate.department}</td>
                  <td className="px-6 py-4">{candidate.currentPosition}</td>
                  <td className="px-6 py-4">{candidate.targetRole}</td>
                  <td className="px-6 py-4">{candidate.talentRank}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getReadinessClasses(
                        candidate.readiness
                      )}`}
                    >
                      {candidate.readiness}
                    </span>
                  </td>

                  <td className="w-40 px-6 py-4">
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-slate-800"
                        style={{ width: `${candidate.progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {candidate.progress}%
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}