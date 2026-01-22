/**
 * @fileoverview Task Status Value Object
 * @module domain/value-objects/task-status
 */

export const TASK_STATUSES = ['todo', 'in_progress', 'completed'] as const;

export type TaskStatusType = (typeof TASK_STATUSES)[number];

export class TaskStatus {
  private constructor(private readonly _value: TaskStatusType) {
    Object.freeze(this);
  }

  get value(): TaskStatusType {
    return this._value;
  }

  static create(value: string): TaskStatus {
    if (!TaskStatus.isValid(value)) {
      throw new Error(`Invalid task status: ${value}. Valid values: ${TASK_STATUSES.join(', ')}`);
    }
    return new TaskStatus(value as TaskStatusType);
  }

  static isValid(value: string): value is TaskStatusType {
    return TASK_STATUSES.includes(value as TaskStatusType);
  }

  static todo(): TaskStatus {
    return new TaskStatus('todo');
  }

  static inProgress(): TaskStatus {
    return new TaskStatus('in_progress');
  }

  static completed(): TaskStatus {
    return new TaskStatus('completed');
  }

  equals(other: TaskStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
