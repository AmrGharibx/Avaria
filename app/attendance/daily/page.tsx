"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Download,
  Calendar,
  Clock,
  Check,
  X,
  AlertCircle,
  Bus,
} from "lucide-react";
import { Sidebar, Header } from "@/components/layout";
import { Button, Badge, Avatar } from "@/components/ui";
import { mockDailyAttendance, mockTrainees } from "@/lib/mock-data";
import { formatTime, calculateMinutesLate } from "@/lib/utils/calculations";
import { cn } from "@/lib/utils";
import { AttendanceStatus } from "@/types";

const statusConfig: Record<
  AttendanceStatus,
  { icon: React.ElementType; color: string; badge: string }
> = {
  Present: {
    icon: Check,
    color: "text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-300",
  },
  Absent: {
    icon: X,
    color: "text-rose-400",
    badge: "bg-rose-500/15 text-rose-300",
  },
  "Tour Day": {
    icon: Bus,
    color: "text-sky-400",
    badge: "bg-sky-500/15 text-sky-300",
  },
  "Off Day": {
    icon: Calendar,
    color: "text-slate-400",
    badge: "bg-slate-500/15 text-slate-300",
  },
};

export default function DailyAttendancePage() {
  const [selectedDate, setSelectedDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );

  const stats = {
    present: mockDailyAttendance.filter((a) => a.status === "Present").length,
    absent: mockDailyAttendance.filter((a) => a.status === "Absent").length,
    late: mockDailyAttendance.filter((a) => a.wasLate).length,
    onTour: mockDailyAttendance.filter((a) => a.status === "Tour Day").length,
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-7xl space-y-8"
          >
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-white">
                  Daily Attendance
                </h1>
                <p className="text-sm text-slate-400">
                  Track and manage daily attendance records
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-100 focus:border-red-500 focus:outline-none"
                />
                <Button variant="secondary">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button>
                  <Plus className="h-4 w-4" />
                  Mark Attendance
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Present"
                value={stats.present}
                icon={Check}
                color="emerald"
              />
              <StatCard
                label="Absent"
                value={stats.absent}
                icon={X}
                color="rose"
              />
              <StatCard
                label="Late"
                value={stats.late}
                icon={AlertCircle}
                color="amber"
              />
              <StatCard
                label="On Tour"
                value={stats.onTour}
                icon={Bus}
                color="sky"
              />
            </div>

            {/* Attendance Table */}
            <div className="glass-card overflow-hidden">
              <div className="border-b border-slate-800/50 p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search trainees..."
                      className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900/70 py-2 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <select className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-100 focus:border-red-500 focus:outline-none">
                    <option value="">All Status</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Tour Day">Tour Day</option>
                    <option value="Off Day">Off Day</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800/50 text-left text-sm text-slate-400">
                      <th className="p-4 font-medium">Trainee</th>
                      <th className="p-4 font-medium">Arrival</th>
                      <th className="p-4 font-medium">Departure</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Late</th>
                      <th className="p-4 font-medium">Minutes Late</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDailyAttendance.map((attendance) => {
                      const trainee = mockTrainees.find(
                        (t) => t.id === attendance.traineeId
                      );
                      const config = statusConfig[attendance.status];
                      const StatusIcon = config.icon;

                      return (
                        <tr
                          key={attendance.id}
                          className="border-b border-slate-800/30 transition-colors hover:bg-slate-900/50"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar
                                name={trainee?.traineeName || "Unknown"}
                                size="sm"
                              />
                              <div>
                                <p className="font-medium text-white">
                                  {trainee?.traineeName || "Unknown"}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {trainee?.company}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-slate-300">
                              <Clock className="h-4 w-4 text-slate-500" />
                              {formatTime(attendance.arrivalTime)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-slate-300">
                              <Clock className="h-4 w-4 text-slate-500" />
                              {formatTime(attendance.departureTime)}
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                                config.badge
                              )}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {attendance.status}
                            </span>
                          </td>
                          <td className="p-4">
                            {attendance.wasLate ? (
                              <span className="inline-flex items-center gap-1 text-amber-400">
                                <AlertCircle className="h-4 w-4" />
                                Yes
                              </span>
                            ) : (
                              <span className="text-slate-500">—</span>
                            )}
                          </td>
                          <td className="p-4">
                            {attendance.minutesLate > 0 ? (
                              <span className="font-mono text-amber-300">
                                +{attendance.minutesLate} min
                              </span>
                            ) : (
                              <span className="text-slate-500">—</span>
                            )}
                          </td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: "emerald" | "rose" | "amber" | "sky";
}) {
  const colorClasses = {
    emerald: "bg-emerald-500/15 text-emerald-300",
    rose: "bg-rose-500/15 text-rose-300",
    amber: "bg-amber-500/15 text-amber-300",
    sky: "bg-sky-500/15 text-sky-300",
  };

  return (
    <div className="glass-card flex items-center gap-4 p-4">
      <div className={cn("rounded-xl p-3", colorClasses[color])}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-white">{value}</p>
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </div>
  );
}
