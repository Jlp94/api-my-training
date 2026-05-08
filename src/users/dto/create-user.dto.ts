import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsNumber,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class MacrosCreateDto {
  @IsNumber()
  targetKcal: number;

  @IsNumber()
  protein: number;

  @IsNumber()
  carbs: number;

  @IsNumber()
  fat: number;
}

class ProfileCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName: string;

  @IsNumber({}, { message: 'La altura debe ser un número' })
  @IsOptional()
  height?: number;

  @IsNumber({}, { message: 'El peso debe ser un número' })
  @IsOptional()
  weight?: number;

  @IsBoolean()
  @IsOptional()
  notifications?: boolean;

  @IsNumber({}, { message: 'El objetivo de kcal de cardio debe ser un número' })
  @IsOptional()
  cardioKcalGoal?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => MacrosCreateDto)
  macros?: MacrosCreateDto;

  @IsString()
  @IsOptional()
  currentDietId?: string;

  @IsString()
  @IsOptional()
  currentRoutineId?: string;
}

export class CreateUserDto {
  @IsEmail({}, { message: 'El email no es válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ValidateNested()
  @Type(() => ProfileCreateDto)
  @IsNotEmpty({ message: 'El perfil es obligatorio' })
  profile: ProfileCreateDto;
}
