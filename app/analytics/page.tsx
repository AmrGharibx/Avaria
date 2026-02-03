"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Download, Calendar, TrendingUp, Users, Award, Clock } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Sidebar, Header } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import { mockDashboardStats } from "@/lib/mock-data";

const attendanceByMonth = [
  { month: "Sep", present: 78, absent: 12, late: 10 },
  { month: "Oct", present: 82, absent: 10, late: 8 },
  { month: "Nov", present: 85, absent: 8, late: 7 },
  { month: "Dec", present: 80, absent: 12, late: 8 },
  { month: "Jan", present: 88, absent: 7, late: 5 },
  { month: "Feb", present: 73, absent: 15, late: 12 },
];

const outcomeDistribution = [
  { name: "Aced", value: 67, color: "#10B981" },
  { name: "Excellent", value: 18, color: "#22C55E" },
  { name: "Very Good", value: 8, color: "#84CC16" },
  { name: "Good", value: 5, color: "#F59E0B" },
  { name: "Needs Improvement", value: 2, color: "#EF4444" },
];

const batchComparison = [
  { batch: "Batch 28", tech: 85, soft: 82 },
  { batch: "Batch 29", tech: 88, soft: 85 },
  { batch: "Batch 30", tech: 90, soft: 88 },
  { batch: "Batch 31", tech: 92, soft: 90 },
];

const latePatterns = [
  { hour: "9 AM", count: 2 },
  { hour: "10 AM", count: 5 },
  { hour: "11 AM", count: 8 },
  { hour: "11:15", count: 15 },
  { hour: "11:30", count: 12 },
  { hour: "11:45", count: 6 },
  { hour: "12 PM", count: 3 },
];

const skillsRadar = [
  { skill: "Mapping", A: 92, B: 85 },
  { skill: "Product", A: 88, B: 90 },
  { skill: "Present.", A: 95, B: 82 },
  { skill: "Soft Skills", A: 90, B: 88 },
  { skill: "Attendance", A: 85, B: 92 },
];

export default function AnalyticsPage() {
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
                <h1 className="text-2xl font-semibold text-white">Analytics</h1>
                <p className="text-sm text-slate-400">
                  Comprehensive insights and performance metrics
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-100 focus:border-red-500 focus:outline-none">
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
                <Button variant="secondary">
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Avg Attendance"
                value="84%"
                change="+2.4%"
                positive
                icon={Users}
              />
              <MetricCard
                label="Avg Assessment Score"
                value="87.5%"
                change="+5.2%"
                positive
                icon={Award}
              />
              <MetricCard
                label="Late Arrivals"
                value="12%"
                change="-3.1%"
                positive
                icon={Clock}
              />
              <MetricCard
                label="Completion Rate"
                value="95%"
                change="+1.8%"
                positive
                icon={TrendingUp}
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Attendance Trends */}
              <Card className="p-6">
                <h3 className="mb-6 text-lg font-semibold text-white">
                  Attendance Trends
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={attendanceByMonth}>
                      <defs>
                        <linearGradient id="present" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="absent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#EF4444" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#94A3B8", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          border: "1px solid #334155",
                          borderRadius: 12,
                          color: "#f8fafc",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="present"
                        stroke="#10B981"
                        fill="url(#present)"
                        name="Present %"
                      />
                      <Area
                        type="monotone"
                        dataKey="absent"
                        stroke="#EF4444"
                        fill="url(#absent)"
                        name="Absent %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Assessment Outcomes */}
              <Card className="p-6">
                <h3 className="mb-6 text-lg font-semibold text-white">
                  Assessment Outcomes Distribution
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={outcomeDistribution}
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {outcomeDistribution.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
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
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  {outcomeDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: item.color }}
                      />
                      <span className="text-slate-400">
                        {item.name}: {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Batch Comparison */}
              <Card className="p-6">
                <h3 className="mb-6 text-lg font-semibold text-white">
                  Batch Performance Comparison
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={batchComparison}>
                      <XAxis dataKey="batch" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#94A3B8", fontSize: 12 }} domain={[70, 100]} />
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          border: "1px solid #334155",
                          borderRadius: 12,
                          color: "#f8fafc",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="tech" name="Tech Score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="soft" name="Soft Score" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Late Arrival Patterns */}
              <Card className="p-6">
                <h3 className="mb-6 text-lg font-semibold text-white">
                  Late Arrival Patterns
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={latePatterns}>
                      <XAxis dataKey="hour" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#94A3B8", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          border: "1px solid #334155",
                          borderRadius: 12,
                          color: "#f8fafc",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        dot={{ fill: "#F59E0B" }}
                        name="Late Count"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Skills Radar */}
            <Card className="p-6">
              <h3 className="mb-6 text-lg font-semibold text-white">
                Skills Comparison (Batch 30 vs Batch 31)
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skillsRadar}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                    <PolarRadiusAxis tick={{ fill: "#94A3B8", fontSize: 10 }} domain={[0, 100]} />
                    <Radar
                      name="Batch 31"
                      dataKey="A"
                      stroke="#DC2626"
                      fill="#DC2626"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Batch 30"
                      dataKey="B"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                    />
                    <Legend />
                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: 12,
                        color: "#f8fafc",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  change,
  positive,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
          <p
            className={`mt-1 text-sm ${
              positive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {change} vs last period
          </p>
        </div>
        <div className="rounded-xl bg-red-500/15 p-3 text-red-300">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
