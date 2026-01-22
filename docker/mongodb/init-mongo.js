// ===========================================
// MongoDB Initialization Script
// ===========================================
// Creates the application database and user
// Runs automatically on first container start
// ===========================================

// Switch to admin database for authentication
db = db.getSiblingDB('admin');

// Create application database
db = db.getSiblingDB('taskflow');

// Create indexes for tasks collection
db.createCollection('tasks');

db.tasks.createIndex({ status: 1 });
db.tasks.createIndex({ priority: 1 });
db.tasks.createIndex({ createdAt: -1 });
db.tasks.createIndex({ title: 'text', description: 'text' });

// Insert sample data for development
db.tasks.insertMany([
  {
    title: 'Learn Clean Architecture',
    description: 'Study the principles of Clean Architecture and how to apply them in Node.js applications',
    status: 'in_progress',
    priority: 'high',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Setup Docker Environment',
    description: 'Configure Docker Compose for development with hot reload support',
    status: 'completed',
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date()
  },
  {
    title: 'Implement React Frontend',
    description: 'Build the frontend using React, TypeScript, and shadcn/ui components',
    status: 'completed',
    priority: 'medium',
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date()
  },
  {
    title: 'Write Unit Tests',
    description: 'Add comprehensive unit tests for use cases and domain logic',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Add Authentication',
    description: 'Implement JWT-based authentication with refresh tokens',
    status: 'todo',
    priority: 'low',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('✅ Database initialized with sample data');
