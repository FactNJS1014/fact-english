import { z } from "zod";

// ---------------------------------------------------------------- auth

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30)
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email("Please enter a valid email address").max(120),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required").max(120),
  password: z.string().min(1, "Password is required").max(100),
  rememberMe: z.boolean().optional().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Enter a valid email address").max(120),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ---------------------------------------------------------------- content (public write)

export const noteSchema = z.object({
  lessonId: z.string().min(1),
  content: z.string().min(1, "Note is empty").max(5000),
});

export const bookmarkSchema = z.object({
  targetKind: z.enum(["LESSON", "COURSE"]),
  targetId: z.string().min(1),
});

export const quizSubmitSchema = z.object({
  quizId: z.string().min(1),
  answers: z.record(z.string(), z.string().max(500)),
});

export const listeningSubmitSchema = z.object({
  exerciseId: z.string().min(1),
  answers: z.record(z.string(), z.string().max(500)),
});

export const readingSubmitSchema = z.object({
  exerciseId: z.string().min(1),
  answers: z.record(z.string(), z.string().max(500)),
});

export const writingSubmitSchema = z.object({
  exerciseId: z.string().min(1),
  content: z.string().min(20, "Write at least a few sentences").max(5000),
});

// ---------------------------------------------------------------- admin content

const statusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const levelSchema = z.object({
  name: z.string().min(2).max(80),
  label: z.string().min(1).max(40),
  slug: z.string().min(2).max(80).optional(),
  description: z.string().min(5).max(1000),
  levelNumber: z.coerce.number().int().min(1).max(10),
  published: statusEnum,
});

export const courseSchema = z.object({
  levelId: z.string().min(1),
  title: z.string().min(2).max(120),
  slug: z.string().min(2).max(120).optional(),
  shortDescription: z.string().min(3).max(200),
  description: z.string().min(5).max(2000),
  thumbnail: z.string().max(500).optional().nullable(),
  order: z.coerce.number().int().min(0),
  published: statusEnum,
});

export const topicSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(2).max(120),
  slug: z.string().min(2).max(120).optional(),
  description: z.string().min(5).max(1000),
  order: z.coerce.number().int().min(0),
  difficulty: z.enum(["BASIC", "ELEMENTARY", "INTERMEDIATE", "UPPER_INTERMEDIATE", "ADVANCED"]),
  published: statusEnum,
});

export const lessonSchema = z.object({
  topicId: z.string().min(1),
  title: z.string().min(2).max(120),
  slug: z.string().min(2).max(120).optional(),
  content: z.string().min(10).max(60000),
  objectives: z.array(z.string().min(1).max(300)).min(1).max(60),
  summary: z.string().max(2000).optional().nullable(),
  order: z.coerce.number().int().min(0),
  durationMinutes: z.coerce.number().int().min(1).max(600),
  published: statusEnum,
});

export const vocabularySchema = z.object({
  lessonId: z.string().min(1),
  word: z.string().min(1).max(80),
  pronunciation: z.string().max(120).optional().nullable(),
  partOfSpeech: z.string().min(1).max(20),
  thaiMeaning: z.string().max(300).optional().nullable(),
  meaning: z.string().min(2).max(500),
  example: z.string().min(2).max(500),
  businessExample: z.string().min(2).max(500),
  audioUrl: z.string().max(500).optional().nullable(),
});

export const grammarSchema = z.object({
  topicId: z.string().min(1),
  title: z.string().min(2).max(120),
  explanation: z.string().min(5).max(4000),
  structure: z.string().min(2).max(1000),
  examples: z.array(z.string()).min(1).max(80), // one per line
  businessExamples: z.array(z.string()).min(1).max(80),
  commonMistakes: z.array(z.string()).min(1).max(80),
});

export const listeningSchema = z.object({
  lessonId: z.string().min(1),
  title: z.string().min(2).max(120),
  audioUrl: z.string().max(500).optional().nullable(),
  transcript: z.string().min(10).max(20000),
  duration: z.coerce.number().int().min(10).max(3600),
  published: statusEnum,
});

export const quizSchema = z.object({
  lessonId: z.string().min(1),
  title: z.string().min(2).max(120),
  description: z.string().max(1000).optional().nullable(),
  passingScore: z.coerce.number().int().min(1).max(100).default(70),
  published: statusEnum,
});

export const readingExerciseSchema = z.object({
  lessonId: z.string().min(1),
  title: z.string().min(2).max(120),
  passage: z.string().min(20).max(30000),
  published: statusEnum,
  order: z.coerce.number().int().min(0),
});

export const exerciseSchema = z.object({
  lessonId: z.string().min(1),
  kind: z.enum(["WRITING", "SPEAKING"]),
  title: z.string().min(2).max(120),
  prompt: z.string().min(10).max(4000),
  content: z.string().min(1).max(12000), // JSON string
  published: statusEnum,
  order: z.coerce.number().int().min(0),
});

export const adminUserSchema = z.object({
  isActive: z.boolean().optional(),
  role: z.enum(["STUDENT", "ADMIN"]).optional(),
  bypassLevelLock: z.boolean().optional(),
  currentLevelId: z.string().nullable().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type NoteInput = z.infer<typeof noteSchema>;
export type WritingSubmitInput = z.infer<typeof writingSubmitSchema>;
