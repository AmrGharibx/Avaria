"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, Download, Sparkles, CheckCircle2 } from "lucide-react";
import { Sidebar, Header } from "@/components/layout";
import { Button, Badge, Avatar, CompletionRing } from "@/components/ui";
import { mock10DayAttendance, mockTrainees } from "@/lib/mock-data";
import { formatDateRange } from "@/lib/utils/calculations";
import { cn } from "@/lib/utils";
import { ChecklistStatus } from "@/types";

const statusColors: Record<ChecklistStatus, string> = {
  "Not Started": "bg-slate-500/15 text-slate-300",
  "In Progress": "bg-amber-500/15 text-amber-300",
  Complete: "bg-emerald-500/15 text-emerald-300",
};

export default function TenDayAttendancePage() {
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
                  10-Day Attendance Summary
                </h1>
                <p className="text-sm text-slate-400">
                  Track attendance completion over 10-day periods
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button>
                  <Sparkles className="h-4 w-4" />
                  Generate AI Reports
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search trainees..."
                  className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900/70 py-2 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
                />
              </div>
              <select className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-100 focus:border-red-500 focus:outline-none">
                <option value="">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Complete">Complete</option>
              </select>
            </div>

            {/* 10-Day Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              {mock10DayAttendance.map((record) => (
                <TenDayCard key={record.id} record={record} />
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function TenDayCard({ record }: { record: typeof mock10DayAttendance[0] }) {
  const trainee = mockTrainees.find((t) => t.id === record.traineeId);
  const days = [
    record.day1,
    record.day2,
    record.day3,
    record.day4,
    record.day5,
    record.day6,
    record.day7,
    record.day8,
    record.day9,
    record.day10,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={trainee?.traineeName || "Unknown"} size="lg" />
          <div>
            <h3 className="font-semibold text-white">
              {trainee?.traineeName || "Unknown"}
            </h3>
            <p className="text-sm text-slate-400">{trainee?.company}</p>
            <p className="mt-1 text-xs text-slate-500">
              {formatDateRange(record.periodStart, record.periodEnd)}
            </p>
          </div>
        </div>
        <CompletionRing value={record.completionPercent} size={56} strokeWidth={6} />
      </div>

      {/* 10-Day Checkboxes */}
      <div className="mt-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
          Daily Attendance
        </p>
        <div className="grid grid-cols-10 gap-2">
          {days.map((checked, i) => (
            <div
              key={i}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg text-xs font-medium transition-colors",
                checked
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-slate-800/50 text-slate-500"
              )}
            >
              {checked ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl bg-slate-900/70 p-4">
        <div className="text-center">
          <p className="text-xl font-semibold text-emerald-300">
            {record.presentCount}
          </p>
          <p className="text-xs text-slate-400">Present</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-rose-300">
            {record.absentCount}
          </p>
          <p className="text-xs text-slate-400">Absent</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-amber-300">
            {record.lateCount}
          </p>
          <p className="text-xs text-slate-400">Late</p>
        </div>
      </div>

      {/* Status & AI Report */}
      <div className="mt-4 flex items-center justify-between">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            statusColors[record.checklistStatus]
          )}
        >
          {record.checklistStatus}
        </span>
        <Button variant="ghost" size="sm">
          View AI Report
        </Button>
      </div>

      {record.attendanceAIReport && (
        <div className="mt-4 rounded-xl border border-slate-800/50 bg-slate-900/50 p-4">
          <p className="text-xs text-slate-400">
            <Sparkles className="mr-1 inline h-3 w-3 text-amber-400" />
            AI Insight
          </p>
          <p className="mt-1 text-sm text-slate-300">
            {record.attendanceAIReport}
          </p>
        </div>
      )}
    </motion.div>
  );
}
