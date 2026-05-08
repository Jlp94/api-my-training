import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Delete,
  Param,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddDietLogDto } from './dto/add-diet-log.dto';
import { AddNeatLogDto } from './dto/add-neat-log.dto';
import { UpdateUserMacrosDto } from './dto/update-user-macros.dto';
import { UpdateNeatLogDto } from './dto/update-neat-log.dto';
import { AddWorkoutLogDto } from './dto/add-workout-log.dto';
import { User } from './users.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OwnerGuard } from '../auth/guards/owner.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Usuario creado correctamente')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin')
  @ResponseMessage('Administrador creado correctamente')
  async createAdmin(@Body() createAdminDto: CreateAdminDto): Promise<User> {
    return this.usersService.createAdmin(createAdminDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ResponseMessage('Lista de usuarios')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ResponseMessage('Perfil del usuario')
  async getMyProfile(@Request() req: any): Promise<User> {
    return this.usersService.findOne(req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ResponseMessage('Usuario encontrado')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ResponseMessage('Usuario eliminado correctamente')
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Patch(':id')
  @ResponseMessage('Usuario actualizado correctamente')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    if (req.user?.role !== 'admin') {
      const allowedFields = [
        'email',
        'password',
        'favoriteFoods',
        'notifications',
        'avatarUrl',
      ];
      Object.keys(updateUserDto).forEach((key) => {
        if (!allowedFields.includes(key)) {
          delete (updateUserDto as any)[key];
        }
      });
    }

    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Patch(':id/macros')
  @ResponseMessage('Macros actualizados correctamente')
  async updateMacros(
    @Param('id') id: string,
    @Body() updateUserMacrosDto: UpdateUserMacrosDto,
  ) {
    return this.usersService.updateMacros(id, updateUserMacrosDto);
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Post(':id/diet-logs')
  @ResponseMessage('Log de dieta añadido correctamente')
  async addDietLog(
    @Param('id') id: string,
    @Body() addDietLogDto: AddDietLogDto,
  ): Promise<User> {
    return this.usersService.addDietLog(id, addDietLogDto);
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Post(':id/neat-logs')
  @ResponseMessage('Log NEAT añadido correctamente')
  async addNeatLog(
    @Param('id') id: string,
    @Body() addNeatLogDto: AddNeatLogDto,
  ): Promise<User> {
    return this.usersService.addNeatLog(id, addNeatLogDto);
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Patch(':id/neat-logs/:date')
  @ResponseMessage('Log NEAT actualizado correctamente')
  async updateNeatLog(
    @Param('id') id: string,
    @Param('date') date: string,
    @Body() updateNeatLogDto: UpdateNeatLogDto,
  ) {
    return this.usersService.updateNeatLog(id, date, updateNeatLogDto);
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Post(':id/workout-logs')
  @ResponseMessage('Log de entrenamiento añadido correctamente')
  async addWorkoutLog(
    @Param('id') id: string,
    @Body() addWorkoutLogDto: AddWorkoutLogDto,
  ) {
    return this.usersService.addWorkoutLog(id, addWorkoutLogDto);
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Get(':id/neat-logs/:date')
  @ResponseMessage('Log NEAT obtenido correctamente')
  async getNeatLogByDate(@Param('id') id: string, @Param('date') date: string) {
    return this.usersService.getNeatLogByDate(id, date);
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Get(':id/workout-logs/:date')
  @ResponseMessage('Log de entrenamiento obtenido correctamente')
  async getWorkoutLogByDate(
    @Param('id') id: string,
    @Param('date') date: string,
  ) {
    return this.usersService.getWorkoutLogByDate(id, date);
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Patch(':id/workout-logs/:date')
  @ResponseMessage('Log de entrenamiento actualizado correctamente')
  async updateWorkoutLog(
    @Param('id') id: string,
    @Param('date') date: string,
    @Body() updateWorkoutLogDto: AddWorkoutLogDto,
  ) {
    return this.usersService.updateWorkoutLog(id, date, updateWorkoutLogDto);
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Get(':id/exercise-log/:exerciseId')
  @ResponseMessage('Historial de progresión del ejercicio')
  async getExerciseProgression(
    @Param('id') id: string,
    @Param('exerciseId') exerciseId: string,
  ) {
    return this.usersService.getExerciseProgression(id, exerciseId);
  }
}
