import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule, JwtModuleOptions } from '@nestjs/jwt';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options: JwtModuleOptions = {
          privateKey: configService.get('PRIVATE_KEY'),
          publicKey: configService.get('PUBLIC_KEY'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRATION'),
            algorithm: 'RS256'
          }
        };
        return options;
      },
      inject: [ConfigService]
    })
  ],
  exports: [NestJwtModule]
})
export class JwtModule {}

/* Required Modules */
const { Module } = require('@nestjs/common');
const { PassportModule } = require('@nestjs/passport');
const { JwtModule } = require('@nestjs/jwt');
const { UsersModule } = require('./users/users.module');
const { AuthService } = require('./auth/auth.service');
const { JwtStrategy } = require('./auth/jwt.strategy');

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: 'secret_key', 
      signOptions: { expiresIn: '1h' }, // JWT token expiration time
    }),
  ],
  providers: [AuthService, JwtStrategy],
})
class AppModule {}

module.exports = AppModule;

const { Injectable, UnauthorizedException } = require('@nestjs/common');
const { PassportStrategy } = require('@nestjs/passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { AuthService } = require('./auth.service');
const { JwtPayload } = require('./interfaces/jwt-payload.interface');

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(authService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret_key'
    });
    this.authService = authService;
  }

  async validate(payload) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

module.exports = JwtStrategy;
