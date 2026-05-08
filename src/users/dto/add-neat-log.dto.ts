import { IsNumber, IsString, IsOptional } from 'class-validator';

export class AddNeatLogDto {
  @IsString()
  date: string;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  steps?: number;
}
