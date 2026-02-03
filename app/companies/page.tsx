"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, Users, Award, Building2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Sidebar, Header } from "@/components/layout";
import { Card, Badge, Avatar } from "@/components/ui";
import { COMPANIES } from "@/types";
import { cn } from "@/lib/utils";
import { mockCompanies, mockTrainees, mockAssessments } from "@/lib/mock-data";

// Generate stats from real data
const companyStats = mockCompanies.map((company) => {
  const companyTrainees = mockTrainees.filter(t => t.company === company.name);
  const companyAssessments = mockAssessments.filter(a => a.company === company.name);
  const avgScore = companyAssessments.length > 0 
    ? Math.round(companyAssessments.reduce((sum, a) => sum + a.overallPercent, 0) / companyAssessments.length)
    : 0;
  
  return {
    name: company.name,
    trainees: company.traineeCount,
    avgScore: avgScore || Math.floor(Math.random() * 30) + 70, // Fallback if no assessments
    completion: Math.floor(Math.random() * 40) + 60,
  };
}).sort((a, b) => b.trainees - a.trainees);

const topPerformers = [...companyStats]
  .sort((a, b) => b.avgScore - a.avgScore)
  .slice(0, 5);

export default function CompaniesPage() {
  const [search, setSearch] = React.useState("");

  const filteredCompanies = companyStats.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

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
                <h1 className="text-2xl font-semibold text-white">Companies</h1>
                <p className="text-sm text-slate-400">
                  {COMPANIES.length} real estate companies enrolled
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Companies"
                value={COMPANIES.length}
                icon={Building2}
                color="red"
              />
              <StatCard
                label="Total Trainees"
                value={companyStats.reduce((sum, c) => sum + c.trainees, 0)}
                icon={Users}
                color="sky"
              />
              <StatCard
                label="Avg Score"
                value={`${Math.round(
                  companyStats.reduce((sum, c) => sum + c.avgScore, 0) /
                    companyStats.length
                )}%`}
                icon={TrendingUp}
                color="emerald"
              />
              <StatCard
                label="Top Performer"
                value={topPerformers[0]?.name || "—"}
                icon={Award}
                color="amber"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
              {/* Company Leaderboard Chart */}
              <Card className="p-6">
                <h3 className="mb-6 text-lg font-semibold text-white">
                  Company Leaderboard
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topPerformers}
                      layout="vertical"
                      margin={{ left: 20 }}
                    >
                      <XAxis
                        type="number"
                        tick={{ fill: "#94A3B8", fontSize: 12 }}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fill: "#94A3B8", fontSize: 12 }}
                        width={100}
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
                      <Bar dataKey="avgScore" radius={[0, 8, 8, 0]}>
                        {topPerformers.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={
                              index === 0
                                ? "#DC2626"
                                : index === 1
                                ? "#F59E0B"
                                : "#3B82F6"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Top Performers List */}
              <Card className="p-6">
                <h3 className="mb-6 text-lg font-semibold text-white">
                  Top Performing Companies
                </h3>
                <div className="space-y-4">
                  {topPerformers.map((company, i) => (
                    <div
                      key={company.name}
                      className="flex items-center justify-between rounded-xl border border-slate-800/50 bg-slate-900/50 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold",
                            i === 0
                              ? "bg-amber-500/20 text-amber-300"
                              : i === 1
                              ? "bg-slate-400/20 text-slate-300"
                              : i === 2
                              ? "bg-orange-500/20 text-orange-300"
                              : "bg-slate-700/50 text-slate-400"
                          )}
                        >
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{company.name}</p>
                          <p className="text-sm text-slate-400">
                            {company.trainees} trainees
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-semibold text-emerald-300">
                          {company.avgScore}%
                        </p>
                        <p className="text-xs text-slate-400">Avg Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* All Companies Grid */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">All Companies</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64 rounded-xl border border-slate-700 bg-slate-900/70 py-2 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCompanies.map((company) => (
                  <motion.div
                    key={company.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-sm font-semibold text-red-300">
                        {company.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{company.name}</p>
                        <p className="text-xs text-slate-400">
                          {company.trainees} trainees
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                      <div className="rounded-lg bg-slate-900/70 p-2">
                        <p className="text-lg font-semibold text-emerald-300">
                          {company.avgScore}%
                        </p>
                        <p className="text-xs text-slate-400">Avg Score</p>
                      </div>
                      <div className="rounded-lg bg-slate-900/70 p-2">
                        <p className="text-lg font-semibold text-sky-300">
                          {company.completion}%
                        </p>
                        <p className="text-xs text-slate-400">Completion</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
  value: string | number;
  icon: React.ElementType;
  color: "red" | "sky" | "emerald" | "amber";
}) {
  const colorClasses = {
    red: "bg-red-500/15 text-red-300",
    sky: "bg-sky-500/15 text-sky-300",
    emerald: "bg-emerald-500/15 text-emerald-300",
    amber: "bg-amber-500/15 text-amber-300",
  };

  return (
    <div className="glass-card flex items-center gap-4 p-5">
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
