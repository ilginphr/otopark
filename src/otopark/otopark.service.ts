import { Injectable } from '@nestjs/common';
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
    return await this.otoparkRepository.find();
  }

  findOne(id: number) {
    return this.otoparkRepository.findOne({
      where: { id },
    });

  }

  update(id: number, updateOtoparkDto: UpdateOtoparkDto): void {


  }



  async deleteAll(): Promise<void> {
    const allSpaces = await this.availableSpaceRepository.find();
    if (allSpaces.length > 0) {
      await this.availableSpaceRepository.remove(allSpaces);
    }

    const allOtoparklar = await this.otoparkRepository.find();
    if (allOtoparklar.length > 0) {
      await this.otoparkRepository.remove(allOtoparklar);
    }

    console.log('BBBBBBBBBBB');
  }


  async remove(id: number): Promise<void> {

    await this.otoparkRepository.delete(id);
    console.log('CCCCCCCCC')
  }

  async createOtopark(createOtoparkDto: CreateOtoparkDto) {
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
  }


  async createSpaces(otoparkId: number, spacenumber: number) {

    try {
      const maxValueQuery = await this.availableSpaceRepository.createQueryBuilder('space')
        .where('space.otopark.id = :otoparkId', { otoparkId }).getCount();
        
      for (let i = maxValueQuery; i <= spacenumber; i++) {
        const result = await this.availableSpaceRepository.save({
          otopark: { id: otoparkId },
          isAvailable: true
        })

        console.log('Kaydedilen:', result);
      }

      console.log('=== BAŞARILI ===');
      return { message: `${spacenumber} park yeri oluşturuldu!` };

    } catch (error) {
      console.log('=== HATA ===');
      console.log('Error:', error);
      throw error;
    }
  }


  async assignSpace(otoparkId: number) {
    try {
      console.log('OtoparkId:', otoparkId);
      const boşYer = await this.availableSpaceRepository.findOne({
        where: {
          otopark: { id: otoparkId },
          isAvailable: true
        }
      });
      console.log('BOŞ YER:', boşYer);
      if (!boşYer) {
        throw new Error('Boş yer yok!');
      }
      boşYer.isAvailable = false;
      await this.availableSpaceRepository.save(boşYer);

      return { message: `${boşYer.index} yerine gidin` };
    } catch (error) {
      console.error('Hata:', error);
      throw error;
    }
  }







}
