"use client";

import { useRequests } from "@/hooks/use-requests";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { StatusChart } from "@/components/dashboard/status-chart";
import { PriorityChart } from "@/components/dashboard/priority-chart";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
  const { data: requests, isLoading } = useRequests();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <DashboardHeader />

      {requests && <DashboardStats requests={requests} />}

      {/* Charts Section */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 w-full">
        {requests && <StatusChart requests={requests} />}
        {requests && <PriorityChart requests={requests} />}
        {requests && <TrendChart requests={requests} />}
        {requests && <CategoryChart requests={requests} />}
      </div>

      {/* Recent Activity Section (Full Width) */}
      <div className="w-full">{requests && <RecentActivity requests={requests} />}</div>
    </div>
  );
}
