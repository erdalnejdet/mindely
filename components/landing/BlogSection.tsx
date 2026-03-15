"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const featuredPosts = [
  {
    title: "Sosyal Anksiyete Nedir?",
    excerpt:
      "Sosyal ortamlarda yaşanan kaygı ve endişe durumları hakkında detaylı bilgi. Belirtileri, nedenleri ve başa çıkma yöntemleri.",
    href: "/blog/sosyal-anksiyete",
  },
  {
    title: "Terapi Nedir?",
    excerpt:
      "Psikolojik terapi süreci nasıl işler? Terapi türleri, faydaları ve doğru terapist seçimi hakkında kapsamlı rehber.",
    href: "/blog/terapi-nedir",
  },
  {
    title: "Cinsel Terapi Nedir?",
    excerpt:
      "Cinsel sağlık problemleri için özel terapi yaklaşımları. Çiftler ve bireyler için cinsel terapi süreci ve faydaları.",
    href: "/blog/cinsel-terapi",
  },
];

const recentPosts = [
  {
    title: "Zihnin Yanıltıcı Hikayeleri",
    excerpt:
      "Zihin bazen olayları olduğu gibi değil, yorumlayarak anlatır. Bu yorumlar gerçek gibi hissedilebilir...",
    href: "/blog/zihnin-yaniltici-hikayeleri",
  },
  {
    title: "Terapi Sürecinde Direnç",
    excerpt:
      "Terapi sürecinde ortaya çıkan direnç çoğu zaman değişim korkusundan kaynaklanır...",
    href: "/blog/terapi-surecinde-direnc",
  },
  {
    title: "Ebeveyn Tükenmişliği",
    excerpt:
      "Modern ebeveynliğin getirdiği aşırı yük ve tükenmişlik hissiyle başa çıkma yollarını keşfedin...",
    href: "/blog/ebeveyn-tukenmisligi",
  },
];

export function BlogSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              En Çok Merak Edilenler
            </h2>
            <p className="mt-2 text-muted-foreground">
              Psikoloji ve terapi hakkında merak ettikleriniz.
            </p>
          </div>
          <Link
            href="/blog"
            className={cn(buttonVariants({ variant: "ghost" }), "w-fit flex items-center gap-1")}
          >
            Tüm Bloglar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <Link
              key={post.title}
              href={post.href}
              className="group rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="font-semibold text-foreground group-hover:text-primary">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {post.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                Okumaya devam et
                <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="text-xl font-semibold text-foreground">
            Güncel Psikoloji Blogları
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {recentPosts.map((post) => (
              <Link
                key={post.title}
                href={post.href}
                className="rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
              >
                <h4 className="font-medium text-foreground">{post.title}</h4>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
