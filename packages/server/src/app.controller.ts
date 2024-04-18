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

const { Controller, Get, Req, Res } = require('@nestjs/common');
const { TwoFactorAuthenticationService } = require('./two-factor-authentication.service');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

@Controller('2fa')
class TwoFactorAuthenticationController {
  constructor(twoFactorAuthenticationService) {
    this.twoFactorAuthenticationService = twoFactorAuthenticationService;
  }

  @Get('generate')
  async generateTwoFactorAuth(req, res) {

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }


    if (user.isTwoFactorAuthenticationEnabled) {
      return res.status(400).json({ message: '2FA already enabled!' });
    }


    const secret = this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(user.username);


    const otpAuthUrl = speakeasy.otpauthURL({
      secret: secret,
      label: `YourApp:${user.username}`,
      issuer: 'YourApp', 
    });

    try {

      const qrCodeDataURL = await QRCode.toDataURL(otpAuthUrl);


      return res.status(200).json({ qrCode: qrCodeDataURL });
    } catch (error) {

      console.error('Error generating QR code:', error);
      return res.status(500).json({ message: 'Error generating QR code' });
    }
  }
}

module.exports = TwoFactorAuthenticationController;

const { Controller, Post, Body, Req, Res } = require('@nestjs/common');
const { TwoFactorAuthenticationService } = require('./two-factor-authentication.service');
const speakeasy = require('speakeasy');

@Controller('2fa')
class TwoFactorAuthenticationController {
  constructor(twoFactorAuthenticationService) {
    this.twoFactorAuthenticationService = twoFactorAuthenticationService;
  }

  @Post('enable')
  async enableTwoFactorAuth(@Req() req, @Body() body, @Res() res) {

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }


    if (user.isTwoFactorAuthenticationEnabled) {
      return res.status(400).json({ message: '2FA already enabled!' });
    }

    const { token } = body;

    const isValidToken = this.twoFactorAuthenticationService.validateTwoFactorAuthenticationToken(
      token,
      user.twoFactorAuthenticationSecret
    );

    if (!isValidToken) {
      return res.status(401).json({ message: 'Invalid 2FA token' });
    }


    return res.status(200).json({ message: '2FA enabled successfully' });
  }
}

module.exports = TwoFactorAuthenticationController;


