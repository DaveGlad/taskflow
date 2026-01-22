/**
 * @fileoverview Task Domain Service
 * @module domain/services/task-domain
 */

import { Task } from '../entities/task.entity';
import { TaskStatus } from '../value-objects/task-status.vo';

export interface TaskStatistics {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  lowPriority: number;
  mediumPriority: number;
  highPriority: number;
  completionRate: number;
}

export class TaskDomainService {
  sortByPriorityAndDate(tasks: Task[]): Task[] {
    const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
    return [...tasks].sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority.value] - priorityOrder[b.priority.value];
      if (priorityDiff !== 0) return priorityDiff;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  groupByStatus(tasks: Task[]): Record<string, Task[]> {
    return tasks.reduce((acc, task) => {
      const status = task.status.value;
      if (!acc[status]) acc[status] = [];
      acc[status].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  }

  calculateCompletionRate(tasks: Task[]): number {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((task) => task.isCompleted()).length;
    return Math.round((completed / tasks.length) * 100);
  }

  getStatistics(tasks: Task[]): TaskStatistics {
    const byStatus = this.groupByStatus(tasks);
    const byPriority = this.groupByPriority(tasks);
    return {
      total: tasks.length,
      todo: byStatus['todo']?.length ?? 0,
      inProgress: byStatus['in_progress']?.length ?? 0,
      completed: byStatus['completed']?.length ?? 0,
      lowPriority: byPriority['low']?.length ?? 0,
      mediumPriority: byPriority['medium']?.length ?? 0,
      highPriority: byPriority['high']?.length ?? 0,
      completionRate: this.calculateCompletionRate(tasks),
    };
  }

  private groupByPriority(tasks: Task[]): Record<string, Task[]> {
    return tasks.reduce((acc, task) => {
      const priority = task.priority.value;
      if (!acc[priority]) acc[priority] = [];
      acc[priority].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  }

  canTransitionStatus(from: TaskStatus, to: TaskStatus): boolean {
    const validTransitions: Record<string, string[]> = {
      todo: ['in_progress', 'completed'],
      in_progress: ['todo', 'completed'],
      completed: ['todo', 'in_progress'],
    };
    return validTransitions[from.value]?.includes(to.value) ?? false;
  }
}
