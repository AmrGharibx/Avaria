"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, MoreHorizontal, Calendar, Users, TrendingUp } from "lucide-react";
import { Sidebar, Header } from "@/components/layout";
import { Button, Badge, Card, ProgressBar } from "@/components/ui";
import { mockBatches } from "@/lib/mock-data";
import { formatDateRange, calculateBatchProgress } from "@/lib/utils/calculations";
import { cn } from "@/lib/utils";

const statusColors = {
  Planning: "warning",
  Active: "success",
  Completed: "info",
} as const;

export default function BatchesPage() {
  const [view, setView] = React.useState<"grid" | "kanban">("grid");

  const planningBatches = mockBatches.filter((b) => b.status === "Planning");
  const activeBatches = mockBatches.filter((b) => b.status === "Active");
  const completedBatches = mockBatches.filter((b) => b.status === "Completed");

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
                <h1 className="text-2xl font-semibold text-white">Batches</h1>
                <p className="text-sm text-slate-400">
                  Manage training batches and track progress
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search batches..."
                    className="w-48 rounded-xl border border-slate-700 bg-slate-900/70 py-2 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
                  />
                </div>
                <Button variant="secondary">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button>
                  <Plus className="h-4 w-4" />
                  New Batch
                </Button>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  view === "grid"
                    ? "bg-red-500/15 text-red-300"
                    : "text-slate-400 hover:text-white"
                )}
              >
                Grid View
              </button>
              <button
                onClick={() => setView("kanban")}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  view === "kanban"
                    ? "bg-red-500/15 text-red-300"
                    : "text-slate-400 hover:text-white"
                )}
              >
                Kanban View
              </button>
            </div>

            {view === "grid" ? (
              /* Grid View */
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {mockBatches.map((batch) => (
                  <BatchCard key={batch.id} batch={batch} />
                ))}
              </div>
            ) : (
              /* Kanban View */
              <div className="grid gap-6 lg:grid-cols-3">
                <KanbanColumn title="Planning" batches={planningBatches} color="amber" />
                <KanbanColumn title="Active" batches={activeBatches} color="emerald" />
                <KanbanColumn title="Completed" batches={completedBatches} color="sky" />
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function BatchCard({ batch }: { batch: typeof mockBatches[0] }) {
  const progress = calculateBatchProgress(batch.dateRange.start, batch.dateRange.end);

  return (
    <Card className="group relative">
      <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{batch.batchName}</h3>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
            <Calendar className="h-4 w-4" />
            {formatDateRange(batch.dateRange.start, batch.dateRange.end)}
          </p>
        </div>
        <Badge variant={statusColors[batch.status]}>{batch.status}</Badge>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4 rounded-xl bg-slate-900/70 p-4">
        <div className="text-center">
          <p className="text-2xl font-semibold text-white">{batch.trainees.length || 12}</p>
          <p className="text-xs text-slate-400">Trainees</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-emerald-300">{batch.presentTotal10Day}%</p>
          <p className="text-xs text-slate-400">Present</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-amber-300">{batch.lateTotal10Day}</p>
          <p className="text-xs text-slate-400">Late</p>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-slate-400">Progress</span>
          <span className="text-slate-300">{progress}%</span>
        </div>
        <ProgressBar value={progress} showLabel={false} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-gradient-to-br from-red-500 to-amber-500 text-xs font-semibold text-white"
            >
              T{i}
            </div>
          ))}
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-700 text-xs text-slate-300">
            +9
          </div>
        </div>
        <Button variant="ghost" size="sm">
          View Details
        </Button>
      </div>
    </Card>
  );
}

function KanbanColumn({
  title,
  batches,
  color,
}: {
  title: string;
  batches: typeof mockBatches;
  color: "amber" | "emerald" | "sky";
}) {
  const colorClasses = {
    amber: "bg-amber-500/15 text-amber-300",
    emerald: "bg-emerald-500/15 text-emerald-300",
    sky: "bg-sky-500/15 text-sky-300",
  };

  return (
    <div className="rounded-2xl border border-slate-800/50 bg-slate-900/30 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white">{title}</h3>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              colorClasses[color]
            )}
          >
            {batches.length}
          </span>
        </div>
        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3">
        {batches.map((batch) => (
          <motion.div
            key={batch.id}
            layoutId={batch.id}
            className="cursor-grab rounded-xl border border-slate-800/70 bg-slate-900/70 p-4 transition-colors hover:border-slate-700"
          >
            <h4 className="font-medium text-white">{batch.batchName}</h4>
            <p className="mt-1 text-xs text-slate-400">
              {formatDateRange(batch.dateRange.start, batch.dateRange.end)}
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> 12
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> {batch.avgCompletion10Day}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
