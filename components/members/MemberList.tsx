import { changeRole, removeMember } from "@/app/actions/members";
import type { FamilyMember } from "@/types";

function initials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

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
    return <p className="text-sm text-gray-500">No members found.</p>;
  }

  return (
    <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
      {members.map((member) => {
        const isSelf = member.user_id === currentUserId;
        return (
          <li key={member.id} className="flex items-center gap-4 px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {initials(member.email)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {member.email}
                {isSelf && (
                  <span className="ml-2 text-xs text-gray-400">(you)</span>
                )}
              </p>
              <p className="text-xs capitalize text-gray-500">{member.role}</p>
            </div>

            {isAdmin && !isSelf && (
              <div className="flex items-center gap-2 shrink-0">
                <form action={changeRole} className="flex items-center gap-1">
                  <input type="hidden" name="memberId" value={member.id} />
                  <select
                    name="role"
                    defaultValue={member.role}
                    className="rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-700"
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Save
                  </button>
                </form>

                <form action={removeMember}>
                  <input type="hidden" name="memberId" value={member.id} />
                  <button
                    type="submit"
                    className="text-sm text-red-500 hover:text-red-700"
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
  );
}
