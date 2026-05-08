import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FoodDocument = Food & Document;

export enum FoodGroup {
  CARNES = 'carnes',
  PESCADOS = 'pescados',
  LACTEOS = 'lácteos',
  CEREALES = 'cereales',
  LEGUMBRES = 'legumbres',
  FRUTAS = 'frutas',
  VERDURAS = 'verduras',
  ACEITES = 'aceites',
  SUPLEMENTOS = 'suplementos',
  HUEVOS = 'huevos',
  FRUTOS_SECOS = 'frutos secos',
}

export enum NutritionalType {
  PROTEINA_MAGRA = 'proteína magra',
  PROTEINA_GRASA = 'proteína grasa',
  CARB_COMPLEJO = 'carbohidrato complejo',
  CARB_SIMPLE = 'carbohidrato simple',
  GRASA = 'grasa',
  VEGETAL_FIBRA = 'vegetal fibra',
}

@Schema({ timestamps: true })
export class Food {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  brand?: string;

  @Prop({ type: String, enum: FoodGroup, required: true })
  category: FoodGroup;

  @Prop({ type: String, enum: NutritionalType, required: true })
  nutritionalType: NutritionalType;

  @Prop({ required: true })
  carbs: number;

  @Prop({ required: true })
  protein: number;

  @Prop({ required: true })
  fat: number;

  @Prop({ required: true })
  kcal: number;
}

export const FoodSchema = SchemaFactory.createForClass(Food);
