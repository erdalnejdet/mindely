import Link from "next/link";
import { Leaf, Instagram, Twitter, Facebook, Linkedin } from "lucide-react";

const footerLinks = {
  quickAccess: [
    { href: "/experts", label: "Uzmanlar" },
    { href: "/booking", label: "Randevu Al" },
    { href: "/tests", label: "Psikolojik Testler" },
    { href: "/dashboard", label: "Panel" },
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
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-emerald-400" />
              <span className="text-xl font-semibold">Mindely</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-slate-400">
              Mental sağlık ve yaşam sağlığı uzmanlarını sizinle buluşturan
              modern online platform.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Hızlı Erişim</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.quickAccess.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Kurumsal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.corporate.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Yardım</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <p className="text-center text-sm text-slate-400">
            © {new Date().getFullYear()} Mindely. Made with ❤️ for mental
            wellness.
          </p>
        </div>
      </div>
    </footer>
  );
}
