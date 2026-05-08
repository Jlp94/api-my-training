import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ _id: false })
export class UserMacros {
  @Prop() targetKcal: number;
  @Prop() protein: number;
  @Prop() carbs: number;
  @Prop() fat: number;
}
export const UserMacrosSchema = SchemaFactory.createForClass(UserMacros);

@Schema({ _id: false })
export class UserNeat {
  @Prop({ required: true }) date: string;
  @Prop() weight?: number;
  @Prop() steps?: number;
}
export const UserNeatSchema = SchemaFactory.createForClass(UserNeat);

@Schema({ _id: false })
export class DietLog {
  @Prop({ required: true }) startDate: string;
  @Prop({ type: UserMacrosSchema }) macros?: UserMacros;
  @Prop() notes?: string;
}
export const DietLogSchema = SchemaFactory.createForClass(DietLog);

@Schema({ _id: false })
export class ExerciseLog {
  @Prop({ required: true }) exerciseId: string;
  @Prop({ required: true }) name: string;
  @Prop({ type: [String], default: [] }) target: string[];
  @Prop({ type: [{ kg: Number, reps: Number, rir: Number }], default: [] })
  sets: { kg: number; reps: number; rir: number }[];
}
export const ExerciseLogSchema = SchemaFactory.createForClass(ExerciseLog);

@Schema({ _id: false })
export class WorkoutLog {
  @Prop({ required: true }) doneAt: string;
  @Prop({ required: true }) routineId: string;
  @Prop() notes?: string;
  @Prop({ type: [ExerciseLogSchema], default: [] }) exerciseLogs: ExerciseLog[];
}
export const WorkoutLogSchema = SchemaFactory.createForClass(WorkoutLog);

@Schema({ _id: false })
export class UserProfile {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  year?: number;

  @Prop()
  avatarUrl?: string;

  @Prop()
  height?: number;

  @Prop()
  weight?: number;

  @Prop({ default: true })
  notifications: boolean;

  @Prop({ type: UserMacrosSchema })
  macros?: UserMacros;

  @Prop({ type: [UserNeatSchema], default: [] })
  neatLogs: UserNeat[];

  @Prop({ type: String })
  currentRoutineId?: string;

  @Prop({ type: String })
  currentDietId?: string;

  @Prop({ default: 0 })
  cardioKcalGoal?: number;

  @Prop({ type: [{ type: Object }], default: [] })
  dietLogs?: DietLog[];

  @Prop({ type: [String], default: [] })
  favoriteFoods?: string[];

  @Prop({ type: [WorkoutLogSchema], default: [] })
  workoutLogs: WorkoutLog[];
}
export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ type: UserProfileSchema, required: true })
  profile: UserProfile;
}

export const UserSchema = SchemaFactory.createForClass(User);
