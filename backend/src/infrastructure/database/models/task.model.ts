/**
 * @fileoverview Task Mongoose Model
 * @module infrastructure/database/models/task
 */

import mongoose, { Schema, Document } from 'mongoose';
import { TASK_STATUSES, TASK_PRIORITIES } from '../../../domain';

export interface ITaskDocument extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITaskDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title must not exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description must not exceed 2000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: { values: TASK_STATUSES, message: 'Invalid status value' },
      default: 'todo',
    },
    priority: {
      type: String,
      enum: { values: TASK_PRIORITIES, message: 'Invalid priority value' },
      default: 'medium',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ createdAt: -1 });

export const TaskModel = mongoose.model<ITaskDocument>('Task', taskSchema);
