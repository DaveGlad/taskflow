/**
 * @fileoverview Create Task DTO
 * @module application/dtos/create-task
 */

import { z } from 'zod';
import { TASK_PRIORITIES } from '../../domain';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must not exceed 200 characters').trim(),
  description: z.string().max(2000, 'Description must not exceed 2000 characters').trim().optional().default(''),
  priority: z.enum(TASK_PRIORITIES).optional().default('medium'),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
