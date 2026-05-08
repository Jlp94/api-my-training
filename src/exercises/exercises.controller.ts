import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  @Roles('admin')
  @ResponseMessage('Ejercicio creado correctamente')
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exercisesService.create(createExerciseDto);
  }

  @Get()
  @ResponseMessage('Lista de ejercicios')
  findAll(@Query('name') name?: string, @Query('category') category?: string) {
    return this.exercisesService.findAll(name, category);
  }

  @Get(':id')
  @ResponseMessage('Detalle del ejercicio')
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ResponseMessage('Ejercicio actualizado correctamente')
  update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exercisesService.update(id, updateExerciseDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ResponseMessage('Ejercicio eliminado correctamente')
  delete(@Param('id') id: string) {
    return this.exercisesService.delete(id);
  }
}
