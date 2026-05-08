import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateAdminDto {
  @IsEmail({}, { message: 'El email no es válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName: string;

  @IsString()
  @IsOptional()
  role?: string;
}
