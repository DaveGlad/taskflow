/**
 * @fileoverview Task Card Component
 * @module components/features/task-card
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task) => void;
}

const statusLabels: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const priorityLabels: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{task.title}</CardTitle>
          <div className="flex gap-1 shrink-0">
            <Badge variant={task.status as 'todo' | 'in_progress' | 'completed'}>
              {statusLabels[task.status]}
            </Badge>
            <Badge variant={task.priority as 'low' | 'medium' | 'high'}>
              {priorityLabels[task.priority]}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {task.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>

          <div className="flex gap-2">
            {task.status !== 'completed' && (
              <Button variant="outline" size="sm" onClick={() => onStatusChange(task)}>
                {task.status === 'todo' ? 'Start' : 'Complete'}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(task)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
