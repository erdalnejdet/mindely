import { Footer } from "./Footer";

export function PageLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className ?? "min-h-screen bg-background"}>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
