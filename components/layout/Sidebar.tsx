const links = [
  { href: "/", label: "Home" },
  { href: "/expenses", label: "Expenses" },
  { href: "/tasks", label: "Tasks" },
  { href: "/members", label: "Members" },
];

export default function Sidebar() {
  return (
    <aside className="flex h-full w-56 flex-col border-r border-neutral-200 bg-white px-3 py-6">
      <span className="mb-8 px-2 text-lg font-bold tracking-tight">HappyOS</span>
      <nav className="flex flex-col gap-1">
        {links.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          >
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
