import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService{

    signin(){
        return { message: "Hello You are signed in" };
    }

    signup(){
        return { message: "Hello You are signed up" };
    }
}
