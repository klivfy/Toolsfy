import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="flex max-w-sm flex-col items-center gap-4 px-8 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2
            className="h-7 w-7 text-emerald-600"
            strokeWidth={1.75}
          />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-zinc-950">
            Pagamento confirmado!
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Seu plano Premium já está ativo. Aproveite todas as ferramentas
            nativas do Toolsfy sem limites.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="mt-2 inline-flex items-center rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Ir para o Dashboard
        </Link>
      </Card>
    </div>
  );
}
