"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/30 dark:bg-[#030712] relative transition-all duration-300">
      {/* Background Liquid Glass Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Blob 1: Top Right - Blue/Indigo */}
        <div className="absolute top-[-10%] right-[-10%] w-[55vw] h-[55vw] min-w-[500px] min-h-[500px] rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-500/20 dark:from-indigo-600/10 dark:to-blue-600/10 blur-[130px] animate-pulse duration-[12s] opacity-80"></div>
        {/* Blob 2: Bottom Left - Violet/Cyan */}
        <div className="absolute bottom-[-15%] left-[-15%] w-[50vw] h-[50vw] min-w-[400px] min-h-[400px] rounded-full bg-gradient-to-tr from-cyan-400/20 to-purple-400/20 dark:from-cyan-600/10 dark:to-purple-600/5 blur-[120px] opacity-75"></div>
        {/* Blob 3: Center Left - Pink/Emerald */}
        <div className="absolute top-[25%] left-[-10%] w-[40vw] h-[40vw] min-w-[300px] min-h-[300px] rounded-full bg-gradient-to-r from-pink-400/15 to-teal-400/15 dark:from-pink-600/5 dark:to-teal-600/5 blur-[100px] opacity-60"></div>
      </div>

      <Sidebar isMobileOpen={isMobileOpen} onCloseMobile={() => setIsMobileOpen(false)} />

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        <Header onOpenMobileMenu={() => setIsMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
          <div className="relative z-10 mx-auto max-w-7xl animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
