import Link from "next/link";
import { Leaf, Instagram, Twitter, Facebook, Linkedin } from "lucide-react";

const footerLinks = {
  quickAccess: [
    { href: "/psikologlar", label: "Psikologlar" },
    { href: "/psikologlar", label: "Randevu Al" },
    { href: "/tests", label: "Psikolojik Testler" },
    { href: "/terapist-islemleri", label: "Terapist Islemleri" },
  ],
  corporate: [
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/iletisim", label: "İletişim" },
    { href: "/gizlilik", label: "Gizlilik Politikası" },
    { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
  ],
  help: [
    { href: "/sss", label: "Sıkça Sorulan Sorular" },
    { href: "/destek", label: "Yardım" },
    { href: "/blog", label: "Blog" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="border-t border-emerald-100 bg-[#f4fafd] text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold">Mindely</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Mental sağlık ve yaşam sağlığı uzmanlarını sizinle buluşturan
              modern online platform.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="rounded-lg border border-emerald-100 bg-white p-2 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Hızlı Erişim</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.quickAccess.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Kurumsal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.corporate.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Yardım</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-emerald-100 pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mindely. Tum haklari saklidir.
          </p>
        </div>
      </div>
    </footer>
  );
}
