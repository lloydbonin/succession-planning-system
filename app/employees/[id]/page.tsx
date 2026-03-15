import AppShell from "@/components/Appshell";
import { employees } from "@/data/employees";
import Link from "next/link";

type EmployeeProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EmployeeProfilePage({
  params,
}: EmployeeProfilePageProps) {
  const { id } = await params;

  const employee = employees.find((emp) => emp.id === id);

  if (!employee) {
    return (
      <AppShell>
        <div className="p-6 text-black">
          <h1 className="text-2xl font-bold">Employee not found</h1>
          <Link
            href="/employees"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Back to Employees
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6 text-black">
        <div>
          <Link
            href="/employees"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Employees
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-2xl font-bold text-slate-700">
                {employee.name.charAt(0)}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  {employee.name}
                </h1>
                <p className="mt-1 text-slate-500">{employee.currentPosition}</p>
                <p className="text-slate-500">{employee.department}</p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">
                {employee.readiness}
              </div>

              <Link
                href={`/employees/${employee.id}/edit`}
                className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Employee Details
            </h2>

            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <span className="font-semibold">Employee ID:</span>{" "}
                {employee.employeeId}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {employee.email}
              </p>
              <p>
                <span className="font-semibold">Department:</span>{" "}
                {employee.department}
              </p>
              <p>
                <span className="font-semibold">Current Position:</span>{" "}
                {employee.currentPosition}
              </p>
              <p>
                <span className="font-semibold">Target Role:</span>{" "}
                {employee.targetRole}
              </p>
              <p>
                <span className="font-semibold">Years of Service:</span>{" "}
                {employee.yearsOfService}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Development Status
            </h2>

            <div className="space-y-4 text-sm text-slate-700">
              <p>
                <span className="font-semibold">Readiness Level:</span>{" "}
                {employee.readiness}
              </p>
              <p>
                <span className="font-semibold">Training Status:</span>{" "}
                {employee.trainingStatus}
              </p>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold">Progress</span>
                  <span>{employee.progress}%</span>
                </div>

                <div className="h-3 w-full rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-slate-800"
                    style={{ width: `${employee.progress}%` }}
                  />
                </div>
              </div>

              <div>
                <span className="font-semibold">Development Plan:</span>
                <p className="mt-2 text-slate-600">
                  {employee.developmentPlan}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}