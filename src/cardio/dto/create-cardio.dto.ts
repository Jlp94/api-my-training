import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CardioType } from '../cardio.schema';

class CardioInstructionDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  valor: string;
}

export class CreateCardioDto {
  @IsEnum(CardioType, { message: 'Tipo de cardio no válido' })
  type: CardioType;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumber()
  @Min(0)
  kcalMin: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardioInstructionDto)
  instrucciones: CardioInstructionDto[];
}
