import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsUrl,
  ArrayNotEmpty,
} from 'class-validator';
import { EquipmentType, MuscleGroup, MovementType } from '../exercises.schema';

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Debe haber al menos un tipo de movimiento' })
  @IsEnum(MovementType, { each: true, message: 'Tipo de movimiento no válido' })
  movementTypes: MovementType[];

  @IsArray()
  @ArrayNotEmpty({ message: 'Debe haber al menos un grupo muscular' })
  @IsEnum(MuscleGroup, { each: true, message: 'Grupo muscular no válido' })
  categories: MuscleGroup[];

  @IsEnum(EquipmentType, { message: 'Equipamiento no válido' })
  equipment: EquipmentType;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  description: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsUrl({}, { message: 'La URL del video no es válida' })
  videoUrl: string;
}
