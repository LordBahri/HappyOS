"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getFamilyId } from "@/lib/family";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" as const };

  const familyId = await getFamilyId(supabase, user.id);
  if (!familyId) return { error: "No family" as const };

  const { data: self } = await supabase
    .from("family_members")
    .select("role")
    .eq("family_id", familyId)
    .eq("user_id", user.id)
    .single();

  if (self?.role !== "admin") return { error: "Not authorized" as const };

  return { supabase, userId: user.id, familyId };
}

export async function changeRole(formData: FormData) {
  const memberId = formData.get("memberId") as string;
  const role = formData.get("role") as "admin" | "member";

  const ctx = await requireAdmin();
  if ("error" in ctx) return;

  const permissions =
    role === "admin"
      ? { manage_members: true, manage_expenses: true, manage_shopping: true }
      : { manage_members: false, manage_expenses: true, manage_shopping: true };

  await ctx.supabase
    .from("family_members")
    .update({ role, permissions })
    .eq("id", memberId)
    .eq("family_id", ctx.familyId);

  revalidatePath("/family");
}

export async function removeMember(formData: FormData) {
  const memberId = formData.get("memberId") as string;

  const ctx = await requireAdmin();
  if ("error" in ctx) return;

  const { data: target } = await ctx.supabase
    .from("family_members")
    .select("user_id")
    .eq("id", memberId)
    .single();

  if (!target || target.user_id === ctx.userId) return;

  await ctx.supabase
    .from("family_members")
    .delete()
    .eq("id", memberId)
    .eq("family_id", ctx.familyId);

  revalidatePath("/family");
}

type InviteState = { link?: string; error?: string } | null;

export async function inviteMember(
  _prev: InviteState,
  formData: FormData
): Promise<InviteState> {
  const email = (formData.get("email") as string).trim().toLowerCase();

  const ctx = await requireAdmin();
  if ("error" in ctx) return { error: ctx.error };

  const { data, error } = await ctx.supabase
    .from("family_invites")
    .insert({ family_id: ctx.familyId, invited_by: ctx.userId, email })
    .select("token")
    .single();

  if (error || !data) return { error: error?.message ?? "Failed to create invite" };

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return { link: `${base}/invite/${data.token}` };
}

export async function updateFamilyInfo(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const name = (formData.get("name") as string).trim();
  const address = (formData.get("address") as string).trim() || null;

  if (!name) return "Family name is required";

  const ctx = await requireAdmin();
  if ("error" in ctx) return ctx.error;

  const { error } = await ctx.supabase
    .from("families")
    .update({ name, address })
    .eq("id", ctx.familyId);

  if (error) return error.message;
  revalidatePath("/family");
  return null;
}
