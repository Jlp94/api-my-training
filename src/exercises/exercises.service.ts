import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise, ExerciseDocument } from './exercises.schema';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<ExerciseDocument>,
  ) {}

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const createdExercise = new this.exerciseModel(createExerciseDto);
    return createdExercise.save();
  }

  async findAll(name?: string, category?: string): Promise<Exercise[]> {
    const filter: Record<string, unknown> = {};
    if (name) filter['name'] = { $regex: name, $options: 'i' };
    if (category) filter['categories'] = { $regex: category, $options: 'i' };
    return this.exerciseModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Exercise> {
    const exercise = await this.exerciseModel.findById(id).exec();
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    return exercise;
  }

  async update(
    id: string,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    const updatedExercise = await this.exerciseModel
      .findByIdAndUpdate(id, updateExerciseDto, { returnDocument: 'after' })
      .exec();
    if (!updatedExercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    return updatedExercise;
  }

  async delete(id: string): Promise<Exercise> {
    const deletedExercise = await this.exerciseModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedExercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    return deletedExercise;
  }
}
