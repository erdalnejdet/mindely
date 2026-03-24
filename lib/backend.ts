import { apiAuth, apiFetch, type ApiResponse } from "@/lib/api";

const API_V1 = "/api/v1";
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop";

type ConsultantMethodApi = {
  name: string;
};

type CategoryApi = {
  id: number;
  name: string;
  slug?: string;
};

type ConsultantApi = {
  id: number;
  uuid?: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
  title?: string | null;
  bio?: string | null;
  city?: string | null;
  district?: string | null;
  online_price?: string | number | null;
  inperson_price?: string | number | null;
  session_duration?: number | null;
  accepts_online?: number | boolean | null;
  accepts_inperson?: number | boolean | null;
  avg_rating?: string | number | null;
  review_count?: number | null;
  categories?: CategoryApi[];
  methods?: ConsultantMethodApi[];
};

type ConsultantsResponse = {
  rows: ConsultantApi[];
  count: number;
};

type TestOptionApi = {
  id: number;
  text: string;
  score?: number;
};

type TestQuestionApi = {
  id: number;
  question_text: string;
  sort_order?: number;
  options?: TestOptionApi[];
};

type TestApi = {
  id: number;
  title: string;
  description?: string | null;
  questions?: TestQuestionApi[];
};

export type Expert = {
  id: string;
  slug: string;
  name: string;
  specialization: string;
  approach: string;
  rating: number;
  reviewCount: number;
  sessionPrice: number | null;
  freeConsultation: boolean;
  image: string;
  expertise: string[];
  bio: string;
  city: string | null;
  sessionDuration: number | null;
  acceptsOnline: boolean;
  acceptsInperson: boolean;
};

export type TestSummary = {
  id: number;
  slug: string;
  title: string;
  description: string;
  questionCount: number;
  duration: string;
};

export type TestDetail = TestSummary & {
  questions: Array<{
    id: number;
    text: string;
    options: Array<{
      id: number;
      text: string;
    }>;
  }>;
};

export type TestSubmissionResult = {
  score: number | { types: Array<{ type: string; score: number }> };
  range?: {
    label: string;
    description: string;
  } | null;
};

export type TimeSlot = {
  start: string;
  end: string;
};

function normalizeText(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toNumber(value: string | number | null | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toBool(value: number | boolean | null | undefined) {
  return value === true || value === 1;
}

function estimateDuration(questionCount: number) {
  if (questionCount <= 10) return "5 dakika";
  if (questionCount <= 20) return "5-10 dakika";
  return "10-15 dakika";
}

async function getBackendData<T>(
  path: string,
  options: (RequestInit & { token?: string }) = {},
): Promise<T> {
  const response = await apiFetch<ApiResponse<T>>(`${API_V1}${path}`, {
    cache: "no-store",
    ...options,
  });
  return response.data;
}

function formatConsultantName(consultant: ConsultantApi) {
  return [consultant.first_name, consultant.last_name].filter(Boolean).join(" ").trim();
}

function getConsultantSlug(consultant: ConsultantApi) {
  const fullName = formatConsultantName(consultant);
  return normalizeText(fullName || String(consultant.id));
}

function mapConsultant(consultant: ConsultantApi): Expert {
  const categories = consultant.categories ?? [];
  const methods = consultant.methods ?? [];
  const sessionPrice = toNumber(consultant.online_price) ?? toNumber(consultant.inperson_price);

  return {
    id: String(consultant.id),
    slug: getConsultantSlug(consultant),
    name: formatConsultantName(consultant),
    specialization: consultant.title?.trim() || categories[0]?.name || "Uzman Danisman",
    approach: methods[0]?.name || (consultant.city ? `${consultant.city} uzmanı` : "Online görüşme"),
    rating: toNumber(consultant.avg_rating) ?? 0,
    reviewCount: consultant.review_count ?? 0,
    sessionPrice,
    freeConsultation: false,
    image: consultant.avatar_url || DEFAULT_AVATAR,
    expertise: categories.map((category) => category.name),
    bio: consultant.bio?.trim() || "Bu uzman henüz profil açıklaması eklemedi.",
    city: consultant.city || null,
    sessionDuration: consultant.session_duration ?? null,
    acceptsOnline: toBool(consultant.accepts_online),
    acceptsInperson: toBool(consultant.accepts_inperson),
  };
}

function mapTest(test: TestApi): TestDetail {
  const questions = (test.questions ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((question) => ({
      id: question.id,
      text: question.question_text,
      options: (question.options ?? []).map((option) => ({
        id: option.id,
        text: option.text,
      })),
    }));

  return {
    id: test.id,
    slug: normalizeText(test.title),
    title: test.title,
    description: test.description?.trim() || "Bu test için açıklama henüz eklenmedi.",
    questionCount: questions.length,
    duration: estimateDuration(questions.length),
    questions,
  };
}

export async function fetchExperts(query?: string) {
  const params = new URLSearchParams();
  params.set("limit", "100");
  if (query?.trim()) {
    params.set("q", query.trim());
  }

  const data = await getBackendData<ConsultantsResponse>(`/consultants?${params.toString()}`);
  return data.rows.map(mapConsultant);
}

export async function fetchFeaturedExperts(limit = 3) {
  const experts = await fetchExperts();
  return experts.slice(0, limit);
}

export async function fetchExpertBySlug(slug: string) {
  if (/^\d+$/.test(slug)) {
    const consultant = await getBackendData<ConsultantApi>(`/consultants/${slug}`);
    return mapConsultant(consultant);
  }

  const experts = await fetchExperts();
  return experts.find((expert) => expert.slug === slug) ?? null;
}

export async function fetchTests() {
  const tests = await getBackendData<TestApi[]>("/tests");
  return tests.map((test) =>
    mapTest({
      ...test,
      questions: test.questions ?? [],
    }),
  );
}

export async function fetchTestBySlug(slug: string) {
  const tests = await fetchTests();
  const exact = tests.find((test) => test.slug === slug);
  if (exact) {
    const detail = await getBackendData<TestApi>(`/tests/${exact.id}`);
    return mapTest(detail);
  }

  if (/^\d+$/.test(slug)) {
    const detail = await getBackendData<TestApi>(`/tests/${slug}`);
    return mapTest(detail);
  }

  return null;
}

export async function fetchAvailableSlots(consultantId: string, date: string) {
  const params = new URLSearchParams({ date });
  return getBackendData<TimeSlot[]>(`/consultants/${consultantId}/available-slots?${params.toString()}`);
}

export async function createAppointment(
  payload: {
    consultant_id: number;
    type: "online" | "inperson";
    appointment_date: string;
    start_time: string;
  },
  token: string,
) {
  return apiAuth(`${"/appointments"}`, {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  });
}

export async function submitTestAnswers(testId: number, answers: number[]) {
  return getBackendData<TestSubmissionResult>(`/tests/${testId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
}
