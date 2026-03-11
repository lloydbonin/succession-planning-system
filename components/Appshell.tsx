import { ReactNode } from "react";
import Sidebar from "./Sidebar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}