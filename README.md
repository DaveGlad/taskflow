# TaskFlow

> Application moderne de gestion de tâches construite avec les principes de Clean Architecture, React, TypeScript et MongoDB.

## Auteurs

- **Mouhcene AYADI** - Contributeur

## Table des Matières

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Docker Configuration](#docker-configuration)
- [API Documentation](#api-documentation)
- [Development Guide](#development-guide)
- [Best Practices](#best-practices)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Docker Environment                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐   │
│  │   Frontend   │────▶│   Backend    │────▶│     MongoDB      │   │
│  │  React/Vite  │     │   Express    │     │                  │   │
│  │  Port: 5173  │     │  Port: 3000  │     │   Port: 27017    │   │
│  └──────────────┘     └──────────────┘     └──────────────────┘   │
│         │                                           │              │
│         │                                           │              │
│         ▼                                           ▼              │
│  ┌──────────────┐                          ┌──────────────────┐   │
│  │ Browser Dev  │                          │  Mongo Express   │   │
│  │    Tools     │                          │   Port: 8081     │   │
│  └──────────────┘                          └──────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Clean Architecture (Backend)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                        │
│                    (Controllers, Routes, DTOs)                   │
├─────────────────────────────────────────────────────────────────┤
│                        Application Layer                         │
│                   (Use Cases, Services, Mappers)                 │
├─────────────────────────────────────────────────────────────────┤
│                          Domain Layer                            │
│               (Entities, Value Objects, Interfaces)              │
├─────────────────────────────────────────────────────────────────┤
│                      Infrastructure Layer                        │
│            (Database, Repositories, External Services)           │
└─────────────────────────────────────────────────────────────────┘
```

**Dependency Rule**: Dependencies point inward. The Domain layer has no dependencies on outer layers.

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 20 | Runtime environment |
| Express.js | Web framework |
| TypeScript | Type safety |
| MongoDB | Database |
| Mongoose | ODM |
| Zod | Schema validation |
| Winston | Logging |
| Swagger | API documentation |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| TypeScript | Type safety |
| Vite | Build tool |
| TanStack Query | Data fetching |
| Zustand | State management |
| Tailwind CSS | Styling |
| shadcn/ui | Component library |
| React Hook Form | Form handling |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| Nginx | Production web server |
| Mongo Express | Database GUI |

---

## Quick Start

### Prerequisites

- Docker Desktop 4.x+
- Docker Compose 2.x+
- Node.js 20+ (for local development)

### Start with Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd taskflow

# Copy environment variables
cp .env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | - |
| Backend API | http://localhost:3000 | - |
| API Docs | http://localhost:3000/api-docs | - |
| Mongo Express | http://localhost:8081 | admin / admin123 |

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

---

## Project Structure

```
taskflow/
├── backend/                           # Backend application
│   ├── src/
│   │   ├── domain/                   # Couche Domaine (logique métier pure)
│   │   │   ├── entities/
│   │   │   │   └── task.entity.ts    # Entité Task avec méthodes métier
│   │   │   ├── value-objects/
│   │   │   │   ├── task-status.vo.ts # Value Object TaskStatus
│   │   │   │   └── task-priority.vo.ts
│   │   │   ├── repositories/
│   │   │   │   └── task.repository.interface.ts
│   │   │   ├── services/
│   │   │   │   └── task-domain.service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── application/              # Couche Application (orchestration)
│   │   │   ├── dtos/
│   │   │   │   ├── create-task.dto.ts
│   │   │   │   ├── update-task.dto.ts
│   │   │   │   └── task-response.dto.ts
│   │   │   ├── mappers/
│   │   │   │   └── task.mapper.ts
│   │   │   ├── services/
│   │   │   │   └── task.service.ts   # Service orchestrateur principal
│   │   │   └── index.ts
│   │   │
│   │   ├── infrastructure/           # Couche Infrastructure (implémentations)
│   │   │   ├── config/
│   │   │   │   └── env.config.ts
│   │   │   ├── database/
│   │   │   │   ├── mongodb.connection.ts
│   │   │   │   └── models/
│   │   │   │       └── task.model.ts
│   │   │   ├── repositories/
│   │   │   │   └── mongo-task.repository.ts
│   │   │   ├── services/
│   │   │   │   └── logger.service.ts
│   │   │   ├── errors/
│   │   │   │   └── app.error.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── presentation/             # Couche Présentation (HTTP)
│   │   │   ├── controllers/
│   │   │   │   └── task.controller.ts
│   │   │   ├── routes/
│   │   │   │   └── task.routes.ts
│   │   │   ├── middlewares/
│   │   │   │   ├── error-handler.middleware.ts
│   │   │   │   └── validation.middleware.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── app.ts                    # Configuration Express
│   │   └── server.ts                 # Point d'entrée
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                          # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                   # Composants shadcn/ui
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   └── badge.tsx
│   │   │   ├── features/             # Composants métier
│   │   │   │   ├── task-card.tsx
│   │   │   │   ├── task-form.tsx
│   │   │   │   └── task-filters.tsx
│   │   │   └── layout/
│   │   │       └── header.tsx
│   │   │
│   │   ├── hooks/
│   │   │   └── use-tasks.ts          # Hooks TanStack Query
│   │   │
│   │   ├── services/
│   │   │   ├── api.service.ts        # Client API Axios
│   │   │   └── index.ts
│   │   │
│   │   ├── stores/
│   │   │   ├── task.store.ts         # Store Zustand
│   │   │   └── index.ts
│   │   │
│   │   ├── types/
│   │   │   ├── task.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── pages/
│   │   │   └── tasks-page.tsx
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css
│   │   │
│   │   ├── app.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Backend Architecture

### Couche Domaine (Domain Layer)

Contient la logique métier pure, indépendante des frameworks et bases de données.

**Entités** (`src/domain/entities/task.entity.ts`)
```typescript
// Entité Task avec méthodes métier
export class Task {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly status: TaskStatus,
    public readonly priority: TaskPriority,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Factory method avec validation
  static create(props: CreateTaskProps): Task {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Title is required');
    }
    return new Task(
      props.id ?? new ObjectId().toString(),
      props.title.trim(),
      props.description?.trim() ?? '',
      props.status ?? TaskStatus.create('todo'),
      props.priority ?? TaskPriority.create('medium'),
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date()
    );
  }

  // Opérations métier (immutables)
  complete(): Task {
    return new Task(/* ... status: TaskStatus.create('completed') */);
  }

  startProgress(): Task {
    return new Task(/* ... status: TaskStatus.create('in_progress') */);
  }

  updatePriority(priority: TaskPriority): Task { /* ... */ }
}
```

**Value Objects** (`src/domain/value-objects/`)
```typescript
// task-status.vo.ts - Value Object immutable
export class TaskStatus {
  private static readonly VALID_STATUSES = ['todo', 'in_progress', 'completed'] as const;

  private constructor(private readonly value: TaskStatusType) {}

  static create(value: string): TaskStatus {
    if (!this.isValid(value)) {
      throw new Error(`Invalid status: ${value}`);
    }
    return new TaskStatus(value as TaskStatusType);
  }

  getValue(): TaskStatusType { return this.value; }
  equals(other: TaskStatus): boolean { return this.value === other.value; }

  // Transitions de statut valides
  canTransitionTo(newStatus: TaskStatus): boolean {
    const transitions: Record<TaskStatusType, TaskStatusType[]> = {
      todo: ['in_progress'],
      in_progress: ['completed', 'todo'],
      completed: ['todo', 'in_progress'],
    };
    return transitions[this.value].includes(newStatus.getValue());
  }
}
```

**Interface Repository** (`src/domain/repositories/task.repository.interface.ts`)
```typescript
// Contrat pour l'accès aux données
export interface ITaskRepository {
  findAll(filters?: TaskFilters): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<boolean>;
}

export interface TaskFilters {
  status?: string;
  priority?: string;
}
```

**Service Domaine** (`src/domain/services/task-domain.service.ts`)
```typescript
// Logique métier complexe qui ne rentre pas dans l'entité
export class TaskDomainService {
  sortByPriority(tasks: Task[]): Task[] {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return [...tasks].sort((a, b) =>
      priorityOrder[a.priority.getValue()] - priorityOrder[b.priority.getValue()]
    );
  }

  getStatistics(tasks: Task[]): TaskStatistics {
    return {
      total: tasks.length,
      byStatus: { todo: 0, in_progress: 0, completed: 0 },
      byPriority: { low: 0, medium: 0, high: 0 },
      completionRate: /* ... */
    };
  }
}
```

### Couche Application (Application Layer)

Orchestre les cas d'utilisation et coordonne le domaine.

**Service Applicatif** (`src/application/services/task.service.ts`)
```typescript
// Service orchestrateur principal
export class TaskService {
  private readonly domainService: TaskDomainService;

  constructor(private readonly taskRepository: ITaskRepository) {
    this.domainService = new TaskDomainService();
  }

  async create(dto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = Task.create({
      title: dto.title,
      description: dto.description,
      priority: dto.priority ? TaskPriority.create(dto.priority) : undefined,
    });
    const saved = await this.taskRepository.create(task);
    return TaskMapper.toResponse(saved);
  }

  async findAll(filters?: TaskFilters): Promise<TaskResponseDto[]> {
    const tasks = await this.taskRepository.findAll(filters);
    const sorted = this.domainService.sortByPriority(tasks);
    return sorted.map(TaskMapper.toResponse);
  }

  async markAsCompleted(id: string): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new NotFoundError('Task', id);

    const completed = task.complete();
    const updated = await this.taskRepository.update(completed);
    return TaskMapper.toResponse(updated);
  }
}
```

**DTOs avec Validation Zod** (`src/application/dtos/`)
```typescript
// create-task.dto.ts
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional().default(''),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;

// update-task.dto.ts
export const updateTaskSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(['todo', 'in_progress', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
```

**Mapper** (`src/application/mappers/task.mapper.ts`)
```typescript
export class TaskMapper {
  static toResponse(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status.getValue(),
      priority: task.priority.getValue(),
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}
```

### Couche Infrastructure (Infrastructure Layer)

Implémentations concrètes des interfaces du domaine.

**Repository MongoDB** (`src/infrastructure/repositories/mongo-task.repository.ts`)
```typescript
export class MongoTaskRepository implements ITaskRepository {
  async findAll(filters?: TaskFilters): Promise<Task[]> {
    const query: FilterQuery<ITaskDocument> = {};
    if (filters?.status) query.status = filters.status;
    if (filters?.priority) query.priority = filters.priority;

    const documents = await TaskModel.find(query).sort({ createdAt: -1 });
    return documents.map((doc) => this.toDomain(doc));
  }

  private toDomain(doc: ITaskDocument): Task {
    return Task.create({
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      status: TaskStatus.create(doc.status),
      priority: TaskPriority.create(doc.priority),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
```

**Gestion des Erreurs** (`src/infrastructure/errors/app.error.ts`)
```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, details);
  }
}
```

### Couche Présentation (Presentation Layer)

Interface HTTP et gestion des requêtes.

**Controller** (`src/presentation/controllers/task.controller.ts`)
```typescript
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await this.taskService.create(req.body);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters: TaskFilters = {
        status: req.query.status as string | undefined,
        priority: req.query.priority as string | undefined,
      };
      const tasks = await this.taskService.findAll(filters);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  };

  markAsCompleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await this.taskService.markAsCompleted(req.params.id);
      res.json(task);
    } catch (error) {
      next(error);
    }
  };
}
```

**Routes** (`src/presentation/routes/task.routes.ts`)
```typescript
const router = Router();

// Injection de dépendances
const taskRepository = new MongoTaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

router.get('/', taskController.findAll);
router.get('/:id', taskController.findById);
router.post('/', validate(createTaskSchema), taskController.create);
router.put('/:id', validate(updateTaskSchema), taskController.update);
router.patch('/:id/complete', taskController.markAsCompleted);
router.patch('/:id/in-progress', taskController.markAsInProgress);
router.delete('/:id', taskController.delete);

export { router as taskRoutes };
```

---

## Frontend Architecture

### Organisation des Composants

```
components/
├── ui/                     # Composants shadcn/ui (base)
│   ├── button.tsx         # Bouton avec variantes
│   ├── card.tsx           # Conteneur carte
│   ├── dialog.tsx         # Modal dialog
│   ├── input.tsx          # Champ de saisie
│   ├── label.tsx          # Label de formulaire
│   ├── select.tsx         # Liste déroulante
│   └── badge.tsx          # Badge de statut/priorité
│
├── features/               # Composants métier
│   ├── task-card.tsx      # Carte d'affichage de tâche
│   ├── task-form.tsx      # Formulaire création/édition
│   └── task-filters.tsx   # Filtres de recherche
│
└── layout/
    └── header.tsx         # En-tête de l'application
```

### Gestion de l'État

**État Serveur** - TanStack Query
```typescript
// hooks/use-tasks.ts
export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => apiService.getTasks(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      apiService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useMarkTaskAsCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiService.markAsCompleted,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
```

**État UI** - Zustand
```typescript
// stores/task.store.ts
interface TaskStore {
  // Filtres
  filters: TaskFilters;
  setFilters: (filters: TaskFilters) => void;

  // Tâche sélectionnée
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;

  // États des dialogues
  isCreateDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  filters: {},
  setFilters: (filters) => set({ filters }),
  selectedTask: null,
  setSelectedTask: (task) => set({ selectedTask: task }),
  isCreateDialogOpen: false,
  setCreateDialogOpen: (open) => set({ isCreateDialogOpen: open }),
  isEditDialogOpen: false,
  setEditDialogOpen: (open) => set({ isEditDialogOpen: open }),
  isDeleteDialogOpen: false,
  setDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),
}));
```

### Service API

```typescript
// services/api.service.ts
class ApiService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    const response = await this.client.get<Task[]>('/api/tasks', { params: filters });
    return response.data;
  }

  async getTask(id: string): Promise<Task> {
    const response = await this.client.get<Task>(`/api/tasks/${id}`);
    return response.data;
  }

  async createTask(data: CreateTaskInput): Promise<Task> {
    const response = await this.client.post<Task>('/api/tasks', data);
    return response.data;
  }

  async updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
    const response = await this.client.put<Task>(`/api/tasks/${id}`, data);
    return response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await this.client.delete(`/api/tasks/${id}`);
  }

  async markAsCompleted(id: string): Promise<Task> {
    const response = await this.client.patch<Task>(`/api/tasks/${id}/complete`);
    return response.data;
  }

  async markAsInProgress(id: string): Promise<Task> {
    const response = await this.client.patch<Task>(`/api/tasks/${id}/in-progress`);
    return response.data;
  }
}

export const apiService = new ApiService();
```

### Types TypeScript

```typescript
// types/task.types.ts
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export const TASK_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'completed'];
export const TASK_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
}
```

### Composants Principaux

**TaskCard** (`components/features/task-card.tsx`)
```tsx
export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
        <div className="flex gap-1">
          <Badge variant={task.status}>{statusLabels[task.status]}</Badge>
          <Badge variant={task.priority}>{priorityLabels[task.priority]}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {task.description && <p>{task.description}</p>}
        <div className="flex gap-2">
          {task.status !== 'completed' && (
            <Button onClick={() => onStatusChange(task)}>
              {task.status === 'todo' ? 'Start' : 'Complete'}
            </Button>
          )}
          <Button onClick={() => onEdit(task)}>Edit</Button>
          <Button variant="destructive" onClick={() => onDelete(task)}>Delete</Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

**TaskForm** (`components/features/task-form.tsx`)
```tsx
export function TaskForm({ task, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const isEditing = !!task;
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      priority: task?.priority ?? 'medium',
      ...(isEditing && { status: task.status }),
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('title', { required: 'Title is required' })} />
      <textarea {...register('description')} />
      <Select onValueChange={(v) => setValue('priority', v)}>
        {TASK_PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
      </Select>
      {isEditing && (
        <Select onValueChange={(v) => setValue('status', v)}>
          {TASK_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </Select>
      )}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
      </Button>
    </form>
  );
}
```

---

## Docker Configuration

### Development Mode

```bash
# Start all services with hot reload
docker-compose up -d

# Rebuild after dependency changes
docker-compose up -d --build

# View logs for specific service
docker-compose logs -f backend
```

**Features:**
- Bind mounts for source code (hot reload)
- Development dependencies included
- Debug logging enabled
- Mongo Express for database inspection

### Production Mode

```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d --build
```

**Features:**
- Multi-stage builds (smaller images)
- Production optimizations
- Non-root user for security
- Nginx serving static frontend
- No Mongo Express exposed

### Service Details

| Service | Development | Production |
|---------|-------------|------------|
| Frontend | Vite dev server | Nginx static |
| Backend | ts-node-dev | Node.js |
| MongoDB | With sample data | Empty |
| Mongo Express | Enabled | Disabled |

---

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/tasks` | Récupérer toutes les tâches |
| `GET` | `/api/tasks/:id` | Récupérer une tâche par ID |
| `POST` | `/api/tasks` | Créer une nouvelle tâche |
| `PUT` | `/api/tasks/:id` | Mettre à jour une tâche |
| `PATCH` | `/api/tasks/:id/complete` | Marquer une tâche comme terminée |
| `PATCH` | `/api/tasks/:id/in-progress` | Marquer une tâche en cours |
| `DELETE` | `/api/tasks/:id` | Supprimer une tâche |
| `GET` | `/health` | Vérification de santé |

---

### Types de Données

#### Task

```typescript
interface Task {
  id: string;           // ObjectId MongoDB
  title: string;        // 1-100 caractères, requis
  description: string;  // 0-500 caractères, optionnel
  status: TaskStatus;   // 'todo' | 'in_progress' | 'completed'
  priority: TaskPriority; // 'low' | 'medium' | 'high'
  createdAt: string;    // ISO 8601 date
  updatedAt: string;    // ISO 8601 date
}
```

#### TaskStatus

| Valeur | Description |
|--------|-------------|
| `todo` | Tâche à faire |
| `in_progress` | Tâche en cours |
| `completed` | Tâche terminée |

#### TaskPriority

| Valeur | Description |
|--------|-------------|
| `low` | Priorité basse |
| `medium` | Priorité moyenne (défaut) |
| `high` | Priorité haute |

---

### 1. Récupérer Toutes les Tâches

```http
GET /api/tasks
```

#### Query Parameters

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `status` | string | Non | Filtrer par statut (`todo`, `in_progress`, `completed`) |
| `priority` | string | Non | Filtrer par priorité (`low`, `medium`, `high`) |

#### Exemples

```bash
# Toutes les tâches
curl http://localhost:3000/api/tasks

# Filtrer par statut
curl "http://localhost:3000/api/tasks?status=todo"

# Filtrer par priorité
curl "http://localhost:3000/api/tasks?priority=high"

# Combiner les filtres
curl "http://localhost:3000/api/tasks?status=in_progress&priority=high"
```

#### Réponse - 200 OK

```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "Apprendre Docker",
    "description": "Compléter le tutoriel Docker",
    "status": "todo",
    "priority": "high",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "title": "Réviser TypeScript",
    "description": "",
    "status": "in_progress",
    "priority": "medium",
    "createdAt": "2024-01-14T09:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
]
```

---

### 2. Récupérer une Tâche par ID

```http
GET /api/tasks/:id
```

#### Path Parameters

| Paramètre | Type | Description |
|-----------|------|-------------|
| `id` | string | ID MongoDB de la tâche |

#### Exemple

```bash
curl http://localhost:3000/api/tasks/507f1f77bcf86cd799439011
```

#### Réponse - 200 OK

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Apprendre Docker",
  "description": "Compléter le tutoriel Docker",
  "status": "todo",
  "priority": "high",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Réponse - 404 Not Found

```json
{
  "error": "Task with id 507f1f77bcf86cd799439011 not found"
}
```

---

### 3. Créer une Tâche

```http
POST /api/tasks
```

#### Request Body

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `title` | string | Oui | Titre de la tâche (1-100 caractères) |
| `description` | string | Non | Description (max 500 caractères) |
| `priority` | string | Non | Priorité (`low`, `medium`, `high`). Défaut: `medium` |

#### Exemple

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Apprendre Docker",
    "description": "Compléter le tutoriel Docker",
    "priority": "high"
  }'
```

#### Réponse - 201 Created

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Apprendre Docker",
  "description": "Compléter le tutoriel Docker",
  "status": "todo",
  "priority": "high",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Réponse - 400 Bad Request

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

---

### 4. Mettre à Jour une Tâche

```http
PUT /api/tasks/:id
```

#### Path Parameters

| Paramètre | Type | Description |
|-----------|------|-------------|
| `id` | string | ID MongoDB de la tâche |

#### Request Body

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `title` | string | Non | Nouveau titre (1-100 caractères) |
| `description` | string | Non | Nouvelle description (max 500 caractères) |
| `status` | string | Non | Nouveau statut (`todo`, `in_progress`, `completed`) |
| `priority` | string | Non | Nouvelle priorité (`low`, `medium`, `high`) |

#### Exemple

```bash
curl -X PUT http://localhost:3000/api/tasks/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Maîtriser Docker",
    "status": "in_progress",
    "priority": "high"
  }'
```

#### Réponse - 200 OK

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Maîtriser Docker",
  "description": "Compléter le tutoriel Docker",
  "status": "in_progress",
  "priority": "high",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T14:00:00.000Z"
}
```

---

### 5. Marquer une Tâche comme Terminée

```http
PATCH /api/tasks/:id/complete
```

#### Path Parameters

| Paramètre | Type | Description |
|-----------|------|-------------|
| `id` | string | ID MongoDB de la tâche |

#### Exemple

```bash
curl -X PATCH http://localhost:3000/api/tasks/507f1f77bcf86cd799439011/complete
```

#### Réponse - 200 OK

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Apprendre Docker",
  "description": "Compléter le tutoriel Docker",
  "status": "completed",
  "priority": "high",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T16:00:00.000Z"
}
```

---

### 6. Marquer une Tâche en Cours

```http
PATCH /api/tasks/:id/in-progress
```

#### Path Parameters

| Paramètre | Type | Description |
|-----------|------|-------------|
| `id` | string | ID MongoDB de la tâche |

#### Exemple

```bash
curl -X PATCH http://localhost:3000/api/tasks/507f1f77bcf86cd799439011/in-progress
```

#### Réponse - 200 OK

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Apprendre Docker",
  "description": "Compléter le tutoriel Docker",
  "status": "in_progress",
  "priority": "high",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T15:00:00.000Z"
}
```

---

### 7. Supprimer une Tâche

```http
DELETE /api/tasks/:id
```

#### Path Parameters

| Paramètre | Type | Description |
|-----------|------|-------------|
| `id` | string | ID MongoDB de la tâche |

#### Exemple

```bash
curl -X DELETE http://localhost:3000/api/tasks/507f1f77bcf86cd799439011
```

#### Réponse - 204 No Content

Aucun corps de réponse.

#### Réponse - 404 Not Found

```json
{
  "error": "Task with id 507f1f77bcf86cd799439011 not found"
}
```

---

### 8. Vérification de Santé

```http
GET /health
```

#### Exemple

```bash
curl http://localhost:3000/health
```

#### Réponse - 200 OK

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Codes d'Erreur

| Code | Signification |
|------|---------------|
| `200` | Succès |
| `201` | Ressource créée |
| `204` | Succès sans contenu |
| `400` | Requête invalide (validation échouée) |
| `404` | Ressource non trouvée |
| `500` | Erreur serveur interne |

### Format des Erreurs

```json
{
  "error": "Message d'erreur descriptif",
  "details": [
    {
      "field": "nom_du_champ",
      "message": "Description de l'erreur de validation"
    }
  ]
}
```

---

### Collection Postman / Insomnia

Importez cette collection pour tester rapidement l'API:

```json
{
  "info": {
    "name": "TaskFlow API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    { "key": "baseUrl", "value": "http://localhost:3000" }
  ],
  "item": [
    {
      "name": "Tasks",
      "item": [
        { "name": "Get All Tasks", "request": { "method": "GET", "url": "{{baseUrl}}/api/tasks" }},
        { "name": "Get Task by ID", "request": { "method": "GET", "url": "{{baseUrl}}/api/tasks/:id" }},
        { "name": "Create Task", "request": { "method": "POST", "url": "{{baseUrl}}/api/tasks", "body": { "mode": "raw", "raw": "{\"title\": \"New Task\", \"priority\": \"high\"}" }}},
        { "name": "Update Task", "request": { "method": "PUT", "url": "{{baseUrl}}/api/tasks/:id" }},
        { "name": "Mark Complete", "request": { "method": "PATCH", "url": "{{baseUrl}}/api/tasks/:id/complete" }},
        { "name": "Mark In Progress", "request": { "method": "PATCH", "url": "{{baseUrl}}/api/tasks/:id/in-progress" }},
        { "name": "Delete Task", "request": { "method": "DELETE", "url": "{{baseUrl}}/api/tasks/:id" }}
      ]
    }
  ]
}
```

---

## Development Guide

### Développement Local (Sans Docker)

**Prérequis**
- Node.js 20+
- MongoDB 6+ (local ou MongoDB Atlas)

**Backend**
```bash
cd backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec votre MONGODB_URI

# Lancer en mode développement
npm run dev

# Le serveur démarre sur http://localhost:3000
```

**Frontend**
```bash
cd frontend

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# L'application démarre sur http://localhost:5173
```

### Variables d'Environnement

**Backend** (`backend/.env`)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskflow
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
```

**Frontend** (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3000
```

### Ajouter une Nouvelle Fonctionnalité

Suivre l'ordre des couches (du domaine vers la présentation):

1. **Couche Domaine**
   - Créer l'entité dans `domain/entities/` (ex: `user.entity.ts`)
   - Créer les value objects dans `domain/value-objects/`
   - Définir l'interface repository dans `domain/repositories/`
   - Ajouter la logique métier complexe dans `domain/services/`

2. **Couche Application**
   - Créer les DTOs avec Zod dans `application/dtos/`
   - Créer le mapper dans `application/mappers/`
   - Créer le service applicatif dans `application/services/`

3. **Couche Infrastructure**
   - Créer le modèle Mongoose dans `infrastructure/database/models/`
   - Implémenter le repository dans `infrastructure/repositories/`

4. **Couche Présentation**
   - Créer le controller dans `presentation/controllers/`
   - Ajouter les routes dans `presentation/routes/`
   - Enregistrer les routes dans `app.ts`

### Scripts Disponibles

**Backend**
```bash
npm run dev        # Développement avec hot-reload
npm run build      # Compilation TypeScript
npm run start      # Production
npm run lint       # Vérification ESLint
npm run test       # Tests unitaires
```

**Frontend**
```bash
npm run dev        # Serveur de développement Vite
npm run build      # Build de production
npm run preview    # Prévisualiser le build
npm run lint       # Vérification ESLint
```

### Tests API avec cURL

```bash
# Créer une tâche
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Ma première tâche", "priority": "high"}'

# Lister toutes les tâches
curl http://localhost:3000/api/tasks

# Filtrer par statut
curl "http://localhost:3000/api/tasks?status=todo"

# Marquer comme en cours
curl -X PATCH http://localhost:3000/api/tasks/{id}/in-progress

# Marquer comme terminée
curl -X PATCH http://localhost:3000/api/tasks/{id}/complete

# Supprimer
curl -X DELETE http://localhost:3000/api/tasks/{id}
```

---

## Best Practices

### Organisation du Code

- **Single Responsibility**: Chaque classe/fonction fait une seule chose bien
- **Dependency Injection**: Injecter les dépendances, ne pas les instancier directement
- **Interface Segregation**: Interfaces petites et focalisées
- **Immutabilité**: Préférer les structures de données immutables (Value Objects)

### Conventions de Nommage

| Type | Convention | Exemple |
|------|------------|---------|
| Fichiers | kebab-case + suffixe | `task.entity.ts`, `task-status.vo.ts` |
| Classes | PascalCase | `TaskService`, `TaskPriority` |
| Interfaces | I + PascalCase | `ITaskRepository` |
| Fonctions/méthodes | camelCase | `findById()`, `markAsCompleted()` |
| Constants | SCREAMING_SNAKE_CASE | `TASK_STATUSES` |

### Suffixes de Fichiers Backend

| Suffixe | Signification |
|---------|---------------|
| `.entity.ts` | Entité du domaine |
| `.vo.ts` | Value Object |
| `.dto.ts` | Data Transfer Object |
| `.service.ts` | Service (domaine ou application) |
| `.repository.ts` | Implémentation repository |
| `.controller.ts` | Controller HTTP |
| `.middleware.ts` | Middleware Express |
| `.routes.ts` | Définition des routes |
| `.model.ts` | Modèle Mongoose |
| `.config.ts` | Configuration |

### Gestion des Erreurs

```typescript
// Classes d'erreurs personnalisées
export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 404);
  }
}

// Middleware global de gestion d'erreurs
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error occurred', { error: error.message, stack: error.stack });

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      ...(error.details && { details: error.details }),
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  return res.status(500).json({ error: 'Internal server error' });
});
```

### Validation

- Valider à la frontière API avec les schémas Zod
- Les entités du domaine appliquent les règles métier
- Ne jamais faire confiance aux entrées utilisateur
- Utiliser des Value Objects pour les valeurs avec contraintes

### Logging

```typescript
// Logging structuré avec Winston
logger.info('Task created', {
  taskId: task.id,
  title: task.title,
  priority: task.priority.getValue(),
});

logger.error('Failed to create task', {
  error: error.message,
  body: req.body,
});
```

---

## Troubleshooting

### Erreurs Courantes

**"Cannot find module 'compression'"**
```bash
cd backend && npm install compression @types/compression
```

**"ECONNREFUSED 127.0.0.1:27017"**
- Vérifier que MongoDB est en cours d'exécution
- Vérifier la variable `MONGODB_URI` dans `.env`

**"CORS error" dans le navigateur**
- Vérifier que `CORS_ORIGIN` dans le backend correspond à l'URL du frontend
- En développement: `CORS_ORIGIN=http://localhost:5173`

**Données non visibles dans MongoDB Compass**
- Connectez-vous à `mongodb://localhost:27017`
- Base de données: `taskflow`
- Collection: `tasks`
- Créer d'abord des tâches via l'API

**Port déjà utilisé**
```bash
# Trouver le processus utilisant le port
lsof -i :3000
# Terminer le processus
kill -9 <PID>
```

### Vérifier l'État des Services

```bash
# Santé du backend
curl http://localhost:3000/health

# Lister les tâches
curl http://localhost:3000/api/tasks

# Logs Docker
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## Contributing

1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

---

## License

MIT License - See LICENSE file for details.
