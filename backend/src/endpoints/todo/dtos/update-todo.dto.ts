import {
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsDateString,
} from 'class-validator';
export class UpdateTodoDTO {
  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(255)
  title: string;
  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(255)
  description?: string;
  @IsOptional()
  @IsUUID()
  userId: string;
  @IsOptional()
  @IsBoolean()
  done?: boolean;
  @IsOptional()
  @IsDateString()
  dateTill?: string;
}