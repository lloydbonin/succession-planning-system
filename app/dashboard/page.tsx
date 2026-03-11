import AppShell from "@/components/Appshell";
import { employees } from "@/data/employees";

export default function DashboardPage() {
  const totalCandidates = employees.length;
  const readyNow = employees.filter(
    (employee) => employee.readiness === "Ready Now"
  ).length;
  const ongoingTraining = employees.filter(
    (employee) => employee.trainingStatus === "Ongoing"
  ).length;
  const completedTraining = employees.filter(
    (employee) => employee.trainingStatus === "Completed"
  ).length;

  return (
    <AppShell>
      <div>
        <h1 className="mb-6 text-3xl font-bold text-slate-800">Dashboard</h1>

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
      </div>
    </AppShell>
  );
}