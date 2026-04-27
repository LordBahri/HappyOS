"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/auth/actions";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/expenses": "Expenses",
  "/shopping": "Shopping",
  "/members": "Members",
  "/tasks": "Tasks",
};

function getTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const key = Object.keys(PAGE_TITLES).find(
    (k) => k !== "/" && pathname.startsWith(k)
  );
  return key ? PAGE_TITLES[key] : "HappyOS";
}

export default function Header() {
  const pathname = usePathname();
  const [initials, setInitials] = useState("…");

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        const email = data.user?.email ?? "";
        setInitials(email.slice(0, 2).toUpperCase() || "?");
      });
  }, []);

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Page title */}
      <h1 className="text-sm font-semibold text-slate-800">
        {getTitle(pathname)}
      </h1>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Quick add */}
        <Link
          href="/expenses"
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add expense
        </Link>

        {/* Avatar + sign out */}
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title="Sign out"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
              {initials}
            </span>
          </button>
        </form>
      </div>
    </header>
  );
}
