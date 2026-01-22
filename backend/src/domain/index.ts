/**
 * @fileoverview Domain Layer Exports
 * @module domain
 */

export { Task } from './entities/task.entity';
export type { TaskProps } from './entities/task.entity';

export { TaskStatus, TASK_STATUSES } from './value-objects/task-status.vo';
export type { TaskStatusType } from './value-objects/task-status.vo';

export { TaskPriority, TASK_PRIORITIES } from './value-objects/task-priority.vo';
export type { TaskPriorityType } from './value-objects/task-priority.vo';

export type {
  ITaskRepository,
  TaskFilters,
  PaginationOptions,
  PaginatedResult,
} from './repositories/task.repository.interface';

export { TaskDomainService } from './services/task-domain.service';
export type { TaskStatistics } from './services/task-domain.service';
