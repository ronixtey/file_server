import { Controller, Get, Param, Post, Request, Res, UnauthorizedException, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guards';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  // @ApiCreatedResponse({ description: 'User login and get jwt token' })
  // @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  // @ApiBody({ type: CreateUserDto })
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiUnauthorizedResponse({ description: 'Invalid JWT token' })
  // @ApiOkResponse({ description: 'Get profile' })
  getProfile(@Request() req) {
    return req.user;
  }
}
