import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { FoodGroup, NutritionalType } from '../foods.schema';

export class CreateFoodDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsEnum(FoodGroup, { message: 'Grupo de alimentos no válido' })
  category: FoodGroup;

  @IsEnum(NutritionalType, { message: 'Tipo nutricional no válido' })
  nutritionalType: NutritionalType;

  @IsNumber()
  @Min(0)
  carbs: number;

  @IsNumber()
  @Min(0)
  protein: number;

  @IsNumber()
  @Min(0)
  fat: number;

  @IsNumber()
  @Min(0)
  kcal: number;
}
