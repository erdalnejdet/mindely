# Mindely Second Brain

Bu dosya, yeni bir sohbete gecildiginde kaldigimiz yerden devam etmek icin tutulur.

## Calisma Kurali

- Bu chatten itibaren yapilan her teknik is/soru burada loglanacak.
- Her yeni adimda "Tarih", "Durum", "Sonraki Adim" alanlari guncellenecek.
- Canliya cikis oncesi API envanteri bu dosyada yasatilacak.

## Guvenlik

- **Gercek sifre / API anahtari sohbette paylasildiysa:** ilgili tum kimlik bilgilerini derhal **rotate** edin (SMTP, Cloudinary, JWT, veritabani). Repoda yalnizca `.env.example` ve dokumanlarda **placeholder** tutun; gercek degerleri commit etmeyin.

## Durum Ozeti (2026-05-13)

- Tek Express API: repo `backend/` (`mindely-backend`); ayri `mindely-api` paketi kaldirildi. Next BFF `BACKEND_API_URL` (fallback: `NEXT_PUBLIC_API_URL`) ile baglanir (`backendApiUrl`, `lib/api-url.ts`).
- Auth: **JWT (HS256) access** + **opaque refresh** (DB hash). `backend/` Express `/auth/login`, `/auth/register`, `/auth/register/psychologist`, `/auth/verify-email`, `/auth/resend-verification`, `/auth/refresh`, `/auth/logout`, `/auth/me`, **`GET /psychologists/public`**; access claims: `typ: access`, `sub`, `role`, `email`, `name`, **`emailVerified`** (boolean; psikolog dogrulanmamis ise login/refresh **403** `email_unverified`, cookie yazilmaz).
- **Psikolog onboarding:** FE giris/kayit akisi **`/terapist-islemleri/giris`** + **`/terapist-islemleri/kayit`** (terapist alani; eski `/auth/register/psychologist` kalici yonlendirme ile kayit sayfasina gider). API tarafi: BFF `POST /api/auth/register/psychologist` (kimlik + **seans suresi** 30/45/60 dk) → `/auth/verify-email?email=` → `POST /api/auth/verify-email` → `/auth/login` veya **`/terapist-islemleri/giris`** → panelde **Profil** sekmesinden unvan+biyografi (`PATCH /api/psychologist/profile`) ile `profileCompletedAt` set; avatar istege bagli (`POST /api/psychologist/profile/avatar`).
- **Gorunurluk (API):** `isListed === true` yalnizca psikolog icin: `emailVerified` **ve** `profileCompleted` **ve** `sessionDurationMinutes != null`. `visibilityStatus`: `draft` (e-posta dogrulanmadi) | `pending_profile` (dogrulandi, profil eksik) | `listed` (tam kosullar). `GET /psychologists/public` ve `GET /auth/me` bu kurallarla uyumludur.
- Next.js **BFF** `app/api/auth/*` + `app/api/psychologist/*` + **`app/api/auth/me`** + **`app/api/psychologists/public`**: kimlik bilgilerini API’ye iletir, **httpOnly** `mindely_at` + `mindely_rt`. Oturum dogrulama `jose` + `JWT_ACCESS_SECRET` (yoksa `JWT_SECRET`); API ile **aynı** gizli anahtar.
- **Middleware** (`middleware.ts`): `/dashboard` ve `/onboarding/psychologist` icin access cookie + rol; psikolog + JWT’de `emailVerified === false` ise `/auth/verify-email`e yonlendirme (defansif); access gecersiz ve refresh varsa `GET /api/auth/reconcile?next=...`.
- `POST /api/auth/oauth-sync`: URL’den gelen tokenlari bir kez dogrulayıp cookie’ye yazar; refresh JWT yoksa opaque refresh (uzunluk >= 32) kabul edilir.
- NextAuth yok; `lib/auth.ts` `fetchSession` + `/api/auth/session` (`emailVerified` alanı JWT ile uyumlu).

## Durum Ozeti (2026-05-05)

- Hedef: Projede API istegi yapan tum noktalarin tespiti.
- Sonuc: API cagrilari kod tabanindan kaldirildi.
- Not: `app/api/auth/**/route.ts` BFF + `backend/` Express.
- Panel: `/dashboard` yeniden var; psikolog profili detay sayfasi dilinde tek sayfa, form state mock (localStorage yok), JSON `formStateToJsonPayload` ile onizleme + `console.info`. Uzmanlik ekleme `Dialog` modal. Ortak dogum tarihi: `components/ui/dogum-tarihi-picker.tsx` (Popover + Calendar).
- Panel refactor: `components/dashboard/PsikologDashboardView.tsx` parcalandi. Yeni klasor: `components/dashboard/psikolog-panel/` (Hero, TabTriggers, Profil tab, Genel ayarlar tab, Saat kapatma tab).
- Genel ayarlar: yeni sekme; `aktifSeansAlma` checkbox + `minRezervasyonSaat` input (saat). Payload `parseMinRezervasyonSaatInput` ile `number | null`.
- Profil foto: URL yerine `input type=\"file\"` ile secim; `FileReader` ile `form.image` icine data URL yaziliyor (mock).
- Randevularim: `Saat kapatma` yanina yeni sekme; bekleyen + tamamlanan randevular (mock liste).

## API Cagri Envanteri

- Auth: Next BFF `app/api/auth/*` → `backend/` `/auth/*` (JWT). `GET /api/auth/me` → `/auth/me` (gorunurluk alanlari dahil).
- Psikolog profil: `app/api/psychologist/profile` (PATCH), `app/api/psychologist/profile/avatar` (POST) → API `/psychologist/profile`, `/psychologist/profile/avatar` (Bearer access).
- **Herkese acik psikolog listesi:** `GET /api/psychologists/public` → API `GET /psychologists/public` (auth yok; yalnizca `isListed` kosullarini saglayanlar).
- Diger sayfalar: uzman liste/detay yerel veri (`lib/data/psikologlar.ts`); panel mock.

## Ortam Degiskenleri (`backend/` tabani)

**Kayit `{"error":"registration_disabled"}`:** Next env degil; API `publicRegisterEnabled()` kapali iken doner (`ENABLE_PUBLIC_REGISTER=false`, veya unset iken `NODE_ENV=production`). **Docker:** `backend/docker-compose.yml` api servisi bu degiskenleri konteynere verir; eski sabit `ENABLE_PUBLIC_REGISTER=false` + `NODE_ENV=production` yalnizca `backend/.env`yi gormezden gelirdi — simdi compose varsayilanlari `development` + `true`; prod benzeri icin hostta `NODE_ENV=production` ve `ENABLE_PUBLIC_REGISTER=false` ayarlayin veya `docker-compose.override.yml` kullanin.

| Degisken | Nerede | Zorunlu | Aciklama |
|----------|--------|---------|----------|
| `ENABLE_PUBLIC_REGISTER` | `backend/` (surec env; Docker’da compose) | Hayir | `true` her zaman acik; `false` her zaman kapali; yoksa yalnizca `NODE_ENV !== "production"` iken acik. Yerel compose: `${ENABLE_PUBLIC_REGISTER:-true}`. |
| `BACKEND_API_URL` | Sunucu (BFF, `lib/api-url.ts`) | Evet (veya asagidaki fallback) | `backend/` kok URL; slash ile bitmemeli. |
| `NEXT_PUBLIC_API_URL` | Sunucu + istemci | Hayir | `BACKEND_API_URL` yoksa sunucuda fallback; tarayicida yalnizca dogrudan API cagrisi tasarlanirsa (simdilik auth `/api/auth/*` BFF). |

**backend/ (ek):** SMTP (`MAIL_*`), `SKIP_EMAIL_SEND`, Cloudinary (`CLOUDINARY_*`), `FRONTEND_URL`, istege bagli `EMAIL_VERIFICATION_CODE_PEPPER`, `EMAIL_VERIFICATION_TTL_MIN`, `EMAIL_VERIFICATION_RESEND_SEC` — tam liste `backend/.env.example`.

Cozum sirasi (kod): `BACKEND_API_URL` → `NEXT_PUBLIC_API_URL`.

## Acik Riskler / Kontrol Listesi (Canli Oncesi)

- `BACKEND_API_URL` (veya `NEXT_PUBLIC_API_URL` fallback) staging/prod’da dogru origin; `NEXT_PUBLIC_API_URL` yalnizca gerekiyorsa uretim degeri dogrulansin.
- CORS policy backend tarafinda production domain icin kontrol edilsin.
- Auth endpointlerinde hata mesaji ve timeout davranisi smoke test edilsin.
- Kritik endpointler icin staging/prod health check listesi yazilsin.

## Sonraki Adim

1. OAuth/Google akışında backend `refresh` üretip callback URL'ine eklenirse `oauth-sync` ile iki çerez de dolar.
2. Kritik endpointler icin canli oncesi test senaryosu cikar.
3. Bu dosyayi her yeni istekte tarihceye ek kayitla guncelle.

## Tarihce

### 2026-05-13 (tek backend: `backend/`)

- Istek: Yalnizca `backend/` kullanilsin; `mindely-api` kaldirilsin.
- Yapilan: `mindely-api/` klasoru silindi; `lib/api-url.ts` yalnizca `BACKEND_API_URL` / `NEXT_PUBLIC_API_URL`; exportlar `backendApiUrl` / `backendApiUrlOrNull`; dokuman + `.env*` ornekleri guncellendi; health `service: mindely-backend`.

### 2026-05-13 (psikolog kayit yapisı + gorunurluk)

- Istek: Kayit formunda seans suresi; odeme yok (yakinda); profil tamamlama panelde; herkese acik liste kurallari.
- Yapilan: Prisma migration `20260513200000_psychologist_session_duration_listing`; API `sessionDurationMinutes`, `profileCompletedAt`, `GET /psychologists/public`, `/auth/me` genisletmesi; FE kayit sayfasi; dogrulama sonrasi `next=/dashboard`; panel tamamlama karti; BFF `me` + `psychologists/public`.

### 2026-05-13 (psikolog onboarding + e-posta dogrulama + Cloudinary)

- Istek: Psikolog kaydi, SMTP ile kod, ilk giris dogrulama, Cloudinary avatar, BFF, middleware, dokuman.
- Yapilan: Prisma migration `20260513190000_psychologist_onboarding_email_verify`; API rotalari; mindely sayfalari `/terapist-islemleri/kayit` + `/auth/verify-email` + `/onboarding/psychologist`; JWT `emailVerified`; login 403 `email_unverified`; compose istege bagli env; SECOND_BRAIN guncellendi.

### 2026-05-13 (kayit registration_disabled)

- Kok neden: BFF dogru URL’ye gidiyor; `registration_disabled` yalnizca API `publicRegisterEnabled()` kapali iken. **Asil tuzak:** `backend/docker-compose.yml` api icin `ENABLE_PUBLIC_REGISTER: "false"` ve `NODE_ENV: production` sabitlenmisti; konteyner `backend/.env`yi otomatik icermeiyor. Duzenleme: compose’da `${NODE_ENV:-development}` ve `${ENABLE_PUBLIC_REGISTER:-true}`.

### 2026-05-13 (API taban URL)

- Istek: Tum API baglantilari env’den; sabit localhost uygulama kodunda yok.
- Yapilan: `lib/api-url.ts` tek kaynak + `backendApiUrlOrNull`; `POST /api/auth/logout` ayni cozum zincirini kullaniyor; `.env.example`, `.env.local.example`, env tablosu, AGENTS notu.

### 2026-05-13 (UTC+3)

- Istek: Auth JWT zorunluluğu + BFF httpOnly + dokümantasyon.
- Yapılan: `backend/` Express JWT backend; Next `app/api/auth/*` BFF, `middleware.ts`, `lib/jwt.ts`, NextAuth kaldırıldı; SECOND_BRAIN + `.env.local.example` güncellendi.

### 2026-05-05 11:37 (UTC+3)

- Istek: "Tum API istek noktalarini bul ve second brain dosyasinda tut."
- Yapilan: Kod tabani tarandi, API cagri noktalari envanterlendi, bu dosya olusturuldu.
- Durum: Devam ediyor.

### 2026-05-05 11:38 (UTC+3)

- Istek: "Tum api baglantilarini sil."
- Yapilan:
  - `lib/api.ts` ve `lib/backend.ts` silindi.
  - `app/auth/login/page.tsx` API baglantilari kaldirildi (simdilik devre disi mesajina cevrildi).
  - `app/auth/register/page.tsx` API baglantilari kaldirildi (simdilik devre disi mesajina cevrildi).
  - `app/experts/page.tsx` yerel veriye gecirildi.
  - `app/experts/[slug]/page.tsx` yerel veriye gecirildi.
- Durum: Tamamlandi.

### 2026-05-05 11:45 (UTC+3)

- Istek: "Psikolog kismi gorseldeki tarza gelsin, mesaj yerine detaya git olsun."
- Yapilan:
  - `app/experts/page.tsx` kart duzeni grid kartlardan yatay liste kart formatina cevrildi.
  - Kart sag paneline "SEANS UCRETI" alanı eklendi.
  - Ikinci aksiyon butonu `Mesaj Gonder / Profili Gor` yerine `Detaya Git` olarak guncellendi.
- Durum: Tamamlandi.

### 2026-05-05 11:46 (UTC+3)

- Istek: "Ana sayfadaki card yapisi da boyle olsun, butonlar duzgun gozukmuyor."
- Yapilan:
  - `components/landing/FeaturedExperts.tsx` ana sayfa uzman kartlari yatay liste yapisina cevrildi.
  - Sag panelde sabit "SEANS UCRETI" + `Randevu Al` + `Detaya Git` aksiyonlari standardize edildi.
  - Buton yukseklikleri/hizalari (`h-12`, `justify-center`) duzenlendi.
  - `Mesaj` ikonu kaldirildi, yerine metinli `Detaya Git` butonu eklendi.
- Durum: Tamamlandi.

### 2026-05-05 11:48 (UTC+3)

- Istek: "`expert` ifadesi URL'de olmasin, `psikolog` olsun ve detay sayfasi yeni tasarim diline yaklassin."
- Yapilan:
  - Tum ana linkler `/psikologlar` ve `/psikologlar/[slug]` rotalarina cekildi.
  - Randevu query parami `?psikolog=` olarak guncellendi (`booking` tarafinda geriye donuk `expert` desteği korunuyor).
  - Yeni detay sayfasi olusturuldu: `app/psikologlar/[slug]/page.tsx` (hero profil, uzmanlik bloklari, egitim/deneyim ve sag sticky seans karti).
  - Yeni liste route'u eklendi: `app/psikologlar/page.tsx`.
- Durum: Tamamlandi.

### 2026-05-05 11:51 (UTC+3)

- Istek: "`expert` kismini tamamen sil/kaldir."
- Yapilan:
  - `lib/data/experts.ts` silindi.
  - Yeni veri kaynagi olusturuldu: `lib/data/psikologlar.ts`.
  - `app/psikologlar/page.tsx` tamamen bagimsiz sayfa olarak yazildi (artik eski expert route'una bagli degil).
  - `components/landing/FeaturedExperts.tsx`, `components/booking/BookingSection.tsx` ve `app/psikologlar/[slug]/page.tsx` yeni `psikolog` veri modeline gecirildi.
  - Public akista `expert/experts` import/route baglantilari temizlendi.
- Durum: Tamamlandi.

### 2026-05-05 11:55 (UTC+3)

- Istek: "Randevu alma kismi gorsellerdeki gibi olsun, secilen psikologa gore aksin."
- Yapilan:
  - `components/booking/BookingSection.tsx` 3 adimli yeni akisla bastan yazildi.
  - Adim 1: Psikolog secimi + tarih/saat secimi (takvim ve saat grid).
  - Adim 2: Kampanya kodu alani + randevu ozeti + toplam tutar.
  - Adim 3: Odeme formu + guvenli odeme kutusu + sag ozet paneli.
  - Tum ozet ve tutar bilgileri secilen psikologa gore dinamik baglandi.
- Durum: Tamamlandi.

### 2026-05-05 11:58 (UTC+3)

- Istek: "Secilen psikolog gorunsun, psikolog secimi degismesin ve ayri booking sayfasi olmasin; modal olsun."
- Yapilan:
  - `components/booking/BookingSection.tsx` prop destekli hale getirildi: `fixedPsikologId`, `onClose`.
  - Secilen psikolog kutusu kilitli yapildi (modalde psikolog degistirme kapali).
  - Yeni modal tetikleyici eklendi: `components/booking/BookingModalTrigger.tsx`.
  - `app/psikologlar/[slug]/page.tsx` icinde randevu aksiyonu modal acacak sekilde guncellendi.
  - Liste ve landing `Randevu Al` linkleri modal acilisli detaya cekildi: `?randevu=1`.
  - `app/booking/page.tsx` ayri akisi kaldirmak icin `/psikologlar`'a yonlendirildi.
- Durum: Tamamlandi.

### 2026-05-07 16:14 (UTC+3)

- Istek: \"Genel ayarlar sekmesi + minimum rezervasyon input (saat)\" ve paneli componentlere bol; profil foto URL yerine dosya secimi; \"Saat kapatma\" yanina \"Randevularim\" sekmesi ekle.
- Yapilan:
  - Panel bileşenlere ayrildi: `components/dashboard/psikolog-panel/*` ve ana dosyada sadece state + handler kaldı.
  - Genel ayarlar sekmesi eklendi: `aktifSeansAlma`, `minRezervasyonSaat` (input).
  - Profil foto alanı `input type=file` oldu; seçilen dosya data URL olarak state'e yaziliyor (mock).
  - Yeni sekme: `Randevularım` (bekleyen + tamamlanan listeler, mock).
- Durum: Tamamlandi.

### 2026-05-05 12:01 (UTC+3)

- Istek: "Ilk stepte secilen psikolog gorunmesin, ekran tasmasin; 2. gorsel gibi olsun."
- Yapilan:
  - `components/booking/BookingSection.tsx` step 1 sadeleştirildi.
  - `Secilen Psikolog` karti kaldirildi (fixed psikolog modalinde gizli).
  - Step 1 iki kolon yapida: `Randevu Tarihi` + `Saat` kutusu.
  - Tarih secilmeden saat alaninda "Once bir tarih secin" placeholder gorunumu eklendi.
  - Modal/genislik degerleri kucultuldu (`max-w-5xl`) ve tasma azaltildi.
- Durum: Tamamlandi.

### 2026-05-05 12:06 (UTC+3)

- Istek: "`Randevu Al` tiklayinca detaya gitmesin, `randevu` parametresi eklenmesin."
- Yapilan:
  - `components/booking/BookingModalTrigger.tsx` tek buton modu eklendi (`triggerMode="single"`).
  - `app/psikologlar/page.tsx` ve `components/landing/FeaturedExperts.tsx` icinde `Randevu Al` linkleri kaldirildi.
  - `Randevu Al` artik bulundugu listede dogrudan modal aciyor, URL parametresi eklemiyor.
  - Kod tabaninda `?randevu=1` kullanimi sifirlandi.
- Durum: Tamamlandi.

### 2026-05-05 12:09 (UTC+3)

- Istek: "Footer'i tasarima uygun yap."
- Yapilan:
  - `components/layout/Footer.tsx` koyu temadan acik, minimalist ve mint/green tonlu tasarima gecirildi.
  - Ust sinir cizgisi, acik zemin, sade link renkleri ve sosyal ikon butonlari yeni stile uyarlandi.
  - Alt telif satiri sade ve kurumsal metne cekildi.
- Durum: Tamamlandi.

### 2026-05-05 12:10 (UTC+3)

- Istek: "Tum dosyalari tara, hatali kisim var mi bak ve gereksiz dosyalari sil."
- Yapilan:
  - Proje genelinde `npm run lint` calistirildi.
  - Hatalar duzeltildi:
    - `app/auth/callback/page.tsx` effect icinde senkron setState hatasi giderildi.
    - `components/dashboard/ExpertDashboardShell.tsx` render icinde component tanimlama hatasi giderildi.
    - `components/landing/PlatformFeatures.tsx` kullanilmayan `Link` importu silindi.
    - `components/dashboard/ExpertProfileEditor.tsx` icinde `img` yerine `next/image` kullanildi.
  - Sonraki lint sonucu: temiz (0 error, 0 warning).
  - Gereksiz dosya tarafinda, otomatik/saglam bicimde "kesin gereksiz" oldugu anlasilan ek bir dosya bulunmadi; mevcut route ve dashboard dosyalari aktif akislarla uyumlu.
- Durum: Tamamlandi.

### 2026-05-05 12:15 (UTC+3)

- Istek: "Testler de modal olsun; depresyon testi sorulari eklensin."
- Yapilan:
  - Yeni test veri kaynagi eklendi: `lib/data/tests.ts`.
  - Depresyon testi icin 21 soruluk set eklendi, diger testler icin placeholder soru akisi tanimlandi.
  - Yeni modal test cozme componenti eklendi: `components/tests/TestStartModal.tsx`.
  - `app/tests/[slug]/page.tsx` modal akisa gecirildi (`/coz` linki kaldirildi, `TestStartModal` baglandi).
  - Modalde soru adimlama, secenek isaretleme, skor hesaplama ve sonuc ekrani eklendi.
- Durum: Tamamlandi.

### 2026-05-05 12:23 (UTC+3)

- Istek: "Linklere bak."
- Yapilan:
  - Projedeki `href="/..."` linkleri tarandi ve app route'lari ile karsilastirildi.
  - Kirik bulunan link: `/dashboard/settings` (sayfa yoktu).
  - Cozum: `app/dashboard/settings/page.tsx` eklendi, artik link 404 vermiyor.
- Durum: Tamamlandi.

### 2026-05-05 12:25 (UTC+3)

- Istek: "Dogum tarihi input type date yerine shadcn date secimi kullanilsin."
- Yapilan:
  - Bagimliliklar eklendi: `react-day-picker`, `date-fns`.
  - Yeni shadcn uyumlu takvim componenti eklendi: `components/ui/calendar.tsx`.
  - `components/terapist/TerapistKayitForm.tsx` icindeki `type="date"` alani button + calendar dropdown yapisina cevrildi.
  - Secim sonucu formda `yyyy-MM-dd` olarak saklanmaya devam ediyor (geriye uyumlu).
- Durum: Tamamlandi.

### 2026-05-05 12:29 (UTC+3)

- Istek: "Takvim bozuk gorunuyor."
- Yapilan:
  - `components/ui/calendar.tsx` icindeki `react-day-picker` classNames yapisi guncel surum key'lerine gore duzeltildi.
  - Eski `table/head_row/...` tabanli key'ler yerine `month_grid/weekdays/week/day_button/...` yapisi kullanildi.
  - Navigasyon butonlari (`button_previous`, `button_next`) ve gun hizalamalari duzeltildi.
- Durum: Tamamlandi.

### 2026-05-05 12:30 (UTC+3)

- Istek: "Takvim hala bozuk geliyor."
- Yapilan:
  - `components/ui/calendar.tsx` caption/navigation yerlesimi yeniden duzenlendi.
  - Ay basligi orta hizaya sabitlendi, onceki-solraki ay butonlari nav satirinda solda/sagda konumlandi.
  - Root genisligi `w-full` yapilarak tasma/konum kaymasi azaltildi.
- Durum: Tamamlandi.

### 2026-05-05 17:29 (UTC+3)

- Istek: "Dashboard kismini tamamen sil."
- Yapilan:
  - `app/dashboard/**` altindaki tum route dosyalari silindi.
  - `components/dashboard/**` altindaki dashboard componentleri silindi.
  - Dashboarda giden kalan linkler guncellendi:
    - `components/layout/Footer.tsx`: `Panel` linki kaldirildi, `Terapist Islemleri` linki eklendi.
    - `app/terapist-islemleri/onay/page.tsx`: `Panele Git` aksiyonu `Terapist Islemlerine Git` olarak degisti.
  - Projede `/dashboard` ve dashboard component referanslari sifirlandi.
- Durum: Tamamlandi.

### 2026-05-05 ~18:45 (UTC+3)

- Istek: "Terapist dogum tarihi shadcn Calendar (radix) + Popover; tum dogum tarihi yerleri ortak component."
- Yapilan:
  - `npx shadcn add popover`, `npx shadcn add calendar --overwrite` ile resmi bileşenler.
  - `components/terapist/TerapistKayitForm.tsx`: Date of Birth ornegi (Popover + Calendar, `captionLayout="dropdown"`, `react-day-picker/locale` tr).
  - `components/ui/dogum-tarihi-picker.tsx`: tekrar kullanilabilir alan (value `yyyy-MM-dd`, gizli input opsiyonel).
  - `lib/button-variants.ts`: `buttonVariants` re-export `@/components/ui/button` (CLI buton birlestirmesi).
- Durum: Tamamlandi.

### 2026-05-05 ~19:00 (UTC+3)

- Istek: "Psikolog detayina gore dashboard, tab menulu."
- Yapilan:
  - `app/dashboard/page.tsx` + `components/dashboard/PsikologDashboardView.tsx` (demo psikolog id `1`).
  - `npx shadcn add tabs` (sonra tek sayfa tasarimina geciste tablar kaldirildi veya kullanimdan dustu; `components/ui/tabs.tsx` projede duruyor).
  - Header/Footer: `Panel` -> `/dashboard` linkleri.
- Not: Sonraki iterasyonda tablar kaldirildi; asagidaki madde guncel yerlesim.

### 2026-05-05 ~19:30 (UTC+3)

- Istek: "Panel duzenlenebilir profil; localStorage yok mock JSON; detay gibi tek yer; uzmanlik ve egitim/deneyim ekle-cikar, JSON gidecek."
- Yapilan:
  - `lib/panel-profile-storage.ts` kaldirildi.
  - `lib/panel-profile.ts`: `PsikologPanelFormState`, `PsikologPanelJsonPayload`, `mockPanelStateFromPsikolog`, `formStateToJsonPayload`, `EducationExperienceItem[]` + `specializations: string[]`.
  - `PsikologDashboardView`: psikolog detay grid'i (hero + sol form bloklari + sag seans/randevu karti); "Mock kaydet (JSON)" ile `jsonPreview` + konsol; egitim satirlari dinamik.
- Durum: Tamamlandi.

### 2026-05-05 ~19:45 (UTC+3)

- Istek: "Uzmanlik alanlari Ekle'ye tiklayinca modal."
- Yapilan:
  - `npx shadcn add dialog` -> `components/ui/dialog.tsx`.
  - Uzmanlik listesi disindaki satir ici input kaldirildi; `Ekle` -> Dialog (`specDraft`, Listeye ekle / Iptal, Enter ile onay).
- Durum: Tamamlandi.

### 2026-05-05 ~20:00 (UTC+3)

- Istek: "Bunlari SECOND_BRAIN'a kaydet."
- Yapilan: Bu tarihce maddeleri ve Durum Ozeti panel satiri eklendi.
- Durum: Tamamlandi.

### 2026-05-13 (UTC+3)

- Istek: Auth (API + Postgres + Docker) ve Next oturumu; roller; dokumantasyon.
- Yapilan:
  - `backend/`: Express + Prisma, opaque refresh, Docker Compose, `SECOND_BRAIN.md`, seed kullanicilar.
  - Next: `jose` ile access JWT dogrulama; `JWT_ACCESS_SECRET` hizasi; dashboard server guard + middleware; `lib/auth.ts` `fetchSession`; logout -> API revoke + cookie temizligi; `oauth-sync` opaque refresh kabulu.
  - `mindely/.env.example` eklendi.
