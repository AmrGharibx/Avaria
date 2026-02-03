"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Download,
  Sparkles,
  Star,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { Sidebar, Header } from "@/components/layout";
import { Button, Badge, Avatar, ProgressBar, Card } from "@/components/ui";
import { mockAssessments, mockTrainees } from "@/lib/mock-data";
import { getOutcomeColor, calculateScores } from "@/lib/utils/calculations";
import { cn } from "@/lib/utils";
import { AssessmentOutcome } from "@/types";

const outcomeColors: Record<AssessmentOutcome, string> = {
  Aced: "bg-emerald-500/15 text-emerald-300",
  Excellent: "bg-green-500/15 text-green-300",
  "Very Good": "bg-lime-500/15 text-lime-300",
  Good: "bg-amber-500/15 text-amber-300",
  "Needs Improvement": "bg-orange-500/15 text-orange-300",
  Failed: "bg-rose-500/15 text-rose-300",
};

export default function AssessmentsPage() {
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
                <h1 className="text-2xl font-semibold text-white">Assessments</h1>
                <p className="text-sm text-slate-400">
                  Track trainee performance and assessment outcomes
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button>
                  <Plus className="h-4 w-4" />
                  New Assessment
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search assessments..."
                  className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900/70 py-2 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
                />
              </div>
              <select className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-100 focus:border-red-500 focus:outline-none">
                <option value="">All Outcomes</option>
                <option value="Aced">Aced</option>
                <option value="Excellent">Excellent</option>
                <option value="Very Good">Very Good</option>
                <option value="Good">Good</option>
                <option value="Needs Improvement">Needs Improvement</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            {/* Assessments Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {mockAssessments.map((assessment) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function AssessmentCard({
  assessment,
}: {
  assessment: typeof mockAssessments[0];
}) {
  const trainee = mockTrainees.find((t) => t.id === assessment.traineeId);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={trainee?.traineeName || "Unknown"} size="lg" />
          <div>
            <h3 className="font-semibold text-white">
              {trainee?.traineeName || "Unknown"}
            </h3>
            <p className="text-sm text-slate-400">{assessment.company}</p>
            <p className="mt-1 text-xs text-slate-500">
              {assessment.assessmentTitle}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            outcomeColors[assessment.assessmentOutcome]
          )}
        >
          {assessment.assessmentOutcome}
        </span>
      </div>

      {/* Scores Section */}
      <div className="mt-6 space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">Technical Score</span>
            <span className="font-semibold text-white">
              {assessment.techScorePercent}%
            </span>
          </div>
          <ProgressBar
            value={assessment.techScorePercent}
            showLabel={false}
            color="from-sky-500 to-cyan-400"
          />
          <div className="mt-2 flex gap-4 text-xs text-slate-400">
            <span>
              Mapping: <StarRating value={assessment.mapping} />
            </span>
            <span>
              Product Knowledge: <StarRating value={assessment.productKnowledge} />
            </span>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">Soft Score</span>
            <span className="font-semibold text-white">
              {assessment.softScorePercent}%
            </span>
          </div>
          <ProgressBar
            value={assessment.softScorePercent}
            showLabel={false}
            color="from-purple-500 to-pink-400"
          />
          <div className="mt-2 flex gap-4 text-xs text-slate-400">
            <span>
              Presentability: <StarRating value={assessment.presentability} />
            </span>
            <span>
              Soft Skills: <StarRating value={assessment.softSkills} />
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/70 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Overall Score</span>
            <span className="text-2xl font-bold text-white">
              {assessment.overallPercent}%
            </span>
          </div>
          <ProgressBar
            value={assessment.overallPercent}
            showLabel={false}
            size="lg"
          />
        </div>
      </div>

      {/* Attendance */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-emerald-500/10 p-3 text-center">
          <p className="text-xl font-semibold text-emerald-300">
            {assessment.attendance}
          </p>
          <p className="text-xs text-slate-400">Present Days</p>
        </div>
        <div className="rounded-xl bg-rose-500/10 p-3 text-center">
          <p className="text-xl font-semibold text-rose-300">
            {assessment.absence}
          </p>
          <p className="text-xs text-slate-400">Absent Days</p>
        </div>
      </div>

      {/* Instructor Comment */}
      {assessment.instructorComment && (
        <div className="mt-4 rounded-xl border border-slate-800/50 bg-slate-900/50 p-4">
          <p className="text-xs text-slate-400">
            <MessageSquare className="mr-1 inline h-3 w-3" />
            Instructor Comment
          </p>
          <p className="mt-1 text-sm text-slate-300">
            {assessment.instructorComment}
          </p>
        </div>
      )}

      {/* AI Report */}
      {assessment.assessmentAIReport && (
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-xs text-amber-400">
            <Sparkles className="mr-1 inline h-3 w-3" />
            AI Assessment Report
          </p>
          <p className="mt-1 text-sm text-slate-300">
            {assessment.assessmentAIReport}
          </p>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button variant="ghost" size="sm" className="flex-1">
          Edit
        </Button>
        <Button variant="secondary" size="sm" className="flex-1">
          <Sparkles className="h-4 w-4" />
          Generate AI Report
        </Button>
      </div>
    </Card>
  );
}

function StarRating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3 w-3",
            i < Math.floor(value) ? "fill-current" : "opacity-30"
          )}
        />
      ))}
      <span className="ml-1 text-slate-300">{value}</span>
    </span>
  );
}
