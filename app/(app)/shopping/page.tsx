import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateFamilyId } from "@/lib/family";
import type { ShoppingItem } from "@/types";
import AddItemForm from "@/components/shopping/AddItemForm";
import ShoppingList from "@/components/shopping/ShoppingList";

export default async function ShoppingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const result = await getOrCreateFamilyId(supabase, user.id);
  if ("error" in result) {
    return <p className="text-sm text-red-500">{result.error}</p>;
  }

  const { data } = await supabase
    .from("shopping_items")
    .select("*")
    .eq("family_id", result.familyId)
    .order("checked", { ascending: true })
    .order("created_at", { ascending: false });

  const items = (data as ShoppingItem[]) ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Shopping</h1>
      <AddItemForm />
      <ShoppingList items={items} />
    </div>
  );
}
