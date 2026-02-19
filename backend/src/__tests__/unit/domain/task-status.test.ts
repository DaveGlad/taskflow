import { describe, it, expect } from 'vitest';
import { TaskStatus } from '../../../domain/value-objects/task-status.vo';

describe('TaskStatus Value Object', () => {
  describe('create()', () => {
    it('should create a valid status from string', () => {
      const status = TaskStatus.create('todo');
      expect(status.value).toBe('todo');
    });

    it('should accept all valid values', () => {
      expect(TaskStatus.create('todo').value).toBe('todo');
      expect(TaskStatus.create('in_progress').value).toBe('in_progress');
      expect(TaskStatus.create('completed').value).toBe('completed');
    });

    it('should throw an error for invalid value', () => {
      expect(() => TaskStatus.create('invalid')).toThrow('Invalid task status: invalid');
    });
  });

  describe('isValid()', () => {
    it('should return true for valid statuses', () => {
      expect(TaskStatus.isValid('todo')).toBe(true);
      expect(TaskStatus.isValid('in_progress')).toBe(true);
      expect(TaskStatus.isValid('completed')).toBe(true);
    });

    it('should return false for invalid statuses', () => {
      expect(TaskStatus.isValid('invalid')).toBe(false);
      expect(TaskStatus.isValid('')).toBe(false);
    });
  });

  describe('factory methods', () => {
    it('todo() should create a todo status', () => {
      expect(TaskStatus.todo().value).toBe('todo');
    });

    it('inProgress() should create an in_progress status', () => {
      expect(TaskStatus.inProgress().value).toBe('in_progress');
    });

    it('completed() should create a completed status', () => {
      expect(TaskStatus.completed().value).toBe('completed');
    });
  });

  describe('equals()', () => {
    it('should return true for same status values', () => {
      expect(TaskStatus.todo().equals(TaskStatus.todo())).toBe(true);
    });

    it('should return false for different status values', () => {
      expect(TaskStatus.todo().equals(TaskStatus.completed())).toBe(false);
    });
  });
});
