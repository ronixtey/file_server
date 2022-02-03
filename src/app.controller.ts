import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guards';
import { CreateUserDto } from './user/dto/create-user.tdo';

@ApiTags('auth')
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiCreatedResponse({ description: 'User login and get jwt token' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: CreateUserDto })
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Invalid JWT token' })
  @ApiOkResponse({ description: 'Get profile' })
  getProfile(@Request() req) {
    return req.user;
  }
}