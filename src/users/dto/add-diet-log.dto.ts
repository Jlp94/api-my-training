import { IsNumber, IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UserMacrosDto {
  @IsNumber()
  targetKcal: number;

  @IsNumber()
  pCarbs: number;

  @IsNumber()
  pProtein: number;

  @IsNumber()
  pFat: number;
}

export class AddDietLogDto {
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
