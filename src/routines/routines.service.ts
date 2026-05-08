import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { Routine, RoutineDocument } from './routines.schema';
import { User, UserDocument } from '../users/users.schema';
import { Exercise, ExerciseDocument } from '../exercises/exercises.schema';

@Injectable()
export class RoutinesService {
  constructor(
    @InjectModel(Routine.name) private routineModel: Model<RoutineDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Exercise.name) private exerciseModel: Model<ExerciseDocument>,
  ) {}

  async create(createRoutineDto: CreateRoutineDto): Promise<Routine> {
    const createdRoutine = new this.routineModel(createRoutineDto);
    const routine = await createdRoutine.save();

    if (routine.userIds && routine.userIds.length > 0) {
      await this.syncUsersRoutine(routine._id.toString(), routine.userIds);
    }

    return routine;
  }

  async findAll(userId?: string) {
    const filter = userId ? { userIds: userId } : {};
    const routines = await this.routineModel.find(filter).lean().exec();
    return Promise.all(routines.map((r) => this.enrichRoutine(r)));
  }

  async findOne(id: string) {
    const routine = await this.routineModel.findById(id).lean().exec();
    if (!routine) {
      throw new NotFoundException(`Rutina con ID ${id} no encontrada`);
    }
    return this.enrichRoutine(routine);
  }

  private async enrichRoutine(routine: any) {
    const allIds: string[] = (routine.sessions as any[]).flatMap((s: any) =>
      (s.exercises as any[]).map((e: any) => e.exerciseId as string),
    );
    const exerciseIds = [...new Set(allIds)];

    const exercises = await this.exerciseModel
      .find({ _id: { $in: exerciseIds } })
      .select('name categories')
      .lean()
      .exec();

    const exerciseMap = new Map(
      exercises.map((ex: any) => [ex._id.toString(), ex]),
    );

    routine.sessions.forEach((session: any) => {
      session.exercises.forEach((ex: any) => {
        const found = exerciseMap.get(ex.exerciseId);
        if (found) {
          ex.name = found.name;
          ex.categories = found.categories;
          ex.target = found.categories;
        }
      });
    });

    return routine;
  }

  async findSession(routineId: string, day: number) {
    const routine = await this.routineModel.findById(routineId).lean().exec();
    if (!routine) {
      throw new NotFoundException(`Rutina con ID ${routineId} no encontrada`);
    }
    const session = routine.sessions.find(
      (s: any) => s.routineDayOfWeek === day,
    );
    if (!session) {
      throw new NotFoundException(
        `No hay sesión para el día ${day} en esta rutina`,
      );
    }

    const exerciseIds: string[] = session.exercises.map(
      (e: any) => e.exerciseId as string,
    );
    const exercises = await this.exerciseModel
      .find({ _id: { $in: exerciseIds } })
      .select('name categories')
      .lean()
      .exec();
    const exerciseMap = new Map(
      exercises.map((ex: any) => [ex._id.toString(), ex]),
    );
    session.exercises.forEach((ex: any) => {
      const found = exerciseMap.get(ex.exerciseId);
      if (found) {
        ex.name = found.name;
        ex.categories = found.categories;
        ex.target = found.categories;
      }
    });

    return session;
  }

  async updateSession(routineId: string, day: number, sessionData: any) {
    const routine = await this.routineModel.findById(routineId).exec();
    if (!routine) {
      throw new NotFoundException(`Rutina con ID ${routineId} no encontrada`);
    }
    const idx = routine.sessions.findIndex(
      (s: any) => s.routineDayOfWeek === day,
    );
    if (idx === -1) {
      throw new NotFoundException(
        `No hay sesión para el día ${day} en esta rutina`,
      );
    }
    Object.assign(routine.sessions[idx], sessionData);
    return routine.save();
  }

  async addExercise(routineId: string, day: number, exerciseData: any) {
    const result = await this.routineModel
      .findOneAndUpdate(
        { _id: routineId, 'sessions.routineDayOfWeek': day },
        { $push: { 'sessions.$.exercises': exerciseData } },
        { returnDocument: 'after' },
      )
      .exec();
    if (!result) {
      throw new NotFoundException(
        `Rutina ${routineId} o sesión día ${day} no encontrada`,
      );
    }
    return result;
  }

  async removeExercise(routineId: string, day: number, exerciseId: string) {
    const result = await this.routineModel
      .findOneAndUpdate(
        { _id: routineId, 'sessions.routineDayOfWeek': day },
        {
          $pull: {
            'sessions.$.exercises': { exerciseId: exerciseId },
          },
        },
        { returnDocument: 'after' },
      )
      .exec();
    if (!result) {
      throw new NotFoundException(
        `Rutina ${routineId} o sesión día ${day} no encontrada`,
      );
    }
    return result;
  }

  async update(
    id: string,
    updateRoutineDto: UpdateRoutineDto,
  ): Promise<Routine> {
    const updatedRoutine = await this.routineModel
      .findByIdAndUpdate(id, updateRoutineDto, { returnDocument: 'after' })
      .exec();

    if (!updatedRoutine) {
      throw new NotFoundException(`Rutina con ID ${id} no encontrada`);
    }

    await this.syncUsersRoutine(id, updatedRoutine.userIds || []);

    return updatedRoutine;
  }

  async delete(id: string): Promise<Routine> {
    const deletedRoutine = await this.routineModel.findByIdAndDelete(id).exec();
    if (!deletedRoutine) {
      throw new NotFoundException(`Rutina con ID ${id} no encontrada`);
    }

    await this.userModel
      .updateMany(
        { 'profile.currentRoutineId': id },
        { $unset: { 'profile.currentRoutineId': '' } },
      )
      .exec();

    return deletedRoutine;
  }

  async findUsersByRoutine(routineId: string): Promise<User[]> {
    return this.userModel
      .find({ 'profile.currentRoutineId': routineId })
      .select('profile.name profile.lastName email')
      .lean()
      .exec();
  }

  private async syncUsersRoutine(routineId: string, userIds: string[]) {
    await this.userModel
      .updateMany(
        { _id: { $in: userIds } },
        { $set: { 'profile.currentRoutineId': routineId } },
      )
      .exec();

    await this.userModel
      .updateMany(
        {
          _id: { $nin: userIds },
          'profile.currentRoutineId': routineId,
        },
        { $unset: { 'profile.currentRoutineId': '' } },
      )
      .exec();
  }
}
