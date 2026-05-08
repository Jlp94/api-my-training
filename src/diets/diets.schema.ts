import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DietDocument = Diet & Document;

@Schema({ _id: false })
export class MealFood {
  @Prop({ required: true })
  foodId: string;

  @Prop({ required: true })
  quantity: number;
}
export const MealFoodSchema = SchemaFactory.createForClass(MealFood);

@Schema({ _id: false })
export class Meal {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [MealFoodSchema], default: [] })
  foods: MealFood[];
}
export const MealSchema = SchemaFactory.createForClass(Meal);

@Schema({ _id: false })
export class DietMacros {
  @Prop({ default: 0 }) protein: number;
  @Prop({ default: 0 }) carbs: number;
  @Prop({ default: 0 }) fat: number;
}
export const DietMacrosSchema = SchemaFactory.createForClass(DietMacros);

@Schema({ timestamps: true, collection: 'diets' })
export class Diet {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  notes?: string;

  @Prop({ type: [MealSchema], default: [] })
  meals: Meal[];

  @Prop({ default: 300 })
  extraKcal: number;

  @Prop({ default: 0 })
  totalKcal: number;

  @Prop({ type: DietMacrosSchema, default: {} })
  totalMacros: DietMacros;
}

export const DietSchema = SchemaFactory.createForClass(Diet);
