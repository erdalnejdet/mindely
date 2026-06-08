# AGENTS.md

## Proje Adı

Mindely

## Proje Tanımı

Mindely, kullanıcıların psikolog, diyetisyen ve diğer sağlık uzmanları ile online görüşme yapabileceği bir uzman pazaryeri platformudur.

Platform kullanıcıların:

* uzman aramasına
* randevu almasına
* psikolojik testler çözmesine
* online görüşme yapmasına

olanak sağlar.

## Ana Amaç

Mental sağlık ve yaşam sağlığı uzmanlarını kullanıcılarla buluşturan modern bir online platform oluşturmak.

---

# Tech Stack

Frontend:

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui
* React Hook Form
* Zustand
* TanStack Query

Authentication:

* Signed JWT access + refresh tokens issued by the Express app in `backend/` (`mindely-backend`, HS256). Next.js App Router BFF (`app/api/auth/*`) stores tokens in httpOnly cookies (`mindely_at`, `mindely_rt`), verifies JWTs server-side (`jose`), and proxies auth to the API.

Backend taban URL (BFF / sunucu kodu): `lib/api-url.ts` — `MINDELY_API_URL` → `BACKEND_API_URL` → `NEXT_PUBLIC_API_URL`. Tarayici BFF: `lib/api-client.ts` — `apiUrl("/api/...")` (`NEXT_PUBLIC_APP_URL` opsiyonel). Sabit `http://localhost:…` kullanma.

Icons:

* Lucide Icons

Hosting:

* Vercel

---

# UI Tasarım Kuralları

* Minimal ve modern SaaS tasarım
* Bol whitespace
* Yuvarlak kartlar
* Yumuşak gölgeler
* Pastel renk paleti
* Responsive tasarım
* Mobil öncelikli yaklaşım

Ana renkler:

Primary: soft blue
Secondary: pastel green
Background: white

---

# Platform Özellikleri

## Kullanıcı Özellikleri

* kayıt olma
* giriş yapma
* uzman arama
* filtreleme
* randevu alma
* psikolojik test çözme
* uzman değerlendirme

## Uzman Özellikleri

* profil oluşturma
* uzmanlık alanı ekleme
* seans ücreti belirleme
* takvim ayarlama
* randevu yönetimi
* danışan mesajları

---

# Sayfa Yapısı

/
Landing page

/experts
Uzman listeleme

/experts/[slug]
Uzman profil sayfası

/booking
Randevu oluşturma

/tests
Psikolojik testler

/dashboard
Kullanıcı paneli

/dashboard/expert
Uzman paneli

---

# Component Yapısı

Ana component kategorileri:

UI Components:

* Button
* Card
* Modal
* Input
* Form

Expert Components:

* ExpertCard
* ExpertProfile
* ExpertFilters

Booking Components:

* Calendar
* TimeSlots
* BookingForm

Test Components:

* TestQuestion
* TestProgress
* TestResult

---

# Kod Standartları

* TypeScript zorunlu
* Component bazlı mimari
* reusable component kullanımı
* clean code
* modüler klasör yapısı

---

# Performans Kuralları

* lazy loading
* server components kullanımı
* optimize edilmiş image kullanımı
* SEO uyumlu sayfalar

---

# SEO

Landing page ve uzman sayfaları SEO uyumlu olmalıdır.

SEO hedefleri:

* online psikolog
* online diyetisyen
* terapi platformu
* psikolojik test

---

# Gelecek Özellikler

* AI terapist öneri sistemi
* mobil uygulama
* online video görüşme
* kurumsal paketler
* uzman doğrulama sistemi

---

# Agent Talimatları

AI agent aşağıdaki kurallara uymalıdır:

1. Next.js App Router kullanılmalıdır.
2. Tailwind CSS tercih edilmelidir.
3. shadcn/ui componentleri kullanılmalıdır.
4. Componentler reusable olmalıdır.
5. Kod modüler yazılmalıdır.
6. UI modern SaaS tasarım standartlarına uygun olmalıdır.
