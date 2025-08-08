import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OtoparkModule } from './otopark/otopark.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './shared/auth.middleware';



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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('users','otopark'); // For all routes within your app.
  }
}
