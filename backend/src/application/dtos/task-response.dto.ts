/**
 * @fileoverview Task Response DTO
 * @module application/dtos/task-response
 */

import type { TaskStatusType, TaskPriorityType } from '../../domain';

export interface TaskResponseDto {
  id: string;
  title: string;
  description: string;
  status: TaskStatusType;
  priority: TaskPriorityType;
  createdAt: string;
  updatedAt: string;
}

export interface TaskListResponseDto {
  data: TaskResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TaskStatisticsResponseDto {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  lowPriority: number;
  mediumPriority: number;
  highPriority: number;
  completionRate: number;
}
