"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Palette, Layout, Zap, Eye, BarChart2, Type, Sparkles, RotateCcw } from "lucide-react";
import { useThemeStore, useDashboardStore } from "@/stores";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface CustomizationPanelProps {
  open: boolean;
  onClose: () => void;
}

const colorSchemes = [
  { id: "red", label: "Red", color: "#DC2626" },
  { id: "blue", label: "Blue", color: "#3B82F6" },
  { id: "purple", label: "Purple", color: "#8B5CF6" },
  { id: "green", label: "Green", color: "#10B981" },
  { id: "orange", label: "Orange", color: "#F97316" },
];

const backgroundStyles = [
  { id: "gradient", label: "Gradient" },
  { id: "solid", label: "Solid" },
  { id: "mesh", label: "Mesh" },
];

const cardStyles = [
  { id: "glass", label: "Glass" },
  { id: "solid", label: "Solid" },
  { id: "bordered", label: "Bordered" },
];

const animationSpeeds = [
  { id: "slow", label: "Slow" },
  { id: "normal", label: "Normal" },
  { id: "fast", label: "Fast" },
];

const chartStyles = [
  { id: "area", label: "Area" },
  { id: "bar", label: "Bar" },
  { id: "line", label: "Line" },
];

const fontFamilies = [
  { id: "inter", label: "Inter" },
  { id: "poppins", label: "Poppins" },
  { id: "system", label: "System" },
];

export function CustomizationPanel({ open, onClose }: CustomizationPanelProps) {
  const { config, setConfig, resetConfig } = useThemeStore();
  const { widgets, toggleWidget } = useDashboardStore();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-md overflow-y-auto border-l border-slate-800/50 bg-slate-950 p-6"
          >
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20">
                  <Sparkles className="h-5 w-5 text-red-300" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Customize</h2>
                  <p className="text-sm text-slate-400">10 Ultimate Options</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-8">
              {/* 1. Color Scheme */}
              <Section icon={Palette} title="1. Color Scheme">
                <div className="grid grid-cols-5 gap-3">
                  {colorSchemes.map((scheme) => (
                    <button
                      key={scheme.id}
                      onClick={() => setConfig({ colorScheme: scheme.id as any })}
                      className={cn(
                        "group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all",
                        config.colorScheme === scheme.id
                          ? "ring-2 ring-white ring-offset-2 ring-offset-slate-950"
                          : "hover:scale-110"
                      )}
                      style={{ background: scheme.color }}
                    >
                      {config.colorScheme === scheme.id && (
                        <Check className="h-5 w-5 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </Section>

              {/* 2. Background Style */}
              <Section icon={Layout} title="2. Background Style">
                <div className="grid grid-cols-3 gap-3">
                  {backgroundStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setConfig({ backgroundStyle: style.id as any })}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                        config.backgroundStyle === style.id
                          ? "border-red-500 bg-red-500/15 text-red-300"
                          : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600"
                      )}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </Section>

              {/* 3. Card Style */}
              <Section icon={Layout} title="3. Card Style">
                <div className="grid grid-cols-3 gap-3">
                  {cardStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setConfig({ cardStyle: style.id as any })}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                        config.cardStyle === style.id
                          ? "border-red-500 bg-red-500/15 text-red-300"
                          : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600"
                      )}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </Section>

              {/* 4. Animation Speed */}
              <Section icon={Zap} title="4. Animation Speed">
                <div className="grid grid-cols-3 gap-3">
                  {animationSpeeds.map((speed) => (
                    <button
                      key={speed.id}
                      onClick={() => setConfig({ animationSpeed: speed.id as any })}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                        config.animationSpeed === speed.id
                          ? "border-red-500 bg-red-500/15 text-red-300"
                          : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600"
                      )}
                    >
                      {speed.label}
                    </button>
                  ))}
                </div>
              </Section>

              {/* 5. Compact Mode */}
              <Section icon={Layout} title="5. Compact Mode">
                <ToggleSwitch
                  enabled={config.compactMode}
                  onChange={(val) => setConfig({ compactMode: val })}
                  label="Enable compact layout"
                />
              </Section>

              {/* 6. Show Sparklines */}
              <Section icon={Eye} title="6. Show Sparklines">
                <ToggleSwitch
                  enabled={config.showSparklines}
                  onChange={(val) => setConfig({ showSparklines: val })}
                  label="Display mini charts in cards"
                />
              </Section>

              {/* 7. Chart Style */}
              <Section icon={BarChart2} title="7. Chart Style">
                <div className="grid grid-cols-3 gap-3">
                  {chartStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setConfig({ chartStyle: style.id as any })}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                        config.chartStyle === style.id
                          ? "border-red-500 bg-red-500/15 text-red-300"
                          : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600"
                      )}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </Section>

              {/* 8. Font Family */}
              <Section icon={Type} title="8. Font Family">
                <div className="grid grid-cols-3 gap-3">
                  {fontFamilies.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setConfig({ fontFamily: font.id as any })}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                        config.fontFamily === font.id
                          ? "border-red-500 bg-red-500/15 text-red-300"
                          : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600"
                      )}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </Section>

              {/* 9. Widget Visibility */}
              <Section icon={Eye} title="9. Widget Visibility">
                <div className="space-y-2">
                  {widgets.map((widget) => (
                    <div
                      key={widget.id}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3"
                    >
                      <span className="text-sm text-slate-300">{widget.title}</span>
                      <ToggleSwitch
                        enabled={widget.visible}
                        onChange={() => toggleWidget(widget.id)}
                        small
                      />
                    </div>
                  ))}
                </div>
              </Section>

              {/* 10. Primary Accent Color */}
              <Section icon={Palette} title="10. Custom Accent Color">
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={config.accentColor}
                    onChange={(e) => setConfig({ accentColor: e.target.value })}
                    className="h-12 w-12 cursor-pointer rounded-xl border-0 bg-transparent"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      Accent Color
                    </p>
                    <p className="text-xs text-slate-400 uppercase">
                      {config.accentColor}
                    </p>
                  </div>
                </div>
              </Section>

              {/* Reset Button */}
              <div className="pt-4">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={resetConfig}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-red-400" />
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ToggleSwitch({
  enabled,
  onChange,
  label,
  small,
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  small?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative inline-flex flex-shrink-0 rounded-full transition-colors",
          small ? "h-5 w-9" : "h-6 w-11",
          enabled ? "bg-red-500" : "bg-slate-700"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block transform rounded-full bg-white shadow-lg ring-0 transition-transform",
            small ? "h-4 w-4" : "h-5 w-5",
            enabled
              ? small
                ? "translate-x-4"
                : "translate-x-5"
              : "translate-x-0.5",
            "mt-0.5"
          )}
        />
      </button>
      {label && <span className="text-sm text-slate-300">{label}</span>}
    </label>
  );
}

export default CustomizationPanel;
