import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { getBlogPost } from "@/lib/data/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  return (
    <PageLayout>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Tüm yazılara dön
        </Link>

        <header className="mt-8">
          <p className="text-sm text-muted-foreground">
            {new Date(post.publishedAt).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · {post.author}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
        </header>

        <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <div className="prose prose-emerald mt-10 max-w-none">
          {post.content
            .trim()
            .split("\n\n")
            .map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={i} className="mt-8 text-xl font-semibold text-foreground">
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.startsWith("- ")) {
                const items = block.split("\n").filter((l) => l.startsWith("- "));
                return (
                  <ul key={i} className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
                    {items.map((item, j) => (
                      <li key={j}>{item.replace("- ", "")}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="mt-4 text-muted-foreground">
                  {block}
                </p>
              );
            })}
        </div>
      </article>
    </PageLayout>
  );
}
