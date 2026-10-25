import { pgTable, uuid, varchar, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export const entries = pgTable("entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  subtitle: varchar("subtitle", { length: 300 }),
  category: varchar("category", { length: 50 }),
  author: varchar("author", { length: 100 }),
  imageUrl: text("image_url"),
  content: text("content").notNull(),
  takeaways: jsonb("takeaways").$type<string[]>().notNull().default([]),
  sources: jsonb("sources").$type<{ title: string; url: string }[]>().notNull().default([]),
  rank: integer("rank"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;