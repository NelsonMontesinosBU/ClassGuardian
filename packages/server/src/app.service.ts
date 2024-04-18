import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

/*Creating a 2FA service*/
const { Injectable } = require('@nestjs/common');
const { JwtService } = require('@nestjs/jwt');
const { UsersService } = require('../users/users.service');

@Injectable()
class AuthService {
  constructor(usersService, jwtService) {
    this.usersService = usersService;
    this.jwtService = jwtService;
  }

  async validateUser(payload) {

    const user = await this.usersService.findById(payload.sub);
    return user;
  }

  async generateJwtToken(user) {
    // Generate a JWT token based on the user's data.
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }
}

module.exports = AuthService;

