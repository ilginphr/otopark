import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { OtoparkService } from './otopark.service';
import { CreateOtoparkDto } from './dto/create-otopark.dto';
import { UpdateOtoparkDto } from './dto/update-otopark.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@Controller('otopark')
@ApiBearerAuth()
export class OtoparkController {
  constructor(private readonly otoparkService: OtoparkService) { }

  @Get()
  findAll() {
    return this.otoparkService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.otoparkService.findOne(+id);
  }

  @Patch(':id')//YARIN


  @Delete('all')
  async deleteAll() {
    return await this.otoparkService.deleteAll();
  }


  @Delete(':id') //url deki id
  async remove(@Param('id') id: number) { //bunlara dokumentasyondan bakcam
    return this.otoparkService.remove(+id);
    return { message: 'SİLİNDİİİİİİİ', id };
  }





  //http://localhost:3000/otopark
  @Post() //otoparkçının işi
  create(@Body() createOtoparkDto: CreateOtoparkDto) { //dto oluşturulur
    console.log('AAAAAAA')
    return this.otoparkService.createOtopark(createOtoparkDto); //service çağrılır,içine dto objesi
  }


  @Patch('park-et/:otoparkId') //url de park-et varsa
  async parkEt(@Param('otoparkId') otoparkId: number, @Req() request: Request) {
    console.log(request.body!['username']);
    console.log(request.body!['carPlate']);
    return this.otoparkService.assignSpace(
    otoparkId, 
    <string>request.body!['username'],
    <string>request.body!['carPlate']  
  );
  }

  @Post('create-spaces/:otoparkId/:spacenumber')
  async createSpaces(
    @Param('otoparkId') otoparkId: number, //basit değer-url gönder
    @Param('spacenumber') spacenumber: number
  ) {
    return this.otoparkService.createSpaces(+otoparkId, +spacenumber);
  }

  //@Param- URL: POST /otopark/park-et/5
  //@Body- Body: { "otoparkId": 5 }

}