import { Body, Controller, Post, Req, ParseIntPipe } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    console.log(dto);
    return this.authservice.signup();
  }

  @Post('signin')
  signin() {
    return this.authservice.signin();
  }
}
