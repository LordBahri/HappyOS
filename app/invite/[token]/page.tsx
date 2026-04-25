import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ token: string }>;
}

async function accept(token: string) {
  "use server";
  const supabase = await createClient();
  const { data } = await supabase.rpc("accept_family_invite", { p_token: token });
  if (data?.error) {
    redirect(`/invite/${token}?error=${encodeURIComponent(data.error)}`);
  }
  redirect("/");
}

export default async function InvitePage({ params, searchParams }: Props & {
  searchParams: Promise<{ error?: string }>;
}) {
  const { token } = await params;
  const { error: qsError } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=/invite/${token}`);
  }

  const { data: info } = await supabase.rpc("get_invite_info", { p_token: token });

  const boundAccept = accept.bind(null, token);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 text-center">
        {info?.valid ? (
          <>
            <div>
              <h1 className="text-2xl font-bold">You&apos;re invited</h1>
              <p className="mt-2 text-gray-500">
                Join <strong className="text-gray-900">{info.family_name}</strong> on HappyOS.
              </p>
            </div>
            {qsError && (
              <p className="text-sm text-red-500">{qsError}</p>
            )}
            <form action={boundAccept}>
              <button
                type="submit"
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
              >
                Accept &amp; join family
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Invalid invite</h1>
            <p className="text-gray-500">
              This invite link has expired or already been used.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
