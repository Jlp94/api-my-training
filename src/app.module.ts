import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ExercisesModule } from './exercises/exercises.module';
import { FoodsModule } from './foods/foods.module';
import { CardioModule } from './cardio/cardio.module';
import { DietsModule } from './diets/diets.module';
import { RoutinesModule } from './routines/routines.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    UsersModule,
    AuthModule,
    ExercisesModule,
    FoodsModule,
    CardioModule,
    DietsModule,
    RoutinesModule,
  ],
})
export class AppModule {}
