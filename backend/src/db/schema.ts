import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  varchar,
  uuid,
  index
} from 'drizzle-orm/pg-core'

export const dayEnum = pgEnum('day_enum', [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
])

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  day: dayEnum('day').notNull(),
  time: varchar('time', { length: 5 }),
  description: text('description'),

  createdAt: timestamp('created_at', { mode: 'date', precision: 3 }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).defaultNow().notNull(),
}, (table) => {
  return {
    dayIdx: index('day_idx').on(table.day),
    createdAtIdx: index('created_at_idx').on(table.createdAt),
    updatedAtIdx: index('updated_at_idx').on(table.updatedAt),
  }
})

export type Event = typeof events.$inferSelect
export type NewEvent = typeof events.$inferInsert
