/**
 * @fileoverview Task Controller
 * @module presentation/controllers/task
 */

import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../../application';
import type { TaskFilters, PaginationOptions, TaskStatusType, TaskPriorityType } from '../../domain';

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters: TaskFilters = {};
      if (req.query.status) filters.status = req.query.status as TaskStatusType;
      if (req.query.priority) filters.priority = req.query.priority as TaskPriorityType;
      if (req.query.search) filters.search = req.query.search as string;

      const tasks = await this.taskService.findAll(Object.keys(filters).length > 0 ? filters : undefined);
      res.json({ success: true, data: tasks });
    } catch (error) {
      next(error);
    }
  };

  getPaginated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters: TaskFilters = {};
      if (req.query.status) filters.status = req.query.status as TaskStatusType;
      if (req.query.priority) filters.priority = req.query.priority as TaskPriorityType;

      const pagination: PaginationOptions = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const result = await this.taskService.findPaginated(
        Object.keys(filters).length > 0 ? filters : undefined,
        pagination
      );
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getStatistics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const statistics = await this.taskService.getStatistics();
      res.json({ success: true, data: statistics });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const task = await this.taskService.findById(req.params['id'] as string);
      res.json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const task = await this.taskService.create(req.body);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const task = await this.taskService.update(req.params['id'] as string, req.body);
      res.json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.taskService.delete(req.params['id'] as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  markAsCompleted = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const task = await this.taskService.markAsCompleted(req.params['id'] as string);
      res.json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  };

  markAsInProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const task = await this.taskService.markAsInProgress(req.params['id'] as string);
      res.json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  };
}
