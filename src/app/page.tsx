import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { ShortcutCards } from "@/components/dashboard/shortcut-cards";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight ">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of your HR management system
          </p>
        </div>
        <OverviewCards />
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <ShortcutCards />
        </div>
      </div>
    </DashboardShell>
  );
}
