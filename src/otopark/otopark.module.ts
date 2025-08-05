import { Module } from '@nestjs/common';
import { OtoparkService } from './otopark.service';
import { OtoparkController } from './otopark.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otopark } from './entities/otopark.entity';
import { AvailableSpace } from './entities/avaliable-space.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Otopark,AvailableSpace])],  
  controllers: [OtoparkController],
  providers: [OtoparkService],
})
export class OtoparkModule {}
