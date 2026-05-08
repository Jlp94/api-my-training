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
import { DietsService } from './diets.service';
import { CreateDietDto } from './dto/create-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('diets')
export class DietsController {
  constructor(private readonly dietsService: DietsService) {}

  @Post()
  @Roles('admin')
  @ResponseMessage('Dieta creada correctamente')
  create(@Body() createDietDto: CreateDietDto) {
    return this.dietsService.create(createDietDto);
  }

  @Get()
  @ResponseMessage('Lista de dietas')
  findAll(@Query('userId') userId?: string) {
    return this.dietsService.findAll(userId);
  }

  @Get(':id')
  @ResponseMessage('Detalle de la dieta')
  findOne(@Param('id') id: string) {
    return this.dietsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ResponseMessage('Dieta actualizada correctamente')
  update(@Param('id') id: string, @Body() updateDietDto: UpdateDietDto) {
    return this.dietsService.update(id, updateDietDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ResponseMessage('Dieta eliminada correctamente')
  delete(@Param('id') id: string) {
    return this.dietsService.delete(id);
  }
}
