import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './repositories/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly TaskRepository: TaskRepository,
  ) {}

  async getAllTasks(filters: GetTasksFilterDto): Promise<Task[]> {
    const result = this.TaskRepository.createQueryBuilder();

    if (filters.status) {
      result.where('status = :status', { status: filters.status });
    }

    if (filters.search) {
      result.where('title like :title', { title: `%${filters.search}%` });
      if ((await result.getCount()) <= 0) {
        result.where('description like :description', {
          description: `%${filters.search}%`,
        });
      }
    }

    const skip = ((filters.page - 1) * filters.qyt) | 0;
    const take = filters.qyt | 1;
    return await result.skip(skip).take(take).getMany();
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      return await this.TaskRepository.createTask(createTaskDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.TaskRepository.findOne(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async removeTask(id: number): Promise<boolean> {
    const task = await this.TaskRepository.delete(id);
    try {
      return task.affected > 0;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    task.save();
    return task;
  }
}
