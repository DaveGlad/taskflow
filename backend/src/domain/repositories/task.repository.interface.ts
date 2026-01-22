/**
 * @fileoverview Task Repository Interface
 * @module domain/repositories/task-repository
 */

import { Task } from '../entities/task.entity';
import type { TaskStatusType } from '../value-objects/task-status.vo';
import type { TaskPriorityType } from '../value-objects/task-priority.vo';

export interface TaskFilters {
  status?: TaskStatusType;
  priority?: TaskPriorityType;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ITaskRepository {
  findAll(filters?: TaskFilters): Promise<Task[]>;
  findPaginated(filters?: TaskFilters, pagination?: PaginationOptions): Promise<PaginatedResult<Task>>;
  findById(id: string): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
  count(filters?: TaskFilters): Promise<number>;
}
