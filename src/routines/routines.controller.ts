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
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post()
  @Roles('admin')
  @ResponseMessage('Rutina creada correctamente')
  create(@Body() createRoutineDto: CreateRoutineDto) {
    return this.routinesService.create(createRoutineDto);
  }

  @Get()
  @ResponseMessage('Lista de rutinas')
  findAll(@Query('userId') userId?: string) {
    return this.routinesService.findAll(userId);
  }

  @Get(':id')
  @ResponseMessage('Detalle de la rutina')
  findOne(@Param('id') id: string) {
    return this.routinesService.findOne(id);
  }

  @Get(':id/sessions/:day')
  @ResponseMessage('Sesión del día')
  findSession(@Param('id') id: string, @Param('day') day: string) {
    return this.routinesService.findSession(id, +day);
  }

  @Patch(':id/sessions/:day')
  @Roles('admin')
  @ResponseMessage('Sesión actualizada correctamente')
  updateSession(
    @Param('id') id: string,
    @Param('day') day: string,
    @Body() sessionData: any,
  ) {
    return this.routinesService.updateSession(id, +day, sessionData);
  }

  @Post(':id/sessions/:day/exercises')
  @Roles('admin')
  @ResponseMessage('Ejercicio añadido a la sesión')
  addExercise(
    @Param('id') id: string,
    @Param('day') day: string,
    @Body() exerciseData: any,
  ) {
    return this.routinesService.addExercise(id, +day, exerciseData);
  }

  @Delete(':id/sessions/:day/exercises/:exerciseId')
  @Roles('admin')
  @ResponseMessage('Ejercicio eliminado de la sesión')
  removeExercise(
    @Param('id') id: string,
    @Param('day') day: string,
    @Param('exerciseId') exerciseId: string,
  ) {
    return this.routinesService.removeExercise(id, +day, exerciseId);
  }

  @Patch(':id')
  @Roles('admin')
  @ResponseMessage('Rutina actualizada correctamente')
  update(@Param('id') id: string, @Body() updateRoutineDto: UpdateRoutineDto) {
    return this.routinesService.update(id, updateRoutineDto);
  }

  @Get(':id/users')
  @ResponseMessage('Usuarios asignados a la rutina')
  findUsersByRoutine(@Param('id') id: string) {
    return this.routinesService.findUsersByRoutine(id);
  }

  @Delete(':id')
  @Roles('admin')
  @ResponseMessage('Rutina eliminada correctamente')
  delete(@Param('id') id: string) {
    return this.routinesService.delete(id);
  }
}
