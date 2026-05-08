import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsEnum,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DayOfWeek, ExecutionMode } from '../routines.schema';

class TempoDto {
  @IsNumber()
  eccentric: number;

  @IsNumber()
  isometric: number;

  @IsNumber()
  concentric: number;
}

class ExerciseSetDto {
  @IsNumber()
  kg: number;

  @IsNumber()
  reps: number;

  @IsNumber()
  rir: number;
}

class RoutineExerciseDto {
  @IsString()
  @IsNotEmpty()
  exerciseId: string;

  @IsNumber()
  rest: number;

  @IsEnum(ExecutionMode)
  @IsOptional()
  executionType?: ExecutionMode;

  @IsString()
  @IsOptional()
  observations?: string;

  @IsNumber()
  @IsOptional()
  restPauseSeconds?: number;

  @IsString()
  @IsOptional()
  idExSuperSet?: string;

  @ValidateNested()
  @Type(() => TempoDto)
  @IsOptional()
  tempo?: TempoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseSetDto)
  @ArrayMinSize(1)
  sets: ExerciseSetDto[];
}

class RoutineSessionDto {
  @IsString()
  @IsNotEmpty()
  routineType: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsEnum(DayOfWeek)
  @IsNotEmpty()
  routineDayOfWeek: DayOfWeek;

  @IsString()
  @IsOptional()
  observations?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoutineExerciseDto)
  @ArrayMinSize(1)
  exercises: RoutineExerciseDto[];
}

export class CreateRoutineDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  userIds?: string[];

  @IsString()
  @IsNotEmpty({ message: 'El nombre de la rutina es obligatorio' })
  name: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoutineSessionDto)
  @ArrayMinSize(1, { message: 'La rutina debe tener al menos una sesión' })
  sessions: RoutineSessionDto[];
}
