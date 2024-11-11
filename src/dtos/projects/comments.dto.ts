export class CreateCommentDto {
  description: string;
  taskId: number;
}

export class UpdateCommentDto {
  description?: string;
}