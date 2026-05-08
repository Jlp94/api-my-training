import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class MealFoodDto {
  @IsString()
  @IsNotEmpty({ message: 'El foodId es obligatorio' })
  foodId: string;

  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  quantity: number;
}

class MealDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la comida es obligatorio' })
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealFoodDto)
  foods: MealFoodDto[];
}

class DietMacrosDto {
  @IsNumber() @IsOptional() protein?: number;
  @IsNumber() @IsOptional() carbs?: number;
  @IsNumber() @IsOptional() fat?: number;
}

export class CreateDietDto {
  @IsString()
  @IsNotEmpty({ message: 'El userId es obligatorio' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre de la dieta es obligatorio' })
  name: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealDto)
  meals: MealDto[];

  @IsNumber()
  @IsOptional()
  extraKcal?: number;

  @IsNumber()
  @IsOptional()
  totalKcal?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => DietMacrosDto)
  totalMacros?: DietMacrosDto;
}
