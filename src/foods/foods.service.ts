import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Food, FoodDocument } from './foods.schema';

@Injectable()
export class FoodsService {
  constructor(@InjectModel(Food.name) private foodModel: Model<FoodDocument>) {}

  async create(createFoodDto: CreateFoodDto): Promise<Food> {
    const createdFood = new this.foodModel(createFoodDto);
    return createdFood.save();
  }

  async findAll(name?: string): Promise<Food[]> {
    const filter = name ? { name: { $regex: name, $options: 'i' } } : {};
    return this.foodModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Food> {
    const food = await this.foodModel.findById(id).exec();
    if (!food) {
      throw new NotFoundException(`Food with ID ${id} not found`);
    }
    return food;
  }

  async update(id: string, updateFoodDto: UpdateFoodDto): Promise<Food> {
    const updatedFood = await this.foodModel
      .findByIdAndUpdate(id, updateFoodDto, { returnDocument: 'after' })
      .exec();
    if (!updatedFood) {
      throw new NotFoundException(`Food with ID ${id} not found`);
    }
    return updatedFood;
  }

  async delete(id: string): Promise<Food> {
    const deletedFood = await this.foodModel.findByIdAndDelete(id).exec();
    if (!deletedFood) {
      throw new NotFoundException(`Food with ID ${id} not found`);
    }
    return deletedFood;
  }
}
