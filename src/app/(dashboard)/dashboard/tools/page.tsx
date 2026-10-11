import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { HeroBanner } from "@/components/showcase/hero-banner";
import { AppGrid } from "@/components/showcase/app-grid";
import { StoreLinks } from "@/components/showcase/store-links";
import { APPS, STORES } from "@/components/showcase/data";

export default async function ToolsPage() {
  const featuredApp = APPS[0];

  const [supabase, user] = await Promise.all([
    createClient(),
    getCurrentUser(),
  ]);
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user!.id)
    .maybeSingle();
  const isPremium = subscription?.status === "active";

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">
          Vitrine de Aplicações
        </h1>
        <p className="text-sm text-zinc-500">
          Centralize suas ferramentas Toolsfy e descubra onde mais estamos
          presentes.
        </p>
      </div>

      <HeroBanner app={featuredApp} />
      <AppGrid apps={APPS} isPremium={isPremium} />
      <StoreLinks stores={STORES} />
    </div>
  );
}
