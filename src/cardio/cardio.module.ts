import { Module } from '@nestjs/common';
import { CardioService } from './cardio.service';
import { CardioController } from './cardio.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cardio, CardioSchema } from './cardio.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Cardio.name,
        schema: CardioSchema,
      },
    ]),
  ],
  controllers: [CardioController],
  providers: [CardioService],
})
export class CardioModule {}
