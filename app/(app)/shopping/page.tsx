import { getSessionContext } from "@/lib/session";
import type { ShoppingItem } from "@/types";
import AddItemForm from "@/components/shopping/AddItemForm";
import ShoppingList from "@/components/shopping/ShoppingList";

export default async function ShoppingPage() {
  const ctx = await getSessionContext();
  if ("error" in ctx) return <p className="text-sm text-red-500">{ctx.error}</p>;

  const { supabase, familyId } = ctx;

  // ShoppingList uses: id, name, checked — created_at drives the sort order
  const { data } = await supabase
    .from("shopping_items")
    .select("id,name,checked,created_at")
    .eq("family_id", familyId)
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
