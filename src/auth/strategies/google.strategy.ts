import {PassportStrategy} from "@nestjs/passport";
import {Profile, Strategy, VerifyCallback} from 'passport-google-oauth20'
import {Inject, Injectable} from "@nestjs/common";
import {AuthService} from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService
  ) {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ['profile', 'email']
    })
  }

  authorizationParams(): { [key: string]: string; } {
    return ({
      access_type: 'offline'
    })
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { emails, displayName } = profile
    const user = {
      email: emails[0].value,
      username: displayName
    }
    done(null, user);
  }

  // async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    // console.log('Access TOKEN: ', accessToken)
    // console.log('Refresh TOKEN: ', refreshToken)
    // console.log(profile)
    // const user = await this.authService.validateGoogleUser({
    //   email: profile.emails[0].value, username: profile.displayName, refreshToken: refreshToken
    // })
    // console.log('Validated')
    // return user || null
  //
  //   const { emails, displayName } = profile
  //   const user = {
  //     email: emails[0].value,
  //     username: displayName,
  //     accessToken,
  //     refreshToken
  //   }
  //   done(null, user);
  // }

}