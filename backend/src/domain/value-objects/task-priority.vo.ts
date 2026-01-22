/**
 * @fileoverview Task Priority Value Object
 * @module domain/value-objects/task-priority
 */

export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;

export type TaskPriorityType = (typeof TASK_PRIORITIES)[number];

export class TaskPriority {
  private constructor(private readonly _value: TaskPriorityType) {
    Object.freeze(this);
  }

  get value(): TaskPriorityType {
    return this._value;
  }

  static create(value: string): TaskPriority {
    if (!TaskPriority.isValid(value)) {
      throw new Error(`Invalid task priority: ${value}. Valid values: ${TASK_PRIORITIES.join(', ')}`);
    }
    return new TaskPriority(value as TaskPriorityType);
  }

  static isValid(value: string): value is TaskPriorityType {
    return TASK_PRIORITIES.includes(value as TaskPriorityType);
  }

  static low(): TaskPriority {
    return new TaskPriority('low');
  }

  static medium(): TaskPriority {
    return new TaskPriority('medium');
  }

  static high(): TaskPriority {
    return new TaskPriority('high');
  }

  equals(other: TaskPriority): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
