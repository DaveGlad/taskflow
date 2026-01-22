/**
 * @fileoverview Task Mapper
 * @module application/mappers/task
 */

import { Task, TaskStatus, TaskPriority, PaginatedResult, TaskStatistics } from '../../domain';
import type { TaskResponseDto, TaskListResponseDto, TaskStatisticsResponseDto } from '../dtos';

export interface TaskPersistenceData {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export class TaskMapper {
  static toResponseDto(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status.value,
      priority: task.priority.value,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }

  static toResponseDtoList(tasks: Task[]): TaskResponseDto[] {
    return tasks.map(TaskMapper.toResponseDto);
  }

  static toPaginatedResponseDto(result: PaginatedResult<Task>): TaskListResponseDto {
    return {
      data: TaskMapper.toResponseDtoList(result.data),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  static toStatisticsResponseDto(stats: TaskStatistics): TaskStatisticsResponseDto {
    return { ...stats };
  }

  static toDomain(data: TaskPersistenceData): Task {
    return Task.reconstitute({
      id: data.id,
      title: data.title,
      description: data.description,
      status: TaskStatus.create(data.status),
      priority: TaskPriority.create(data.priority),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }
}
