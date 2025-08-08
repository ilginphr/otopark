import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
    const newOtopark = this.otoparkRepository.create();
    newOtopark.name = createOtoparkDto.name;
    newOtopark.location = createOtoparkDto.location;
    newOtopark.capacity = createOtoparkDto.capacity;
    await this.otoparkRepository.save(newOtopark);

    const availableSpaceArray: AvailableSpace[] = [];
    for (let i = 0; i < createOtoparkDto.availableSpaces; i++) {
      const availableSpace = this.availableSpaceRepository.create();
      availableSpace.otopark = newOtopark;
      availableSpace.index = i + 1;
      
      // EKSİK FIELDLAR EKLENDİ:
     availableSpace.isAvailable = true;
     availableSpace.parkedAt = null as any;  
    availableSpaceArray.push(availableSpace);
    }
    
    await this.availableSpaceRepository.save(availableSpaceArray);
    return newOtopark;
  } catch (error) {
    console.error('DETAYLI HATA:', error); // Hatayı görmek için
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


  async assignSpace(otoparkId: number, username: string ,carPlate: string) {
    try {
      
      const existingParking = await this.availableSpaceRepository.findOne({
            where: { isAvailable: false }
        });
        
        if (existingParking) {
          throw new BadRequestException(`${username} zaten park etmiş durumda`);
}

      const otopark = await this.otoparkRepository.findOne({ where: { id: otoparkId } });
      if (!otopark) {
        throw new NotFoundException(' Otopark cannot be found. ');
      }
      const bosYer = await this.availableSpaceRepository.findOne({
        where: {
          otopark: { id: otoparkId },
          isAvailable: true
        }
      });
      console.log(' Available Space: ', bosYer);
      if (!bosYer) {
        throw new BadRequestException(' No Available Space! ');
      }

      
      bosYer.isAvailable = false;
      bosYer.parkedAt = new Date();

      await this.availableSpaceRepository.save(bosYer);

      return { message: `Parking space assigned. Please go to space number ${bosYer.index}` };
    } catch (error) {
      console.error('Error: ', error);
      throw error;

    }
  }







}
