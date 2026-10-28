import {
  mysqlTable,
  int,
  varchar,
  text,
  mysqlEnum,
  timestamp,
  boolean
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 191 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: mysqlEnum('role', [
    'participant',
    'admin',
    'leader'
  ]).default('participant').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const questions = mysqlTable('questions', {
  id: int('id').autoincrement().primaryKey(),
  section: mysqlEnum('section', [
    'listening',
    'structure',
    'reading'
  ]).notNull(),
  questionText: text('question_text').notNull(),
  optionA: varchar('option_a', { length: 500 }).notNull(),
  optionB: varchar('option_b', { length: 500 }).notNull(),
  optionC: varchar('option_c', { length: 500 }).notNull(),
  optionD: varchar('option_d', { length: 500 }).notNull(),
  correctAnswer: varchar('correct_answer', { length: 1 }).notNull(),
  isActive: boolean('is_active').default(true).notNull()
});

export const testSessions = mysqlTable('test_sessions', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 150 }).notNull(),
  startsAt: timestamp('starts_at').notNull(),
  durationMinutes: int('duration_minutes').notNull(),
  passingScore: int('passing_score').notNull(),
  isActive: boolean('is_active').default(true).notNull()
});

export const examAttempts = mysqlTable('exam_attempts', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
  sessionId: int('session_id')
    .notNull()
    .references(() => testSessions.id),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  submittedAt: timestamp('submitted_at'),
  listeningScore: int('listening_score'),
  structureScore: int('structure_score'),
  readingScore: int('reading_score'),
  totalScore: int('total_score'),
  passed: boolean('passed')
});