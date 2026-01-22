/**
 * @fileoverview Task Routes
 * @module presentation/routes/task
 */

import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { TaskService } from '../../application';
import { MongoTaskRepository } from '../../infrastructure';
import { validateBody } from '../middlewares/validation.middleware';
import { createTaskSchema, updateTaskSchema } from '../../application';

// Dependency injection
const taskRepository = new MongoTaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

const router = Router();

router.get('/', taskController.getAll);
router.get('/paginated', taskController.getPaginated);
router.get('/statistics', taskController.getStatistics);
router.get('/:id', taskController.getById);
router.post('/', validateBody(createTaskSchema), taskController.create);
router.put('/:id', validateBody(updateTaskSchema), taskController.update);
router.delete('/:id', taskController.delete);
router.patch('/:id/complete', taskController.markAsCompleted);
router.patch('/:id/start', taskController.markAsInProgress);

export { router as taskRoutes };
