import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { type Application } from 'express';
import { createApp } from '../../../app';

let app: Application;

beforeAll(() => {
  app = createApp();
});

describe('Tasks API Integration', () => {
  describe('POST /api/tasks', () => {
    it('should create a task and return 201', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Integration test task', description: 'A test task', priority: 'high' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Integration test task');
      expect(res.body.data.description).toBe('A test task');
      expect(res.body.data.priority).toBe('high');
      expect(res.body.data.status).toBe('todo');
      expect(res.body.data.id).toBeDefined();
    });

    it('should return 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks', () => {
    it('should return a list of tasks', async () => {
      await request(app).post('/api/tasks').send({ title: 'Task 1' });
      await request(app).post('/api/tasks').send({ title: 'Task 2' });

      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a task by ID', async () => {
      const created = await request(app)
        .post('/api/tasks')
        .send({ title: 'Find me' });

      const res = await request(app).get(`/api/tasks/${created.body.data.id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Find me');
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/tasks/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task and return 204', async () => {
      const created = await request(app)
        .post('/api/tasks')
        .send({ title: 'Delete me' });

      const deleteRes = await request(app).delete(`/api/tasks/${created.body.data.id}`);
      expect(deleteRes.status).toBe(204);

      const getRes = await request(app).get(`/api/tasks/${created.body.data.id}`);
      expect(getRes.status).toBe(404);
    });
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.timestamp).toBeDefined();
    });
  });
});
