import { changeRole, removeMember } from "@/app/actions/members";
import type { FamilyMember } from "@/types";

function initials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

const ROLE_BADGE: Record<string, string> = {
  admin:  "bg-indigo-50 text-indigo-700",
  member: "bg-slate-100 text-slate-600",
};

export default function MemberList({
  members,
  currentUserId,
  isAdmin,
}: {
  members: FamilyMember[];
  currentUserId: string;
  isAdmin: boolean;
}) {
  if (!members.length) {
    return <p className="text-sm text-slate-400">No members found.</p>;
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
      <ul className="divide-y divide-slate-50">
        {members.map((member) => {
          const isSelf = member.user_id === currentUserId;
          return (
            <li key={member.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors">
              {/* Avatar */}
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                {initials(member.email)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-800 truncate">{member.email}</p>
                  {isSelf && (
                    <span className="text-xs text-slate-400">(you)</span>
                  )}
                </div>
                <span className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${ROLE_BADGE[member.role] ?? ROLE_BADGE.member}`}>
                  {member.role}
                </span>
              </div>

              {/* Admin actions */}
              {isAdmin && !isSelf && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <form action={changeRole} className="flex items-center gap-1.5">
                    <input type="hidden" name="memberId" value={member.id} />
                    <select
                      name="role"
                      defaultValue={member.role}
                      className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-colors cursor-pointer"
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Save
                    </button>
                  </form>

                  <form action={removeMember}>
                    <input type="hidden" name="memberId" value={member.id} />
                    <button
                      type="submit"
                      className="rounded-xl px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
