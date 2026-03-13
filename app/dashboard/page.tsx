import AppShell from "@/components/Appshell";
import { successionPool } from "@/data/successionPool";
import { trainingRecords } from "@/data/trainingRecords";
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

function getStatusClasses(status: string) {
  if (status === "Completed") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "Ongoing") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-slate-200 text-slate-700";
}

export default function DashboardPage() {
  const totalCandidates = successionPool.length;

  const readyNow = successionPool.filter(
    (candidate) => candidate.readiness === "Ready Now"
  ).length;

  const ongoingTraining = trainingRecords.filter(
    (record) => record.status === "Ongoing"
  ).length;

  const completedTraining = trainingRecords.filter(
    (record) => record.status === "Completed"
  ).length;

  return (
    <AppShell>
      <div className="space-y-6 text-black">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor succession readiness and development progress.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Succession Candidates</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {totalCandidates}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Ready Now</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {readyNow}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Ongoing Training</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {ongoingTraining}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Completed Training</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {completedTraining}
            </h2>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm xl:col-span-1">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Readiness Overview
            </h2>

            <div className="space-y-4">
              {[
                "Ready Now",
                "Ready in 1–2 Years",
                "Ready in 3–5 Years",
              ].map((level) => {
                const count = successionPool.filter(
                  (candidate) => candidate.readiness === level
                ).length;

                const percentage =
                  totalCandidates > 0
                    ? Math.round((count / totalCandidates) * 100)
                    : 0;

                return (
                  <div key={level}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{level}</span>
                      <span className="text-slate-500">{count}</span>
                    </div>

                    <div className="h-3 w-full rounded-full bg-slate-200">
                      <div
                        className="h-3 rounded-full bg-slate-800"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm xl:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Recent Succession Candidates
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-600">
                  <tr>
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Target Role</th>
                    <th className="pb-3">Readiness</th>
                    <th className="pb-3">Progress</th>
                  </tr>
                </thead>

                <tbody>
                  {successionPool.slice(0, 3).map((candidate) => (
                    <tr key={candidate.id} className="border-t border-slate-200">
                      <td className="py-4">
                        <Link
                          href={`/employees/${candidate.id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {candidate.name}
                        </Link>
                      </td>

                      <td className="py-4 text-slate-700">{candidate.targetRole}</td>

                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getReadinessClasses(
                            candidate.readiness
                          )}`}
                        >
                          {candidate.readiness}
                        </span>
                      </td>

                      <td className="py-4">
                        <div className="w-32">
                          <div className="h-2 w-full rounded-full bg-slate-200">
                            <div
                              className="h-2 rounded-full bg-slate-800"
                              style={{ width: `${candidate.progress}%` }}
                            />
                          </div>
                          <p className="mt-1 text-xs text-slate-500">
                            {candidate.progress}%
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            Training Overview
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-600">
                <tr>
                  <th className="pb-3">Employee</th>
                  <th className="pb-3">Training Title</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Completion</th>
                </tr>
              </thead>

              <tbody>
                {trainingRecords.slice(0, 3).map((record) => (
                  <tr key={record.id} className="border-t border-slate-200">
                    <td className="py-4">
                      <Link
                        href={`/employees/${record.employeeId}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {record.employeeName}
                      </Link>
                    </td>

                    <td className="py-4 text-slate-700">{record.trainingTitle}</td>

                    <td className="py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                          record.status
                        )}`}
                      >
                        {record.status}
                      </span>
                    </td>

                    <td className="py-4 text-slate-700">{record.completionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}