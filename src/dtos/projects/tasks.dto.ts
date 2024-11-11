import { Status } from "@prisma/client";

export class CreateTaskDto {
  title: string;
  description: string;
  status?: Status;
  projectId?: number;
}

export class UpdateTaskDto {
  title?: string;
  description?: string;
  status?: Status;
}
