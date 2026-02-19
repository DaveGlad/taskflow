/**
 * @fileoverview MongoDB Task Repository Implementation
 * @module infrastructure/repositories/mongo-task
 */

import { FilterQuery } from 'mongoose';
import {
  Task,
  TaskStatus,
  TaskPriority,
  type ITaskRepository,
  type TaskFilters,
  type PaginationOptions,
  type PaginatedResult,
} from '../../domain';
import { TaskModel, ITaskDocument } from '../database/models/task.model';
import { logger } from '../services/logger.service';

export class MongoTaskRepository implements ITaskRepository {
  async findAll(filters?: TaskFilters): Promise<Task[]> {
    const query = this.buildQuery(filters);
    const documents = await TaskModel.find(query).sort({ createdAt: -1 }).lean();
    return documents.map((doc) => this.toDomain(doc));
  }

  async findPaginated(filters?: TaskFilters, pagination?: PaginationOptions): Promise<PaginatedResult<Task>> {
    const query = this.buildQuery(filters);
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      TaskModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      TaskModel.countDocuments(query),
    ]);

    return {
      data: documents.map((doc) => this.toDomain(doc)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Task | null> {
    try {
      const document = await TaskModel.findById(id).lean();
      return document ? this.toDomain(document) : null;
    } catch {
      logger.debug(`Task not found with id: ${id}`);
      return null;
    }
  }

  async create(task: Task): Promise<Task> {
    const document = await TaskModel.create({
      title: task.title,
      description: task.description,
      status: task.status.value,
      priority: task.priority.value,
    });
    return this.toDomain(document.toObject() as unknown as Record<string, unknown>);
  }

  async update(task: Task): Promise<Task> {
    const document = await TaskModel.findByIdAndUpdate(
      task.id,
      {
        title: task.title,
        description: task.description,
        status: task.status.value,
        priority: task.priority.value,
        updatedAt: new Date(),
      },
      { new: true, lean: true }
    );
    if (!document) throw new Error(`Task with id '${task.id}' not found`);
    return this.toDomain(document);
  }

  async delete(id: string): Promise<boolean> {
    const result = await TaskModel.findByIdAndDelete(id);
    return result !== null;
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await TaskModel.countDocuments({ _id: id });
      return count > 0;
    } catch {
      return false;
    }
  }

  async count(filters?: TaskFilters): Promise<number> {
    const query = this.buildQuery(filters);
    return TaskModel.countDocuments(query);
  }

  private buildQuery(filters?: TaskFilters): FilterQuery<ITaskDocument> {
    const query: FilterQuery<ITaskDocument> = {};
    if (filters?.status) query.status = filters.status;
    if (filters?.priority) query.priority = filters.priority;
    if (filters?.search) query.$text = { $search: filters.search };
    return query;
  }

  private toDomain(doc: Record<string, unknown>): Task {
    return Task.reconstitute({
      id: (doc._id ?? doc.id)?.toString() ?? '',
      title: doc.title as string,
      description: (doc.description as string) ?? '',
      status: TaskStatus.create(doc.status as string),
      priority: TaskPriority.create(doc.priority as string),
      createdAt: new Date(doc.createdAt as string | Date),
      updatedAt: new Date(doc.updatedAt as string | Date),
    });
  }
}
