import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { blogPosts } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Psikoloji Blog",
  description:
    "Psikoloji, terapi ve mental sağlık hakkında güncel yazılar. Uzman görüşleri ve pratik öneriler.",
};

export default function BlogPage() {
  return (
    <PageLayout>
      <div className="bg-emerald-50/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Psikoloji Blog
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Psikoloji, terapi ve mental sağlık hakkında güncel yazılar.
              Uzman görüşleri ve pratik öneriler.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-foreground group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-muted-foreground">
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                  Okumaya devam et
                  <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
