import { Injectable } from "@nestjs/common";
import { User,Bookmark } from '@prisma/client'
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService{

    constructor(private prisma: PrismaService){}

    signin(){
        return { message: "Hello You are signed in" };
    }

    signup(){
        return { message: "Hello You are signed up" };
    }
}
