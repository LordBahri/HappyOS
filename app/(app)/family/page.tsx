import { getSessionContext } from "@/lib/session";
import { getFamily } from "@/lib/family";
import type { FamilyMember } from "@/types";
import FamilyHeader from "@/components/family/FamilyHeader";
import MemberGrid from "@/components/family/MemberGrid";
import InviteModal from "@/components/family/InviteModal";

export default async function FamilyPage() {
  const ctx = await getSessionContext();
  if ("error" in ctx) return <p className="text-sm text-red-500">{ctx.error}</p>;

  const { supabase, familyId, user } = ctx;

  const [family, membersResult] = await Promise.all([
    getFamily(supabase, familyId),
    supabase.rpc("get_family_members_with_email", { p_family_id: familyId }),
  ]);

  if (membersResult.error) {
    return <p className="text-sm text-red-500">Failed to load members.</p>;
  }

  const members = (membersResult.data as FamilyMember[]) ?? [];
  const currentMember = members.find((m) => m.user_id === user.id);
  const isAdmin = currentMember?.role === "admin";

  return (
    <div className="space-y-6">
      {family && (
        <FamilyHeader
          family={family}
          isAdmin={isAdmin}
          memberCount={members.length}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Members</h2>
          <p className="text-xs text-gray-400">
            {members.length} {members.length === 1 ? "person" : "people"} in this family
          </p>
        </div>
        {isAdmin && <InviteModal />}
      </div>

      <MemberGrid members={members} currentUserId={user.id} isAdmin={isAdmin} />
    </div>
  );
}
