import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

const { Injectable } = require('@nestjs/common');
const speakeasy = require('speakeasy');

@Injectable()
class TwoFactorAuthenticationService {

  generateTwoFactorAuthenticationSecret(username) {
    const secret = speakeasy.generateSecret({
      name: `ByteScrum Custom App:${username}`,
    });
    return secret.base32;
  }

  generateTwoFactorAuthenticationToken(secret) {
    return speakeasy.totp({
      secret,
      encoding: 'base32',
    });
  }
  validateTwoFactorAuthenticationToken(token, secret) {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1, 
  }
}

module.exports = TwoFactorAuthenticationService;
