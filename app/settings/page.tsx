"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Settings2, Palette, Bell, Shield, Database, Moon, Sun, Save } from "lucide-react";
import { Sidebar, Header } from "@/components/layout";
import { Button, Card, Input, Select } from "@/components/ui";
import { CustomizationPanel } from "@/components/customization/CustomizationPanel";
import { useThemeStore } from "@/stores";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [customizationOpen, setCustomizationOpen] = React.useState(false);
  const { config } = useThemeStore();

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl space-y-8"
          >
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-semibold text-white">Settings</h1>
              <p className="text-sm text-slate-400">
                Manage your preferences and application settings
              </p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
              {/* Appearance */}
              <Card className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-purple-500/15 p-2 text-purple-300">
                    <Palette className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Appearance</h2>
                    <p className="text-sm text-slate-400">
                      Customize the look and feel of your dashboard
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-slate-800/50 bg-slate-900/50 p-4">
                    <div>
                      <p className="font-medium text-white">Color Scheme</p>
                      <p className="text-sm text-slate-400">
                        Current: {config.colorScheme}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => setCustomizationOpen(true)}
                    >
                      Customize
                    </Button>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-800/50 bg-slate-900/50 p-4">
                    <div>
                      <p className="font-medium text-white">Background Style</p>
                      <p className="text-sm text-slate-400">
                        Current: {config.backgroundStyle}
                      </p>
                    </div>
                    <Select
                      options={[
                        { value: "gradient", label: "Gradient" },
                        { value: "solid", label: "Solid" },
                        { value: "mesh", label: "Mesh" },
                      ]}
                      defaultValue={config.backgroundStyle}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-800/50 bg-slate-900/50 p-4">
                    <div>
                      <p className="font-medium text-white">Animation Speed</p>
                      <p className="text-sm text-slate-400">
                        Control animation speed across the app
                      </p>
                    </div>
                    <Select
                      options={[
                        { value: "slow", label: "Slow" },
                        { value: "normal", label: "Normal" },
                        { value: "fast", label: "Fast" },
                      ]}
                      defaultValue={config.animationSpeed}
                    />
                  </div>
                </div>
              </Card>

              {/* Notifications */}
              <Card className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-amber-500/15 p-2 text-amber-300">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Notifications
                    </h2>
                    <p className="text-sm text-slate-400">
                      Configure notification preferences
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <ToggleSetting
                    label="Email Notifications"
                    description="Receive email alerts for important updates"
                    defaultChecked
                  />
                  <ToggleSetting
                    label="Attendance Alerts"
                    description="Get notified when attendance drops below threshold"
                    defaultChecked
                  />
                  <ToggleSetting
                    label="Assessment Reminders"
                    description="Reminder notifications for pending assessments"
                    defaultChecked={false}
                  />
                </div>
              </Card>

              {/* Security */}
              <Card className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-300">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Security</h2>
                    <p className="text-sm text-slate-400">
                      Manage your account security settings
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-800/50 bg-slate-900/50 p-4">
                    <p className="font-medium text-white">Change Password</p>
                    <p className="mb-4 text-sm text-slate-400">
                      Update your account password
                    </p>
                    <div className="space-y-3">
                      <Input type="password" placeholder="Current password" />
                      <Input type="password" placeholder="New password" />
                      <Input type="password" placeholder="Confirm new password" />
                    </div>
                    <Button className="mt-4">Update Password</Button>
                  </div>

                  <ToggleSetting
                    label="Two-Factor Authentication"
                    description="Add an extra layer of security to your account"
                    defaultChecked={false}
                  />
                </div>
              </Card>

              {/* Data Management */}
              <Card className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-sky-500/15 p-2 text-sky-300">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Data Management
                    </h2>
                    <p className="text-sm text-slate-400">
                      Export and manage your data
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-slate-800/50 bg-slate-900/50 p-4">
                    <div>
                      <p className="font-medium text-white">Export All Data</p>
                      <p className="text-sm text-slate-400">
                        Download all your data as CSV/Excel
                      </p>
                    </div>
                    <Button variant="secondary">Export</Button>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-800/50 bg-slate-900/50 p-4">
                    <div>
                      <p className="font-medium text-white">Import Data</p>
                      <p className="text-sm text-slate-400">
                        Import data from CSV/Excel files
                      </p>
                    </div>
                    <Button variant="secondary">Import</Button>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                    <div>
                      <p className="font-medium text-rose-300">Clear All Data</p>
                      <p className="text-sm text-slate-400">
                        Permanently delete all data. This cannot be undone.
                      </p>
                    </div>
                    <Button variant="danger">Clear Data</Button>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>

      <CustomizationPanel
        open={customizationOpen}
        onClose={() => setCustomizationOpen(false)}
      />
    </div>
  );
}

function ToggleSetting({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = React.useState(defaultChecked);

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800/50 bg-slate-900/50 p-4">
      <div>
        <p className="font-medium text-white">{label}</p>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-red-500" : "bg-slate-700"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-lg transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}
