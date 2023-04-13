import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Bookmark, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signin() {
    return { message: 'Hello You are signed in' };
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
      delete user.hash;
      // return the generated User
      return user;
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
}
