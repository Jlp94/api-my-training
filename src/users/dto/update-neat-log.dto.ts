import { PartialType } from '@nestjs/mapped-types';
import { AddNeatLogDto } from './add-neat-log.dto';

export class UpdateNeatLogDto extends PartialType(AddNeatLogDto) {}
