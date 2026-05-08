import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CardioDocument = Cardio & Document;

export enum CardioType {
  CINTA = 'cinta',
  ELIPTICA = 'elíptica',
  BICI = 'bici',
  ESCALERAS = 'escaleras',
  REMO = 'remo',
  TABATA = 'tábata',
  HIIT = 'HIIT',
}

@Schema({ _id: false })
export class CardioInstruction {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  valor: string;
}
export const CardioInstructionSchema =
  SchemaFactory.createForClass(CardioInstruction);

@Schema({ timestamps: true, collection: 'cardio' })
export class Cardio {
  @Prop({ required: true, enum: CardioType })
  type: string;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  kcalMin: number;

  @Prop({ type: [CardioInstructionSchema], default: [] })
  instrucciones: CardioInstruction[];
}

export const CardioSchema = SchemaFactory.createForClass(Cardio);
