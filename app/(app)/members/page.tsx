import { getSessionContext } from "@/lib/session";
import type { FamilyMember } from "@/types";
import MemberList from "@/components/members/MemberList";

export default async function MembersPage() {
  const ctx = await getSessionContext();
  if ("error" in ctx) return <p className="text-sm text-red-500">{ctx.error}</p>;

  const { supabase, familyId, user } = ctx;

  const { data, error } = await supabase.rpc("get_family_members_with_email", {
    p_family_id: familyId,
  });

  if (error) {
    return <p className="text-sm text-red-500">Failed to load members.</p>;
  }

  const members = (data as FamilyMember[]) ?? [];
  const currentMember = members.find((m) => m.user_id === user.id);
  const isAdmin = currentMember?.role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Members</h1>
        <span className="text-sm text-gray-500">
          {members.length} {members.length === 1 ? "member" : "members"}
        </span>
      </div>
      <MemberList members={members} currentUserId={user.id} isAdmin={isAdmin} />
    </div>
  );
}
