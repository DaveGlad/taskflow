/**
 * @fileoverview Task Application Service
 * @module application/services/task
 */

import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskDomainService,
  type ITaskRepository,
  type TaskFilters,
  type PaginationOptions,
} from '../../domain';
import { TaskMapper } from '../mappers/task.mapper';
import {
  createTaskSchema,
  updateTaskSchema,
  type CreateTaskDto,
  type UpdateTaskDto,
  type TaskResponseDto,
  type TaskListResponseDto,
  type TaskStatisticsResponseDto,
} from '../dtos';
import { NotFoundError, ValidationError } from '../../infrastructure/errors/app.error';

export class TaskService {
  private readonly domainService: TaskDomainService;

  constructor(private readonly taskRepository: ITaskRepository) {
    this.domainService = new TaskDomainService();
  }

  async create(dto: CreateTaskDto): Promise<TaskResponseDto> {
    const validationResult = createTaskSchema.safeParse(dto);
    if (!validationResult.success) {
      throw new ValidationError(validationResult.error.errors[0].message);
    }

    const validated = validationResult.data;
    const task = Task.create({
      title: validated.title,
      description: validated.description,
      priority: TaskPriority.create(validated.priority),
    });

    const savedTask = await this.taskRepository.create(task);
    return TaskMapper.toResponseDto(savedTask);
  }

  async findAll(filters?: TaskFilters): Promise<TaskResponseDto[]> {
    const tasks = await this.taskRepository.findAll(filters);
    const sortedTasks = this.domainService.sortByPriorityAndDate(tasks);
    return TaskMapper.toResponseDtoList(sortedTasks);
  }

  async findPaginated(filters?: TaskFilters, pagination?: PaginationOptions): Promise<TaskListResponseDto> {
    const defaultPagination: PaginationOptions = {
      page: pagination?.page ?? 1,
      limit: pagination?.limit ?? 10,
    };

    const result = await this.taskRepository.findPaginated(filters, defaultPagination);
    return TaskMapper.toPaginatedResponseDto(result);
  }

  async findById(id: string): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new NotFoundError('Task', id);
    return TaskMapper.toResponseDto(task);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<TaskResponseDto> {
    const validationResult = updateTaskSchema.safeParse(dto);
    if (!validationResult.success) {
      throw new ValidationError(validationResult.error.errors[0].message);
    }

    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) throw new NotFoundError('Task', id);

    const validated = validationResult.data;
    let updatedTask = existingTask;

    if (validated.title !== undefined) {
      updatedTask = updatedTask.updateTitle(validated.title);
    }
    if (validated.description !== undefined) {
      updatedTask = updatedTask.updateDescription(validated.description);
    }
    if (validated.status !== undefined) {
      updatedTask = updatedTask.changeStatus(TaskStatus.create(validated.status));
    }
    if (validated.priority !== undefined) {
      updatedTask = updatedTask.changePriority(TaskPriority.create(validated.priority));
    }

    const savedTask = await this.taskRepository.update(updatedTask);
    return TaskMapper.toResponseDto(savedTask);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.taskRepository.exists(id);
    if (!exists) throw new NotFoundError('Task', id);
    await this.taskRepository.delete(id);
  }

  async getStatistics(): Promise<TaskStatisticsResponseDto> {
    const tasks = await this.taskRepository.findAll();
    const stats = this.domainService.getStatistics(tasks);
    return TaskMapper.toStatisticsResponseDto(stats);
  }

  async markAsCompleted(id: string): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new NotFoundError('Task', id);

    const completedTask = task.markAsCompleted();
    const savedTask = await this.taskRepository.update(completedTask);
    return TaskMapper.toResponseDto(savedTask);
  }

  async markAsInProgress(id: string): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new NotFoundError('Task', id);

    const inProgressTask = task.markAsInProgress();
    const savedTask = await this.taskRepository.update(inProgressTask);
    return TaskMapper.toResponseDto(savedTask);
  }
}
