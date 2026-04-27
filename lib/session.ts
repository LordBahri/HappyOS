import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateFamilyId } from "@/lib/family";

type SessionContext =
  | { supabase: SupabaseClient; user: User; familyId: string }
  | { error: string };

export async function getSessionContext(): Promise<SessionContext> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const result = await getOrCreateFamilyId(supabase, user.id);
  if ("error" in result) return { error: result.error };

  return { supabase, user, familyId: result.familyId };
}
