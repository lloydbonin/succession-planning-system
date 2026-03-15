import AppShell from "@/components/Appshell";
import { employees } from "@/data/employees";
import Link from "next/link";

type EditEmployeePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditEmployeePage({
  params,
}: EditEmployeePageProps) {
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
      <div className="max-w-xl space-y-6 text-black">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Edit Employee
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Update the employee succession profile.
            </p>
          </div>

          <Link
            href={`/employees/${employee.id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Profile
          </Link>
        </div>

        <form className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Employee ID
            </label>
            <input
              defaultValue={employee.employeeId}
              className="mt-1 w-full rounded-xl border px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              defaultValue={employee.name}
              className="mt-1 w-full rounded-xl border px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Department
            </label>
            <input
              defaultValue={employee.department}
              className="mt-1 w-full rounded-xl border px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Current Position
            </label>
            <input
              defaultValue={employee.currentPosition}
              className="mt-1 w-full rounded-xl border px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Target Role
            </label>
            <input
              defaultValue={employee.targetRole}
              className="mt-1 w-full rounded-xl border px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Readiness
            </label>
            <select
              defaultValue={employee.readiness}
              className="mt-1 w-full rounded-xl border px-4 py-2"
            >
              <option>Ready Now</option>
              <option>Ready in 1–2 Years</option>
              <option>Ready in 3–5 Years</option>
            </select>
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-slate-800 py-2 text-white hover:bg-slate-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </AppShell>
  );
}