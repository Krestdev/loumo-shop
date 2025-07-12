// app/info/[name]/page.tsx
import { notFound } from "next/navigation";
import SettingQuery from "@/queries/setting";
import { Metadata } from "next";

// 🚫 Ne pas utiliser useQuery ici, on est dans un composant server
// ✅ Utiliser directement async/await côté serveur

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {

  const { name } = await params

  return {
    title: decodeURIComponent(name),
  };
}

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const decodedName = decodeURIComponent((await params).name);
  const settings = await new SettingQuery().getAll();
  const setting = settings.find((s) => s.name === decodedName);

  if (!setting) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <article
        className="prose prose-lg prose-slate max-w-none [&_h1]:pb-5 [&_p]:pb-1 [&_p]:indent-8"
        dangerouslySetInnerHTML={{ __html: setting.content ?? "" }}
      />
    </div>
  );
}