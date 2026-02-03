"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  ArrowUpRight,
  Bell,
  CalendarCheck,
  GraduationCap,
  Settings2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Sidebar, Header } from "@/components/layout";
import { CustomizationPanel } from "@/components/customization/CustomizationPanel";
import { ClientOnly, LoadingScreen } from "@/components/ClientOnly";
import { mockDashboardStats, mockDailyAttendance, mockTrainees, mock10DayAttendance } from "@/lib/mock-data";

// Dynamic import Recharts to avoid SSR issues
const AreaChart = dynamic(
  () => import("recharts").then((mod) => mod.AreaChart),
  { ssr: false }
);
const Area = dynamic(() => import("recharts").then((mod) => mod.Area), {
  ssr: false,
});
const BarChart = dynamic(
  () => import("recharts").then((mod) => mod.BarChart),
  { ssr: false }
);
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), {
  ssr: false,
});
const PieChart = dynamic(
  () => import("recharts").then((mod) => mod.PieChart),
  { ssr: false }
);
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), {
  ssr: false,
});
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), {
  ssr: false,
});
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), {
  ssr: false,
});

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as const },
  },
};

// Use real data from Notion exports
const stats = [
  {
    title: "Active Batches",
    value: mockDashboardStats.activeBatches,
    trend: 12,
    icon: GraduationCap,
    color: "red",
  },
  {
    title: "Planning Batches",
    value: mockDashboardStats.planningBatches,
    trend: 4,
    icon: CalendarCheck,
    color: "amber",
  },
  {
    title: "Completed Batches",
    value: mockDashboardStats.completedBatches,
    trend: 8,
    icon: ShieldCheck,
    color: "emerald",
  },
  {
    title: "Total Trainees",
    value: mockDashboardStats.totalTrainees,
    trend: 16,
    icon: Users,
    color: "sky",
  },
];

const attendanceTrend = mockDashboardStats.weeklyTrend;

const outcomeData = mockDashboardStats.outcomeDistribution;

const outcomeColors = ["#DC2626", "#F59E0B", "#38BDF8", "#94A3B8"];

const topCompanies = mockDashboardStats.topCompanies;

// Get recent attendance entries (last 10)
const recentAttendance = mockDailyAttendance
  .slice(0, 10)
  .map(a => {
    const trainee = mockTrainees.find(t => t.id === a.traineeId);
    // Extract name from entryId if trainee not found (format: "YYYY-MM-DD - Name")
    const nameFromEntry = a.entryId?.split(' - ')[1] || 'Unknown';
    
    let badge = "bg-emerald-500/15 text-emerald-300";
    let status = "Present";
    
    if (a.status === "Absent") {
      badge = "bg-rose-500/15 text-rose-300";
      status = "Absent";
    } else if (a.wasLate || a.status === "Tour Day") {
      badge = "bg-amber-500/15 text-amber-300";
      status = a.status === "Tour Day" ? "Tour" : "Late";
    }
    
    const timeStr = a.arrivalTime 
      ? a.arrivalTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
      : "—";
    
    return {
      name: trainee?.traineeName || nameFromEntry,
      status,
      time: timeStr,
      badge,
    };
  });

// Get 10-day progress from real data
const tenDayProgress = mock10DayAttendance
  .slice(0, 5)
  .map(a => {
    const trainee = mockTrainees.find(t => t.id === a.traineeId);
    return {
      name: trainee?.traineeName || "Unknown",
      percent: a.completionPercent,
      status: a.checklistStatus,
    };
  });

const colorMap: Record<
  string,
  { bg: string; text: string; glow: string }
> = {
  red: {
    bg: "bg-red-500/15",
    text: "text-red-300",
    glow: "bg-red-500/30",
  },
  amber: {
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    glow: "bg-amber-500/30",
  },
  emerald: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    glow: "bg-emerald-500/30",
  },
  sky: {
    bg: "bg-sky-500/15",
    text: "text-sky-300",
    glow: "bg-sky-500/30",
  },
};

function CompletionRing({ value }: { value: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative h-16 w-16">
      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 72 72">
        <circle
          cx="36"
          cy="36"
          r={radius}
          strokeWidth="8"
          className="text-slate-700"
          stroke="currentColor"
          fill="transparent"
        />
        <circle
          cx="36"
          cy="36"
          r={radius}
          strokeWidth="8"
          strokeLinecap="round"
          className="text-red-400"
          stroke="currentColor"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-100">
        {value}%
      </span>
    </div>
  );
}

export default function Home() {
  const [customizationOpen, setCustomizationOpen] = React.useState(false);
  const todayLabel = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#dc262640,transparent_55%)]" />
          <div className="absolute inset-x-0 top-[-200px] -z-10 h-[500px] bg-[radial-gradient(circle,#dc262640,transparent_65%)] blur-3xl" />

          <motion.main
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-20 pt-10"
          >
            <header className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20">
                  <Sparkles className="h-6 w-6 text-red-300" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-red-200/80">
                    Red Academy
                  </p>
                  <h1 className="text-3xl font-semibold text-white md:text-4xl">
                    Training Command Center
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCustomizationOpen(true)}
                  className="glass-card flex items-center gap-2 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800/70"
                >
                  <Settings2 className="h-4 w-4 text-red-300" />
                  Customize
                </button>
                <button className="glass-card flex items-center gap-2 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800/70">
                  <TrendingUp className="h-4 w-4 text-red-300" />
                  Generate Report
                </button>
                <button className="glass-card flex items-center gap-2 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800/70">
                  <Bell className="h-4 w-4 text-red-300" />
                  Alerts
                </button>
              </div>
            </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-card relative overflow-hidden p-8">
            <div className="absolute -right-16 -top-20 h-40 w-40 rounded-full bg-red-500/30 blur-3xl" />
            <p className="text-sm font-medium text-red-200">{todayLabel}</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Real-time Attendance Pulse
            </h2>
            <p className="mt-3 max-w-xl text-sm text-slate-300">
              Monitor attendance across every batch with live rollups, late
              arrival tracking, and automated 10-day completion summaries.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">Today</p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  73% Attendance
                </p>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-800">
                  <div className="h-2 w-[73%] rounded-full bg-gradient-to-r from-red-500 via-red-400 to-amber-400" />
                </div>
                <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-300">
                    <ArrowUpRight className="h-3 w-3" /> +4.2%
                  </span>
                  vs last week
                </div>
              </div>
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">Live Snapshot</p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Present</p>
                    <p className="text-xl font-semibold text-emerald-300">45</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Absent</p>
                    <p className="text-xl font-semibold text-rose-300">8</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Late</p>
                    <p className="text-xl font-semibold text-amber-300">12</p>
                  </div>
                  <div>
                    <p className="text-slate-500">On Tour</p>
                    <p className="text-xl font-semibold text-sky-300">5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="section-title">Live Attendance Feed</h3>
              <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs text-red-200">
                Batch 31
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {recentAttendance.map((entry) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-900/70 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{entry.name}</p>
                    <p className="text-xs text-slate-400">{entry.time}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${entry.badge}`}
                  >
                    {entry.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const color = colorMap[stat.color];
            return (
              <motion.div
                key={stat.title}
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass-card relative overflow-hidden p-6"
              >
                <div className={`absolute -right-10 -top-10 h-24 w-24 rounded-full ${color.glow} blur-2xl`} />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.title}</p>
                    <p className="mt-3 text-3xl font-semibold text-white">
                      <CountUp end={stat.value} duration={2} />
                    </p>
                    <p className="mt-2 text-xs text-emerald-300">
                      ↑ {stat.trend}% from last month
                    </p>
                  </div>
                  <div className={`rounded-2xl p-3 ${color.bg} ${color.text}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="section-title">Attendance Trend</h3>
              <span className="muted-text">Last 7 days</span>
            </div>
            <div className="mt-6 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrend}>
                  <defs>
                    <linearGradient id="attendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#DC2626" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#DC2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#94A3B8", fontSize: 12 }} domain={[60, 90]} />
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: 12,
                      color: "#f8fafc",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#DC2626"
                    strokeWidth={2}
                    fill="url(#attendance)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="section-title">Assessment Outcomes</h3>
              <span className="muted-text">Current batch</span>
            </div>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={outcomeData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {outcomeData.map((entry, index) => (
                      <Cell key={entry.name} fill={outcomeColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: 12,
                      color: "#f8fafc",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-300">
              {outcomeData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: outcomeColors[index] }}
                  />
                  {entry.name}: {entry.value}%
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="section-title">Top Companies</h3>
              <span className="muted-text">Leaderboard</span>
            </div>
            <div className="mt-6 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCompanies} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#1f2937" }}
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: 12,
                      color: "#f8fafc",
                    }}
                  />
                  <Bar dataKey="trainees" fill="#DC2626" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="section-title">10-Day Completion</h3>
              <span className="muted-text">Rolling summary</span>
            </div>
            <div className="mt-6 space-y-4">
              {tenDayProgress.map((entry) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/70 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{entry.name}</p>
                    <p className="text-xs text-slate-400">{entry.status}</p>
                  </div>
                  <CompletionRing value={entry.percent} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </motion.main>

      <CustomizationPanel
        open={customizationOpen}
        onClose={() => setCustomizationOpen(false)}
      />
        </div>
      </div>
    </div>
  );
}
