import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserMacrosDto {
  @IsNumber()
  targetKcal: number;

  @IsNumber()
  protein: number;

  @IsNumber()
  carbs: number;

  @IsNumber()
  fat: number;
}

export class DietLogDto {
  @IsString()
  startDate: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserMacrosDto)
  macros?: UserMacrosDto;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateUserDto extends PartialType(CreateAdminDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DietLogDto)
  dietLogs?: DietLogDto[];

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  currentDietId?: string;

  @IsOptional()
  @IsString()
  currentRoutineId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favoriteFoods?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => UserMacrosDto)
  macros?: UserMacrosDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  notifications?: boolean;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsNumber()
  cardioKcalGoal?: number;
}
