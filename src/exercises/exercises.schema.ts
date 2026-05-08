import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExerciseDocument = Exercise & Document;

export enum EquipmentType {
  LIBRE = 'libre',
  MANCUERNAS = 'mancuernas',
  BARRA = 'barra',
  POLEA = 'polea',
  MAQUINA = 'máquina',
  MULTIPOWER = 'multipower',
  KETTLEBELL = 'kettlebell',
  DISCO = 'disco',
}

export enum MuscleGroup {
  CORE = 'core',
  PECTORAL = 'pectoral',
  ESPALDA = 'espalda',
  HOMBRO = 'hombro',
  CUADRICEPS = 'cuádriceps',
  FEMORAL = 'femoral',
  GLUTEO = 'glúteo',
  BICEPS = 'bíceps',
  TRICEPS = 'tríceps',
  GEMELO = 'gemelo',
  ANTEBRAZO = 'antebrazo',
}

export enum MovementType {
  PUSH = 'push',
  PULL = 'pull',
  LEG = 'leg',
}

@Schema({ timestamps: true })
export class Exercise {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [String], enum: MovementType, required: true })
  movementTypes: MovementType[];

  @Prop({ type: [String], enum: MuscleGroup, required: true })
  categories: MuscleGroup[];

  @Prop({ type: String, enum: EquipmentType, required: true })
  equipment: EquipmentType;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  videoUrl: string;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
