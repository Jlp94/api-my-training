import { Module } from '@nestjs/common';
import { DietsService } from './diets.service';
import { DietsController } from './diets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Diet, DietSchema } from './diets.schema';
import { Food, FoodSchema } from '../foods/foods.schema';
import { User, UserSchema } from '../users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Diet.name, schema: DietSchema },
      { name: Food.name, schema: FoodSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [DietsController],
  providers: [DietsService],
})
export class DietsModule {}
