import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, profile } = createUserDto;

    const exists = await this.userModel.findOne({ email });
    if (exists) {
      throw new ConflictException('Ese correo ya está registrado, busca otro.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userToSave: Partial<User> = {
      email,
      password: hashedPassword,
      role: 'user',
      profile: {
        name: profile.name,
        lastName: profile.lastName,
        height: profile.height || 0,
        weight: profile.weight,
        notifications: profile.notifications ?? true,
        cardioKcalGoal: profile.cardioKcalGoal ?? 0,
        currentDietId: profile.currentDietId,
        currentRoutineId: profile.currentRoutineId,
        neatLogs: [],
        workoutLogs: [],
      },
    };

    const newUser = new this.userModel(userToSave);
    const savedUser = await newUser.save();
    return this.userModel.findById(savedUser._id).select('-password').exec();
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<User> {
    const { email, password, name, lastName } = createAdminDto;

    const exists = await this.userModel.findOne({ email });
    if (exists) {
      throw new ConflictException('Ese correo ya está registrado, busca otro.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const adminToSave: Partial<User> = {
      email,
      password: hashedPassword,
      role: 'admin',
      profile: {
        name,
        lastName,
        notifications: true,
        neatLogs: [],
        workoutLogs: [],
      },
    };

    const newAdmin = new this.userModel(adminToSave);
    const savedAdmin = await newAdmin.save();
    return this.userModel.findById(savedAdmin._id).select('-password').exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User #${id} not found`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const {
      email,
      password,
      name,
      lastName,
      height,
      weight,
      role,
      dietLogs,
      currentDietId,
      currentRoutineId,
      favoriteFoods,
      notifications,
      isActive,
      avatarUrl,
      cardioKcalGoal,
    } = updateUserDto;

    const updateData: any = {};

    if (email) updateData.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (name) updateData['profile.name'] = name;
    if (lastName) updateData['profile.lastName'] = lastName;
    if (height !== undefined) updateData['profile.height'] = height;
    if (weight !== undefined) updateData['profile.weight'] = weight;
    if (dietLogs) updateData['profile.dietLogs'] = dietLogs;
    if (currentDietId) updateData['profile.currentDietId'] = currentDietId;
    if (currentRoutineId)
      updateData['profile.currentRoutineId'] = currentRoutineId;
    if (favoriteFoods) updateData['profile.favoriteFoods'] = favoriteFoods;
    if (notifications !== undefined)
      updateData['profile.notifications'] = notifications;
    if (avatarUrl) updateData['profile.avatarUrl'] = avatarUrl;
    if (cardioKcalGoal !== undefined)
      updateData['profile.cardioKcalGoal'] = cardioKcalGoal;

    const finalUpdate: any = { $set: updateData };

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, finalUpdate, { returnDocument: 'after' })
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return updatedUser;
  }

  async addDietLog(id: string, log: any): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { $push: { 'profile.dietLogs': log } },
        { returnDocument: 'after' },
      )
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return updatedUser;
  }

  async addNeatLog(id: string, log: any): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { $push: { 'profile.neatLogs': log } },
        { returnDocument: 'after' },
      )
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return updatedUser;
  }

  async updateMacros(id: string, macros: any): Promise<User> {
    const today = new Date().toISOString().split('T')[0];

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: { 'profile.macros': macros },
          $push: {
            'profile.dietLogs': {
              startDate: today,
              macros: macros,
              notes: 'Actualización de macros',
            },
          },
        },
        { returnDocument: 'after' },
      )
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return updatedUser;
  }

  async updateNeatLog(id: string, date: string, logData: any): Promise<User> {
    const user = await this.userModel.findOne({
      _id: id,
      'profile.neatLogs.date': date,
    });

    if (user) {
      const updatedUser = await this.userModel
        .findOneAndUpdate(
          { _id: id, 'profile.neatLogs.date': date },
          {
            $set: {
              'profile.neatLogs.$.weight': logData.weight,
              'profile.neatLogs.$.steps': logData.steps,
            },
          },
          { returnDocument: 'after' },
        )
        .select('-password')
        .exec();
      return updatedUser;
    } else {
      throw new NotFoundException(
        `NeatLog for date ${date} not found for user #${id}`,
      );
    }
  }

  async addWorkoutLog(id: string, log: any): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { $push: { 'profile.workoutLogs': log } },
        { returnDocument: 'after' },
      )
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return updatedUser;
  }

  async getNeatLogByDate(userId: string, date: string): Promise<any> {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .exec();
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    const neatLog = user.profile.neatLogs.find((log) => log.date === date);
    if (!neatLog) {
      throw new NotFoundException(`NeatLog del ${date} no encontrado`);
    }
    return neatLog;
  }

  async getWorkoutLogByDate(userId: string, date: string): Promise<any> {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .exec();
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    const workoutLog = user.profile.workoutLogs.find(
      (log) => log.doneAt === date,
    );
    if (!workoutLog) {
      throw new NotFoundException(`WorkoutLog del ${date} no encontrado`);
    }
    return workoutLog;
  }

  async updateWorkoutLog(
    id: string,
    date: string,
    logData: any,
  ): Promise<User> {
    const user = await this.userModel.findOne({
      _id: id,
      'profile.workoutLogs.doneAt': date,
    });

    if (!user) {
      throw new NotFoundException(
        `WorkoutLog del ${date} no encontrado para el usuario #${id}`,
      );
    }

    const setFields: any = {};
    if (logData.routineId)
      setFields['profile.workoutLogs.$.routineId'] = logData.routineId;
    if (logData.notes !== undefined)
      setFields['profile.workoutLogs.$.notes'] = logData.notes;
    if (logData.exerciseLogs)
      setFields['profile.workoutLogs.$.exerciseLogs'] = logData.exerciseLogs;

    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { _id: id, 'profile.workoutLogs.doneAt': date },
        { $set: setFields },
        { returnDocument: 'after' },
      )
      .select('-password')
      .exec();

    return updatedUser;
  }

  async getExerciseProgression(
    userId: string,
    exerciseId: string,
  ): Promise<any[]> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    const progression = [];

    user.profile.workoutLogs.forEach((workout) => {
      const exerciseLog = workout.exerciseLogs.find(
        (ex) => ex.exerciseId === exerciseId,
      );

      if (exerciseLog && exerciseLog.sets.length > 0) {
        progression.push({
          date: workout.doneAt,
          stats: exerciseLog.sets[0],
        });
      }
    });

    return progression;
  }
}
