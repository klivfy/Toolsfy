import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-neutral-950">
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-8">
        <h1 className="text-xl font-semibold text-zinc-950 dark:text-white">
          Política de Privacidade
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-500 dark:text-neutral-400">
          Esta página está em construção. Em breve traremos os detalhes
          completos sobre como a Mestry&apos;s Tecnologia e Consultoria em TI
          LTDA coleta, utiliza e protege os dados dos usuários do Toolsfy.
        </p>
      </main>
      <Footer />
    </div>
  );
}
