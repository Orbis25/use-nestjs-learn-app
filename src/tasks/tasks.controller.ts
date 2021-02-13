import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './entities/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  async getAllTask(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    return await this.taskService.getAllTasks(filterDto);
  }

  @Post()
  async createTask(
    @GetUser() user: User,
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    createTaskDto.userId = user.id;
    return await this.taskService.createTask(createTaskDto);
  }

  @Get('/:id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return await this.taskService.getTaskById(id);
  }

  @Delete('/:id')
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.taskService.removeTask(id);
  }

  @Put('/:id/status')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return await this.taskService.updateTaskStatus(id, status);
  }
}
