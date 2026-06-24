import { z } from 'zod';
import { pgTable, varchar, text, timestamp, numeric } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm/sql';

export const createReimbursementSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	amount: z.number().positive('Amount must be a positive number'),
});

export const updateReimbursementSchema = z.object({
	reimbursementId: z.string().uuid('reimbursementId must be a valid UUID'),
	status: z.enum(['APPROVED', 'REJECTED']),
});

export const reimbursements = pgTable('reimbursements', {
	id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description').notNull(),
	amount: numeric('amount').notNull(),
	status: varchar('status', { length: 32 }).notNull().default('PENDING'),
	created_by: varchar('created_by', { length: 255 }).notNull(),
	created_at: timestamp('created_at').defaultNow(),
});
