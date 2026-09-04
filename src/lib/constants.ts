export const XP = {
  LESSON_COMPLETE: 10,
  LISTENING_PASS: 15,
  QUIZ_PASS: 20,
  QUIZ_PERFECT_BONUS: 15,
  READING_PASS: 10,
  WRITING_SUBMIT: 5,
  COURSE_COMPLETE: 100,
  LEVEL_COMPLETE: 250,
} as const;

export const QUIZ_PASS_PERCENT = 70;
export const LISTENING_PASS_PERCENT = 70;
export const READING_PASS_PERCENT = 70;

export const LEVEL_DIFFICULTY = [
  { levelNumber: 1, label: "Basic", difficulty: "BASIC" },
  { levelNumber: 2, label: "Elementary", difficulty: "ELEMENTARY" },
  { levelNumber: 3, label: "Intermediate", difficulty: "INTERMEDIATE" },
  { levelNumber: 4, label: "Upper Intermediate", difficulty: "UPPER_INTERMEDIATE" },
  { levelNumber: 5, label: "Advanced", difficulty: "ADVANCED" },
] as const;

/** Achievement codes — must match prisma/seed.ts (seed list is the source of truth). */
export const ACHIEVEMENTS = {
  FIRST_LESSON: "first-lesson",
  LESSONS_10: "lessons-10",
  LESSONS_50: "lessons-50",
  LESSONS_100: "lessons-100",
  FIRST_QUIZ: "first-quiz",
  PERFECT_QUIZ: "perfect-quiz",
  FIRST_LISTENING: "first-listening",
  FIRST_READING: "first-reading",
  FIRST_COURSE: "first-course",
  FIRST_WRITING: "first-writing",
  STREAK_7: "streak-7",
  STREAK_30: "streak-30",
  LEVEL_1: "level-1",
  LEVEL_2: "level-2",
  LEVEL_3: "level-3",
  LEVEL_4: "level-4",
  LEVEL_5: "level-5",
} as const;

export const LEARNING_SKILLS = [
  "Reading",
  "Writing",
  "Listening",
  "Speaking",
  "Vocabulary",
  "Grammar",
  "Business Communication",
] as const;

export const APP_NAME = "FactBusiness English";
export const APP_TAGLINE = "Learn English for the real world of business.";
