import { ForbiddenException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService:JwtService) {
  }
  use(req: Request, res: Response, next: NextFunction) {
    //req ---> gelen request;
    //response ---> response (client'a gidecek;
    const authHeader = req.headers.authorization; //bearer 37dg7gbw

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authHeader.split(' ')[1]; //bearer
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    const decoded = this.jwtService.decode(<string>token); //{username:username,role:role}
    console.log("ROLE: "  +decoded['role']);
    if(req.method=="POST" && decoded['role']!="admin"){
      throw new ForbiddenException('NO PERMISSION ');
    }
    next(); // eğer her şey yolundaysa servise devam et
  }
}