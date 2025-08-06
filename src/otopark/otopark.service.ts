import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOtoparkDto } from './dto/create-otopark.dto';
import { UpdateOtoparkDto } from './dto/update-otopark.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Otopark } from './entities/otopark.entity';
import { AvailableSpace } from './entities/avaliable-space.entity';

//YUKARDAN BAK HEPSİNİN AÇIKLAMASI
@Injectable()
export class OtoparkService {
  constructor(
    @InjectRepository(Otopark)
    private readonly otoparkRepository: Repository<Otopark>, //otopark tablosuyla işlem yapar
    @InjectRepository(AvailableSpace)
    private readonly availableSpaceRepository: Repository<AvailableSpace>,
  ) { }



  async findAll() {
try {
   return await this.otoparkRepository.find();
  }
 catch (error) {
  throw new InternalServerErrorException('Failed to retrieve otoparks');
}
}

   async findOne(id: number) {
try {
const otopark = await this.otoparkRepository.findOne({
where: { id },
});
if (!otopark) {
throw new NotFoundException('Otopark cannot be found.');
}
return otopark;
} catch (error) {
throw error;
}
}


  async deleteAll(): Promise<void> {
try {
const allSpaces = await this.availableSpaceRepository.find();
if (allSpaces.length > 0) {
await this.availableSpaceRepository.remove(allSpaces);
}
const allOtoparklar = await this.otoparkRepository.find();
if (allOtoparklar.length > 0) {
await this.otoparkRepository.remove(allOtoparklar);
}
} catch (error) {
throw new InternalServerErrorException('Failed to delete all otoparks');
}
}

 async remove(id: number) {
try {
const otopark = await this.otoparkRepository.findOne({ where: { id } });
if (!otopark) {
throw new NotFoundException('Otopark cannot be found.');
}
await this.otoparkRepository.delete(id);
return {
message: 'Otopark deleted successfully',
};
} catch (error) {
throw error;
}
}

  async createOtopark(createOtoparkDto: CreateOtoparkDto) {
try {
const newOtopark = this.otoparkRepository.create(); // dto dan otopark entity'sini oluşur
newOtopark.name = createOtoparkDto.name;
newOtopark.location = createOtoparkDto.location;
newOtopark.capacity = createOtoparkDto.capacity;
await this.otoparkRepository.save(newOtopark);
const avaliableSpaceArray: AvailableSpace[] = [];
for (let i = 0; i < createOtoparkDto.availableSpaces; i++) {
const availableSpace = this.availableSpaceRepository.create(); // AvailableSpace entity'sini oluşturun
availableSpace.otopark = newOtopark!; // Otopark'ı ayarla
availableSpace.index = i;
avaliableSpaceArray.push(availableSpace); // AvailableSpace'i diziye ekle
}
await this.availableSpaceRepository.save(avaliableSpaceArray); // Tüm AvailableSpace'leri kaydet
// newOtopark.availableSpaces = createOtoparkDto.availableSpaces;
return newOtopark;
} catch (error) {
throw new InternalServerErrorException('Failed to create otopark');
}
}


  async createSpaces(otoparkId: number, spacenumber: number) {

    try {
      const otopark = await this.otoparkRepository.findOne({ where: { id: otoparkId } });
      if (!otopark) {
         throw new NotFoundException('Otopark cannot be found.');
      }
      const maxValueQuery = await this.availableSpaceRepository.createQueryBuilder('space')
        .where('space.otopark.id = :otoparkId', { otoparkId }).getCount();
        
      for (let i = maxValueQuery; i <= spacenumber; i++) {
        const result = await this.availableSpaceRepository.save({
          otopark: { id: otoparkId },
          isAvailable: true
        })

        console.log('Saved: ', result);
      }
      return { message: `${spacenumber} parking spaces created! ` };

    } catch (error) {
      console.log('Error:', error);
      throw error;
    }
  }


  async assignSpace(otoparkId: number) {
    try {
      console.log('OtoparkId:', otoparkId);
      const otopark = await this.otoparkRepository.findOne({ where: { id: otoparkId } });
      if (!otopark) {
         throw new NotFoundException('Otopark cannot be found.');
      }
      const boşYer = await this.availableSpaceRepository.findOne({
        where: {
          otopark: { id: otoparkId },
          isAvailable: true
        }
      });
      console.log('Available Space: ', boşYer);
      if (!boşYer) {
        throw new Error(' No Available Space! ');
      }
      boşYer.isAvailable = false;
      await this.availableSpaceRepository.save(boşYer);

      return { message: `Parking space assigned. Please go to space number ${boşYer.index}` };
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
  }







}
