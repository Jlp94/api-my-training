import { IsNumber, IsOptional } from 'class-validator';

export class UpdateUserMacrosDto {
  @IsNumber()
  targetKcal: number;

  @IsOptional()
  @IsNumber()
  pCarbs?: number;

  @IsOptional()
  @IsNumber()
  pProtein?: number;

  @IsOptional()
  @IsNumber()
  pFat?: number;

  @IsOptional()
  @IsNumber()
  carbs?: number;

  @IsOptional()
  @IsNumber()
  protein?: number;

  @IsOptional()
  @IsNumber()
  fat?: number;
}
