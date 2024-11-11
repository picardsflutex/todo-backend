import { Status } from "@prisma/client";

export class CreateProjectDto {
  title: string;
  description: string;
  status?: Status;
}

export class UpdateProjectDto {
  title?: string;
  description?: string;
  status?: Status;
}
