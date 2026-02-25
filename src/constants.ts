import { Subject, Branch, Flashcard } from './types';

export const BRANCHES: Record<string, Branch> = {
  math: {
    id: 'math',
    name: "شعبة رياضيات",
    subjects: [
      { name: "الرياضيات", coeff: 7, lvl: 'med' },
      { name: "العلوم الفيزيائية", coeff: 6, lvl: 'med' },
      { name: "اللغة العربية", coeff: 3, lvl: 'med' },
      { name: "الفلسفة", coeff: 2, lvl: 'med' },
      { name: "اللغة الفرنسية", coeff: 2, lvl: 'med' },
      { name: "اللغة الإنجليزية", coeff: 2, lvl: 'med' },
    ]
  },
  science: {
    id: 'science',
    name: "علوم تجريبية",
    subjects: [
      { name: "علوم الطبيعة و الحياة", coeff: 6, lvl: 'med' },
      { name: "العلوم الفيزيائية", coeff: 5, lvl: 'med' },
      { name: "الرياضيات", coeff: 5, lvl: 'med' },
      { name: "اللغة العربية", coeff: 3, lvl: 'med' },
      { name: "الفلسفة", coeff: 2, lvl: 'med' },
    ]
  },
  tech: {
    id: 'tech',
    name: "تقني رياضي",
    subjects: [
      { name: "التكنولوجيا", coeff: 7, lvl: 'med' },
      { name: "الرياضيات", coeff: 6, lvl: 'med' },
      { name: "العلوم الفيزيائية", coeff: 6, lvl: 'med' },
      { name: "اللغة العربية", coeff: 3, lvl: 'med' },
    ]
  }
};

export const FLASHCARDS: Record<string, Flashcard[]> = {
  "الرياضيات": [
    { q: "مشتقة sin(x)؟", a: "cos(x)", category: "الاشتقاق" },
    { q: "مشتقة ln(x)؟", a: "1/x", category: "الدوال" },
    { q: "معادلة المماس عند x0؟", a: "y = f'(x0)(x-x0) + f(x0)", category: "الدوال" }
  ],
  "العلوم الفيزيائية": [
    { q: "قانون نيوتن الثاني؟", a: "ΣF = m.a", category: "الميكانيك" },
    { q: "قانون أوم؟", a: "U = R.I", category: "الكهرباء" }
  ]
};

export const QUOTES = [
  "النجاح ليس نهاية الطريق، بل هو المحاولة المستمرة.",
  "العلم نور والجهل ظلام — ابدأ بخطوة واحدة.",
  "الانضباط يفعل ما لا تستطيع الإرادة وحدها فعله.",
  "كل دقيقة مراجعة اليوم = ساعة راحة في يوم الامتحان."
];
