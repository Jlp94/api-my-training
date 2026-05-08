import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoutineDocument = Routine & Document;

export enum DayOfWeek {
  DOMINGO = 0,
  LUNES = 1,
  MARTES = 2,
  MIERCOLES = 3,
  JUEVES = 4,
  VIERNES = 5,
  SABADO = 6,
}

export enum ExecutionMode {
  NORMAL = 'normal',
  SUPER_SET = 'superset',
  REST_PAUSE = 'restpause',
  DROP_SET = 'dropset',
}

@Schema({ _id: false })
export class Tempo {
  @Prop({ default: 1 }) eccentric: number;
  @Prop({ default: 0 }) isometric: number;
  @Prop({ default: 0 }) concentric: number;
}
export const TempoSchema = SchemaFactory.createForClass(Tempo);

@Schema({ _id: false })
export class ExerciseSet {
  @Prop({ default: 0 }) kg: number;
  @Prop({ default: 0 }) reps: number;
  @Prop({ default: 0 }) rir: number;
}
export const ExerciseSetSchema = SchemaFactory.createForClass(ExerciseSet);

@Schema({ _id: false })
export class RoutineExercise {
  @Prop({ required: true }) exerciseId: string;
  @Prop({ required: true, default: 120 }) rest: number;
  @Prop({ type: String, enum: ExecutionMode, default: ExecutionMode.NORMAL })
  executionType: ExecutionMode;
  @Prop() observations?: string;
  @Prop() restPauseSeconds?: number;
  @Prop() idExSuperSet?: string;
  @Prop({ type: TempoSchema, default: () => ({}) }) tempo: Tempo;
  @Prop({ type: [ExerciseSetSchema], default: [] }) sets: ExerciseSet[];
}
export const RoutineExerciseSchema =
  SchemaFactory.createForClass(RoutineExercise);

@Schema({ _id: false })
export class RoutineSession {
  @Prop({ required: true }) routineType: string;
  @Prop({ required: true }) category: string;
  @Prop({ type: Number, enum: DayOfWeek, required: true })
  routineDayOfWeek: DayOfWeek;
  @Prop() observations?: string;
  @Prop({ type: [RoutineExerciseSchema], default: [] })
  exercises: RoutineExercise[];
}
export const RoutineSessionSchema =
  SchemaFactory.createForClass(RoutineSession);

@Schema({ timestamps: true })
export class Routine {
  @Prop({ type: [String], default: [] })
  userIds: string[];

  @Prop({ required: true })
  name: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [RoutineSessionSchema], default: [] })
  sessions: RoutineSession[];
}

export const RoutineSchema = SchemaFactory.createForClass(Routine);
