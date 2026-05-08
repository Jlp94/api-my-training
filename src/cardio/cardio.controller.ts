import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CardioService } from './cardio.service';
import { CreateCardioDto } from './dto/create-cardio.dto';
import { UpdateCardioDto } from './dto/update-cardio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cardio')
export class CardioController {
  constructor(private readonly cardioService: CardioService) {}

  @Post()
  @Roles('admin')
  @ResponseMessage('Cardio creado correctamente')
  create(@Body() createCardioDto: CreateCardioDto) {
    return this.cardioService.create(createCardioDto);
  }

  @Get()
  @ResponseMessage('Lista de cardio')
  findAll() {
    return this.cardioService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Detalle de cardio')
  findOne(@Param('id') id: string) {
    return this.cardioService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ResponseMessage('Cardio actualizado correctamente')
  update(@Param('id') id: string, @Body() updateCardioDto: UpdateCardioDto) {
    return this.cardioService.update(id, updateCardioDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ResponseMessage('Cardio eliminado correctamente')
  delete(@Param('id') id: string) {
    return this.cardioService.delete(id);
  }
}
