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
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  @Roles('admin')
  @ResponseMessage('Alimento creado correctamente')
  create(@Body() createFoodDto: CreateFoodDto) {
    return this.foodsService.create(createFoodDto);
  }

  @Get()
  @ResponseMessage('Lista de alimentos')
  findAll(@Query('name') name?: string) {
    return this.foodsService.findAll(name);
  }

  @Get(':id')
  @ResponseMessage('Detalle del alimento')
  findOne(@Param('id') id: string) {
    return this.foodsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ResponseMessage('Alimento actualizado correctamente')
  update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    return this.foodsService.update(id, updateFoodDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ResponseMessage('Alimento eliminado correctamente')
  delete(@Param('id') id: string) {
    return this.foodsService.delete(id);
  }
}
