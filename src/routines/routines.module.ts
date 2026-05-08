import { Module } from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { RoutinesController } from './routines.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Routine, RoutineSchema } from './routines.schema';
import { User, UserSchema } from '../users/users.schema';
import { Exercise, ExerciseSchema } from '../exercises/exercises.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Routine.name, schema: RoutineSchema },
      { name: User.name, schema: UserSchema },
      { name: Exercise.name, schema: ExerciseSchema },
    ]),
  ],
  controllers: [RoutinesController],
  providers: [RoutinesService],
})
export class RoutinesModule {}
