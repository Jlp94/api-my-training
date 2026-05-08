import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCardioDto } from './dto/create-cardio.dto';
import { UpdateCardioDto } from './dto/update-cardio.dto';
import { Cardio, CardioDocument } from './cardio.schema';

@Injectable()
export class CardioService {
  constructor(
    @InjectModel(Cardio.name)
    private cardioModel: Model<CardioDocument>,
  ) {}

  async create(createCardioDto: CreateCardioDto): Promise<Cardio> {
    const createdCardio = new this.cardioModel(createCardioDto);
    return createdCardio.save();
  }

  async findAll(): Promise<Cardio[]> {
    return this.cardioModel.find().exec();
  }

  async findOne(id: string): Promise<Cardio> {
    const cardio = await this.cardioModel.findById(id).exec();
    if (!cardio) {
      throw new NotFoundException(`Cardio with ID ${id} not found`);
    }
    return cardio;
  }

  async update(
    id: string,
    updateCardioDto: UpdateCardioDto,
  ): Promise<Cardio> {
    const updatedCardio = await this.cardioModel
      .findByIdAndUpdate(id, updateCardioDto, { returnDocument: 'after' })
      .exec();
    if (!updatedCardio) {
      throw new NotFoundException(`Cardio with ID ${id} not found`);
    }
    return updatedCardio;
  }

  async delete(id: string): Promise<Cardio> {
    const deletedCardio = await this.cardioModel.findByIdAndDelete(id).exec();
    if (!deletedCardio) {
      throw new NotFoundException(`Cardio with ID ${id} not found`);
    }
    return deletedCardio;
  }
}
