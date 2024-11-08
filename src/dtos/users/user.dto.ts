import { Role } from "@prisma/client";
import { IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  username?: string;

  @IsString()
  @IsNotEmpty({ message: "Password is required." })
  @MinLength(8, { message: "Password must be at least 8 characters long." })
  @MaxLength(32, { message: "Password cannot exceed 32 characters." })
  password: string;

  @IsString()
  @IsNotEmpty({ message: "Email is required." })
  @IsEmail({}, { message: "Email must be a valid email address." })
  email: string;
}