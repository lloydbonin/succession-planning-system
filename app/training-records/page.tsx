import AppShell from "@/components/Appshell";
import { trainingRecords } from "@/data/trainingRecords";
import Link from "next/link";

function getStatusClasses(status: string) {
  if (status === "Completed") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "Ongoing") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-slate-200 text-slate-700";
}

export default function TrainingRecordsPage() {
  return (
    <AppShell>
      <div className="text-black">
        <h1 className="mb-6 text-3xl font-bold text-slate-800">
          Training Records
        </h1>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Training Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Target Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Completion</th>
              </tr>
            </thead>

            <tbody>
              {trainingRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-t border-slate-200 hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/employees/${record.employeeId}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {record.employeeName}
                    </Link>
                  </td>

                  <td className="px-6 py-4">{record.department}</td>
                  <td className="px-6 py-4">{record.trainingTitle}</td>
                  <td className="px-6 py-4">{record.trainingCategory}</td>
                  <td className="px-6 py-4">{record.targetRole}</td>

                  <td className="px-6 py-4">
                    <span
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                            record.status
                        )}`}
                    >
                      {record.status}
                    </span>
                  </td>

                  <td className="w-40 px-6 py-4">
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-slate-800"
                        style={{ width: `${record.progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {record.progress}%
                    </p>
                  </td>

                  <td className="px-6 py-4">{record.completionDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}