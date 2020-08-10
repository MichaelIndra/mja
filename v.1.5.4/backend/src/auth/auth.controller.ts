import { Controller, Post, Body, HttpException, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Account } from './account/account.entity';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { LoginDto, ResetPasswordDto, SendLinkResetPasswordDto, RandomResetPasswordDto, LinkResetPasswordDto } from './auth.dto';

@ApiUseTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: LoginDto): Promise<any> {
    return this.authService.login(user);
  }

  // @Post('register')
  // async register(@Body() user: Account): Promise<any> {
  //   return this.authService.register(user);
  // }

  @ApiOperation({title: 'Generate url for reset password. Then, send generated url to email.'})
  @Post('reset-password/generate-token')
  async sendLinkResetPassword(@Body() dto: LinkResetPasswordDto): Promise<any> {
    try {
      const newDto: SendLinkResetPasswordDto = {
        ...dto,
        randomize: 0,
      };
      return this.authService.sendLinkResetPassword(newDto);
    } catch (err) {
      throw new HttpException(err.message || JSON.stringify(err), err.statusCode || err.status || 500);
    }
  }

  @ApiOperation({title: 'Generate random password. Then, send generated password to email.'})
  @Post('reset-password/generate-random-password')
  async sendRandomResetPassword(@Body() dto: RandomResetPasswordDto): Promise<any> {
    try {
      const newDto: SendLinkResetPasswordDto = {
        ...dto,
        randomize: 1,
      };
      return this.authService.sendLinkResetPassword(newDto);
    } catch (err) {
      throw new HttpException(err.message || JSON.stringify(err), err.statusCode || err.status || 500);
    }
  }

  @ApiOperation({title: 'Reset password by token'})
  @Put('reset-password/by-token')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<any> {
    try {
      return this.authService.resetPassword(dto);
    } catch (err) {
      throw new HttpException(err.message || JSON.stringify(err), err.statusCode || err.status || 500);
    }
  }
}
