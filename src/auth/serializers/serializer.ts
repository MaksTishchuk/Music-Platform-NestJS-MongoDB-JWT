import {PassportSerializer} from "@nestjs/passport";
import {AuthService} from "../auth.service";
import {User} from "../entities/user.entity";
import {Injectable} from "@nestjs/common";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    private authService: AuthService
  ) {
    super();
  }

  serializeUser(user: User, done: Function): any {
    console.log('SERIALIZE USER')
    done(null, user)
  }

  async deserializeUser(payload: any, done: Function) {
    const user = await this.authService.getUserById(payload._id)
    console.log('DESERIALIZE USER')
    return user ? done(null, user) : done(null, null)
  }
}