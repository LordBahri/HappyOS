import { logout } from "@/app/auth/actions";

export default function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <span className="text-sm text-neutral-500">Welcome back</span>
      <form action={logout}>
        <button
          type="submit"
          className="text-sm text-neutral-500 hover:text-neutral-900"
        >
          Sign out
        </button>
      </form>
    </header>
  );
}
