import { changeRole, removeMember } from "@/app/actions/members";
import type { FamilyMember } from "@/types";

const ROLE_BADGE: Record<string, string> = {
  admin:  "bg-indigo-50  text-indigo-700",
  member: "bg-gray-100   text-gray-500",
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
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition hover:shadow-md">
      {/* Avatar */}
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
        {initials(member.email)}
      </div>

      {/* Identity */}
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-center gap-1.5">
          <p className="max-w-[160px] truncate text-sm font-medium text-gray-900">
            {member.email}
          </p>
          {isSelf && (
            <span className="shrink-0 rounded-full bg-gray-100 px-1.5 py-px text-xs text-gray-400">
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
        <div className="w-full space-y-1.5 border-t border-gray-100 pt-3">
          <form action={changeRole} className="flex gap-1.5">
            <input type="hidden" name="memberId" value={member.id} />
            <select
              name="role"
              defaultValue={member.role}
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
            <button
              type="submit"
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Save
            </button>
          </form>

          <form action={removeMember}>
            <input type="hidden" name="memberId" value={member.id} />
            <button
              type="submit"
              className="w-full rounded-xl py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-50 hover:text-red-600"
            >
              Remove
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
