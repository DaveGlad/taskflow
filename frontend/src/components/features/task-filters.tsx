/**
 * @fileoverview Task Filters Component
 * @module components/features/task-filters
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { TaskFilters as Filters, TaskStatus, TaskPriority } from '@/types';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/types';

interface TaskFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  const statusLabels: Record<TaskStatus, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    completed: 'Completed',
  };

  const priorityLabels: Record<TaskPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };

  const handleStatusChange = (value: string) => {
    const newFilters = { ...filters };
    if (value === 'all') {
      delete newFilters.status;
    } else {
      newFilters.status = value as TaskStatus;
    }
    onFiltersChange(newFilters);
  };

  const handlePriorityChange = (value: string) => {
    const newFilters = { ...filters };
    if (value === 'all') {
      delete newFilters.priority;
    } else {
      newFilters.priority = value as TaskPriority;
    }
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.status || filters.priority;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Status:</span>
        <Select value={filters.status ?? 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {TASK_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {statusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Priority:</span>
        <Select value={filters.priority ?? 'all'} onValueChange={handlePriorityChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {TASK_PRIORITIES.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priorityLabels[priority]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
