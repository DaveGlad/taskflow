/**
 * @fileoverview Update Task DTO
 * @module application/dtos/update-task
 */

import { z } from 'zod';
import { TASK_STATUSES, TASK_PRIORITIES } from '../../domain';

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must not exceed 200 characters').trim().optional(),
  description: z.string().max(2000, 'Description must not exceed 2000 characters').trim().optional(),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
});

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
