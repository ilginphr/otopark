import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OtoparkModule } from './otopark/otopark.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';



@Module({
  imports: [OtoparkModule,
   UsersModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      username: 'postgres',
      password:'postgres',
      database: 'otopark',
      synchronize:true
    }),
    
 ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
