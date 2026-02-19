import { describe, it, expect } from 'vitest';
import { TaskDomainService } from '../../../domain/services/task-domain.service';
import { Task } from '../../../domain/entities/task.entity';
import { TaskStatus } from '../../../domain/value-objects/task-status.vo';
import { TaskPriority } from '../../../domain/value-objects/task-priority.vo';

function createTask(overrides: {
  title?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  createdAt?: Date;
} = {}): Task {
  return Task.create({
    title: overrides.title ?? 'Test task',
    status: overrides.status ?? TaskStatus.todo(),
    priority: overrides.priority ?? TaskPriority.medium(),
    createdAt: overrides.createdAt ?? new Date(),
  });
}

describe('TaskDomainService', () => {
  const service = new TaskDomainService();

  describe('sortByPriorityAndDate', () => {
    it('should sort tasks by priority (high first)', () => {
      const low = createTask({ title: 'Low', priority: TaskPriority.low() });
      const high = createTask({ title: 'High', priority: TaskPriority.high() });
      const medium = createTask({ title: 'Medium', priority: TaskPriority.medium() });

      const sorted = service.sortByPriorityAndDate([low, high, medium]);

      expect(sorted[0].title).toBe('High');
      expect(sorted[1].title).toBe('Medium');
      expect(sorted[2].title).toBe('Low');
    });

    it('should sort by date (newest first) when same priority', () => {
      const older = createTask({
        title: 'Older',
        priority: TaskPriority.high(),
        createdAt: new Date('2024-01-01'),
      });
      const newer = createTask({
        title: 'Newer',
        priority: TaskPriority.high(),
        createdAt: new Date('2024-06-01'),
      });

      const sorted = service.sortByPriorityAndDate([older, newer]);

      expect(sorted[0].title).toBe('Newer');
      expect(sorted[1].title).toBe('Older');
    });

    it('should return empty array for empty input', () => {
      const sorted = service.sortByPriorityAndDate([]);
      expect(sorted).toEqual([]);
    });

    it('should not mutate the original array', () => {
      const tasks = [
        createTask({ title: 'Low', priority: TaskPriority.low() }),
        createTask({ title: 'High', priority: TaskPriority.high() }),
      ];
      const original = [...tasks];

      service.sortByPriorityAndDate(tasks);

      expect(tasks[0].title).toBe(original[0].title);
      expect(tasks[1].title).toBe(original[1].title);
    });
  });

  describe('calculateCompletionRate', () => {
    it('should return 0 for empty array', () => {
      expect(service.calculateCompletionRate([])).toBe(0);
    });

    it('should return 0 when no tasks are completed', () => {
      const tasks = [
        createTask({ status: TaskStatus.todo() }),
        createTask({ status: TaskStatus.inProgress() }),
      ];
      expect(service.calculateCompletionRate(tasks)).toBe(0);
    });

    it('should return 100 when all tasks are completed', () => {
      const tasks = [
        createTask({ status: TaskStatus.completed() }),
        createTask({ status: TaskStatus.completed() }),
      ];
      expect(service.calculateCompletionRate(tasks)).toBe(100);
    });

    it('should calculate correct rate for mixed statuses', () => {
      const tasks = [
        createTask({ status: TaskStatus.completed() }),
        createTask({ status: TaskStatus.todo() }),
        createTask({ status: TaskStatus.inProgress() }),
      ];
      expect(service.calculateCompletionRate(tasks)).toBe(33);
    });

    it('should round the completion rate', () => {
      const tasks = [
        createTask({ status: TaskStatus.completed() }),
        createTask({ status: TaskStatus.todo() }),
        createTask({ status: TaskStatus.todo() }),
      ];
      // 1/3 = 33.33... → rounded to 33
      expect(service.calculateCompletionRate(tasks)).toBe(33);
    });
  });

  describe('canTransitionStatus', () => {
    it('should allow todo → in_progress', () => {
      expect(service.canTransitionStatus(TaskStatus.todo(), TaskStatus.inProgress())).toBe(true);
    });

    it('should allow todo → completed', () => {
      expect(service.canTransitionStatus(TaskStatus.todo(), TaskStatus.completed())).toBe(true);
    });

    it('should allow in_progress → todo', () => {
      expect(service.canTransitionStatus(TaskStatus.inProgress(), TaskStatus.todo())).toBe(true);
    });

    it('should allow in_progress → completed', () => {
      expect(service.canTransitionStatus(TaskStatus.inProgress(), TaskStatus.completed())).toBe(true);
    });

    it('should allow completed → todo', () => {
      expect(service.canTransitionStatus(TaskStatus.completed(), TaskStatus.todo())).toBe(true);
    });

    it('should allow completed → in_progress', () => {
      expect(service.canTransitionStatus(TaskStatus.completed(), TaskStatus.inProgress())).toBe(true);
    });

    it('should not allow same-status transition (todo → todo)', () => {
      expect(service.canTransitionStatus(TaskStatus.todo(), TaskStatus.todo())).toBe(false);
    });
  });

  describe('getStatistics', () => {
    it('should return correct counts by status and priority', () => {
      const tasks = [
        createTask({ status: TaskStatus.todo(), priority: TaskPriority.high() }),
        createTask({ status: TaskStatus.todo(), priority: TaskPriority.medium() }),
        createTask({ status: TaskStatus.inProgress(), priority: TaskPriority.low() }),
        createTask({ status: TaskStatus.completed(), priority: TaskPriority.high() }),
      ];

      const stats = service.getStatistics(tasks);

      expect(stats.total).toBe(4);
      expect(stats.todo).toBe(2);
      expect(stats.inProgress).toBe(1);
      expect(stats.completed).toBe(1);
      expect(stats.highPriority).toBe(2);
      expect(stats.mediumPriority).toBe(1);
      expect(stats.lowPriority).toBe(1);
      expect(stats.completionRate).toBe(25);
    });

    it('should handle empty array', () => {
      const stats = service.getStatistics([]);

      expect(stats.total).toBe(0);
      expect(stats.todo).toBe(0);
      expect(stats.inProgress).toBe(0);
      expect(stats.completed).toBe(0);
      expect(stats.completionRate).toBe(0);
    });
  });

  describe('groupByStatus', () => {
    it('should group tasks by their status', () => {
      const tasks = [
        createTask({ title: 'T1', status: TaskStatus.todo() }),
        createTask({ title: 'T2', status: TaskStatus.inProgress() }),
        createTask({ title: 'T3', status: TaskStatus.todo() }),
        createTask({ title: 'T4', status: TaskStatus.completed() }),
      ];

      const grouped = service.groupByStatus(tasks);

      expect(grouped['todo']).toHaveLength(2);
      expect(grouped['in_progress']).toHaveLength(1);
      expect(grouped['completed']).toHaveLength(1);
    });

    it('should return empty object for empty array', () => {
      const grouped = service.groupByStatus([]);
      expect(grouped).toEqual({});
    });
  });
});
