import { describe, it, expect } from 'vitest';
import { Task } from '../../../domain/entities/task.entity';
import { TaskStatus } from '../../../domain/value-objects/task-status.vo';

describe('Task Entity', () => {
  describe('create()', () => {
    it('should create a task with default values', () => {
      const task = Task.create({ title: 'My task' });

      expect(task.title).toBe('My task');
      expect(task.description).toBe('');
      expect(task.status.value).toBe('todo');
      expect(task.priority.value).toBe('medium');
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
    });

    it('should trim the title', () => {
      const task = Task.create({ title: '  My task  ' });
      expect(task.title).toBe('My task');
    });

    it('should throw an error if title is empty', () => {
      expect(() => Task.create({ title: '' })).toThrow('Task title is required');
    });

    it('should throw an error if title is only whitespace', () => {
      expect(() => Task.create({ title: '   ' })).toThrow('Task title is required');
    });

    it('should throw an error if title exceeds 200 characters', () => {
      const longTitle = 'a'.repeat(201);
      expect(() => Task.create({ title: longTitle })).toThrow('Task title must not exceed 200 characters');
    });

    it('should throw an error if description exceeds 2000 characters', () => {
      const longDesc = 'a'.repeat(2001);
      expect(() => Task.create({ title: 'Valid', description: longDesc })).toThrow(
        'Task description must not exceed 2000 characters'
      );
    });
  });

  describe('immutable methods', () => {
    it('updateTitle should return a new Task with the updated title', () => {
      const task = Task.create({ title: 'Original' });
      const updated = task.updateTitle('Updated');

      expect(updated.title).toBe('Updated');
      expect(task.title).toBe('Original');
      expect(updated.id).toBe(task.id);
    });

    it('markAsInProgress should return a new Task with in_progress status', () => {
      const task = Task.create({ title: 'Task' });
      const inProgress = task.markAsInProgress();

      expect(inProgress.status.value).toBe('in_progress');
      expect(task.status.value).toBe('todo');
    });

    it('markAsCompleted should return a new Task with completed status', () => {
      const task = Task.create({ title: 'Task' });
      const completed = task.markAsCompleted();

      expect(completed.status.value).toBe('completed');
      expect(task.status.value).toBe('todo');
    });
  });

  describe('isCompleted()', () => {
    it('should return true when status is completed', () => {
      const task = Task.create({ title: 'Task', status: TaskStatus.completed() });
      expect(task.isCompleted()).toBe(true);
    });

    it('should return false when status is not completed', () => {
      const task = Task.create({ title: 'Task', status: TaskStatus.todo() });
      expect(task.isCompleted()).toBe(false);
    });
  });
});
