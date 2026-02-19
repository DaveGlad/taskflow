import { describe, it, expect } from 'vitest';
import { TaskPriority } from '../../../domain/value-objects/task-priority.vo';

describe('TaskPriority Value Object', () => {
  describe('create()', () => {
    it('should create a valid priority from string', () => {
      const priority = TaskPriority.create('low');
      expect(priority.value).toBe('low');
    });

    it('should accept all valid values', () => {
      expect(TaskPriority.create('low').value).toBe('low');
      expect(TaskPriority.create('medium').value).toBe('medium');
      expect(TaskPriority.create('high').value).toBe('high');
    });

    it('should throw an error for invalid value', () => {
      expect(() => TaskPriority.create('invalid')).toThrow('Invalid task priority: invalid');
    });
  });

  describe('isValid()', () => {
    it('should return true for valid priorities', () => {
      expect(TaskPriority.isValid('low')).toBe(true);
      expect(TaskPriority.isValid('medium')).toBe(true);
      expect(TaskPriority.isValid('high')).toBe(true);
    });

    it('should return false for invalid priorities', () => {
      expect(TaskPriority.isValid('invalid')).toBe(false);
      expect(TaskPriority.isValid('')).toBe(false);
    });
  });

  describe('factory methods', () => {
    it('low() should create a low priority', () => {
      expect(TaskPriority.low().value).toBe('low');
    });

    it('medium() should create a medium priority', () => {
      expect(TaskPriority.medium().value).toBe('medium');
    });

    it('high() should create a high priority', () => {
      expect(TaskPriority.high().value).toBe('high');
    });
  });

  describe('equals()', () => {
    it('should return true for same priority values', () => {
      expect(TaskPriority.high().equals(TaskPriority.high())).toBe(true);
    });

    it('should return false for different priority values', () => {
      expect(TaskPriority.low().equals(TaskPriority.high())).toBe(false);
    });
  });
});
