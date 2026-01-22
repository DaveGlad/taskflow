/**
 * @fileoverview API Service
 * @module services/api
 */

import axios, { AxiosInstance } from 'axios';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskFilters, ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    });
  }

  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);

    const response = await this.client.get<ApiResponse<Task[]>>(`/api/tasks?${params.toString()}`);
    return response.data.data;
  }

  async getTaskById(id: string): Promise<Task> {
    const response = await this.client.get<ApiResponse<Task>>(`/api/tasks/${id}`);
    return response.data.data;
  }

  async createTask(data: CreateTaskInput): Promise<Task> {
    const response = await this.client.post<ApiResponse<Task>>('/api/tasks', data);
    return response.data.data;
  }

  async updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
    const response = await this.client.put<ApiResponse<Task>>(`/api/tasks/${id}`, data);
    return response.data.data;
  }

  async deleteTask(id: string): Promise<void> {
    await this.client.delete(`/api/tasks/${id}`);
  }

  async markTaskAsCompleted(id: string): Promise<Task> {
    const response = await this.client.patch<ApiResponse<Task>>(`/api/tasks/${id}/complete`);
    return response.data.data;
  }

  async markTaskAsInProgress(id: string): Promise<Task> {
    const response = await this.client.patch<ApiResponse<Task>>(`/api/tasks/${id}/start`);
    return response.data.data;
  }
}

export const apiService = new ApiService();
