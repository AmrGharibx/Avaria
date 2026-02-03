"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Download, MoreHorizontal, Mail, Phone } from "lucide-react";
import { Sidebar, Header } from "@/components/layout";
import { Button, Badge, Card, Avatar, CompletionRing } from "@/components/ui";
import { mockTrainees } from "@/lib/mock-data";
import { COMPANIES } from "@/types";
import { cn } from "@/lib/utils";

export default function TraineesPage() {
  const [search, setSearch] = React.useState("");
  const [selectedCompany, setSelectedCompany] = React.useState<string | null>(null);

  const filteredTrainees = mockTrainees.filter((t) => {
    const matchesSearch = t.traineeName.toLowerCase().includes(search.toLowerCase());
    const matchesCompany = !selectedCompany || t.company === selectedCompany;
    return matchesSearch && matchesCompany;
  });

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
                <h1 className="text-2xl font-semibold text-white">Trainees</h1>
                <p className="text-sm text-slate-400">
                  {filteredTrainees.length} trainees across all batches
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button>
                  <Plus className="h-4 w-4" />
                  Add Trainee
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900/70 py-2 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
                />
              </div>
              <select
                value={selectedCompany || ""}
                onChange={(e) => setSelectedCompany(e.target.value || null)}
                className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-100 focus:border-red-500 focus:outline-none"
              >
                <option value="">All Companies</option>
                {COMPANIES.slice(0, 20).map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>

            {/* Trainees Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredTrainees.map((trainee) => (
                <TraineeCard key={trainee.id} trainee={trainee} />
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function TraineeCard({ trainee }: { trainee: typeof mockTrainees[0] }) {
  return (
    <Card className="group relative">
      <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-start gap-4">
        <Avatar name={trainee.traineeName} size="lg" />
        <div className="flex-1">
          <h3 className="font-semibold text-white">{trainee.traineeName}</h3>
          <p className="text-sm text-slate-400">{trainee.company}</p>
          <Badge variant="info" className="mt-2">
            Batch 31
          </Badge>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl bg-slate-900/70 p-4">
        <div className="text-center">
          <p className="text-xl font-semibold text-emerald-300">{trainee.presentDaily}</p>
          <p className="text-xs text-slate-400">Present</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-rose-300">{trainee.absentDaily}</p>
          <p className="text-xs text-slate-400">Absent</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-amber-300">{trainee.latesDaily}</p>
          <p className="text-xs text-slate-400">Late</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">10-Day Completion</p>
          <p className="text-sm font-medium text-white">
            {trainee.latestCompletion10Day}%
          </p>
        </div>
        <CompletionRing value={trainee.latestCompletion10Day} size={48} strokeWidth={6} />
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="ghost" size="sm" className="flex-1">
          <Mail className="h-4 w-4" />
          Email
        </Button>
        <Button variant="ghost" size="sm" className="flex-1">
          <Phone className="h-4 w-4" />
          Call
        </Button>
      </div>
    </Card>
  );
}
