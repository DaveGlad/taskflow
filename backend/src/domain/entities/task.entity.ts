/**
 * @fileoverview Task Entity - Core Domain Model
 * @module domain/entities/task
 */

import { TaskStatus } from '../value-objects/task-status.vo';
import { TaskPriority } from '../value-objects/task-priority.vo';

export interface TaskProps {
  id?: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Task {
  private readonly _id: string;
  private readonly _title: string;
  private readonly _description: string;
  private readonly _status: TaskStatus;
  private readonly _priority: TaskPriority;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: Required<TaskProps>) {
    this._id = props.id;
    this._title = props.title;
    this._description = props.description;
    this._status = props.status;
    this._priority = props.priority;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    Object.freeze(this);
  }

  get id(): string { return this._id; }
  get title(): string { return this._title; }
  get description(): string { return this._description; }
  get status(): TaskStatus { return this._status; }
  get priority(): TaskPriority { return this._priority; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  static create(props: TaskProps): Task {
    Task.validate(props);
    return new Task({
      id: props.id ?? crypto.randomUUID(),
      title: props.title.trim(),
      description: props.description?.trim() ?? '',
      status: props.status ?? TaskStatus.todo(),
      priority: props.priority ?? TaskPriority.medium(),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  static reconstitute(props: Required<TaskProps>): Task {
    return new Task(props);
  }

  private static validate(props: TaskProps): void {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Task title is required');
    }
    if (props.title.trim().length > 200) {
      throw new Error('Task title must not exceed 200 characters');
    }
    if (props.description && props.description.length > 2000) {
      throw new Error('Task description must not exceed 2000 characters');
    }
  }

  updateTitle(title: string): Task {
    return Task.create({ ...this.toProps(), title, updatedAt: new Date() });
  }

  updateDescription(description: string): Task {
    return Task.create({ ...this.toProps(), description, updatedAt: new Date() });
  }

  changeStatus(status: TaskStatus): Task {
    return Task.create({ ...this.toProps(), status, updatedAt: new Date() });
  }

  changePriority(priority: TaskPriority): Task {
    return Task.create({ ...this.toProps(), priority, updatedAt: new Date() });
  }

  markAsInProgress(): Task {
    return this.changeStatus(TaskStatus.inProgress());
  }

  markAsCompleted(): Task {
    return this.changeStatus(TaskStatus.completed());
  }

  isCompleted(): boolean {
    return this._status.equals(TaskStatus.completed());
  }

  toProps(): Required<TaskProps> {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      status: this._status,
      priority: this._priority,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
