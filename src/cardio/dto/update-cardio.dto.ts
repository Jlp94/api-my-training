import { PartialType } from '@nestjs/mapped-types';
import { CreateCardioDto } from './create-cardio.dto';

export class UpdateCardioDto extends PartialType(CreateCardioDto) {}
