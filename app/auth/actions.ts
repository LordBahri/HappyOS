"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (error) return error.message;
  const next = (formData.get("next") as string) || "/";
  redirect(next);
}

export async function signup(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (error) return error.message;
  redirect("/auth/verify");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
