import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Bookmark, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { config } from 'process';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private cofig: ConfigService,
  ) {}

  async signin(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user does not exist throw exception
    if (!user)
      throw new ForbiddenException({ messgae: 'credentials incorrect' });
    // compare password
    const pwMatches = await argon.verify(user.hash, dto.password);
    // if password incorrect throw exception
    if (!pwMatches)
      throw new ForbiddenException({ messgae: 'password not matched' });

    // send back the user
    return this.signToken(user.id, user.email);
  }

  async signup(dto: AuthDto) {
    // generate the pass word has
    const hash = await argon.hash(dto.password);
    try {
      // save the user in new DB
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        //select: { id: true, email: true, createdAt: true },
      });
      // return the generated User
      return this.signToken(user.id, user.email);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          throw new ForbiddenException({ message: 'Duplicate User' });
        }
      }
      throw e;
    }
  }

  async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.cofig.get('JWT_SECRET');

    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
  }
}
