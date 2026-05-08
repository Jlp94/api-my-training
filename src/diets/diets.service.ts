import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDietDto } from './dto/create-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';
import { Diet, DietDocument } from './diets.schema';
import { Food, FoodDocument } from '../foods/foods.schema';
import { User, UserDocument } from '../users/users.schema';

@Injectable()
export class DietsService {
  constructor(
    @InjectModel(Diet.name) private dietModel: Model<DietDocument>,
    @InjectModel(Food.name) private foodModel: Model<FoodDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private async calculateTotals(meals: any[], extraKcal = 0) {
    const allFoodIds = meals.flatMap((meal) =>
      meal.foods.map((f: any) => f.foodId),
    );
    const uniqueFoodIds = [...new Set(allFoodIds)];
    const foods = await this.foodModel
      .find({ _id: { $in: uniqueFoodIds } })
      .exec();
    const foodMap = new Map(foods.map((f) => [f._id.toString(), f]));

    let totalKcal = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    for (const meal of meals) {
      for (const mealFood of meal.foods) {
        const food = foodMap.get(mealFood.foodId);
        if (!food) continue;
        const factor = mealFood.quantity / 100;
        totalKcal += food.kcal * factor;
        totalProtein += food.protein * factor;
        totalCarbs += food.carbs * factor;
        totalFat += food.fat * factor;
      }
    }

    return {
      totalKcal: Math.round(totalKcal + extraKcal),
      totalMacros: {
        protein: Math.round(totalProtein),
        carbs: Math.round(totalCarbs),
        fat: Math.round(totalFat),
      },
    };
  }

  async create(createDietDto: CreateDietDto): Promise<Diet> {
    const totals = await this.calculateTotals(
      createDietDto.meals,
      createDietDto.extraKcal,
    );
    const dietToSave = { ...createDietDto, ...totals };

    const createdDiet = new this.dietModel(dietToSave);
    const savedDiet = await createdDiet.save();

    await this.syncUserDiet(createDietDto.userId, savedDiet);

    return savedDiet;
  }

  async findAll(userId?: string): Promise<Diet[]> {
    const filter = userId ? { userId } : {};
    return this.dietModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Diet> {
    const diet = await this.dietModel.findById(id).exec();
    if (!diet) {
      throw new NotFoundException(`Dieta con ID ${id} no encontrada`);
    }
    return diet;
  }

  async update(id: string, updateDietDto: UpdateDietDto): Promise<Diet> {
    let totals = {};
    if (updateDietDto.meals) {
      totals = await this.calculateTotals(
        updateDietDto.meals,
        updateDietDto.extraKcal,
      );
    }

    const updatedDiet = await this.dietModel
      .findByIdAndUpdate(
        id,
        { ...updateDietDto, ...totals },
        { returnDocument: 'after' },
      )
      .exec();

    if (!updatedDiet) {
      throw new NotFoundException(`Dieta con ID ${id} no encontrada`);
    }

    if (updatedDiet.isActive) {
      await this.syncUserDiet(updatedDiet.userId, updatedDiet);
    }

    return updatedDiet;
  }

  async delete(id: string): Promise<Diet> {
    const deletedDiet = await this.dietModel.findByIdAndDelete(id).exec();
    if (!deletedDiet) {
      throw new NotFoundException(`Dieta con ID ${id} no encontrada`);
    }

    await this.userModel
      .updateOne(
        { _id: deletedDiet.userId, 'profile.currentDietId': id },
        { $unset: { 'profile.currentDietId': '' } },
      )
      .exec();

    return deletedDiet;
  }

  private async syncUserDiet(userId: string, diet: DietDocument) {
    const today = new Date().toISOString().split('T')[0];
    await this.userModel.findByIdAndUpdate(userId, {
      $set: {
        'profile.macros': {
          targetKcal: diet.totalKcal,
          protein: diet.totalMacros.protein,
          carbs: diet.totalMacros.carbs,
          fat: diet.totalMacros.fat,
        },
        'profile.currentDietId': diet._id.toString(),
      },
      $push: {
        'profile.dietLogs': {
          startDate: today,
          macros: {
            targetKcal: diet.totalKcal,
            protein: diet.totalMacros.protein,
            carbs: diet.totalMacros.carbs,
            fat: diet.totalMacros.fat,
          },
          notes: `Dieta asignada/actualizada: ${diet.name}`,
        },
      },
    });
  }
}
