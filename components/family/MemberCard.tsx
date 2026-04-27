import { changeRole, removeMember } from "@/app/actions/members";
import type { FamilyMember } from "@/types";

const ROLE_BADGE: Record<string, string> = {
  admin:  "bg-primary-50 text-primary-700",
  member: "bg-neutral-100 text-fg-muted",
};

function initials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

export default function MemberCard({
  member,
  currentUserId,
  isAdmin,
}: {
  member: FamilyMember;
  currentUserId: string;
  isAdmin: boolean;
}) {
  const isSelf = member.user_id === currentUserId;

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-5 text-center shadow-sm transition hover:shadow-md">
      {/* Avatar */}
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
        {initials(member.email)}
      </div>

      {/* Identity */}
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-center gap-1.5">
          <p className="max-w-[160px] truncate text-sm font-medium text-fg">
            {member.email}
          </p>
          {isSelf && (
            <span className="shrink-0 rounded-full bg-neutral-100 px-1.5 py-px text-xs text-fg-subtle">
              you
            </span>
          )}
        </div>
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${ROLE_BADGE[member.role] ?? ROLE_BADGE.member}`}>
          {member.role}
        </span>
      </div>

      {/* Admin actions — hidden for self */}
      {isAdmin && !isSelf && (
        <div className="w-full space-y-1.5 border-t border-line pt-3">
          <form action={changeRole} className="flex gap-1.5">
            <input type="hidden" name="memberId" value={member.id} />
            <select
              name="role"
              defaultValue={member.role}
              className="flex-1 rounded-xl border border-line bg-surface-raised px-2.5 py-1.5 text-xs outline-none focus:border-primary-400 focus:ring-2 focus:ring-interactive-ring transition"
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
            <button
              type="submit"
              className="rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-medium text-fg-muted transition hover:bg-surface-raised"
            >
              Save
            </button>
          </form>

          <form action={removeMember}>
            <input type="hidden" name="memberId" value={member.id} />
            <button
              type="submit"
              className="w-full rounded-xl py-1.5 text-xs font-medium text-danger/70 transition hover:bg-danger/5 hover:text-danger"
            >
              Remove
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
