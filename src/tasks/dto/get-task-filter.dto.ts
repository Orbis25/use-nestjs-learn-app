import { TaskStatus } from '../task-status.enum';

export class GetTasksFilterDto {
  status: TaskStatus;
  search: string;
  qyt:number;
  page:number
}
