import { PartialType } from '@nestjs/swagger';
import { CreateOtoparkDto } from './create-otopark.dto';

export class UpdateOtoparkDto extends PartialType(CreateOtoparkDto) {
//inheritance oluyo-lod tekrarı yok
}
