import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class SetDto {
  @IsNumber()
  kg: number;

  @IsNumber()
  reps: number;

  @IsNumber()
  rir: number;
}

class ExerciseLogDto {
  @IsString()
  exerciseId: string;

  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  target: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SetDto)
  sets: SetDto[];
}

export class AddWorkoutLogDto {
  @IsString()
  doneAt: string;

  @IsString()
  routineId: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseLogDto)
  exerciseLogs: ExerciseLogDto[];
}
